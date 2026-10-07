import { useState } from 'react';
import { FARM, CATTLE, SHEEP, TASKS_TODAY, EGG_DAYS, MILK_DAYS, VACINAS, PASTAGENS, ESTOQUE, FIN_MES, FIN_RECENTES, FIN_CATS, REPRODUCAO } from './data.js';
import { Ico, SpeciesAvatar, PageHeader, StatTile, Sheet, BarChart, Donut, Empty } from './ui.jsx';
// VidaNoMato — screens: Produção, Saúde, Mais menu, Pastagens, Estoque, Financeiro, Calendário, Relatórios


// ════════════════════════════════════════════
// PRODUÇÃO
// ════════════════════════════════════════════
function ProducaoScreen({ showToast }) {
  const [tab, setTab] = useState("ovos");

  const totalOvos = EGG_DAYS.reduce((s,d)=>s+d.v,0);
  const totalLeite = MILK_DAYS.reduce((s,d)=>s+d.v,0);

  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader title="Produção" subtitle="Acompanhe ovos, leite e carne"/>

      <div style={{padding: "0 16px 14px"}}>
        <div className="seg" style={{display: "flex", width: "100%"}}>
          {[
            {k:"ovos", l:"Ovos"},
            {k:"leite", l:"Leite"},
            {k:"carne", l:"Carne"},
          ].map(s => (
            <button key={s.k} onClick={() => setTab(s.k)} className={tab === s.k ? "on" : ""} style={{flex: 1}}>{s.l}</button>
          ))}
        </div>
      </div>

      {tab === "ovos" && (
        <div style={{padding: "0 16px", display: "flex", flexDirection: "column", gap: 12}}>
          <div className="card" style={{padding: 18}}>
            <div className="stat-label">OVOS NA SEMANA</div>
            <div style={{display: "flex", alignItems: "baseline", gap: 8, marginTop: 6}}>
              <span className="serif" style={{fontSize: 52, lineHeight: 1, color: "var(--terra)"}}>{totalOvos}</span>
              <span style={{fontSize: 14, color: "var(--ink-3)", fontWeight: 600}}>ovos · 7 dias</span>
            </div>
            <div style={{display: "flex", gap: 6, marginTop: 6}}>
              <span className="chip moss" style={{padding: "3px 10px", fontSize: 11}}><Ico.trend s={11}/> +3% vs semana anterior</span>
              <span className="chip" style={{padding: "3px 10px", fontSize: 11}}>~149 ovos/dia</span>
            </div>
            <div style={{marginTop: 16}}>
              <BarChart data={EGG_DAYS} color="var(--terra)" height={120}/>
            </div>
          </div>

          <div className="card" style={{padding: 18}}>
            <div style={{fontWeight: 700, marginBottom: 12}}>Por lote</div>
            {[
              {n: "Lote A — Caipiras", v: 78, max: 85, cor: "var(--terra)"},
              {n: "Lote B — Vermelhas", v: 67, max: 72, cor: "var(--moss)"},
            ].map(l => (
              <div key={l.n} style={{marginBottom: 12}}>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: 6}}>
                  <span style={{fontSize: 13, fontWeight: 600}}>{l.n}</span>
                  <span style={{fontSize: 13, color: "var(--ink-3)"}}>{l.v}/{l.max} ovos · {Math.round(l.v/l.max*100)}%</span>
                </div>
                <div className="bar"><i style={{width: `${l.v/l.max*100}%`, background: l.cor}}/></div>
              </div>
            ))}
          </div>

          <button onClick={() => showToast("Abrir registro de ovos")} className="btn btn-terra" style={{width: "100%"}}>
            <Ico.plus s={16} c="#fff"/> Registrar coleta de ovos
          </button>
        </div>
      )}

      {tab === "leite" && (
        <div style={{padding: "0 16px", display: "flex", flexDirection: "column", gap: 12}}>
          <div className="card" style={{padding: 18}}>
            <div className="stat-label">LEITE NA SEMANA</div>
            <div style={{display: "flex", alignItems: "baseline", gap: 8, marginTop: 6}}>
              <span className="serif" style={{fontSize: 52, lineHeight: 1, color: "var(--moss)"}}>{totalLeite}</span>
              <span style={{fontSize: 14, color: "var(--ink-3)", fontWeight: 600}}>litros · 7 dias</span>
            </div>
            <div style={{marginTop: 16}}>
              <BarChart data={MILK_DAYS} color="var(--moss)" height={120} valSuffix="L"/>
            </div>
          </div>

          <div className="card" style={{padding: 18}}>
            <div style={{fontWeight: 700, marginBottom: 12}}>Por vaca (hoje)</div>
            {[
              {n: "Mimosa", v: 12, m: 13, brincos: "0142"},
              {n: "Estrela", v: 14, m: 14, brincos: "0156"},
              {n: "Princesa", v: 12, m: 12, brincos: "0098"},
            ].map(c => (
              <div key={c.n} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0", borderBottom: "1px solid var(--line-soft)",
              }}>
                <SpeciesAvatar species="Bovino" size={40}/>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 700}}>{c.n}</div>
                  <div style={{fontSize: 12, color: "var(--ink-3)"}}>brinco #{c.brincos}</div>
                </div>
                <div style={{textAlign: "right"}}>
                  <div className="serif" style={{fontSize: 22, color: "var(--moss-deep)"}}>{c.v}L</div>
                  <div style={{fontSize: 10, color: "var(--ink-3)"}}>média {c.m}L</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "carne" && (
        <div style={{padding: "0 16px", display: "flex", flexDirection: "column", gap: 12}}>
          <div className="card" style={{padding: 18}}>
            <div className="stat-label">GANHO DE PESO MÉDIO</div>
            <div style={{display: "flex", alignItems: "baseline", gap: 8, marginTop: 6}}>
              <span className="serif" style={{fontSize: 52, lineHeight: 1, color: "var(--terra)"}}>0,82</span>
              <span style={{fontSize: 14, color: "var(--ink-3)", fontWeight: 600}}>kg/dia · gado em engorda</span>
            </div>
            <div style={{display: "flex", gap: 6, marginTop: 8}}>
              <span className="chip moss" style={{padding: "3px 10px", fontSize: 11}}><Ico.trend s={11}/> bom desempenho</span>
            </div>
          </div>
          <div className="card" style={{padding: 18}}>
            <div style={{fontWeight: 700, marginBottom: 12}}>Próximos abates / vendas</div>
            {[
              {n: "Lote D — Frangos", q: "60 aves", quando: "21 dias", peso: "~2,8 kg/ave"},
              {n: "Cordeiros 2026A", q: "8 cordeiros", quando: "30 dias", peso: "~32 kg/cab"},
              {n: "Caramelo (boi)", q: "1 boi", quando: "~60 dias", peso: "~480 kg"},
            ].map(l => (
              <div key={l.n} style={{padding: "12px 0", borderBottom: "1px solid var(--line-soft)"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                  <span style={{fontWeight: 700, fontSize: 14}}>{l.n}</span>
                  <span className="chip terra" style={{padding: "2px 10px", fontSize: 11}}>em {l.quando}</span>
                </div>
                <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 4}}>{l.q} · {l.peso}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="spacer-24"/>
    </div>
  );
}

// ════════════════════════════════════════════
// SAÚDE
// ════════════════════════════════════════════
function SaudeScreen({ back, showToast }) {
  const [tab, setTab] = useState("pendente"); // pendente | aplicada
  const [addOpen, setAddOpen] = useState(false);

  const filt = VACINAS.filter(v => tab === "pendente" ? v.status !== "aplicada" : v.status === "aplicada");

  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader
        title="Saúde"
        subtitle={`${VACINAS.filter(v=>v.status!=="aplicada").length} vacinas agendadas`}
        onBack={back}
        action={
          <button onClick={() => setAddOpen(true)} style={{
            width: 40, height: 40, borderRadius: 999,
            background: "var(--ink)", color: "var(--bg)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><Ico.plus s={20} c="var(--bg)"/></button>
        }
      />

      {/* Stats row */}
      <div style={{padding: "0 16px 14px", display: "flex", gap: 10}}>
        <StatTile label="Hoje" value="1" sub="urgente" tone="terra" icon={<Ico.alert s={12} c="var(--terra)"/>}/>
        <StatTile label="Esta semana" value="3" sub="vacinas" tone="ink" icon={<Ico.calendar s={12}/>}/>
        <StatTile label="Em dia" value="98%" sub="do rebanho" tone="moss" icon={<Ico.check s={12} c="var(--moss)"/>}/>
      </div>

      <div style={{padding: "0 16px 10px", display: "flex", justifyContent: "center"}}>
        <div className="seg">
          <button onClick={() => setTab("pendente")} className={tab === "pendente" ? "on" : ""}>A aplicar</button>
          <button onClick={() => setTab("aplicada")} className={tab === "aplicada" ? "on" : ""}>Histórico</button>
        </div>
      </div>

      <div style={{padding: "0 16px"}}>
        <div className="card" style={{padding: "4px 16px"}}>
          {filt.length === 0 ? (
            <Empty title="Tudo em dia" sub="Não há vacinas pendentes."/>
          ) : filt.map((v) => {
            return (
              <div key={v.id} className="list-row" style={{padding: "14px 0"}}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: v.urgente ? "var(--danger-soft)" : "var(--terra-soft)",
                  color: v.urgente ? "var(--danger)" : "var(--terra-deep)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}><Ico.vaccine s={20}/></div>
                <div className="meta">
                  <div className="t1">{v.vacina}</div>
                  <div className="t2">{v.animal} · {v.especie}</div>
                </div>
                <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4}}>
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    color: v.urgente ? "var(--danger)" : "var(--ink-2)",
                  }}>{v.data}</span>
                  {tab === "pendente" && (
                    <button onClick={() => showToast(`${v.vacina} aplicada em ${v.animal}`)} className="chip moss" style={{
                      padding: "4px 10px", fontSize: 11, border: "none", cursor: "pointer"
                    }}>Aplicar</button>
                  )}
                  {tab === "aplicada" && (
                    <span className="chip moss" style={{padding: "2px 8px", fontSize: 10}}><Ico.check s={10}/> Aplicada</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Sheet open={addOpen} onClose={() => setAddOpen(false)} title="Nova aplicação">
        <div className="field">
          <label>Animal / lote</label>
          <select><option>Selecione...</option>{CATTLE.concat(SHEEP).map(a => <option key={a.id}>{a.nome}</option>)}</select>
        </div>
        <div className="field">
          <label>Tipo</label>
          <div style={{display: "flex", gap: 6, flexWrap: "wrap"}}>
            {["Vacina", "Vermífugo", "Antibiótico", "Vitamina"].map(t => (
              <button key={t} className="chip">{t}</button>
            ))}
          </div>
        </div>
        <div className="field"><label>Produto / vacina</label><input placeholder="Ex.: Aftosa"/></div>
        <div style={{display: "flex", gap: 8}}>
          <div className="field" style={{flex: 1}}><label>Data</label><input placeholder="25/05/2026"/></div>
          <div className="field" style={{flex: 1}}><label>Dose</label><input placeholder="5 mL"/></div>
        </div>
        <button onClick={() => { setAddOpen(false); showToast("Aplicação registrada"); }} className="btn btn-primary" style={{width: "100%"}}>
          <Ico.check s={16} c="var(--bg)"/> Salvar
        </button>
      </Sheet>
      <div className="spacer-24"/>
    </div>
  );
}

// ════════════════════════════════════════════
// MAIS (menu)
// ════════════════════════════════════════════
function MaisScreen({ go, onSair }) {
  const items = [
    {k: "saude", l: "Saúde & vacinação", d: "1 urgente · 3 esta semana", ico: <Ico.heart/>, tone: "#B84A2E"},
    {k: "calendar", l: "Calendário de tarefas", d: "5 tarefas para hoje", ico: <Ico.calendar/>, tone: "#C2693A"},
    {k: "pastagens", l: "Pastagens & piquetes", d: "5 piquetes · 1 alerta", ico: <Ico.field/>, tone: "#5A7A3A"},
    {k: "estoque", l: "Estoque & insumos", d: "1 item em falta", ico: <Ico.box/>, tone: "#82591A"},
    {k: "financeiro", l: "Financeiro", d: `Saldo do mês R$ ${FIN_MES.saldo}`, ico: <Ico.money/>, tone: "#9C4F26"},
    {k: "reproducao", l: "Reprodução", d: "3 fêmeas em gestação", ico: <Ico.babies/>, tone: "#335C6E"},
    {k: "relatorios", l: "Relatórios", d: "Exportar dados", ico: <Ico.report/>, tone: "#5C4A33"},
  ];

  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader title="Mais" subtitle={FARM.name}/>

      <div style={{padding: "0 16px"}}>
        <div className="card" style={{padding: "4px 16px"}}>
          {items.map((it) => (
            <div key={it.k} className="list-row tap" onClick={() => go(it.k)} style={{padding: "16px 0"}}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${it.tone}1A`, color: it.tone,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>{it.ico}</div>
              <div className="meta">
                <div className="t1">{it.l}</div>
                <div className="t2">{it.d}</div>
              </div>
              <Ico.chevron c="var(--ink-4)"/>
            </div>
          ))}
        </div>
      </div>

      <div className="section-head">
        <span className="ttl">A propriedade</span>
      </div>
      <div style={{padding: "0 16px"}}>
        <div className="card">
          <div style={{display: "flex", alignItems: "center", gap: 14}}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg, var(--terra-soft), var(--yolk-soft))",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
            }}>🌾</div>
            <div style={{flex: 1}}>
              <div className="serif" style={{fontSize: 22}}>{FARM.name}</div>
              <div style={{fontSize: 13, color: "var(--ink-3)"}}>{FARM.city} · {FARM.owner}</div>
            </div>
          </div>
          <div style={{display: "flex", gap: 8, marginTop: 14}}>
            <button className="btn btn-soft" style={{flex: 1, fontSize: 13}}>Configurar</button>
            <button className="btn btn-soft" style={{flex: 1, fontSize: 13}}>Backup</button>
            <button onClick={onSair} className="btn btn-soft" style={{flex: 1, fontSize: 13}}>Sair</button>
          </div>
        </div>
      </div>
      <div className="spacer-24"/>
    </div>
  );
}

// ════════════════════════════════════════════
// PASTAGENS
// ════════════════════════════════════════════
function PastagensScreen({ back, showToast }) {
  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader title="Pastagens" subtitle={`${PASTAGENS.length} piquetes · 11,4 ha total`} onBack={back}/>

      {/* Mini-map illustration */}
      <div style={{padding: "0 16px 14px"}}>
        <div className="card" style={{padding: 0, overflow: "hidden", height: 180, position: "relative", background: "linear-gradient(135deg, #DDE6C7, #C9D6A8)"}}>
          <svg viewBox="0 0 320 180" width="100%" height="180" preserveAspectRatio="xMidYMid slice">
            {/* fence lines */}
            <path d="M 30 30 L 290 30 L 290 150 L 30 150 Z" fill="none" stroke="#3F5825" strokeWidth="1.5" strokeDasharray="4 3"/>
            <path d="M 30 70 L 290 70 M 30 110 L 290 110 M 160 30 L 160 150" stroke="#3F5825" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
            {/* labels */}
            <text x="95" y="55" fontSize="11" fontFamily="Manrope" fontWeight="700" fill="#3F5825">Pq 1</text>
            <text x="225" y="55" fontSize="11" fontFamily="Manrope" fontWeight="700" fill="#3F5825">Pq 2</text>
            <text x="95" y="95" fontSize="11" fontFamily="Manrope" fontWeight="700" fill="#3F5825">Pq 3</text>
            <text x="225" y="95" fontSize="11" fontFamily="Manrope" fontWeight="700" fill="#B84A2E">Pq 4</text>
            <text x="95" y="135" fontSize="11" fontFamily="Manrope" fontWeight="700" fill="#3F5825">Pq 5</text>
            {/* cows on Pq 2 */}
            <text x="248" y="46" fontSize="16">🐄</text>
            <text x="260" y="60" fontSize="16">🐄</text>
            <text x="240" y="60" fontSize="16">🐄</text>
            {/* alert on Pq4 */}
            <circle cx="270" cy="85" r="6" fill="#B84A2E"/>
            <text x="270" y="89" fontSize="10" fill="#fff" textAnchor="middle" fontWeight="700">!</text>
          </svg>
        </div>
      </div>

      <div style={{padding: "0 16px", display: "flex", flexDirection: "column", gap: 10}}>
        {PASTAGENS.map(p => {
          const cor = p.status === "Em uso" ? "#5A7A3A" :
                      p.status === "Pronto" ? "#C2693A" :
                      p.status === "Superpastejado" ? "#B84A2E" : "#8B7757";
          return (
            <div key={p.id} className="card" style={{padding: 16}}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10}}>
                <div>
                  <div style={{display: "flex", alignItems: "center", gap: 8}}>
                    <div className="serif" style={{fontSize: 22}}>{p.nome}</div>
                    {p.alerta && <span className="chip danger" style={{padding: "2px 8px", fontSize: 10}}>Alerta</span>}
                  </div>
                  <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 2}}>{p.area} · {p.capim}</div>
                </div>
                <span className="chip" style={{
                  background: `${cor}1A`, color: cor, borderColor: "transparent",
                  fontSize: 11, padding: "4px 10px",
                }}>{p.status}</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "var(--ink-3)"}}>
                <span>Ocupação · {p.ocupacao}/{p.cap} cab</span>
                <span>{p.dias}d {p.ocupacao > 0 ? "em uso" : "descanso"}</span>
              </div>
              <div className="bar"><i style={{width: `${(p.ocupacao/p.cap)*100}%`, background: cor}}/></div>
              {p.status === "Pronto" && (
                <button onClick={() => showToast(`Gado movido para ${p.nome}`)} className="btn btn-soft" style={{width: "100%", marginTop: 12, fontSize: 13, padding: "10px 0"}}>
                  Mover gado para cá →
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="spacer-24"/>
    </div>
  );
}

// ════════════════════════════════════════════
// ESTOQUE
// ════════════════════════════════════════════
function EstoqueScreen({ back, showToast }) {
  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader title="Estoque" subtitle="Ração, insumos e medicamentos" onBack={back}
        action={
          <button onClick={() => showToast("Item adicionado")} style={{
            width: 40, height: 40, borderRadius: 999,
            background: "var(--ink)", color: "var(--bg)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><Ico.plus s={20} c="var(--bg)"/></button>
        }
      />

      {/* Alerts banner if low stock */}
      <div style={{padding: "0 16px 14px"}}>
        <div className="card" style={{padding: 14, background: "var(--danger-soft)", borderColor: "transparent", display: "flex", gap: 12, alignItems: "center"}}>
          <Ico.alert s={20} c="var(--danger)"/>
          <div style={{flex: 1}}>
            <div style={{fontWeight: 700, fontSize: 14, color: "var(--danger)"}}>1 item em falta</div>
            <div style={{fontSize: 12, color: "var(--danger)"}}>Ração inicial em 12% — pedir reposição</div>
          </div>
          <button className="btn" style={{background: "var(--danger)", color: "#fff", padding: "8px 14px", fontSize: 12}}>Pedir</button>
        </div>
      </div>

      <div style={{padding: "0 16px", display: "flex", flexDirection: "column", gap: 8}}>
        {ESTOQUE.map(e => (
          <div key={e.id} className="card" style={{padding: 14}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8}}>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontWeight: 700, fontSize: 14.5}}>{e.nome}</div>
                <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 2}}>
                  Mín: {e.min} {e.unit}
                </div>
              </div>
              <div style={{textAlign: "right"}}>
                <div className="serif" style={{fontSize: 24, color: e.alerta ? "var(--danger)" : "var(--ink)"}}>{e.qtd}</div>
                <div style={{fontSize: 11, color: "var(--ink-3)"}}>{e.unit}</div>
              </div>
            </div>
            <div className="bar">
              <i style={{
                width: `${e.pct}%`,
                background: e.alerta ? "var(--danger)" : e.pct < 40 ? "var(--yolk)" : "var(--moss)"
              }}/>
            </div>
          </div>
        ))}
      </div>
      <div className="spacer-24"/>
    </div>
  );
}

// ════════════════════════════════════════════
// FINANCEIRO
// ════════════════════════════════════════════
function FinanceiroScreen({ back, showToast }) {
  const [addOpen, setAddOpen] = useState(false);
  const [tipo, setTipo] = useState("despesa");
  const [valor, setValor] = useState("");

  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader title="Financeiro" subtitle="Maio 2026" onBack={back}/>

      {/* Hero balance */}
      <div style={{padding: "0 16px"}}>
        <div className="hero">
          <div style={{position: "relative", zIndex: 1}}>
            <div style={{fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em"}}>
              Saldo do mês
            </div>
            <div className="serif" style={{fontSize: 48, lineHeight: 1.1, marginTop: 4, color: "var(--yolk)"}}>
              R$ {FIN_MES.saldo.toLocaleString('pt-BR')}
            </div>
            <div style={{display: "flex", gap: 18, marginTop: 14}}>
              <div>
                <div style={{fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 700, letterSpacing: "0.06em"}}>RECEITAS</div>
                <div style={{fontSize: 18, fontWeight: 700, marginTop: 2}}>R$ {FIN_MES.receita.toLocaleString('pt-BR')}</div>
              </div>
              <div style={{width: 1, background: "rgba(255,255,255,0.15)"}}/>
              <div>
                <div style={{fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 700, letterSpacing: "0.06em"}}>DESPESAS</div>
                <div style={{fontSize: 18, fontWeight: 700, marginTop: 2}}>R$ {FIN_MES.despesa.toLocaleString('pt-BR')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick add buttons */}
      <div style={{padding: "14px 16px 0", display: "flex", gap: 10}}>
        <button onClick={() => { setTipo("receita"); setAddOpen(true); }} className="btn btn-terra" style={{flex: 1, padding: "12px 0", fontSize: 14}}>
          <Ico.plus s={14} c="#fff"/> Receita
        </button>
        <button onClick={() => { setTipo("despesa"); setAddOpen(true); }} className="btn btn-soft" style={{flex: 1, padding: "12px 0", fontSize: 14}}>
          <Ico.plus s={14}/> Despesa
        </button>
      </div>

      {/* Donut categorias */}
      <div className="section-head">
        <span className="ttl">Despesas por categoria</span>
      </div>
      <div style={{padding: "0 16px"}}>
        <div className="card" style={{padding: 18, display: "flex", gap: 18, alignItems: "center"}}>
          <Donut data={FIN_CATS} size={130}/>
          <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 8}}>
            {FIN_CATS.map(c => (
              <div key={c.nome} style={{display: "flex", alignItems: "center", gap: 8, fontSize: 12}}>
                <span style={{width: 10, height: 10, borderRadius: 2, background: c.cor, flexShrink: 0}}/>
                <span style={{flex: 1, color: "var(--ink-2)"}}>{c.nome}</span>
                <span style={{fontWeight: 700, color: "var(--ink)"}}>R$ {c.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-head">
        <span className="ttl">Lançamentos recentes</span>
      </div>
      <div style={{padding: "0 16px"}}>
        <div className="card" style={{padding: "4px 16px"}}>
          {FIN_RECENTES.map((f) => (
            <div key={f.id} className="list-row" style={{padding: "12px 0"}}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: f.tipo === "receita" ? "var(--moss-soft)" : "var(--terra-soft)",
                color: f.tipo === "receita" ? "var(--moss-deep)" : "var(--terra-deep)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                fontSize: 18,
              }}>{f.tipo === "receita" ? "↗" : "↙"}</div>
              <div className="meta">
                <div className="t1" style={{fontSize: 14.5}}>{f.cat}</div>
                <div className="t2">{f.desc} · {f.data}</div>
              </div>
              <div style={{
                fontWeight: 700, fontSize: 15,
                color: f.tipo === "receita" ? "var(--moss-deep)" : "var(--ink)",
              }}>
                {f.tipo === "receita" ? "+" : "−"} R$ {f.valor}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Sheet open={addOpen} onClose={() => { setAddOpen(false); setValor(""); }} title={tipo === "receita" ? "Nova receita" : "Nova despesa"}>
        <div style={{textAlign: "center", padding: "16px 0"}}>
          <div className="stat-label">VALOR</div>
          <div style={{display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8}}>
            <span style={{fontSize: 18, color: "var(--ink-3)", fontWeight: 600}}>R$</span>
            <span className="serif" style={{fontSize: 56, lineHeight: 1, color: tipo === "receita" ? "var(--moss)" : "var(--terra)"}}>
              {valor || "0"}
            </span>
          </div>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12}}>
          {["1","2","3","4","5","6","7","8","9",",","0","⌫"].map(k => (
            <button key={k} onClick={() => {
              if (k === "⌫") setValor(v => v.slice(0, -1));
              else setValor(v => v + k);
            }} style={{
              padding: "14px 0", borderRadius: 14,
              background: "var(--surface)", border: "1px solid var(--line)",
              fontSize: 22, fontFamily: "Instrument Serif, Georgia, serif", color: "var(--ink)",
            }}>{k}</button>
          ))}
        </div>
        <div className="field">
          <label>Categoria</label>
          <div style={{display: "flex", gap: 6, flexWrap: "wrap"}}>
            {(tipo === "receita" ? ["Venda ovos","Venda leite","Venda animal","Outros"] : ["Ração","Veterinário","Energia","Mão de obra","Manutenção"]).map(c => (
              <button key={c} className="chip">{c}</button>
            ))}
          </div>
        </div>
        <div className="field"><label>Descrição</label><input placeholder="Ex.: Ração inicial 50kg"/></div>
        <button onClick={() => { setAddOpen(false); showToast(`${tipo === "receita" ? "Receita" : "Despesa"} de R$ ${valor || "0"} salva`); setValor(""); }} className="btn btn-primary" style={{width: "100%"}}>
          <Ico.check s={16} c="var(--bg)"/> Salvar
        </button>
      </Sheet>
      <div className="spacer-24"/>
    </div>
  );
}

// ════════════════════════════════════════════
// CALENDÁRIO
// ════════════════════════════════════════════
function CalendarioScreen({ back }) {
  // Mock May 2026: 1 May 2026 is a Friday (real). We start with Sun.
  const monthDays = 31;
  const firstDow = 5; // Friday
  const today = 25;
  const taskDays = [5, 8, 12, 14, 15, 20, 22, 25, 28, 30];

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push({ blank: true });
  for (let d = 1; d <= monthDays; d++) cells.push({ d, today: d === today, has: taskDays.includes(d) });

  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader title="Calendário" subtitle="Maio 2026" onBack={back}/>

      <div style={{padding: "0 16px 14px"}}>
        <div className="card" style={{padding: 16}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14}}>
            <button style={{background: "none", border: "none", color: "var(--ink-3)", fontSize: 18}}>‹</button>
            <div className="serif" style={{fontSize: 20}}>Maio 2026</div>
            <button style={{background: "none", border: "none", color: "var(--ink-3)", fontSize: 18}}>›</button>
          </div>
          <div className="cal-grid" style={{marginBottom: 8}}>
            {["D","S","T","Q","Q","S","S"].map((d, i) => (
              <div key={i} style={{textAlign: "center", fontSize: 11, color: "var(--ink-3)", fontWeight: 700, padding: 4}}>{d}</div>
            ))}
          </div>
          <div className="cal-grid">
            {cells.map((c, i) => c.blank ? (
              <div key={i}/>
            ) : (
              <div key={i} className={`cal-cell ${c.today ? "today" : ""} ${c.has ? "has-task" : ""}`}>{c.d}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-head">
        <span className="ttl">Hoje, 25 de maio</span>
        <button className="more">+ Tarefa</button>
      </div>
      <div style={{padding: "0 16px"}}>
        <div className="card" style={{padding: "4px 16px"}}>
          {TASKS_TODAY.map((t) => (
            <div key={t.id} className="list-row" style={{padding: "12px 0"}}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: t.done ? "var(--moss-soft)" : "var(--bg-deep)",
                color: t.done ? "var(--moss-deep)" : "var(--ink-2)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{
                t.icon === "egg" ? <Ico.egg/> :
                t.icon === "milk" ? <Ico.milk/> :
                t.icon === "vaccine" ? <Ico.vaccine/> :
                t.icon === "field" ? <Ico.field/> :
                t.icon === "water" ? <Ico.water/> :
                t.icon === "scale" ? <Ico.scale/> : <Ico.check/>
              }</div>
              <div className="meta">
                <div className="t1" style={{
                  textDecoration: t.done ? "line-through" : "none",
                  color: t.done ? "var(--ink-3)" : "var(--ink)",
                }}>{t.titulo}</div>
                <div className="t2">{t.cat} · {t.hora}</div>
              </div>
              {t.done ? <Ico.check c="var(--moss)" s={18}/> : t.urgent && <span className="chip danger" style={{padding: "2px 8px", fontSize: 10}}>!</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="section-head">
        <span className="ttl">Próximos dias</span>
      </div>
      <div style={{padding: "0 16px", display: "flex", flexDirection: "column", gap: 8}}>
        {[
          {d: "Amanhã, 26", n: 3, ev: "Vacinação Lote C · Visita do veterinário"},
          {d: "Quarta, 28", n: 2, ev: "Brucelose: Mimosa · Pesagem cordeiros"},
          {d: "Sexta, 30", n: 4, ev: "Vacina Newcastle · Reposição de ração"},
        ].map(d => (
          <div key={d.d} className="card" style={{padding: 14, display: "flex", alignItems: "center", gap: 12}}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "var(--bg)", border: "1px solid var(--line)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontSize: 13, fontWeight: 700, color: "var(--ink-2)",
            }}>{d.d.split(" ")[1]}</div>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{fontWeight: 700, fontSize: 14}}>{d.d}</div>
              <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 2}}>{d.ev}</div>
            </div>
            <span className="chip terra" style={{padding: "2px 10px", fontSize: 11}}>{d.n}</span>
          </div>
        ))}
      </div>
      <div className="spacer-24"/>
    </div>
  );
}

// ════════════════════════════════════════════
// REPRODUÇÃO
// ════════════════════════════════════════════
function ReproducaoScreen({ back }) {
  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader title="Reprodução" subtitle="Coberturas, gestações e nascimentos" onBack={back}/>

      <div style={{padding: "0 16px 14px", display: "flex", gap: 10}}>
        <StatTile label="Gestantes" value="3" sub="2 bov + 1 ov" tone="terra" icon={<Ico.babies s={12}/>}/>
        <StatTile label="Em monta" value="2" sub="novilhas" tone="moss" icon={<Ico.heart s={12}/>}/>
        <StatTile label="Nascimentos" value="12" sub="últimos 12m" tone="ink"/>
      </div>

      <div className="section-head"><span className="ttl">Partos próximos</span></div>
      <div style={{padding: "0 16px", display: "flex", flexDirection: "column", gap: 10}}>
        {REPRODUCAO.filter(r => r.status.includes("Gestação")).map(r => (
          <div key={r.id} className="card" style={{padding: 14, display: "flex", alignItems: "center", gap: 12}}>
            <SpeciesAvatar species={r.animal === "Bola de Neve" || r.animal === "Nuvem" ? "Ovino" : "Bovino"} size={48}/>
            <div style={{flex: 1}}>
              <div className="serif" style={{fontSize: 20}}>{r.animal}</div>
              <div style={{fontSize: 12, color: "var(--ink-3)"}}>{r.status}</div>
            </div>
            <div style={{textAlign: "right"}}>
              <div className="stat-label">PREVISÃO</div>
              <div style={{fontWeight: 700, fontSize: 14, color: "var(--terra-deep)"}}>{r.prevista}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-head"><span className="ttl">Histórico</span></div>
      <div style={{padding: "0 16px"}}>
        <div className="card" style={{padding: "4px 16px"}}>
          {REPRODUCAO.map((r) => (
            <div key={r.id} className="list-row" style={{padding: "12px 0"}}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "var(--sky-soft)", color: "#335C6E",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}><Ico.babies s={18}/></div>
              <div className="meta">
                <div className="t1" style={{fontSize: 14}}>{r.evento} · {r.animal}</div>
                <div className="t2">{r.data}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="spacer-24"/>
    </div>
  );
}

// ════════════════════════════════════════════
// RELATÓRIOS
// ════════════════════════════════════════════
function RelatoriosScreen({ back, showToast }) {
  const reports = [
    {k: "prod", l: "Produção mensal", d: "Ovos, leite e ganho de peso", ico: <Ico.trend/>, tone: "#C2693A"},
    {k: "saude", l: "Saúde do rebanho", d: "Vacinação, tratamentos, mortalidade", ico: <Ico.heart/>, tone: "#B84A2E"},
    {k: "fin", l: "Financeiro mensal", d: "Receitas, despesas e lucro", ico: <Ico.money/>, tone: "#5A7A3A"},
    {k: "rep", l: "Reprodução anual", d: "Taxa de prenhez e natalidade", ico: <Ico.babies/>, tone: "#335C6E"},
    {k: "rebanho", l: "Inventário do rebanho", d: "Lista completa por categoria", ico: <Ico.herd/>, tone: "#82591A"},
    {k: "past", l: "Manejo de pastagens", d: "Rotação e ocupação", ico: <Ico.field/>, tone: "#3F5825"},
  ];
  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader title="Relatórios" subtitle="Exportar dados em PDF" onBack={back}/>

      <div style={{padding: "0 16px 14px"}}>
        <div className="card" style={{padding: 16, background: "var(--ink)", color: "var(--bg)", borderColor: "transparent"}}>
          <div style={{display: "flex", alignItems: "center", gap: 12}}>
            <div style={{width: 44, height: 44, borderRadius: 12, background: "rgba(232,181,68,0.2)", color: "var(--yolk)", display: "flex", alignItems: "center", justifyContent: "center"}}><Ico.report/></div>
            <div style={{flex: 1}}>
              <div className="serif" style={{fontSize: 22, color: "var(--yolk)"}}>Resumo do mês</div>
              <div style={{fontSize: 12, opacity: 0.7}}>Maio/2026 · gerado automaticamente</div>
            </div>
            <button onClick={() => showToast("Resumo enviado por WhatsApp")} style={{
              padding: "8px 12px", borderRadius: 999,
              background: "var(--yolk)", color: "var(--ink)", border: "none",
              fontSize: 12, fontWeight: 700,
            }}>Compartilhar</button>
          </div>
        </div>
      </div>

      <div style={{padding: "0 16px", display: "flex", flexDirection: "column", gap: 8}}>
        {reports.map(r => (
          <div key={r.k} className="card tap" onClick={() => showToast(`${r.l} exportado em PDF`)} style={{padding: 14, display: "flex", alignItems: "center", gap: 12}}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `${r.tone}1A`, color: r.tone,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>{r.ico}</div>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{fontWeight: 700, fontSize: 14.5}}>{r.l}</div>
              <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 2}}>{r.d}</div>
            </div>
            <Ico.chevron c="var(--ink-4)"/>
          </div>
        ))}
      </div>
      <div className="spacer-24"/>
    </div>
  );
}

export {
  ProducaoScreen, SaudeScreen, MaisScreen, PastagensScreen, EstoqueScreen, FinanceiroScreen, CalendarioScreen, ReproducaoScreen, RelatoriosScreen,
};
