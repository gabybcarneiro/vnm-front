import { useState } from 'react';
import { api, useApi, getSessao } from './api.js';
import { FARM, WEATHER, TASKS_TODAY, ALERTS, EGG_DAYS, FIN_MES } from './data.js';
import { Ico, SpeciesAvatar, PageHeader, StatTile, Sheet, BarChart } from './ui.jsx';
// VidaNoMato — screens: Home, Alertas


// ════════════════════════════════════════════
// HOME / INÍCIO
// ════════════════════════════════════════════
function HomeScreen({ go, showToast }) {
  const [tasks, setTasks] = useState(TASKS_TODAY);
  const [eggSheet, setEggSheet] = useState(false);
  const [milkSheet, setMilkSheet] = useState(false);
  const [eggCount, setEggCount] = useState(0);
  const [eggPeriod, setEggPeriod] = useState("manhã");
  const [milkVals, setMilkVals] = useState({ Mimosa: 12, Estrela: 14, Princesa: 12 });

  const tasksDone = tasks.filter(t => t.done).length;
  const tasksTotal = tasks.length;
  const resumo = useApi("resumo", api.resumo);
  const totalTipo = (t) => resumo.data?.find(r => r.tipo === t)?.total.total ?? 0;
  const totalAnimals = resumo.data ? totalTipo("BOVINO") + totalTipo("OVINO") + totalTipo("GALINHA") : "–";
  const nomeUsuario = getSessao()?.usuario?.nome?.split(" ")[0] || FARM.owner;

  const toggleTask = (id) => {
    setTasks(ts => ts.map(t => t.id === id ? {...t, done: !t.done} : t));
  };

  const submitEggs = () => {
    setEggSheet(false);
    showToast(`${eggCount} ovos registrados (${eggPeriod})`);
    setEggCount(0);
  };
  const submitMilk = () => {
    const total = Object.values(milkVals).reduce((s,v)=>s+v,0);
    setMilkSheet(false);
    showToast(`${total} L de leite registrados`);
  };

  return (
    <div>
      <div className="top-spacer" />
      {/* Header */}
      <div style={{padding: "8px 20px 4px", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <div>
          <div style={{fontSize: 12, color: "var(--ink-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em"}}>
            Bom dia, {nomeUsuario}
          </div>
          <div className="serif" style={{fontSize: 24, color: "var(--ink)", marginTop: 2}}>{FARM.name}</div>
        </div>
        <button onClick={() => go("alerts")} style={{
          position: "relative",
          width: 44, height: 44, borderRadius: 999,
          background: "var(--surface)", border: "1px solid var(--line)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)",
        }}>
          <Ico.bell />
          <span style={{
            position: "absolute", top: 6, right: 6,
            width: 10, height: 10, borderRadius: 999,
            background: "var(--terra)", border: "2px solid var(--surface)",
          }}/>
        </button>
      </div>

      {/* Offline & weather strip */}
      <div style={{padding: "10px 20px 0", display: "flex", gap: 8, flexWrap: "wrap"}}>
        <div className="offline-banner"><Ico.offline /> Trabalhando offline · 3 itens p/ sincronizar</div>
      </div>

      {/* Weather card */}
      <div style={{padding: "16px 16px 0"}}>
        <div className="card" style={{padding: "16px 18px", background: "linear-gradient(135deg, #DAE7EE, #F0EAD2)"}}>
          <div style={{display: "flex", alignItems: "center", gap: 14}}>
            <div style={{color: "#335C6E"}}><Ico.partly s={42} /></div>
            <div style={{flex: 1}}>
              <div style={{display: "flex", alignItems: "baseline", gap: 6}}>
                <span className="serif" style={{fontSize: 32, color: "#2A4554"}}>{WEATHER.temp}°</span>
                <span style={{fontSize: 13, color: "#3F5F70", fontWeight: 600}}>{WEATHER.condition}</span>
              </div>
              <div style={{fontSize: 12, color: "#52707F", fontWeight: 600, marginTop: 2}}>
                {WEATHER.city || FARM.city} · vento {WEATHER.wind} km/h
              </div>
            </div>
          </div>
          <div style={{
            marginTop: 12, padding: "8px 12px",
            background: "rgba(255,255,255,0.55)", borderRadius: 12,
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 12, color: "#335C6E", fontWeight: 600,
          }}>
            <Ico.rain s={16} />
            Amanhã: {WEATHER.rainTomorrow}% de chuva à tarde — programe-se.
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{padding: "18px 16px 0"}}>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10}}>
          <button onClick={() => setEggSheet(true)} className="card" style={{
            textAlign: "left", padding: 14, background: "var(--yolk-soft)", borderColor: "transparent",
          }}>
            <div style={{color: "#82591A"}}><Ico.egg s={24} /></div>
            <div style={{fontSize: 13, fontWeight: 700, color: "#82591A", marginTop: 6}}>Registrar ovos</div>
            <div style={{fontSize: 11, color: "#82591A", opacity: 0.7}}>Coleta da manhã</div>
          </button>
          <button onClick={() => setMilkSheet(true)} className="card" style={{
            textAlign: "left", padding: 14, background: "var(--moss-soft)", borderColor: "transparent",
          }}>
            <div style={{color: "var(--moss-deep)"}}><Ico.milk s={24} /></div>
            <div style={{fontSize: 13, fontWeight: 700, color: "var(--moss-deep)", marginTop: 6}}>Ordenha</div>
            <div style={{fontSize: 11, color: "var(--moss-deep)", opacity: 0.7}}>3 vacas ativas</div>
          </button>
        </div>
      </div>

      {/* Alerts (urgent first 2) */}
      <div className="section-head">
        <span className="ttl">Atenção hoje</span>
        <button className="more" onClick={() => go("alerts")}>Ver tudo</button>
      </div>
      <div style={{padding: "0 16px", display: "flex", flexDirection: "column", gap: 10}}>
        {ALERTS.slice(0, 2).map(a => (
          <AlertCard key={a.id} alert={a} />
        ))}
      </div>

      {/* Tasks of the day */}
      <div className="section-head">
        <span className="ttl">Tarefas de hoje · {tasksDone}/{tasksTotal}</span>
        <button className="more" onClick={() => go("calendar")}>Calendário</button>
      </div>
      <div style={{padding: "0 16px"}}>
        <div className="card" style={{padding: "4px 16px"}}>
          {tasks.slice(0, 5).map((t, i) => (
            <div key={t.id} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 0",
              borderBottom: i < 4 ? "1px solid var(--line-soft)" : "none",
            }}>
              <button onClick={() => toggleTask(t.id)} style={{
                width: 26, height: 26, borderRadius: 999,
                border: t.done ? "none" : "2px solid var(--ink-4)",
                background: t.done ? "var(--moss)" : "transparent",
                color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {t.done && <Ico.check s={14} c="#fff" />}
              </button>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{
                  fontWeight: 600, fontSize: 14.5,
                  color: t.done ? "var(--ink-3)" : "var(--ink)",
                  textDecoration: t.done ? "line-through" : "none",
                }}>{t.titulo}</div>
                {t.detail && <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 2}}>{t.detail}</div>}
              </div>
              <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2}}>
                <span style={{fontSize: 12, color: "var(--ink-3)", fontWeight: 600}}>{t.hora}</span>
                {t.urgent && !t.done && <span className="chip danger" style={{padding: "2px 8px", fontSize: 10}}>Urgente</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today stats */}
      <div className="section-head">
        <span className="ttl">Visão geral</span>
      </div>
      <div style={{padding: "0 16px", display: "flex", gap: 10}}>
        <StatTile label="Ovos hoje" value="145" sub="↑ 5% vs ontem" tone="yolk" icon={<Ico.egg s={14}/>} />
        <StatTile label="Leite hoje" value="38" unit="L" sub="3 vacas em lactação" tone="moss" icon={<Ico.milk s={14}/>} />
      </div>
      <div className="spacer-12"/>
      <div style={{padding: "0 16px", display: "flex", gap: 10}}>
        <StatTile label="Rebanho" value={totalAnimals} sub={resumo.erro ? "Não foi possível carregar" : resumo.data ? `${totalTipo("BOVINO")} bov · ${totalTipo("OVINO")} ov · ${totalTipo("GALINHA")} av` : "Carregando…"} tone="ink" icon={<Ico.herd s={14}/>} />
        <StatTile label="Saldo do mês" value={`R$ ${FIN_MES.saldo.toLocaleString('pt-BR')}`} sub={`Receita R$ ${FIN_MES.receita.toLocaleString('pt-BR')}`} tone="terra" icon={<Ico.money s={14}/>} />
      </div>

      {/* Mini chart */}
      <div className="section-head">
        <span className="ttl">Postura últimos 7 dias</span>
        <button className="more" onClick={() => go("producao")}>Detalhar</button>
      </div>
      <div style={{padding: "0 16px"}}>
        <div className="card" style={{padding: 16}}>
          <div style={{display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8}}>
            <div>
              <span className="serif" style={{fontSize: 28}}>{EGG_DAYS.reduce((s,d)=>s+d.v,0)}</span>
              <span style={{fontSize: 13, color: "var(--ink-3)", marginLeft: 4, fontWeight: 600}}>ovos / semana</span>
            </div>
            <span className="chip moss" style={{padding: "4px 10px"}}><Ico.trend s={12}/> média 149/dia</span>
          </div>
          <BarChart data={EGG_DAYS} color="var(--terra)" height={100} />
        </div>
      </div>

      <div className="spacer-24"/>

      {/* Egg sheet */}
      <Sheet open={eggSheet} onClose={() => setEggSheet(false)} title="Registrar coleta de ovos">
        <div style={{display: "flex", gap: 8, marginBottom: 16}}>
          {["manhã","tarde","noite"].map(p => (
            <button key={p} onClick={() => setEggPeriod(p)} className="chip" style={{
              flex: 1, justifyContent: "center", padding: "10px 0",
              background: eggPeriod === p ? "var(--ink)" : "var(--surface)",
              color: eggPeriod === p ? "var(--bg)" : "var(--ink-2)",
              borderColor: eggPeriod === p ? "var(--ink)" : "var(--line)",
              textTransform: "capitalize",
            }}>{p}</button>
          ))}
        </div>
        <div style={{textAlign: "center", padding: "20px 0"}}>
          <div className="stat-label">Quantidade total</div>
          <div className="serif" style={{fontSize: 72, lineHeight: 1, color: "var(--terra)"}}>{eggCount}</div>
          <div style={{fontSize: 13, color: "var(--ink-3)", marginTop: 4}}>ovos</div>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16}}>
          {[10, 25, 50, 100].map(n => (
            <button key={n} onClick={() => setEggCount(c => c + n)} className="btn-soft btn" style={{padding: "12px 0", fontSize: 14}}>
              +{n}
            </button>
          ))}
        </div>
        <div style={{display: "flex", gap: 8, marginBottom: 16}}>
          <button onClick={() => setEggCount(c => Math.max(0, c - 1))} className="btn btn-soft" style={{flex: 1, fontSize: 18}}>−1</button>
          <button onClick={() => setEggCount(c => c + 1)} className="btn btn-soft" style={{flex: 1, fontSize: 18}}>+1</button>
          <button onClick={() => setEggCount(0)} className="btn btn-ghost" style={{flex: 1, fontSize: 14}}>Limpar</button>
        </div>
        <div style={{fontSize: 12, color: "var(--ink-3)", textAlign: "center", marginBottom: 12}}>
          Lote A produziu 145 em média esta semana
        </div>
        <button onClick={submitEggs} className="btn btn-primary" style={{width: "100%"}}>
          <Ico.check s={16} c="var(--bg)"/> Salvar
        </button>
      </Sheet>

      {/* Milk sheet */}
      <Sheet open={milkSheet} onClose={() => setMilkSheet(false)} title="Ordenha do dia">
        <div style={{fontSize: 13, color: "var(--ink-3)", marginBottom: 14}}>Registre o leite de cada vaca em lactação.</div>
        {Object.keys(milkVals).map(name => (
          <div key={name} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 14px", marginBottom: 8,
            background: "var(--surface)", borderRadius: 16, border: "1px solid var(--line)",
          }}>
            <SpeciesAvatar species="Bovino" size={40}/>
            <div style={{flex: 1}}>
              <div style={{fontWeight: 700, fontSize: 15}}>{name}</div>
              <div style={{fontSize: 11, color: "var(--ink-3)"}}>vaca em lactação</div>
            </div>
            <div className="stepper" style={{padding: "4px 6px"}}>
              <button onClick={() => setMilkVals(v => ({...v, [name]: Math.max(0, v[name] - 1)}))}>−</button>
              <div style={{display: "flex", alignItems: "baseline", gap: 2, padding: "0 8px"}}>
                <span className="val">{milkVals[name]}</span>
                <span style={{fontSize: 12, color: "var(--ink-3)", fontWeight: 600}}>L</span>
              </div>
              <button onClick={() => setMilkVals(v => ({...v, [name]: v[name] + 1}))}>+</button>
            </div>
          </div>
        ))}
        <div style={{
          padding: "12px 14px", marginTop: 8,
          background: "var(--moss-soft)", borderRadius: 16,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{fontWeight: 700, color: "var(--moss-deep)"}}>Total</span>
          <span className="serif" style={{fontSize: 28, color: "var(--moss-deep)"}}>
            {Object.values(milkVals).reduce((s,v)=>s+v,0)} L
          </span>
        </div>
        <div className="spacer-16"/>
        <button onClick={submitMilk} className="btn btn-primary" style={{width: "100%"}}>
          <Ico.check s={16} c="var(--bg)"/> Salvar ordenha
        </button>
      </Sheet>
    </div>
  );
}

// ────── Alert card ──────
function AlertCard({ alert }) {
  const tones = {
    saude: { bg: "var(--danger-soft)", col: "var(--danger)", chip: "danger", ico: <Ico.heart s={20}/> },
    producao: { bg: "var(--yolk-soft)", col: "#82591A", chip: "yolk", ico: <Ico.trendDown s={20}/> },
    estoque: { bg: "var(--terra-soft)", col: "var(--terra-deep)", chip: "terra", ico: <Ico.box s={20}/> },
    reproducao: { bg: "var(--sky-soft)", col: "#335C6E", chip: "sky", ico: <Ico.babies s={20}/> },
    pastagem: { bg: "var(--moss-soft)", col: "var(--moss-deep)", chip: "moss", ico: <Ico.field s={20}/> },
  };
  const t = tones[alert.tipo] || tones.saude;
  return (
    <div className="card" style={{padding: 14, display: "flex", gap: 12, alignItems: "flex-start"}}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: t.bg, color: t.col,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>{t.ico}</div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{display: "flex", alignItems: "center", gap: 8}}>
          <span style={{fontWeight: 700, fontSize: 14.5}}>{alert.titulo}</span>
          {alert.urgencia === "alta" && <span className={`chip ${t.chip}`} style={{padding: "2px 8px", fontSize: 10}}>Urgente</span>}
        </div>
        <div style={{fontSize: 12.5, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.45}}>{alert.desc}</div>
        <div style={{fontSize: 11, color: "var(--ink-3)", marginTop: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em"}}>{alert.quando}</div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// ALERTS LIST (full)
// ════════════════════════════════════════════
function AlertsScreen({ go }) {
  return (
    <div>
      <div className="top-spacer"/>
      <PageHeader title="Alertas" subtitle={`${ALERTS.length} situações para acompanhar`} onBack={() => go("home")} />
      <div style={{padding: "0 16px", display: "flex", flexDirection: "column", gap: 10}}>
        {ALERTS.map(a => <AlertCard key={a.id} alert={a} />)}
      </div>
      <div className="spacer-24"/>
    </div>
  );
}

export {
  HomeScreen, AlertsScreen, AlertCard,
};
