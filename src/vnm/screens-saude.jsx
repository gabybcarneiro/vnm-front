import { useState } from 'react';
import { api, useApi, TIPOS, tipoInfo, sexosTexto, dataBr, hojeIso, TIPOS_APLICACAO, UNIDADES, intervaloTexto, idadeDiasTexto } from './api.js';
import { Ico, PageHeader, StatTile, Sheet, Empty } from './ui.jsx';
import { Carregando, ErroCarga, ErroForm, Chips, QuantidadesForm } from './screens-lotes.jsx';
// VidaNoMato — Saúde (feature 004): aplicações, agenda, recorrências, sugestões e base de vacinas


const AVISO_VET = "Sugestões de referência: confirme o protocolo com o seu veterinário.";
const QTD_ZERO = { machos: 0, femeas: 0, naoInformado: 0 };
const opcoes = (mapa) => Object.entries(mapa);

function atrasoTexto(dias) {
  if (dias > 0) return `${dias} ${dias === 1 ? "dia" : "dias"} de atraso`;
  if (dias === 0) return "hoje";
  return `em ${-dias} ${dias === -1 ? "dia" : "dias"}`;
}

function Switch({ ligado, onChange, rotulo }) {
  return (
    <label style={{display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", margin: "4px 0 14px"}}>
      <input type="checkbox" checked={ligado} onChange={e => onChange(e.target.checked)} style={{width: 18, height: 18}}/>
      {rotulo}
    </label>
  );
}

function Avisos({ avisos }) {
  if (!avisos?.length) return null;
  return (
    <div style={{padding: "10px 14px", marginBottom: 14, borderRadius: 12, background: "var(--yolk-soft)", color: "#82591A", fontSize: 13, fontWeight: 600}}>
      {avisos.join(" · ")}
    </div>
  );
}

// ════════════════════════════════════════════
// SAÚDE
// ════════════════════════════════════════════
function SaudeScreen({ back, showToast, openLote, openProtocolo }) {
  const [tab, setTab] = useState("aplicar");
  const [sheet, setSheet] = useState(null);
  const [versao, setVersao] = useState(0);
  const recarregar = () => setVersao(v => v + 1);
  const resumo = useApi(`saude-resumo#${versao}`, () => api.saudeResumo());

  const fechar = (msg) => { setSheet(null); if (msg) showToast(msg); recarregar(); };
  const r = resumo.data;

  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader title="Saúde" subtitle="Vacinas, vermífugos e tratamentos" onBack={back} action={
        <button onClick={() => setSheet({ tipo: "nova" })} aria-label="Nova aplicação" style={{
          width: 40, height: 40, borderRadius: 999, background: "var(--ink)", color: "var(--bg)", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><Ico.plus s={20} c="var(--bg)"/></button>
      }/>

      <div style={{padding: "0 16px 14px", display: "flex", gap: 10}}>
        <StatTile label="Atrasadas" value={r ? r.atrasadas : "–"} sub="aplicações" tone="terra" icon={<Ico.alert s={12} c="var(--terra)"/>}/>
        <StatTile label="Hoje" value={r ? r.hoje : "–"} sub="aplicações" tone="ink" icon={<Ico.vaccine s={12}/>}/>
        <StatTile label="7 dias" value={r ? r.proximos7Dias : "–"} sub="aplicações" tone="moss" icon={<Ico.calendar s={12}/>}/>
      </div>

      <div style={{padding: "0 16px 10px", display: "flex", justifyContent: "center"}}>
        <div className="seg">
          {[["aplicar", "A aplicar"], ["sugestoes", "Sugestões"], ["historico", "Histórico"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={tab === k ? "on" : ""}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{padding: "0 16px"}}>
        {tab === "aplicar" && <AbaAplicar versao={versao} onAcao={setSheet} recarregar={recarregar} showToast={showToast}/>}
        {tab === "sugestoes" && <AbaSugestoes versao={versao} onAcao={setSheet} recarregar={recarregar} showToast={showToast}
          openLote={openLote} openProtocolo={openProtocolo}/>}
        {tab === "historico" && <AbaHistorico versao={versao} onAcao={(s, msg) => s ? setSheet(s) : fechar(msg)}/>}
      </div>

      <FormulariosSaude sheet={sheet} onFechar={fechar} onCancelar={() => setSheet(null)}/>
      <div className="spacer-24"/>
    </div>
  );
}

// Sheets compartilhados pela Saúde e pela aba Saúde do lote
function FormulariosSaude({ sheet, onFechar, onCancelar, destinoFixo }) {
  const titulos = {
    nova: "Nova aplicação", corrigir: "Corrigir aplicação", confirmar: "Registrar aplicação",
    adiar: "Adiar aplicação", aceitar: "Agendar sugestão", dispensadas: "Sugestões dispensadas",
  };
  return (
    <Sheet open={!!sheet} onClose={onCancelar} title={sheet && titulos[sheet.tipo]}>
      {sheet?.tipo === "nova" && <AplicacaoForm destinoFixo={sheet.destino || destinoFixo} onSalvo={onFechar}/>}
      {sheet?.tipo === "corrigir" && <AplicacaoForm aplicacao={sheet.aplicacao} onSalvo={onFechar}/>}
      {sheet?.tipo === "confirmar" && <ConfirmarForm prevista={sheet.prevista} onSalvo={onFechar}/>}
      {sheet?.tipo === "adiar" && <AdiarForm prevista={sheet.prevista} onSalvo={onFechar}/>}
      {sheet?.tipo === "aceitar" && <AceitarForm lote={sheet.lote} sugestao={sheet.sugestao} onSalvo={onFechar}/>}
      {sheet?.tipo === "dispensadas" && <Dispensadas onAlterado={() => onFechar("Sugestão voltou a aparecer")}/>}
    </Sheet>
  );
}

// ────── A aplicar ──────
function AbaAplicar({ versao, onAcao, recarregar, showToast, loteCodigo }) {
  const previstas = useApi(`previstas:${loteCodigo || ""}#${versao}`, () => api.previstas({ loteCodigo }));
  const [erro, setErro] = useState(null);

  const executar = async (acao, msg) => {
    setErro(null);
    try { await acao(); showToast(msg); recarregar(); } catch (e) { setErro(e); }
  };

  if (previstas.erro) return <ErroCarga erro={previstas.erro} onRetry={previstas.recarregar}/>;
  if (!previstas.data) return <Carregando/>;
  return (
    <div>
      <ErroForm erro={erro}/>
      <div className="card" style={{padding: "4px 16px"}}>
        {previstas.data.length === 0 ? <Empty title="Nada a aplicar" sub="Aplicações agendadas e recorrências aparecem aqui."/> :
          previstas.data.map((p, i, arr) => (
            <PrevistaRow key={p.id} p={p} ultimo={i === arr.length - 1} mostrarDestino={!loteCodigo}
              onAplicar={() => onAcao({ tipo: "confirmar", prevista: p })}
              onAdiar={() => onAcao({ tipo: "adiar", prevista: p })}
              onCancelar={() => executar(() => api.cancelarPrevista(p.id), "Aplicação cancelada")}
              onEncerrar={p.recorrencia ? () => executar(() => api.encerrarRecorrencia(p.recorrencia.id), "Recorrência encerrada") : null}/>
          ))}
      </div>
    </div>
  );
}

function PrevistaRow({ p, ultimo, mostrarDestino, onAplicar, onAdiar, onCancelar, onEncerrar }) {
  const [confirmar, setConfirmar] = useState(null); // null | "cancelar" | "encerrar"
  const atrasada = p.diasDeAtraso > 0;
  return (
    <div style={{padding: "12px 0", borderBottom: ultimo ? "none" : "1px solid var(--line-soft)"}}>
      <div style={{display: "flex", gap: 12}}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: atrasada ? "var(--danger-soft)" : "var(--terra-soft)", color: atrasada ? "var(--danger)" : "var(--terra-deep)",
        }}><Ico.vaccine s={18}/></div>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{display: "flex", justifyContent: "space-between", gap: 8}}>
            <span style={{fontWeight: 700, fontSize: 14}}>{p.produto}</span>
            <span style={{fontSize: 12, fontWeight: 700, flexShrink: 0, color: atrasada ? "var(--danger)" : "var(--ink-2)"}}>{dataBr(p.dataPrevista)}</span>
          </div>
          <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 2}}>
            {TIPOS_APLICACAO[p.tipoAplicacao]}{mostrarDestino && <> · {p.destino.descricao}</>}
            {p.recorrencia && <> · {intervaloTexto(p.recorrencia.intervalo)}</>}
          </div>
          <div style={{fontSize: 12, fontWeight: 600, marginTop: 2, color: atrasada ? "var(--danger)" : "var(--ink-3)"}}>{atrasoTexto(p.diasDeAtraso)}</div>
          <div style={{display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap", alignItems: "center"}}>
            {confirmar ? (
              <>
                <span style={{fontSize: 12, color: "var(--danger)", fontWeight: 600}}>
                  {confirmar === "cancelar" ? "Cancelar esta aplicação?" : "Encerrar a recorrência?"}
                </span>
                <button onClick={() => { setConfirmar(null); (confirmar === "cancelar" ? onCancelar : onEncerrar)(); }}
                  className="btn btn-soft" style={{padding: "4px 10px", fontSize: 12, color: "var(--danger)"}}>Sim</button>
                <button onClick={() => setConfirmar(null)} className="btn btn-ghost" style={{padding: "4px 10px", fontSize: 12}}>Não</button>
              </>
            ) : (
              <>
                <button onClick={onAplicar} className="chip moss" style={{padding: "4px 12px", fontSize: 12, border: "none", cursor: "pointer"}}>
                  <Ico.check s={11}/> Aplicar
                </button>
                <button onClick={onAdiar} className="btn btn-ghost" style={{padding: "4px 10px", fontSize: 12}}>Adiar</button>
                <button onClick={() => setConfirmar("cancelar")} className="btn btn-ghost" style={{padding: "4px 10px", fontSize: 12}}>Cancelar</button>
                {onEncerrar && <button onClick={() => setConfirmar("encerrar")} className="btn btn-ghost" style={{padding: "4px 10px", fontSize: 12}}>Encerrar recorrência</button>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ────── Sugestões ──────
function AbaSugestoes({ versao, onAcao, recarregar, showToast, openLote, openProtocolo }) {
  const dados = useApi(`sugestoes#${versao}`, () => api.sugestoes({}));
  const [erro, setErro] = useState(null);

  const dispensar = async (lote, s) => {
    setErro(null);
    try {
      await api.dispensarSugestao({ loteCodigo: lote.codigo, itemProtocoloId: s.item.id });
      showToast("Sugestão dispensada");
      recarregar();
    } catch (e) { setErro(e); }
  };

  return (
    <div style={{display: "flex", flexDirection: "column", gap: 12}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8}}>
        <span style={{fontSize: 12, color: "var(--ink-3)"}}>{AVISO_VET}</span>
        {openProtocolo && <button onClick={openProtocolo} className="btn btn-soft" style={{padding: "6px 12px", fontSize: 12, flexShrink: 0}}>Base de vacinas</button>}
      </div>
      <ErroForm erro={erro}/>
      {dados.erro ? <ErroCarga erro={dados.erro} onRetry={dados.recarregar}/> : !dados.data ? <Carregando/> :
        dados.data.length === 0 ? <div className="card"><Empty title="Nenhum lote ativo" sub="Cadastre lotes para receber sugestões."/></div> :
        dados.data.map(grupo => (
          <div key={grupo.lote.codigo} className="card" style={{padding: "14px 16px"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8}}>
              <button onClick={() => openLote?.(grupo.lote)} style={{background: "none", border: "none", padding: 0, textAlign: "left", color: "inherit", cursor: "pointer"}}>
                <span style={{fontWeight: 700}}>{grupo.lote.nome || grupo.lote.codigo}</span>
                <span style={{fontSize: 12, color: "var(--ink-3)"}}>{grupo.lote.nome ? ` · ${grupo.lote.codigo}` : ""} · {tipoInfo(grupo.lote.tipo).desc}</span>
              </button>
              <span style={{fontSize: 12, color: "var(--ink-3)", flexShrink: 0}}>{idadeDiasTexto(grupo.idadeDias)}</span>
            </div>
            {grupo.aviso && <div style={{fontSize: 12, color: "#82591A", marginTop: 6}}>{grupo.aviso}</div>}
            {grupo.sugestoes.length === 0 ? <div style={{fontSize: 13, color: "var(--ink-3)", padding: "10px 0 2px"}}>Tudo em dia para este lote.</div> :
              grupo.sugestoes.map(s => (
                <div key={s.item.id} style={{padding: "10px 0 2px", borderTop: "1px solid var(--line-soft)", marginTop: 10}}>
                  <div style={{display: "flex", justifyContent: "space-between", gap: 8}}>
                    <span style={{fontWeight: 700, fontSize: 14}}>{s.item.nome}</span>
                    <span style={{fontSize: 12, fontWeight: 700, color: "var(--ink-2)", flexShrink: 0}}>{dataBr(s.dataIndicada)}</span>
                  </div>
                  <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 2}}>{s.motivo}</div>
                  <div style={{fontSize: 12, color: "var(--ink-3)"}}>
                    {s.item.doses > 1 ? `${s.item.doses} doses` : "dose única"}{s.item.reforco && ` · reforço ${intervaloTexto(s.item.reforco)}`}
                  </div>
                  <div style={{display: "flex", gap: 6, marginTop: 8}}>
                    <button onClick={() => onAcao({ tipo: "aceitar", lote: grupo.lote, sugestao: s })} className="chip moss"
                      style={{padding: "4px 12px", fontSize: 12, border: "none", cursor: "pointer"}}><Ico.calendar s={11}/> Agendar</button>
                    <button onClick={() => dispensar(grupo.lote, s)} className="btn btn-ghost" style={{padding: "4px 10px", fontSize: 12}}>Dispensar</button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      <button onClick={() => onAcao({ tipo: "dispensadas" })} className="btn btn-ghost" style={{alignSelf: "center", fontSize: 13}}>Ver dispensadas</button>
    </div>
  );
}

function AceitarForm({ lote, sugestao, onSalvo }) {
  const [data, setData] = useState(sugestao.dataIndicada);
  const [dose, setDose] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const item = sugestao.item;

  const salvar = async () => {
    setEnviando(true);
    setErro(null);
    try {
      await api.aceitarSugestao({ loteCodigo: lote.codigo, itemProtocoloId: item.id, dataPrimeiraDose: data, dose: dose.trim() || undefined });
      onSalvo(item.doses > 1 ? `${item.doses} doses agendadas` : "Aplicação agendada");
    } catch (e) { setErro(e); setEnviando(false); }
  };

  return (
    <div>
      <div style={{fontWeight: 700}}>{item.nome}</div>
      <div style={{fontSize: 13, color: "var(--ink-3)", marginBottom: 14}}>
        {lote.nome || lote.codigo} · {item.doses > 1 ? `${item.doses} doses com ${item.intervaloDosesDias} dias de intervalo` : "dose única"}
        {item.reforco && ` · reforço ${intervaloTexto(item.reforco)} depois da última dose`}
      </div>
      <div className="field">
        <label>{item.doses > 1 ? "Data da 1ª dose" : "Data"}</label>
        <input type="date" value={data} onChange={e => setData(e.target.value)}/>
      </div>
      <div className="field">
        <label>Dose (opcional)</label>
        <input value={dose} maxLength={60} onChange={e => setDose(e.target.value)} placeholder="Ex.: 5 mL"/>
      </div>
      <ErroForm erro={erro}/>
      <button onClick={salvar} disabled={!data || enviando} className="btn btn-primary" style={{width: "100%", opacity: !data || enviando ? 0.4 : 1}}>
        <Ico.check s={16} c="var(--bg)"/> {enviando ? "Salvando…" : "Agendar"}
      </button>
    </div>
  );
}

function Dispensadas({ onAlterado }) {
  const lista = useApi("dispensadas", () => api.dispensadas({}));
  const [erro, setErro] = useState(null);
  const reverter = async (d) => {
    setErro(null);
    try { await api.reverterDispensa(d.lote.codigo, d.item.id); onAlterado(); } catch (e) { setErro(e); }
  };
  if (lista.erro) return <ErroCarga erro={lista.erro} onRetry={lista.recarregar}/>;
  if (!lista.data) return <Carregando/>;
  return (
    <div>
      <ErroForm erro={erro}/>
      {lista.data.length === 0 ? <Empty title="Nenhuma dispensada" sub="Sugestões dispensadas aparecem aqui."/> :
        lista.data.map((d, i, arr) => (
          <div key={`${d.lote.codigo}:${d.item.id}`} style={{display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i === arr.length - 1 ? "none" : "1px solid var(--line-soft)"}}>
            <div style={{flex: 1}}>
              <div style={{fontWeight: 700, fontSize: 14}}>{d.item.nome}</div>
              <div style={{fontSize: 12, color: "var(--ink-3)"}}>{d.lote.nome || d.lote.codigo} · por {d.dispensadaPor?.nome}</div>
            </div>
            <button onClick={() => reverter(d)} className="btn btn-soft" style={{padding: "6px 10px", fontSize: 12}}>Voltar a sugerir</button>
          </div>
        ))}
    </div>
  );
}

// ────── Histórico ──────
function AbaHistorico({ versao, onAcao, loteCodigo }) {
  const dados = useApi(`aplicacoes:${loteCodigo || ""}#${versao}`, () => api.aplicacoes({ loteCodigo }));
  if (dados.erro) return <ErroCarga erro={dados.erro} onRetry={dados.recarregar}/>;
  if (!dados.data) return <Carregando/>;
  return (
    <div className="card" style={{padding: "4px 16px"}}>
      {dados.data.itens.length === 0 ? <Empty title="Sem aplicações" sub="As aplicações registradas aparecem aqui."/> :
        dados.data.itens.map((a, i, arr) => (
          <AplicacaoRow key={a.id} a={a} ultimo={i === arr.length - 1} mostrarDestino={!loteCodigo}
            onCorrigir={() => onAcao({ tipo: "corrigir", aplicacao: a })} onExcluido={() => onAcao(null, "Aplicação excluída")}/>
        ))}
    </div>
  );
}

function AplicacaoRow({ a, ultimo, mostrarDestino, onCorrigir, onExcluido }) {
  const [confirmar, setConfirmar] = useState(false);
  const [erro, setErro] = useState(null);
  const excluir = async () => {
    setErro(null);
    try { await api.excluirAplicacao(a.id); onExcluido(); } catch (e) { setErro(e); }
  };
  return (
    <div style={{padding: "12px 0", borderBottom: ultimo ? "none" : "1px solid var(--line-soft)"}}>
      <div style={{display: "flex", justifyContent: "space-between", gap: 8}}>
        <span style={{fontWeight: 700, fontSize: 14}}>{a.produto}</span>
        <span style={{fontSize: 12, color: "var(--ink-3)", flexShrink: 0}}>{dataBr(a.dataOcorrencia)}</span>
      </div>
      <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 2}}>
        {TIPOS_APLICACAO[a.tipoAplicacao]}{mostrarDestino && <> · {a.destino.descricao}</>} · {a.quantidades.total} ({sexosTexto(a.quantidades)})
        {a.dose && <> · {a.dose}</>}
      </div>
      {a.observacoes && <div style={{fontSize: 12, color: "var(--ink-2)", marginTop: 2}}>{a.observacoes}</div>}
      <ErroForm erro={erro}/>
      <div style={{display: "flex", alignItems: "center", gap: 8, marginTop: 6}}>
        <span style={{fontSize: 11, color: "var(--ink-3)", flex: 1}}>por {a.registradoPor?.nome || "—"}{a.substituiId ? " · corrigida" : ""}</span>
        {confirmar ? (
          <>
            <span style={{fontSize: 12, color: "var(--danger)", fontWeight: 600}}>Excluir?</span>
            <button onClick={excluir} className="btn btn-soft" style={{padding: "4px 10px", fontSize: 12, color: "var(--danger)"}}>Sim</button>
            <button onClick={() => setConfirmar(false)} className="btn btn-ghost" style={{padding: "4px 10px", fontSize: 12}}>Não</button>
          </>
        ) : (
          <>
            <button onClick={onCorrigir} className="btn btn-ghost" style={{padding: "4px 10px", fontSize: 12}}><Ico.edit s={12}/> Corrigir</button>
            <button onClick={() => setConfirmar(true)} className="btn btn-ghost" style={{padding: "4px 10px", fontSize: 12, color: "var(--danger)"}}>Excluir</button>
          </>
        )}
      </div>
    </div>
  );
}

// ────── Formulários ──────
// destinoFixo: { loteCodigo?, nascimentoId?, descricao, tipo, quantidades }
function AplicacaoForm({ destinoFixo, aplicacao, onSalvo }) {
  const corrigindo = !!aplicacao;
  const [destino, setDestino] = useState("");
  const [tipo, setTipo] = useState(aplicacao?.tipoAplicacao || "VACINA");
  const [produto, setProduto] = useState(aplicacao?.produto?.replace(/ — \dª dose$/, "") || "");
  const [dose, setDose] = useState(aplicacao?.dose || "");
  const [data, setData] = useState(aplicacao?.dataOcorrencia || hojeIso());
  const [obs, setObs] = useState(aplicacao?.observacoes || "");
  const [futuro, setFuturo] = useState(false);
  const [repetir, setRepetir] = useState(false);
  const [intervalo, setIntervalo] = useState({ valor: 4, unidade: "MESES" });
  const [parte, setParte] = useState(false);
  const [qtd, setQtd] = useState(aplicacao ? { ...aplicacao.quantidades } : QTD_ZERO);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [avisos, setAvisos] = useState(null);

  const precisaEscolher = !destinoFixo && !corrigindo;
  const lotes = useApi("destinos:lotes", () => precisaEscolher ? api.lotes({ situacao: "ATIVO" }) : Promise.resolve(null));
  const nascimentos = useApi("destinos:nascimentos", () => precisaEscolher ? api.nascimentos({ semLote: true }) : Promise.resolve(null));
  const loteEscolhido = lotes.data?.itens.find(l => `L:${l.codigo}` === destino);
  const nascEscolhido = nascimentos.data?.find(n => `N:${n.id}` === destino);
  const alvo = destinoFixo || (loteEscolhido && { loteCodigo: loteEscolhido.codigo, tipo: loteEscolhido.tipo })
    || (nascEscolhido && { nascimentoId: nascEscolhido.id, tipo: nascEscolhido.tipo });
  const tipoAnimal = corrigindo ? aplicacao.destino.tipo : alvo?.tipo;
  const total = qtd.machos + qtd.femeas + qtd.naoInformado;
  const valido = (corrigindo || alvo) && produto.trim() && data && (!parte || total > 0) && (!repetir || intervalo.valor > 0);

  const salvar = async () => {
    setEnviando(true);
    setErro(null);
    const base = { tipoAplicacao: tipo, produto: produto.trim(), dose: dose.trim() || undefined };
    const rec = repetir ? { valor: Number(intervalo.valor), unidade: intervalo.unidade } : undefined;
    try {
      let r;
      if (corrigindo) {
        r = await api.corrigirAplicacao(aplicacao.id, { ...base, dataOcorrencia: data, quantidades: parte ? qtd : undefined, observacoes: obs.trim() || undefined });
      } else if (futuro) {
        r = await api.agendar({ ...base, loteCodigo: alvo.loteCodigo, nascimentoId: alvo.nascimentoId, dataPrevista: data, recorrencia: rec });
      } else {
        r = await api.registrarAplicacao({
          ...base, loteCodigo: alvo.loteCodigo, nascimentoId: alvo.nascimentoId, dataOcorrencia: data,
          quantidades: parte ? qtd : undefined, observacoes: obs.trim() || undefined, recorrencia: rec,
        });
      }
      if (r?.avisos?.length) { setAvisos(r.avisos); setEnviando(false); return; }
      onSalvo(corrigindo ? "Aplicação corrigida" : futuro ? "Aplicação agendada" : "Aplicação registrada");
    } catch (e) { setErro(e); setEnviando(false); }
  };

  return (
    <div>
      {avisos ? (
        <div>
          <Avisos avisos={avisos}/>
          <button onClick={() => onSalvo(futuro ? "Aplicação agendada" : "Aplicação registrada")} className="btn btn-primary" style={{width: "100%"}}>Ok, entendi</button>
        </div>
      ) : <>
      <div className="field">
        <label>Lote ou nascimento</label>
        {corrigindo ? <div style={{fontWeight: 700}}>{aplicacao.destino.descricao}</div>
          : destinoFixo ? <div style={{fontWeight: 700}}>{destinoFixo.descricao}</div>
          : (lotes.erro || nascimentos.erro) ? <ErroCarga erro={lotes.erro || nascimentos.erro}/>
          : (
            <select value={destino} onChange={e => setDestino(e.target.value)} disabled={lotes.carregando || nascimentos.carregando}>
              <option value="">{lotes.carregando ? "Carregando…" : "Selecione..."}</option>
              <optgroup label="Lotes">
                {(lotes.data?.itens || []).map(l => <option key={l.codigo} value={`L:${l.codigo}`}>{l.nome || l.codigo} · {l.codigo}</option>)}
              </optgroup>
              {nascimentos.data?.length > 0 && (
                <optgroup label="Nascimentos sem lote">
                  {nascimentos.data.map(n => <option key={n.id} value={`N:${n.id}`}>{dataBr(n.dataNascimento)} · {n.quantidades.total} {tipoInfo(n.tipo).desc.toLowerCase()}</option>)}
                </optgroup>
              )}
            </select>
          )}
      </div>
      {!corrigindo && <Switch ligado={futuro} onChange={setFuturo} rotulo="Agendar para depois (ainda não apliquei)"/>}
      <div className="field">
        <label>Tipo</label>
        <Chips opcoes={opcoes(TIPOS_APLICACAO)} valor={tipo} onChange={setTipo}/>
      </div>
      <div className="field">
        <label>Produto</label>
        <input value={produto} maxLength={120} onChange={e => setProduto(e.target.value)} placeholder="Ex.: Vermífugo, Vitamina ADE"/>
      </div>
      <div style={{display: "flex", gap: 8}}>
        <div className="field" style={{flex: 1}}>
          <label>{futuro ? "Data prevista" : "Data"}</label>
          <input type="date" value={data} max={futuro ? undefined : hojeIso()} onChange={e => setData(e.target.value)}/>
        </div>
        <div className="field" style={{flex: 1}}>
          <label>Dose (opcional)</label>
          <input value={dose} maxLength={60} onChange={e => setDose(e.target.value)} placeholder="5 mL"/>
        </div>
      </div>
      {!corrigindo && <Switch ligado={repetir} onChange={setRepetir} rotulo="Repetir periodicamente"/>}
      {repetir && (
        <div className="field">
          <label>Repetir a cada</label>
          <div style={{display: "flex", gap: 8, alignItems: "center"}}>
            <input type="number" min={1} value={intervalo.valor} onChange={e => setIntervalo(i => ({ ...i, valor: e.target.value }))} style={{width: 80}}/>
            <Chips opcoes={opcoes(UNIDADES)} valor={intervalo.unidade} onChange={u => setIntervalo(i => ({ ...i, unidade: u }))}/>
          </div>
        </div>
      )}
      {!futuro && (
        <>
          <Switch ligado={parte} onChange={setParte} rotulo="Aplicar só em parte dos animais"/>
          {parte && tipoAnimal && (
            <div className="field"><QuantidadesForm q={qtd} setQ={setQtd} tipo={tipoAnimal}/></div>
          )}
          <div className="field">
            <label>Observações (opcional)</label>
            <textarea rows={2} value={obs} maxLength={500} onChange={e => setObs(e.target.value)}/>
          </div>
        </>
      )}
      <ErroForm erro={erro}/>
      <button onClick={salvar} disabled={!valido || enviando} className="btn btn-primary" style={{width: "100%", opacity: !valido || enviando ? 0.4 : 1}}>
        <Ico.check s={16} c="var(--bg)"/> {enviando ? "Salvando…" : corrigindo ? "Salvar correção" : futuro ? "Agendar" : "Registrar"}
      </button>
      </>}
    </div>
  );
}

function ConfirmarForm({ prevista, onSalvo }) {
  const [data, setData] = useState(hojeIso());
  const [dose, setDose] = useState(prevista.dose || "");
  const [obs, setObs] = useState("");
  const [parte, setParte] = useState(false);
  const [qtd, setQtd] = useState(QTD_ZERO);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const salvar = async () => {
    setEnviando(true);
    setErro(null);
    try {
      const r = await api.confirmarPrevista(prevista.id, {
        dataOcorrencia: data, dose: dose.trim() || undefined, observacoes: obs.trim() || undefined, quantidades: parte ? qtd : undefined,
      });
      const proxima = r.previstas?.[0];
      onSalvo(proxima ? `Aplicação registrada · próxima em ${dataBr(proxima.dataPrevista)}` : "Aplicação registrada");
    } catch (e) { setErro(e); setEnviando(false); }
  };

  return (
    <div>
      <div style={{fontWeight: 700}}>{prevista.produto}</div>
      <div style={{fontSize: 13, color: "var(--ink-3)", marginBottom: 14}}>
        {prevista.destino.descricao} · previsto para {dataBr(prevista.dataPrevista)}
        {prevista.recorrencia && <> · {intervaloTexto(prevista.recorrencia.intervalo)}</>}
      </div>
      <div style={{display: "flex", gap: 8}}>
        <div className="field" style={{flex: 1}}>
          <label>Data da aplicação</label>
          <input type="date" value={data} max={hojeIso()} onChange={e => setData(e.target.value)}/>
        </div>
        <div className="field" style={{flex: 1}}>
          <label>Dose (opcional)</label>
          <input value={dose} maxLength={60} onChange={e => setDose(e.target.value)}/>
        </div>
      </div>
      <Switch ligado={parte} onChange={setParte} rotulo="Aplicado só em parte dos animais"/>
      {parte && <div className="field"><QuantidadesForm q={qtd} setQ={setQtd} tipo={prevista.destino.tipo}/></div>}
      <div className="field">
        <label>Observações (opcional)</label>
        <textarea rows={2} value={obs} maxLength={500} onChange={e => setObs(e.target.value)}/>
      </div>
      <ErroForm erro={erro}/>
      <button onClick={salvar} disabled={enviando} className="btn btn-primary" style={{width: "100%", opacity: enviando ? 0.4 : 1}}>
        <Ico.check s={16} c="var(--bg)"/> {enviando ? "Salvando…" : "Registrar aplicação"}
      </button>
    </div>
  );
}

function AdiarForm({ prevista, onSalvo }) {
  const [data, setData] = useState(prevista.dataPrevista);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const salvar = async () => {
    setEnviando(true);
    setErro(null);
    try { await api.adiarPrevista(prevista.id, data); onSalvo(`Adiada para ${dataBr(data)}`); } catch (e) { setErro(e); setEnviando(false); }
  };
  return (
    <div>
      <div style={{fontWeight: 700, marginBottom: 12}}>{prevista.produto} · {prevista.destino.descricao}</div>
      <div className="field">
        <label>Nova data</label>
        <input type="date" value={data} onChange={e => setData(e.target.value)}/>
      </div>
      <ErroForm erro={erro}/>
      <button onClick={salvar} disabled={!data || enviando} className="btn btn-primary" style={{width: "100%", opacity: !data || enviando ? 0.4 : 1}}>
        <Ico.check s={16} c="var(--bg)"/> {enviando ? "Salvando…" : "Adiar"}
      </button>
    </div>
  );
}

// ────── Aba Saúde do detalhe do lote ──────
function SaudeDoLote({ lote, showToast }) {
  const [sheet, setSheet] = useState(null);
  const [versao, setVersao] = useState(0);
  const recarregar = () => setVersao(v => v + 1);
  const fechar = (msg) => { setSheet(null); if (msg) showToast(msg); recarregar(); };
  const destino = { loteCodigo: lote.codigo, descricao: lote.nome ? `${lote.codigo} · ${lote.nome}` : lote.codigo, tipo: lote.tipo };
  const ativo = lote.situacao === "ATIVO";
  // A aba Histórico usa onAcao(null, msg) para avisar exclusões
  const acaoHistorico = (s, msg) => s ? setSheet(s) : fechar(msg);

  return (
    <div style={{display: "flex", flexDirection: "column", gap: 12}}>
      {ativo && (
        <button onClick={() => setSheet({ tipo: "nova", destino })} className="btn btn-soft" style={{width: "100%"}}>
          <Ico.plus s={16}/> Registrar aplicação
        </button>
      )}
      <div style={{fontSize: 11, color: "var(--ink-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em"}}>A aplicar</div>
      <AbaAplicar versao={versao} onAcao={setSheet} recarregar={recarregar} showToast={showToast} loteCodigo={lote.codigo}/>
      <div style={{fontSize: 11, color: "var(--ink-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em"}}>Histórico</div>
      <AbaHistorico versao={versao} onAcao={acaoHistorico} loteCodigo={lote.codigo}/>
      <FormulariosSaude sheet={sheet} onFechar={fechar} onCancelar={() => setSheet(null)} destinoFixo={destino}/>
    </div>
  );
}

// ════════════════════════════════════════════
// BASE DE VACINAS (US5)
// ════════════════════════════════════════════
function idadeItemTexto(i) {
  const fmt = (d) => d <= 60 ? `${d} ${d === 1 ? "dia" : "dias"}` : `${Math.round(d / 30)} meses`;
  if (i.idadeInicioDias === null || i.idadeInicioDias === undefined) return "qualquer idade";
  if (i.idadeFimDias !== null && i.idadeFimDias !== undefined) return `de ${fmt(i.idadeInicioDias)} a ${fmt(i.idadeFimDias)}`;
  return `a partir de ${fmt(i.idadeInicioDias)}`;
}

function ProtocoloScreen({ back, showToast }) {
  const [tipo, setTipo] = useState("BOVINO");
  const [versao, setVersao] = useState(0);
  const [form, setForm] = useState(null); // null | {} (novo) | item
  const [erro, setErro] = useState(null);
  const base = useApi(`protocolo:${tipo}#${versao}`, () => api.protocolo(tipo));
  const recarregar = () => setVersao(v => v + 1);

  const alternar = async (item) => {
    setErro(null);
    try {
      await api.alterarItemProtocolo(item.id, { ...corpoItem(item), ativo: !item.ativo });
      showToast(item.ativo ? `${item.nome} desativado` : `${item.nome} ativado`);
      recarregar();
    } catch (e) { setErro(e); }
  };
  const restaurar = async (item) => {
    setErro(null);
    try { await api.restaurarItemProtocolo(item.id); showToast(`${item.nome} restaurado`); recarregar(); } catch (e) { setErro(e); }
  };

  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader title="Base de vacinas" subtitle="Vacinas e tratamentos sugeridos" onBack={back} action={
        <button onClick={() => setForm({})} aria-label="Incluir item" style={{
          width: 40, height: 40, borderRadius: 999, background: "var(--ink)", color: "var(--bg)", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><Ico.plus s={20} c="var(--bg)"/></button>
      }/>
      <div style={{padding: "0 16px 10px", display: "flex", justifyContent: "center"}}>
        <div className="seg">
          {TIPOS.map(t => <button key={t.tipo} onClick={() => setTipo(t.tipo)} className={tipo === t.tipo ? "on" : ""}>{t.lbl}</button>)}
        </div>
      </div>
      <div style={{padding: "0 16px"}}>
        <div style={{fontSize: 12, color: "var(--ink-3)", marginBottom: 10}}>{AVISO_VET}</div>
        <ErroForm erro={erro}/>
        {base.erro ? <ErroCarga erro={base.erro} onRetry={base.recarregar}/> : !base.data ? <Carregando/> : (
          <div className="card" style={{padding: "4px 16px"}}>
            {base.data.length === 0 ? <Empty title="Nenhum item" sub="Inclua vacinas e tratamentos para esta espécie."/> :
              base.data.map((i, idx, arr) => (
                <div key={i.id} style={{padding: "12px 0", borderBottom: idx === arr.length - 1 ? "none" : "1px solid var(--line-soft)", opacity: i.ativo ? 1 : 0.55}}>
                  <div style={{display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center"}}>
                    <span style={{fontWeight: 700, fontSize: 14}}>{i.nome}</span>
                    <span className={`chip ${i.padrao ? "" : "moss"}`} style={{padding: "2px 8px", fontSize: 10}}>
                      {i.padrao ? (i.alteradoDoPadrao ? "básico · alterado" : "básico") : "da fazenda"}
                    </span>
                  </div>
                  <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 2}}>
                    {TIPOS_APLICACAO[i.tipoAplicacao]} · {idadeItemTexto(i)}{i.sexo === "FEMEAS" ? " · só fêmeas" : ""}
                    {" · "}{i.doses > 1 ? `${i.doses} doses (${i.intervaloDosesDias} dias)` : "dose única"}
                    {i.reforco && ` · reforço ${intervaloTexto(i.reforco)}`}
                  </div>
                  <div style={{fontSize: 12, color: "var(--ink-2)", marginTop: 2}}>{i.motivo}</div>
                  <div style={{display: "flex", gap: 6, marginTop: 8}}>
                    <button onClick={() => alternar(i)} className="btn btn-ghost" style={{padding: "4px 10px", fontSize: 12}}>{i.ativo ? "Desativar" : "Ativar"}</button>
                    <button onClick={() => setForm(i)} className="btn btn-ghost" style={{padding: "4px 10px", fontSize: 12}}><Ico.edit s={12}/> Editar</button>
                    {i.alteradoDoPadrao && <button onClick={() => restaurar(i)} className="btn btn-ghost" style={{padding: "4px 10px", fontSize: 12}}>Restaurar original</button>}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      <Sheet open={!!form} onClose={() => setForm(null)} title={form?.id ? "Editar item" : "Incluir item"}>
        {form && <ItemProtocoloForm item={form.id ? form : null} tipo={tipo} onSalvo={(msg) => { setForm(null); showToast(msg); recarregar(); }}/>}
      </Sheet>
      <div className="spacer-24"/>
    </div>
  );
}

function corpoItem(i) {
  return {
    nome: i.nome, tipoAplicacao: i.tipoAplicacao, idadeInicioDias: i.idadeInicioDias, idadeFimDias: i.idadeFimDias,
    sexo: i.sexo, doses: i.doses, intervaloDosesDias: i.intervaloDosesDias, reforco: i.reforco, motivo: i.motivo,
  };
}

function ItemProtocoloForm({ item, tipo, onSalvo }) {
  const emMeses = (d) => d !== null && d !== undefined && d > 60 && d % 30 === 0;
  const inicial = (d) => d === null || d === undefined ? "" : String(emMeses(d) ? d / 30 : d);
  const [nome, setNome] = useState(item?.nome || "");
  const [tipoAplicacao, setTipoAplicacao] = useState(item?.tipoAplicacao || "VACINA");
  const [unidadeIdade, setUnidadeIdade] = useState(emMeses(item?.idadeInicioDias) ? "MESES" : "DIAS");
  const [inicio, setInicio] = useState(inicial(item?.idadeInicioDias));
  const [fim, setFim] = useState(inicial(item?.idadeFimDias));
  const [sexo, setSexo] = useState(item?.sexo || "TODOS");
  const [doses, setDoses] = useState(String(item?.doses || 1));
  const [intervaloDoses, setIntervaloDoses] = useState(item?.intervaloDosesDias ? String(item.intervaloDosesDias) : "");
  const [temReforco, setTemReforco] = useState(!!item?.reforco);
  const [reforco, setReforco] = useState(item?.reforco || { valor: 12, unidade: "MESES" });
  const [motivo, setMotivo] = useState(item?.motivo || "");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const dias = (v) => v === "" ? null : Number(v) * (unidadeIdade === "MESES" ? 30 : 1);
  const salvar = async () => {
    setEnviando(true);
    setErro(null);
    const corpo = {
      nome, tipoAplicacao, idadeInicioDias: dias(inicio), idadeFimDias: dias(fim), sexo, doses: Number(doses),
      intervaloDosesDias: Number(doses) > 1 ? Number(intervaloDoses) || null : null,
      reforco: temReforco ? { valor: Number(reforco.valor), unidade: reforco.unidade } : null, motivo,
    };
    try {
      if (item) await api.alterarItemProtocolo(item.id, { ...corpo, ativo: item.ativo });
      else await api.incluirItemProtocolo({ ...corpo, tipo });
      onSalvo(item ? "Item atualizado" : "Item incluído");
    } catch (e) { setErro(e); setEnviando(false); }
  };

  return (
    <div>
      <div className="field"><label>Nome</label><input value={nome} maxLength={80} onChange={e => setNome(e.target.value)} placeholder="Ex.: Leptospirose"/></div>
      <div className="field"><label>Tipo</label><Chips opcoes={opcoes(TIPOS_APLICACAO)} valor={tipoAplicacao} onChange={setTipoAplicacao}/></div>
      <div className="field">
        <label>Idade indicada (deixe em branco se não depende de idade)</label>
        <div style={{display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap"}}>
          <input type="number" min={0} value={inicio} onChange={e => setInicio(e.target.value)} placeholder="de" style={{width: 80}}/>
          <input type="number" min={0} value={fim} onChange={e => setFim(e.target.value)} placeholder="até" style={{width: 80}}/>
          <Chips opcoes={[["DIAS", "dias"], ["MESES", "meses"]]} valor={unidadeIdade} onChange={setUnidadeIdade}/>
        </div>
      </div>
      <div className="field"><label>Sexo</label><Chips opcoes={[["TODOS", "Todos"], ["FEMEAS", "Só fêmeas"]]} valor={sexo} onChange={setSexo}/></div>
      <div style={{display: "flex", gap: 8}}>
        <div className="field" style={{flex: 1}}><label>Doses</label><input type="number" min={1} value={doses} onChange={e => setDoses(e.target.value)}/></div>
        {Number(doses) > 1 && (
          <div className="field" style={{flex: 1}}><label>Intervalo (dias)</label><input type="number" min={1} value={intervaloDoses} onChange={e => setIntervaloDoses(e.target.value)}/></div>
        )}
      </div>
      <Switch ligado={temReforco} onChange={setTemReforco} rotulo="Tem reforço periódico"/>
      {temReforco && (
        <div className="field">
          <label>Reforço a cada</label>
          <div style={{display: "flex", gap: 8, alignItems: "center"}}>
            <input type="number" min={1} value={reforco.valor} onChange={e => setReforco(r => ({ ...r, valor: e.target.value }))} style={{width: 80}}/>
            <Chips opcoes={opcoes(UNIDADES)} valor={reforco.unidade} onChange={u => setReforco(r => ({ ...r, unidade: u }))}/>
          </div>
        </div>
      )}
      <div className="field"><label>Motivo (aparece na sugestão)</label><input value={motivo} maxLength={200} onChange={e => setMotivo(e.target.value)}/></div>
      <ErroForm erro={erro}/>
      <button onClick={salvar} disabled={!nome.trim() || !motivo.trim() || enviando} className="btn btn-primary"
        style={{width: "100%", opacity: !nome.trim() || !motivo.trim() || enviando ? 0.4 : 1}}>
        <Ico.check s={16} c="var(--bg)"/> {enviando ? "Salvando…" : "Salvar"}
      </button>
    </div>
  );
}

export { SaudeScreen, SaudeDoLote, AplicacaoForm, ProtocoloScreen };
