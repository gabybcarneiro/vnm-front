import { useState } from 'react';
import { api, useApi, TIPOS, tipoInfo, finalidadesPorTipo, FINALIDADES, hojeIso, dataBr, sexosTexto } from './api.js';
import { Ico, PageHeader, Sheet, Empty } from './ui.jsx';
import { Carregando, ErroCarga, ErroForm, ChipsMulti, QuantidadesForm } from './screens-lotes.jsx';
import { AplicacaoForm } from './screens-saude.jsx';
// VidaNoMato — nascimentos (001) com calendário de vacinas sugerido (feature 004, US4)


const QTD_ZERO = { machos: 0, femeas: 0, naoInformado: 0 };

// ════════════════════════════════════════════
// REGISTRAR NASCIMENTO
// ════════════════════════════════════════════
function NascimentoScreen({ back, onSalvo }) {
  const [tipo, setTipo] = useState("");
  const [racaId, setRacaId] = useState("");
  const [data, setData] = useState(hojeIso());
  const [qtd, setQtd] = useState(QTD_ZERO);
  const [obs, setObs] = useState("");
  const [desmarcados, setDesmarcados] = useState(new Set());
  const [datas, setDatas] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const total = qtd.machos + qtd.femeas + qtd.naoInformado;
  const racas = useApi(`racas:${tipo}`, () => tipo ? api.racas(tipo) : Promise.resolve([]));
  const params = { tipo, dataNascimento: data, machos: qtd.machos, femeas: qtd.femeas, naoInformado: qtd.naoInformado };
  const calendario = useApi(`calendario:${JSON.stringify(params)}`,
    () => tipo && data && data <= hojeIso() ? api.calendarioSugerido(params) : Promise.resolve([]));
  const chave = (c) => `${c.itemProtocoloId}:${c.numeroDose}`;
  const itens = calendario.data || [];

  const escolherTipo = (t) => { setTipo(t); setRacaId(""); setDesmarcados(new Set()); setDatas({}); };
  const alternar = (k) => setDesmarcados(s => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const valido = tipo && racaId && data && total > 0;

  const salvar = async () => {
    setEnviando(true);
    setErro(null);
    const mantidos = itens.filter(c => !desmarcados.has(chave(c)))
      .map(c => ({ itemProtocoloId: c.itemProtocoloId, numeroDose: c.numeroDose, dataPrevista: datas[chave(c)] || c.dataPrevista }));
    try {
      await api.registrarNascimento({ tipo, racaId, dataNascimento: data, quantidades: qtd, observacoes: obs.trim() || undefined, calendario: mantidos });
      onSalvo(mantidos.length ? `Nascimento registrado · ${mantidos.length} vacinas agendadas` : "Nascimento registrado");
    } catch (e) { setErro(e); setEnviando(false); }
  };

  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader title="Registrar nascimento" subtitle="Os nascimentos ficam sem lote até você agrupá-los" onBack={back}/>
      <div style={{padding: "0 16px"}}>
        <div className="field">
          <label>Espécie</label>
          <div style={{display: "flex", gap: 8}}>
            {TIPOS.map(s => (
              <button key={s.tipo} onClick={() => escolherTipo(s.tipo)} className="card" style={{
                flex: 1, padding: 12, textAlign: "center",
                background: tipo === s.tipo ? "var(--terra-soft)" : "var(--surface)",
                borderColor: tipo === s.tipo ? "var(--terra)" : "var(--line)", borderWidth: tipo === s.tipo ? 2 : 1,
              }}>
                <div style={{fontSize: 26}}>{s.emoji}</div>
                <div style={{fontWeight: 700, fontSize: 13}}>{s.lbl}</div>
              </button>
            ))}
          </div>
        </div>
        {tipo && <>
          <div className="field">
            <label>Raça</label>
            {racas.erro ? <ErroCarga erro={racas.erro} onRetry={racas.recarregar}/> : (
              <select value={racaId} onChange={e => setRacaId(e.target.value)} disabled={racas.carregando}>
                <option value="">{racas.carregando ? "Carregando…" : "Selecione..."}</option>
                {(racas.data || []).map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
              </select>
            )}
          </div>
          <div className="field">
            <label>Data de nascimento</label>
            <input type="date" value={data} max={hojeIso()} onChange={e => { setData(e.target.value); setDatas({}); }}/>
          </div>
          <div className="field">
            <label>Quantos nasceram?</label>
            <QuantidadesForm q={qtd} setQ={setQtd} tipo={tipo}/>
          </div>
          <div className="field">
            <label>Observações (opcional)</label>
            <textarea rows={2} value={obs} onChange={e => setObs(e.target.value)}/>
          </div>

          <div className="card" style={{padding: "14px 16px", marginBottom: 14}}>
            <div style={{display: "flex", alignItems: "center", gap: 8}}>
              <Ico.vaccine s={18}/>
              <span style={{fontWeight: 700}}>Calendário de vacinas sugerido</span>
            </div>
            <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 4}}>
              Desmarque o que não vai aplicar e ajuste as datas. Confirme o protocolo com o seu veterinário.
            </div>
            {calendario.erro ? <ErroCarga erro={calendario.erro} onRetry={calendario.recarregar}/> : calendario.carregando ? <Carregando/> :
              itens.length === 0 ? <div style={{fontSize: 13, color: "var(--ink-3)", paddingTop: 10}}>Nenhuma vacina básica para esta espécie.</div> :
              itens.map(c => {
                const k = chave(c);
                const marcado = !desmarcados.has(k);
                return (
                  <div key={k} style={{display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: "1px solid var(--line-soft)", marginTop: 8, opacity: marcado ? 1 : 0.5}}>
                    <input type="checkbox" checked={marcado} onChange={() => alternar(k)} style={{width: 18, height: 18}} aria-label={c.nome}/>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{fontWeight: 700, fontSize: 14}}>{c.nome}</div>
                      <div style={{display: "flex", gap: 6, marginTop: 2, flexWrap: "wrap"}}>
                        {c.somenteFemeas && <span className="chip" style={{padding: "1px 8px", fontSize: 10}}>só fêmeas</span>}
                        {c.atrasada && <span className="chip" style={{padding: "1px 8px", fontSize: 10, background: "var(--danger-soft)", color: "var(--danger)"}}>atrasada · aplicar o quanto antes</span>}
                      </div>
                    </div>
                    <input type="date" value={datas[k] || c.dataPrevista} min={data} disabled={!marcado}
                      onChange={e => setDatas(d => ({ ...d, [k]: e.target.value }))} style={{width: 150}}/>
                  </div>
                );
              })}
          </div>
        </>}
        <ErroForm erro={erro}/>
        <button onClick={salvar} disabled={!valido || enviando} className="btn btn-primary" style={{width: "100%", opacity: !valido || enviando ? 0.4 : 1}}>
          <Ico.check s={16} c="var(--bg)"/> {enviando ? "Salvando…" : "Registrar nascimento"}
        </button>
      </div>
      <div className="spacer-24"/>
    </div>
  );
}

// ════════════════════════════════════════════
// NASCIMENTOS SEM LOTE
// ════════════════════════════════════════════
function NascimentosSemLoteScreen({ back, openLote, showToast, openNovo }) {
  const [versao, setVersao] = useState(0);
  const [selecionados, setSelecionados] = useState([]);
  const [sheet, setSheet] = useState(null); // null | "lote" | { aplicacao: nascimento }
  const lista = useApi(`nascimentosSemLote#${versao}`, () => api.nascimentos({ semLote: true }));
  const itens = lista.data || [];
  const tipoSelecionado = itens.find(n => n.id === selecionados[0])?.tipo;

  const alternar = (n) => setSelecionados(s => s.includes(n.id) ? s.filter(x => x !== n.id) : [...s, n.id]);

  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader title="Nascimentos sem lote" subtitle="Selecione nascimentos da mesma espécie para criar um lote" onBack={back} action={
        <button onClick={openNovo} aria-label="Registrar nascimento" style={{
          width: 40, height: 40, borderRadius: 999, background: "var(--ink)", color: "var(--bg)", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><Ico.plus s={20} c="var(--bg)"/></button>
      }/>
      <div style={{padding: "0 16px"}}>
        {lista.erro ? <ErroCarga erro={lista.erro} onRetry={lista.recarregar}/> : !lista.data ? <Carregando/> : (
          <div className="card" style={{padding: "4px 16px"}}>
            {itens.length === 0 ? <Empty title="Nenhum nascimento sem lote" sub="Os nascimentos registrados aparecem aqui até virarem um lote."/> :
              itens.map((n, i, arr) => {
                const outroTipo = tipoSelecionado && n.tipo !== tipoSelecionado;
                return (
                  <div key={n.id} style={{display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i === arr.length - 1 ? "none" : "1px solid var(--line-soft)", opacity: outroTipo ? 0.45 : 1}}>
                    <input type="checkbox" checked={selecionados.includes(n.id)} disabled={outroTipo} onChange={() => alternar(n)} style={{width: 18, height: 18}}/>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{fontWeight: 700, fontSize: 14}}>{tipoInfo(n.tipo).emoji} {n.quantidades.total} · {n.raca.nome}</div>
                      <div style={{fontSize: 12, color: "var(--ink-3)"}}>Nasceram em {dataBr(n.dataNascimento)} · {sexosTexto(n.quantidades)}</div>
                    </div>
                    <button onClick={() => setSheet({ aplicacao: n })} className="btn btn-ghost" style={{padding: "4px 10px", fontSize: 12}}>
                      <Ico.vaccine s={12}/> Aplicação
                    </button>
                  </div>
                );
              })}
          </div>
        )}
        <div className="spacer-24"/>
        <button onClick={() => setSheet("lote")} disabled={!selecionados.length} className="btn btn-primary"
          style={{width: "100%", opacity: selecionados.length ? 1 : 0.4}}>
          <Ico.plus s={16} c="var(--bg)"/> Criar lote com {selecionados.length} {selecionados.length === 1 ? "nascimento" : "nascimentos"}
        </button>
      </div>
      <Sheet open={!!sheet} onClose={() => setSheet(null)} title={sheet === "lote" ? "Criar lote" : "Registrar aplicação"}>
        {sheet === "lote" && <CriarLoteForm ids={selecionados} tipo={tipoSelecionado} onCriado={(l) => {
          setSheet(null);
          showToast(`Lote ${l.codigo} criado`);
          setSelecionados([]);
          setVersao(v => v + 1);
          openLote(l);
        }}/>}
        {sheet?.aplicacao && <AplicacaoForm
          destinoFixo={{ nascimentoId: sheet.aplicacao.id, tipo: sheet.aplicacao.tipo,
            descricao: `Nascimento de ${dataBr(sheet.aplicacao.dataNascimento)} · ${sheet.aplicacao.quantidades.total} ${tipoInfo(sheet.aplicacao.tipo).desc.toLowerCase()}` }}
          onSalvo={(msg) => { setSheet(null); showToast(msg); }}/>}
      </Sheet>
      <div className="spacer-24"/>
    </div>
  );
}

function CriarLoteForm({ ids, tipo, onCriado }) {
  const [nome, setNome] = useState("");
  const [finalidades, setFinalidades] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const salvar = async () => {
    setEnviando(true);
    setErro(null);
    try {
      const lote = await api.criarLoteDeNascimentos({ nascimentoIds: ids, finalidades, nome: nome.trim() || undefined });
      onCriado(lote);
    } catch (e) { setErro(e); setEnviando(false); }
  };
  return (
    <div>
      <div style={{fontSize: 13, color: "var(--ink-3)", marginBottom: 12}}>
        As vacinas agendadas dos nascimentos passam para o lote, sem repetir a mesma vacina.
      </div>
      <div className="field"><label>Nome (opcional)</label><input value={nome} maxLength={80} onChange={e => setNome(e.target.value)}/></div>
      <div className="field">
        <label>Finalidade</label>
        <ChipsMulti opcoes={finalidadesPorTipo(tipo).map(f => [f, FINALIDADES[f]])} valores={finalidades} onChange={setFinalidades}/>
      </div>
      <ErroForm erro={erro}/>
      <button onClick={salvar} disabled={!finalidades.length || enviando} className="btn btn-primary"
        style={{width: "100%", opacity: !finalidades.length || enviando ? 0.4 : 1}}>
        <Ico.check s={16} c="var(--bg)"/> {enviando ? "Criando…" : "Criar lote"}
      </button>
    </div>
  );
}

export { NascimentoScreen, NascimentosSemLoteScreen };
