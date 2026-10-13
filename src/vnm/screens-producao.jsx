import { useState } from 'react';
import { api, useApi, tipoInfo, sexosTexto, dataBr, hojeIso } from './api.js';
import { Ico, PageHeader, Sheet, BarChart, Empty } from './ui.jsx';
import { Carregando, ErroCarga, ErroForm } from './screens-lotes.jsx';
// VidaNoMato — tela de Produção ligada ao vnm-backend (feature 003): Ovos, Leite e Corte dos lotes da fazenda


// Cada seção da tela: finalidade do lote, tipo de lançamento e textos
const SECOES = [
  { k: "ovos", l: "Ovos", tipo: "OVOS", finalidade: "OVOS", cor: "var(--terra)", unidade: "ovos",
    registrar: "Registrar coleta de ovos", tituloForm: "Coleta de ovos", toast: "Coleta registrada", vazio: "Nenhum lote de ovos" },
  { k: "leite", l: "Leite", tipo: "LEITE", finalidade: "LEITE", cor: "var(--moss)", unidade: "litros", sufixo: "L",
    registrar: "Registrar ordenha", tituloForm: "Ordenha", toast: "Ordenha registrada", vazio: "Nenhum lote de leite" },
  { k: "corte", l: "Corte", tipo: "PESAGEM", finalidade: "CORTE", cor: "var(--terra)",
    registrar: "Registrar pesagem", tituloForm: "Pesagem", toast: "Pesagem registrada", vazio: "Nenhum lote de corte" },
];

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const rotuloDia = (iso) => iso === hojeIso() ? "Hoje" : DIAS[new Date(`${iso}T12:00:00`).getDay()];
const num = (v, casas = 1) => v === null || v === undefined ? "—" : Number(v).toLocaleString("pt-BR", { maximumFractionDigits: casas });
const nomeLote = (l) => l.nome || l.codigo;
const plural = (n, um, varios) => `${num(n, 0)} ${n === 1 ? um : varios}`;

// ════════════════════════════════════════════
// PRODUÇÃO
// ════════════════════════════════════════════
function ProducaoScreen({ showToast, openLote, openAdd }) {
  const [tab, setTab] = useState("ovos");
  const [form, setForm] = useState(null);           // { secao, lote?, lancamento? }
  const [loteAberto, setLoteAberto] = useState(null); // { secao, lote }
  const [semFinalidade, setSemFinalidade] = useState(false);
  const producao = useApi("producao", () => api.producao());

  const secao = SECOES.find(s => s.k === tab);
  const p = producao.data;

  const aposSalvar = () => {
    showToast(form.lancamento ? "Lançamento corrigido" : form.secao.toast);
    setForm(null);
    producao.recarregar();
  };

  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader title="Produção" subtitle={p ? `${dataBr(p.periodo.inicio)} a ${dataBr(p.periodo.fim)} · últimos 7 dias` : "Ovos, leite e corte dos lotes da fazenda"}/>

      {producao.erro ? <div style={{padding: "0 16px"}}><ErroCarga erro={producao.erro} onRetry={producao.recarregar}/></div>
        : !p ? <Carregando/> : (
        <>
          {p.lotesSemFinalidade > 0 && (
            <div style={{padding: "0 16px 12px"}}>
              <button onClick={() => setSemFinalidade(true)} className="card" style={{
                width: "100%", padding: 14, display: "flex", gap: 12, alignItems: "center", textAlign: "left",
                background: "var(--yolk-soft)", borderColor: "transparent",
              }}>
                <Ico.alert c="#82591A"/>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 700, fontSize: 14, color: "#82591A"}}>
                    {p.lotesSemFinalidade === 1 ? "1 lote sem finalidade" : `${p.lotesSemFinalidade} lotes sem finalidade`}
                  </div>
                  <div style={{fontSize: 12, color: "#82591A"}}>Informe a finalidade para que apareçam na Produção.</div>
                </div>
                <Ico.chevron c="#82591A"/>
              </button>
            </div>
          )}

          <div style={{padding: "0 16px 14px"}}>
            <div className="seg" style={{display: "flex", width: "100%"}}>
              {SECOES.map(s => (
                <button key={s.k} onClick={() => setTab(s.k)} className={tab === s.k ? "on" : ""} style={{flex: 1}}>{s.l}</button>
              ))}
            </div>
          </div>

          <div style={{padding: "0 16px", display: "flex", flexDirection: "column", gap: 12}}>
            {tab === "corte"
              ? <SecaoCorte dados={p.corte} onLote={l => setLoteAberto({ secao, lote: l })}/>
              : <SecaoDiaria secao={secao} dados={p[tab]} onLote={l => setLoteAberto({ secao, lote: l })}/>}

            {p[tab].lotes.length === 0 ? (
              <button onClick={openAdd} className="btn btn-soft" style={{width: "100%"}}><Ico.plus s={16}/> Cadastrar lote</button>
            ) : (
              <button onClick={() => setForm({ secao })} className={tab === "leite" ? "btn btn-primary" : "btn btn-terra"} style={{width: "100%"}}>
                <Ico.plus s={16} c="#fff"/> {secao.registrar}
              </button>
            )}
          </div>
        </>
      )}

      <Sheet open={!!form} onClose={() => setForm(null)} title={form && (form.lancamento ? `Corrigir ${form.secao.tituloForm.toLowerCase()}` : form.secao.tituloForm)}>
        {form && <LancamentoForm key={form.lancamento?.id || form.secao.k} {...form} onSalvo={aposSalvar}/>}
      </Sheet>

      <Sheet open={!!loteAberto} onClose={() => setLoteAberto(null)} title={loteAberto && nomeLote(loteAberto.lote)}>
        {loteAberto && (
          <LancamentosLote {...loteAberto}
            onCorrigir={(lancamento) => { setForm({ secao: loteAberto.secao, lote: loteAberto.lote, lancamento }); setLoteAberto(null); }}
            onRegistrar={() => { setForm({ secao: loteAberto.secao, lote: loteAberto.lote }); setLoteAberto(null); }}
            onExcluido={() => { showToast("Lançamento excluído"); producao.recarregar(); }}
            onAbrirLote={() => { const l = loteAberto.lote; setLoteAberto(null); openLote(l); }}/>
        )}
      </Sheet>

      <Sheet open={semFinalidade} onClose={() => setSemFinalidade(false)} title="Lotes sem finalidade">
        {semFinalidade && <LotesSemFinalidade onAbrir={(l) => { setSemFinalidade(false); openLote(l); }}/>}
      </Sheet>

      <div className="spacer-24"/>
    </div>
  );
}

// ────── Ovos e Leite ──────
function SecaoDiaria({ secao, dados, onLote }) {
  const ovos = secao.k === "ovos";
  return (
    <>
      <div className="card" style={{padding: 18}}>
        <div className="stat-label">{ovos ? "OVOS NA SEMANA" : "LEITE NA SEMANA"}</div>
        <div style={{display: "flex", alignItems: "baseline", gap: 8, marginTop: 6}}>
          <span className="serif" style={{fontSize: 52, lineHeight: 1, color: secao.cor}}>{num(dados.total)}</span>
          <span style={{fontSize: 14, color: "var(--ink-3)", fontWeight: 600}}>{secao.unidade} · 7 dias</span>
        </div>
        <div style={{display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap"}}>
          <span className="chip" style={{padding: "3px 10px", fontSize: 11}}>~{num(Number(dados.total) / 7)} {secao.unidade}/dia</span>
          <span className="chip" style={{padding: "3px 10px", fontSize: 11}}>{plural(dados.totalLotes, "lote", "lotes")} · {plural(dados.totalAnimais, "animal", "animais")}</span>
        </div>
        <div style={{marginTop: 16}}>
          <BarChart data={dados.porDia.map(d => ({ d: rotuloDia(d.data), v: Number(d.total) }))} color={secao.cor} height={120} valSuffix={secao.sufixo || ""}/>
        </div>
      </div>

      <div className="card" style={{padding: "14px 18px"}}>
        <div style={{fontWeight: 700, marginBottom: 4}}>Por lote</div>
        {dados.lotes.length === 0 ? <Empty title={secao.vazio} sub="Cadastre um lote com essa finalidade para registrar a produção."/> :
          dados.lotes.map((item, i, arr) => (
            <LinhaLote key={item.lote.codigo} lote={item.lote} ultimo={i === arr.length - 1} onClick={() => onLote(item.lote)}
              valor={`${num(item.totalPeriodo)}${secao.sufixo ? " L" : ""}`}
              detalhe={ovos
                ? `${num(item.mediaDia)} ovos/dia · ${item.mediaPorAveDia === null ? "sem aves" : `${num(item.mediaPorAveDia, 2)} ovo/ave/dia`}`
                : `${num(item.mediaDia)} L/dia`}/>
          ))}
      </div>
    </>
  );
}

// ────── Corte ──────
function SecaoCorte({ dados, onLote }) {
  return (
    <div className="card" style={{padding: "14px 18px"}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4}}>
        <span style={{fontWeight: 700}}>Lotes de corte</span>
        <span style={{fontSize: 12, color: "var(--ink-3)"}}>{plural(dados.totalLotes, "lote", "lotes")} · {plural(dados.totalAnimais, "animal", "animais")}</span>
      </div>
      {dados.lotes.length === 0 ? <Empty title="Nenhum lote de corte" sub="Cadastre um lote com essa finalidade para registrar pesagens."/> :
        dados.lotes.map((item, i, arr) => {
          const u = item.ultimaPesagem;
          const ganho = item.ganhoMedioDiario;
          return (
            <LinhaLote key={item.lote.codigo} lote={item.lote} ultimo={i === arr.length - 1} onClick={() => onLote(item.lote)}
              valor={u ? `${num(u.pesoMedio)} kg` : "—"}
              detalhe={!u ? "nunca pesado"
                : `pesado em ${dataBr(u.data)} · ${ganho === null ? "sem pesagem anterior" : `${Number(ganho) > 0 ? "+" : ""}${num(ganho, 2)} kg/dia`}`}/>
          );
        })}
    </div>
  );
}

function LinhaLote({ lote, valor, detalhe, ultimo, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 0", textAlign: "left",
      background: "none", border: "none", borderBottom: ultimo ? "none" : "1px solid var(--line-soft)", color: "inherit",
    }}>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontWeight: 700, fontSize: 14}}>{nomeLote(lote)}</div>
        <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 2}}>
          {lote.codigo} · {tipoInfo(lote.tipo).desc} · {lote.raca.nome} · {lote.quantidades.total} ({sexosTexto(lote.quantidades)})
        </div>
        <div style={{fontSize: 12, color: "var(--ink-2)", marginTop: 2}}>{detalhe}</div>
      </div>
      <div className="serif" style={{fontSize: 22, color: "var(--ink)", flexShrink: 0}}>{valor}</div>
      <Ico.chevron c="var(--ink-3)"/>
    </button>
  );
}

// ────── Lançamentos de um lote (corrigir / excluir) ──────
function LancamentosLote({ secao, lote, onCorrigir, onRegistrar, onExcluido, onAbrirLote }) {
  const lista = useApi(`lancamentos:${lote.codigo}:${secao.tipo}`, () => api.lancamentos(lote.codigo, secao.tipo));
  const [confirmar, setConfirmar] = useState(null);
  const [erro, setErro] = useState(null);

  const excluir = async (id) => {
    setErro(null);
    try {
      await api.excluirLancamento(lote.codigo, id);
      setConfirmar(null);
      lista.recarregar();
      onExcluido();
    } catch (e) {
      setErro(e);
    }
  };

  return (
    <div>
      <div style={{fontSize: 13, color: "var(--ink-3)", marginBottom: 12}}>
        {lote.codigo} · {lote.raca.nome} · {secao.tituloForm}: lançamentos registrados
      </div>
      <ErroForm erro={erro}/>
      {lista.erro ? <ErroCarga erro={lista.erro} onRetry={lista.recarregar}/> : !lista.data ? <Carregando/> :
        lista.data.length === 0 ? <Empty title="Nenhum lançamento" sub="Os registros deste lote aparecerão aqui."/> : (
          <div style={{maxHeight: "45vh", overflowY: "auto"}}>
            {lista.data.map((m, i, arr) => (
              <div key={m.id} style={{padding: "10px 0", borderBottom: i === arr.length - 1 ? "none" : "1px solid var(--line-soft)"}}>
                <div style={{display: "flex", justifyContent: "space-between", gap: 8}}>
                  <span style={{fontWeight: 700, fontSize: 14}}>{descricaoLancamento(m)}</span>
                  <span style={{fontSize: 12, color: "var(--ink-3)", flexShrink: 0}}>{dataBr(m.dataOcorrencia)}</span>
                </div>
                {m.observacoes && <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 2}}>{m.observacoes}</div>}
                <div style={{display: "flex", alignItems: "center", gap: 8, marginTop: 6}}>
                  <span style={{fontSize: 11, color: "var(--ink-3)", flex: 1}}>
                    por {m.registradoPor?.nome || "—"}{m.substituiId ? " · corrigido" : ""}
                  </span>
                  {confirmar === m.id ? (
                    <>
                      <span style={{fontSize: 12, color: "var(--danger)", fontWeight: 600}}>Excluir?</span>
                      <button onClick={() => excluir(m.id)} className="btn btn-soft" style={{padding: "4px 10px", fontSize: 12, color: "var(--danger)"}}>Sim</button>
                      <button onClick={() => setConfirmar(null)} className="btn btn-ghost" style={{padding: "4px 10px", fontSize: 12}}>Não</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => onCorrigir(m)} className="btn btn-ghost" style={{padding: "4px 10px", fontSize: 12}}><Ico.edit s={12}/> Corrigir</button>
                      <button onClick={() => setConfirmar(m.id)} className="btn btn-ghost" style={{padding: "4px 10px", fontSize: 12, color: "var(--danger)"}}>Excluir</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      <div style={{display: "flex", gap: 10, marginTop: 14}}>
        <button onClick={onAbrirLote} className="btn btn-ghost" style={{flex: 1}}>Abrir lote</button>
        <button onClick={onRegistrar} className="btn btn-primary" style={{flex: 2}}><Ico.plus s={14} c="var(--bg)"/> {secao.registrar.replace("Registrar ", "Nova ")}</button>
      </div>
    </div>
  );
}

function descricaoLancamento(m) {
  if (m.tipo === "OVOS") return plural(Number(m.quantidade), "ovo", "ovos");
  if (m.tipo === "LEITE") return `${num(m.quantidade)} L`;
  return `${plural(m.animaisPesados, "animal", "animais")} · ${num(m.quantidade)} kg · média ${num(m.pesoMedio)} kg`;
}

// ────── Formulário de coleta / ordenha / pesagem ──────
function LancamentoForm({ secao, lote, lancamento, onSalvo }) {
  const pesagem = secao.tipo === "PESAGEM";
  const fixo = lote || null;
  const [codigo, setCodigo] = useState(fixo?.codigo || "");
  const [data, setData] = useState(lancamento?.dataOcorrencia || hojeIso());
  const [quantidade, setQuantidade] = useState(lancamento ? String(lancamento.quantidade) : "");
  const [animais, setAnimais] = useState(lancamento?.animaisPesados ? String(lancamento.animaisPesados) : "");
  const [obs, setObs] = useState(lancamento?.observacoes || "");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  // Só lotes ativos com a finalidade da seção (FR-023)
  const elegiveis = useApi(`elegiveis:${secao.finalidade}`, () => fixo ? Promise.resolve(null) : api.lotes({ situacao: "ATIVO", finalidade: secao.finalidade }));
  const opcoes = elegiveis.data?.itens || [];
  const selecionado = fixo || opcoes.find(l => l.codigo === codigo);

  const q = Number(quantidade.replace(",", "."));
  const a = Number(animais);
  const valido = codigo && data && q > 0 && (!pesagem || a > 0);
  const previa = pesagem && q > 0 && a > 0 ? q / a : null;

  const salvar = async () => {
    setEnviando(true);
    setErro(null);
    const dados = {
      tipo: secao.tipo, dataOcorrencia: data, quantidade: q,
      animaisPesados: pesagem ? a : undefined,
      observacoes: obs.trim() || undefined,
    };
    try {
      if (lancamento) await api.corrigirLancamento(codigo, lancamento.id, dados);
      else await api.registrarLancamento(codigo, dados);
      onSalvo();
    } catch (err) {
      setErro(err);
      setEnviando(false);
    }
  };

  return (
    <div>
      <div className="field">
        <label>Lote</label>
        {fixo ? (
          <div style={{fontWeight: 700}}>{nomeLote(fixo)} <span style={{fontWeight: 500, color: "var(--ink-3)", fontSize: 13}}>· {fixo.codigo}</span></div>
        ) : elegiveis.erro ? <ErroCarga erro={elegiveis.erro} onRetry={elegiveis.recarregar}/> : (
          <select value={codigo} onChange={e => setCodigo(e.target.value)} disabled={elegiveis.carregando}>
            <option value="">{elegiveis.carregando ? "Carregando…" : "Selecione..."}</option>
            {opcoes.map(l => <option key={l.codigo} value={l.codigo}>{nomeLote(l)} · {l.codigo}</option>)}
          </select>
        )}
      </div>
      <div className="field">
        <label>{pesagem ? "Data da pesagem" : secao.k === "ovos" ? "Data da coleta" : "Data da ordenha"}</label>
        <input type="date" value={data} max={hojeIso()} onChange={e => setData(e.target.value)}/>
      </div>
      {pesagem && (
        <div className="field">
          <label>Animais pesados</label>
          <input type="number" inputMode="numeric" min={1} step={1} value={animais} onChange={e => setAnimais(e.target.value)}/>
          {selecionado && <div style={{fontSize: 12, color: "var(--ink-3)"}}>No lote hoje: {selecionado.quantidades.total}</div>}
        </div>
      )}
      <div className="field">
        <label>{pesagem ? "Peso total (kg)" : secao.k === "ovos" ? "Quantidade de ovos" : "Litros"}</label>
        <input type="number" inputMode={secao.k === "ovos" ? "numeric" : "decimal"} min={0} step={secao.k === "ovos" ? 1 : 0.1}
          value={quantidade} onChange={e => setQuantidade(e.target.value)}/>
        {previa !== null && <div style={{fontSize: 12, color: "var(--ink-3)"}}>Peso médio: {num(previa)} kg por animal</div>}
      </div>
      <div className="field">
        <label>Observações (opcional)</label>
        <textarea rows={2} value={obs} maxLength={500} onChange={e => setObs(e.target.value)}/>
      </div>
      <ErroForm erro={erro}/>
      <button onClick={salvar} disabled={!valido || enviando} className="btn btn-primary" style={{width: "100%", opacity: !valido || enviando ? 0.4 : 1}}>
        <Ico.check s={16} c="var(--bg)"/> {enviando ? "Salvando…" : lancamento ? "Salvar correção" : "Registrar"}
      </button>
    </div>
  );
}

// ────── Lotes sem finalidade (cadastrados antes da feature 003) ──────
function LotesSemFinalidade({ onAbrir }) {
  const lotes = useApi("semFinalidade", () => api.lotes({ situacao: "ATIVO", semFinalidade: true }));
  if (lotes.erro) return <ErroCarga erro={lotes.erro} onRetry={lotes.recarregar}/>;
  if (!lotes.data) return <Carregando/>;
  return (
    <div>
      <div style={{fontSize: 13, color: "var(--ink-3)", marginBottom: 8}}>Abra o lote e toque em “Informar” na linha Finalidade.</div>
      {lotes.data.itens.length === 0 ? <Empty title="Tudo certo" sub="Todos os lotes têm finalidade."/> :
        lotes.data.itens.map((l, i, arr) => (
          <LinhaLote key={l.codigo} lote={l} ultimo={i === arr.length - 1} onClick={() => onAbrir(l)} valor="" detalhe="Finalidade não informada"/>
        ))}
    </div>
  );
}

export { ProducaoScreen };
