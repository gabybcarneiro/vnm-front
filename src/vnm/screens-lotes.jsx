import { useState } from 'react';
import { api, useApi, login, TIPOS, tipoInfo, MOTIVOS, hojeIso, dataBr, idadeDesde, nascimentoLote, sexosTexto } from './api.js';
import { Ico, SpeciesAvatar, PageHeader, StatTile, Sheet, Empty } from './ui.jsx';
// VidaNoMato — telas ligadas ao vnm-backend: Login, Rebanho (lotes), Detalhe do lote, Novo lote


// ────── Pequenos blocos compartilhados ──────
function Carregando() {
  return <div style={{padding: "28px 0", textAlign: "center", fontSize: 13, color: "var(--ink-3)", fontWeight: 600}}>Carregando…</div>;
}

function ErroCarga({ erro, onRetry }) {
  return (
    <div className="card" style={{padding: 16, display: "flex", gap: 12, alignItems: "center", background: "var(--danger-soft)", borderColor: "transparent"}}>
      <Ico.alert c="var(--danger)"/>
      <div style={{flex: 1, fontSize: 13, color: "var(--danger)", fontWeight: 600}}>{erro.message}</div>
      {onRetry && <button onClick={onRetry} className="btn btn-soft" style={{padding: "8px 12px", fontSize: 13}}>Tentar de novo</button>}
    </div>
  );
}

function ErroForm({ erro }) {
  if (!erro) return null;
  return (
    <div style={{padding: "10px 14px", marginBottom: 14, borderRadius: 12, background: "var(--danger-soft)", color: "var(--danger)", fontSize: 13, fontWeight: 600}}>
      {erro.message}
    </div>
  );
}

function QtdStepper({ label, value, onChange }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 14px", marginBottom: 8,
      background: "var(--surface)", borderRadius: 16, border: "1px solid var(--line)",
    }}>
      <div style={{flex: 1, fontWeight: 700, fontSize: 15}}>{label}</div>
      <div className="stepper" style={{padding: "4px 6px"}}>
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))}>−</button>
        <input
          className="val" inputMode="numeric" value={value}
          onChange={e => onChange(Math.max(0, parseInt(e.target.value.replace(/\D/g, ""), 10) || 0))}
          style={{width: 48, textAlign: "center", border: "none", background: "transparent", outline: "none", fontFamily: "inherit"}}
        />
        <button type="button" onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}

function QuantidadesForm({ q, setQ, tipo }) {
  const [m, f] = tipo === "GALINHA" ? ["Galos ♂", "Galinhas ♀"] : ["Machos ♂", "Fêmeas ♀"];
  return (
    <div>
      <QtdStepper label={f} value={q.femeas} onChange={v => setQ({...q, femeas: v})}/>
      <QtdStepper label={m} value={q.machos} onChange={v => setQ({...q, machos: v})}/>
      <QtdStepper label="Sexo não informado" value={q.naoInformado} onChange={v => setQ({...q, naoInformado: v})}/>
    </div>
  );
}

const somaQtd = (q) => q.machos + q.femeas + q.naoInformado;
const QTD_ZERO = { machos: 0, femeas: 0, naoInformado: 0 };

function Chips({ opcoes, valor, onChange }) {
  return (
    <div style={{display: "flex", gap: 6, flexWrap: "wrap"}}>
      {opcoes.map(([k, l]) => (
        <button key={k} type="button" onClick={() => onChange(k)} className="chip" style={{
          background: valor === k ? "var(--terra)" : "var(--surface)",
          color: valor === k ? "#fff" : "var(--ink-2)",
          borderColor: valor === k ? "var(--terra)" : "var(--line)",
        }}>{l}</button>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════
// LOGIN
// ════════════════════════════════════════════
function LoginScreen() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const entrar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await login(usuario.trim(), senha);
    } catch (err) {
      setErro(err.status === 401 ? new Error("Usuário ou senha incorretos") : err);
      setEnviando(false);
    }
  };

  return (
    <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "var(--bg)"}}>
      <form onSubmit={entrar} className="card" style={{width: "100%", maxWidth: 380, padding: 24}}>
        <div style={{textAlign: "center", marginBottom: 20}}>
          <div style={{fontSize: 40}}>🌾</div>
          <div className="serif" style={{fontSize: 32, marginTop: 4}}>VidaNoMato</div>
          <div style={{fontSize: 13, color: "var(--ink-3)", marginTop: 2}}>Entre para administrar o sítio</div>
        </div>
        <ErroForm erro={erro}/>
        <div className="field">
          <label>Usuário</label>
          <input value={usuario} onChange={e => setUsuario(e.target.value)} autoComplete="username" autoCapitalize="none" required/>
        </div>
        <div className="field">
          <label>Senha</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} autoComplete="current-password" required/>
        </div>
        <button type="submit" disabled={enviando} className="btn btn-primary" style={{width: "100%", opacity: enviando ? 0.6 : 1}}>
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}

// ════════════════════════════════════════════
// REBANHO (lotes)
// ════════════════════════════════════════════
function RebanhoScreen({ openLote, openAdd }) {
  const [tipo, setTipo] = useState("");
  const [q, setQ] = useState("");
  const [encerrados, setEncerrados] = useState(false);

  const resumo = useApi("resumo", api.resumo);
  const filtros = { tipo, nome: q.trim(), situacao: encerrados ? "" : "ATIVO" };
  const lotes = useApi(JSON.stringify(filtros), () => api.lotes(filtros));

  const totalTipo = (t) => resumo.data?.find(r => r.tipo === t)?.total.total ?? 0;
  const totalGeral = TIPOS.reduce((s, t) => s + totalTipo(t.tipo), 0);

  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader
        title="Animais"
        subtitle={resumo.data ? `${totalGeral} animais no sítio` : " "}
        action={
          <button onClick={openAdd} aria-label="Novo lote" style={{
            width: 40, height: 40, borderRadius: 999,
            background: "var(--ink)", color: "var(--bg)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><Ico.plus s={20} c="var(--bg)"/></button>
        }
      />

      {/* Totais por espécie */}
      <div style={{padding: "4px 16px 14px", display: "flex", gap: 8}}>
        {TIPOS.map(s => (
          <button key={s.tipo} onClick={() => setTipo(tipo === s.tipo ? "" : s.tipo)} className="card" style={{
            flex: 1, padding: "12px 10px", textAlign: "left",
            background: tipo === s.tipo ? "var(--ink)" : "var(--surface)",
            borderColor: tipo === s.tipo ? "var(--ink)" : "var(--line)",
            color: tipo === s.tipo ? "var(--bg)" : "var(--ink)",
          }}>
            <div style={{fontSize: 22}}>{s.emoji}</div>
            <div className="serif" style={{fontSize: 22, marginTop: 2}}>{resumo.data ? totalTipo(s.tipo) : "–"}</div>
            <div style={{fontSize: 11, fontWeight: 600, opacity: tipo === s.tipo ? 0.7 : 0.6}}>{s.lbl}</div>
          </button>
        ))}
      </div>

      {/* Busca + filtro de encerrados */}
      <div style={{padding: "0 16px 10px", display: "flex", gap: 8}}>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 8,
          background: "var(--surface)", border: "1px solid var(--line)",
          borderRadius: 999, padding: "10px 14px",
        }}>
          <Ico.search s={16}/>
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Buscar lote pelo nome..."
            style={{flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 14, fontFamily: "inherit", color: "var(--ink)"}}
          />
        </div>
        <button onClick={() => setEncerrados(v => !v)} className="btn btn-soft" title="Mostrar lotes encerrados" style={{
          padding: "10px 14px",
          background: encerrados ? "var(--ink)" : undefined, color: encerrados ? "var(--bg)" : undefined,
        }}><Ico.filter s={16}/></button>
      </div>

      {/* Abas */}
      <div style={{padding: "0 16px 8px", display: "flex", gap: 6, overflowX: "auto"}} className="no-scroll">
        {[{tipo: "", lbl: "Todos"}, ...TIPOS].map(t => (
          <button key={t.tipo} onClick={() => setTipo(t.tipo)} className="chip" style={{
            background: tipo === t.tipo ? "var(--terra)" : "var(--surface)",
            color: tipo === t.tipo ? "#fff" : "var(--ink-2)",
            borderColor: tipo === t.tipo ? "var(--terra)" : "var(--line)",
            flexShrink: 0,
          }}>{t.lbl}</button>
        ))}
        {encerrados && <span className="chip solid" style={{flexShrink: 0}}>+ encerrados</span>}
      </div>

      {/* Lista de lotes */}
      <div style={{padding: "0 16px"}}>
        {lotes.erro ? <ErroCarga erro={lotes.erro} onRetry={lotes.recarregar}/> : (
          <div className="card" style={{padding: "4px 16px"}}>
            {lotes.carregando && !lotes.data ? <Carregando/> :
             lotes.data.itens.length === 0 ? (
              <Empty title="Nenhum lote encontrado" sub={q || tipo ? "Tente outro filtro." : "Toque em + para cadastrar o primeiro lote."}/>
            ) : lotes.data.itens.map(l => (
              <div key={l.id} className="list-row tap" onClick={() => openLote(l)} style={{padding: "12px 0", opacity: lotes.carregando ? 0.5 : 1}}>
                <SpeciesAvatar species={tipoInfo(l.tipo).especie} size={48}/>
                <div className="meta">
                  <div className="t1">{l.nome || l.codigo}</div>
                  <div className="t2">
                    {l.codigo} · {l.raca.nome} · {l.quantidades.total} {l.quantidades.total === 1 ? "animal" : "animais"}
                    {nascimentoLote(l.idade) && ` · ${nascimentoLote(l.idade).idade}`}
                  </div>
                </div>
                <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4}}>
                  {l.situacao === "ENCERRADO" && <span className="chip" style={{fontSize: 10, padding: "2px 8px", background: "var(--bg-deep)", borderColor: "transparent"}}>Encerrado</span>}
                  <Ico.chevron c="var(--ink-4)"/>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="spacer-24"/>
    </div>
  );
}

// ════════════════════════════════════════════
// DETALHE DO LOTE
// ════════════════════════════════════════════
function LoteDetailScreen({ codigo, back, showToast }) {
  const [tab, setTab] = useState("info");
  const [movSheet, setMovSheet] = useState(false);
  const lote = useApi(`lote:${codigo}`, () => api.lote(codigo));
  const movs = useApi(`movs:${codigo}`, () => api.movimentacoes(codigo));

  const aposMovimentacao = () => {
    setMovSheet(false);
    showToast("Movimentação registrada");
    lote.recarregar();
    movs.recarregar();
  };

  const l = lote.data;
  const info = l ? tipoInfo(l.tipo) : null;
  const nasc = l ? nascimentoLote(l.idade) : null;

  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader title="" onBack={back} action={l && l.situacao === "ATIVO" && (
        <button onClick={() => setMovSheet(true)} className="btn btn-soft" style={{padding: "8px 14px", fontSize: 13}}><Ico.plus s={14}/> Movimentar</button>
      )}/>

      <div style={{padding: "0 16px"}}>
        {lote.erro ? <ErroCarga erro={lote.erro} onRetry={lote.recarregar}/> : !l ? <Carregando/> : (
          <div>
            {/* Hero */}
            <div className="card" style={{padding: 20, textAlign: "center"}}>
              <div style={{display: "flex", justifyContent: "center"}}>
                <SpeciesAvatar species={info.especie} size={88}/>
              </div>
              <div className="serif" style={{fontSize: 32, marginTop: 12}}>{l.nome || l.codigo}</div>
              <div style={{fontSize: 13, color: "var(--ink-3)", marginTop: 4}}>{l.codigo} · {info.desc} · {l.raca.nome}</div>
              <div style={{marginTop: 10}}>
                <span className={`chip ${l.situacao === "ATIVO" ? "moss" : ""}`} style={{padding: "4px 12px"}}>
                  {l.situacao === "ATIVO" ? "Ativo" : "Encerrado"}
                </span>
              </div>
            </div>

            <div style={{padding: "14px 0 0", display: "flex", gap: 10}}>
              <StatTile label="Quantidade" value={l.quantidades.total} unit={l.quantidades.total === 1 ? "animal" : "animais"} tone="ink"/>
              <StatTile label="Composição" value={sexosTexto(l.quantidades)} tone="terra"/>
            </div>
          </div>
        )}
      </div>

      {l && (
        <>
          <div style={{padding: "18px 16px 10px", display: "flex", justifyContent: "center"}}>
            <div className="seg">
              {[{k: "info", l: "Ficha"}, {k: "hist", l: "Histórico"}].map(s => (
                <button key={s.k} onClick={() => setTab(s.k)} className={tab === s.k ? "on" : ""}>{s.l}</button>
              ))}
            </div>
          </div>

          <div style={{padding: "0 16px"}}>
            {tab === "info" && (
              <div className="card" style={{padding: "4px 16px"}}>
                {[
                  ["Código", l.codigo],
                  ["Espécie", info.desc],
                  ["Raça", l.raca.nome],
                  ["Origem", {COMPRA: "Compra", OUTRO: "Outro", NASCIMENTO: "Nascimentos"}[l.origem] || l.origem],
                  ["Nascimento", nasc ? nasc.data : "Não informado"],
                  ["Idade", nasc ? nasc.idade : "—"],
                  ["Cadastrado por", l.criadoPor?.nome || "—"],
                  ["Cadastrado em", dataBr(l.criadoEm)],
                ].map(([k, v], i, arr) => (
                  <div key={k} style={{
                    display: "flex", justifyContent: "space-between", padding: "12px 0", gap: 12,
                    borderBottom: i < arr.length - 1 ? "1px solid var(--line-soft)" : "none",
                    fontSize: 14,
                  }}>
                    <span style={{color: "var(--ink-3)", fontWeight: 600}}>{k}</span>
                    <span style={{color: "var(--ink)", fontWeight: 600, textAlign: "right"}}>{v}</span>
                  </div>
                ))}
                {l.observacoes && (
                  <div style={{padding: "14px 0", borderTop: "1px solid var(--line-soft)"}}>
                    <div style={{fontSize: 11, color: "var(--ink-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6}}>Observações</div>
                    <div style={{fontSize: 14, color: "var(--ink-2)", lineHeight: 1.45}}>{l.observacoes}</div>
                  </div>
                )}
              </div>
            )}

            {tab === "hist" && (
              movs.erro ? <ErroCarga erro={movs.erro} onRetry={movs.recarregar}/> : (
                <div className="card" style={{padding: "4px 16px"}}>
                  {movs.carregando && !movs.data ? <Carregando/> :
                   movs.data.length === 0 ? <Empty title="Sem movimentações" sub="Entradas e saídas aparecerão aqui."/> :
                   movs.data.map((m, i, arr) => <MovimentacaoRow key={m.id} m={m} ultimo={i === arr.length - 1}/>)}
                </div>
              )
            )}
          </div>

          <Sheet open={movSheet} onClose={() => setMovSheet(false)} title="Registrar movimentação">
            <MovimentacaoForm lote={l} onSalvo={aposMovimentacao}/>
          </Sheet>
        </>
      )}
      <div className="spacer-24"/>
    </div>
  );
}

function MovimentacaoRow({ m, ultimo }) {
  const entrada = m.tipo === "ENTRADA", saida = m.tipo === "SAIDA";
  const titulo = m.tipo === "RECLASSIFICACAO" ? "Reclassificação de sexo" : `${entrada ? "Entrada" : "Saída"} · ${MOTIVOS[m.motivo] || m.motivo}`;
  const detalhe = m.tipo === "RECLASSIFICACAO"
    ? [["machos", "♂"], ["femeas", "♀"], ["naoInformado", "s/ sexo"]]
        .filter(([k]) => m.quantidades[k]).map(([k, s]) => `${m.quantidades[k] > 0 ? "+" : ""}${m.quantidades[k]} ${s}`).join(" · ")
    : sexosTexto(m.quantidades);
  return (
    <div style={{display: "flex", gap: 12, padding: "12px 0", borderBottom: ultimo ? "none" : "1px solid var(--line-soft)"}}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: entrada ? "var(--moss-soft)" : saida ? "var(--danger-soft)" : "var(--sky-soft)",
        color: entrada ? "var(--moss-deep)" : saida ? "var(--danger)" : "#335C6E",
        display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800,
      }}>{entrada ? "+" : saida ? "−" : "⇄"}</div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{display: "flex", justifyContent: "space-between", gap: 8}}>
          <span style={{fontWeight: 700, fontSize: 14}}>{titulo}</span>
          <span style={{fontSize: 12, color: "var(--ink-3)", flexShrink: 0}}>{dataBr(m.dataOcorrencia)}</span>
        </div>
        <div style={{fontSize: 13, color: "var(--ink-2)", marginTop: 2}}>
          {m.tipo !== "RECLASSIFICACAO" && <b>{entrada ? "+" : "−"}{m.quantidades.total} </b>}{detalhe}
        </div>
        {m.observacoes && <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 4}}>{m.observacoes}</div>}
        <div style={{fontSize: 11, color: "var(--ink-3)", marginTop: 4}}>por {m.registradoPor?.nome || "—"}</div>
      </div>
    </div>
  );
}

const MOTIVOS_POR_TIPO = {
  ENTRADA: ["COMPRA", "OUTRO"],
  SAIDA: ["MORTE", "VENDA", "ABATE", "OUTRO"],
};

function MovimentacaoForm({ lote, onSalvo }) {
  const [tipo, setTipo] = useState("SAIDA");
  const [motivo, setMotivo] = useState("VENDA");
  const [data, setData] = useState(hojeIso());
  const [qtd, setQtd] = useState(QTD_ZERO);
  const [obs, setObs] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const trocarTipo = (t) => { setTipo(t); setMotivo(MOTIVOS_POR_TIPO[t][0]); };
  const total = somaQtd(qtd);

  const salvar = async () => {
    setEnviando(true);
    setErro(null);
    try {
      await api.registrarMovimentacao(lote.codigo, {
        tipo, motivo, dataOcorrencia: data, quantidades: qtd,
        observacoes: obs.trim() || undefined,
      });
      onSalvo();
    } catch (err) {
      setErro(err);
      setEnviando(false);
    }
  };

  return (
    <div>
      <div style={{display: "flex", justifyContent: "center", marginBottom: 16}}>
        <div className="seg">
          <button onClick={() => trocarTipo("SAIDA")} className={tipo === "SAIDA" ? "on" : ""}>Saída</button>
          <button onClick={() => trocarTipo("ENTRADA")} className={tipo === "ENTRADA" ? "on" : ""}>Entrada</button>
        </div>
      </div>
      <div className="field">
        <label>Motivo</label>
        <Chips opcoes={MOTIVOS_POR_TIPO[tipo].map(k => [k, MOTIVOS[k]])} valor={motivo} onChange={setMotivo}/>
      </div>
      <div className="field">
        <label>Data</label>
        <input type="date" value={data} max={hojeIso()} onChange={e => setData(e.target.value)}/>
      </div>
      <div className="field">
        <label>Quantidade</label>
        <QuantidadesForm q={qtd} setQ={setQtd} tipo={lote.tipo}/>
        {tipo === "SAIDA" && (
          <div style={{fontSize: 12, color: "var(--ink-3)"}}>No lote hoje: {sexosTexto(lote.quantidades)}</div>
        )}
      </div>
      <div className="field">
        <label>Observações (opcional)</label>
        <textarea rows={2} value={obs} onChange={e => setObs(e.target.value)}/>
      </div>
      <ErroForm erro={erro}/>
      <button onClick={salvar} disabled={!total || enviando} className="btn btn-primary" style={{width: "100%", opacity: !total || enviando ? 0.4 : 1}}>
        <Ico.check s={16} c="var(--bg)"/> {enviando ? "Salvando…" : `Registrar ${tipo === "SAIDA" ? "saída" : "entrada"} de ${total}`}
      </button>
    </div>
  );
}

// ════════════════════════════════════════════
// NOVO LOTE (formulário)
// ════════════════════════════════════════════
function NovoLoteScreen({ back, onCriado }) {
  const [step, setStep] = useState(1);
  const [d, setD] = useState({
    tipo: "", racaId: "", nome: "", origem: "COMPRA",
    dataOcorrencia: hojeIso(), dataNascimento: "", observacoes: "",
  });
  const [qtd, setQtd] = useState(QTD_ZERO);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const set = (k, v) => setD(x => ({...x, [k]: v}));

  const racas = useApi(`racas:${d.tipo}`, () => d.tipo ? api.racas(d.tipo) : Promise.resolve([]));

  const nascimentoInvalido = d.dataNascimento && d.dataOcorrencia && d.dataNascimento > d.dataOcorrencia;
  const passo2Ok = d.racaId && d.dataOcorrencia && !nascimentoInvalido;
  const escolherTipo = (t) => setD(x => ({...x, tipo: t, racaId: ""}));
  const total = somaQtd(qtd);

  const submit = async () => {
    setEnviando(true);
    setErro(null);
    // A API guarda idade como estimativa; 0 meses na data de nascimento = a própria data de nascimento
    const idade = d.dataNascimento ? { meses: 0, dataEstimativa: d.dataNascimento } : undefined;
    try {
      const lote = await api.criarLote({
        tipo: d.tipo, racaId: d.racaId, origem: d.origem,
        dataOcorrencia: d.dataOcorrencia, quantidades: qtd,
        idadeEstimada: idade,
        nome: d.nome.trim() || undefined,
        observacoes: d.observacoes.trim() || undefined,
      });
      onCriado(lote);
    } catch (err) {
      setErro(err);
      setEnviando(false);
    }
  };

  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader title="Novo lote" subtitle={`Passo ${step} de 3`} onBack={back}/>

      <div style={{padding: "0 16px 16px"}}>
        <div className="bar" style={{height: 4}}>
          <i style={{width: `${(step/3)*100}%`, background: "var(--terra)"}}/>
        </div>
      </div>

      <div style={{padding: "0 16px"}}>
        {step === 1 && (
          <div>
            <div className="serif" style={{fontSize: 24, marginBottom: 4}}>Qual a espécie?</div>
            <div style={{fontSize: 13, color: "var(--ink-3)", marginBottom: 18}}>Os animais são cadastrados em lotes.</div>
            <div style={{display: "flex", flexDirection: "column", gap: 10}}>
              {TIPOS.map(s => (
                <button key={s.tipo} onClick={() => escolherTipo(s.tipo)} className="card" style={{
                  display: "flex", alignItems: "center", gap: 16, padding: 16, textAlign: "left",
                  background: d.tipo === s.tipo ? "var(--terra-soft)" : "var(--surface)",
                  borderColor: d.tipo === s.tipo ? "var(--terra)" : "var(--line)",
                  borderWidth: d.tipo === s.tipo ? 2 : 1,
                }}>
                  <span style={{fontSize: 34}}>{s.emoji}</span>
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 700, fontSize: 16}}>{s.desc}</div>
                    <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 2}}>{s.sub}</div>
                  </div>
                  {d.tipo === s.tipo && <Ico.check c="var(--terra)" s={20}/>}
                </button>
              ))}
            </div>
            <div className="spacer-24"/>
            <button onClick={() => setStep(2)} disabled={!d.tipo} className="btn btn-primary" style={{width: "100%", opacity: d.tipo ? 1 : 0.4}}>
              Próximo →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="serif" style={{fontSize: 24, marginBottom: 4}}>Dados do lote</div>
            <div style={{fontSize: 13, color: "var(--ink-3)", marginBottom: 18}}>Um nome ajuda a encontrar o lote depois.</div>
            <div className="field">
              <label>Nome (opcional)</label>
              <input value={d.nome} onChange={e => set("nome", e.target.value)} maxLength={80} placeholder="Ex.: Vacas leiteiras, Lote A..."/>
            </div>
            <div className="field">
              <label>Raça</label>
              {racas.erro ? <ErroCarga erro={racas.erro} onRetry={racas.recarregar}/> : (
                <select value={d.racaId} onChange={e => set("racaId", e.target.value)} disabled={racas.carregando}>
                  <option value="">{racas.carregando ? "Carregando…" : "Selecione..."}</option>
                  {(racas.data || []).map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
                </select>
              )}
            </div>
            <div className="field">
              <label>Origem</label>
              <Chips opcoes={[["COMPRA", "Compra"], ["OUTRO", "Outro"]]} valor={d.origem} onChange={v => set("origem", v)}/>
            </div>
            <div className="field">
              <label>Data de entrada</label>
              <input type="date" value={d.dataOcorrencia} max={hojeIso()} onChange={e => set("dataOcorrencia", e.target.value)}/>
            </div>
            <div className="field">
              <label>Data de nascimento (opcional)</label>
              <input type="date" value={d.dataNascimento} max={d.dataOcorrencia || hojeIso()} onChange={e => set("dataNascimento", e.target.value)}/>
              {d.dataNascimento && (
                <div style={{fontSize: 12, marginTop: 6, fontWeight: 600, color: nascimentoInvalido ? "var(--danger)" : "var(--ink-3)"}}>
                  {nascimentoInvalido ? "A data de nascimento não pode ser depois da data de entrada." : `Idade hoje: ${idadeDesde(d.dataNascimento)}`}
                </div>
              )}
            </div>
            <div style={{display: "flex", gap: 10}}>
              <button onClick={() => setStep(1)} className="btn btn-ghost" style={{flex: 1}}>← Voltar</button>
              <button onClick={() => setStep(3)} disabled={!passo2Ok} className="btn btn-primary" style={{flex: 2, opacity: passo2Ok ? 1 : 0.4}}>Próximo →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="serif" style={{fontSize: 24, marginBottom: 4}}>Quantos animais?</div>
            <div style={{fontSize: 13, color: "var(--ink-3)", marginBottom: 18}}>Informe por sexo. Dá para reclassificar depois.</div>
            <div className="field">
              <QuantidadesForm q={qtd} setQ={setQtd} tipo={d.tipo}/>
              <div style={{
                padding: "12px 14px", marginTop: 8,
                background: "var(--moss-soft)", borderRadius: 16,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{fontWeight: 700, color: "var(--moss-deep)"}}>Total</span>
                <span className="serif" style={{fontSize: 28, color: "var(--moss-deep)"}}>{total}</span>
              </div>
            </div>
            <div className="field">
              <label>Observações (opcional)</label>
              <textarea rows={3} value={d.observacoes} onChange={e => set("observacoes", e.target.value)} placeholder="Notas sobre o lote..."/>
            </div>
            <ErroForm erro={erro}/>
            <div style={{display: "flex", gap: 10}}>
              <button onClick={() => setStep(2)} className="btn btn-ghost" style={{flex: 1}}>← Voltar</button>
              <button onClick={submit} disabled={!total || enviando} className="btn btn-terra" style={{flex: 2, opacity: !total || enviando ? 0.4 : 1}}>
                <Ico.check s={16} c="#fff"/> {enviando ? "Salvando…" : "Cadastrar"}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="spacer-24"/>
    </div>
  );
}

export { LoginScreen, RebanhoScreen, LoteDetailScreen, NovoLoteScreen };
