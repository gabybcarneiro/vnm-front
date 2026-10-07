import { useEffect, useState } from 'react';
import { getSessao, onSessao, logout } from './api.js';
import { FARM } from './data.js';
import { Ico, Toast } from './ui.jsx';
import { HomeScreen, AlertsScreen } from './screens-core.jsx';
import { LoginScreen, RebanhoScreen, LoteDetailScreen, NovoLoteScreen } from './screens-lotes.jsx';
import { ProducaoScreen, SaudeScreen, MaisScreen, PastagensScreen, EstoqueScreen, FinanceiroScreen, CalendarioScreen, ReproducaoScreen, RelatoriosScreen } from './screens-more.jsx';
import './styles.css';
import './responsive.css';
// VidaNoMato — App root · responsive shell (sidebar + tabbar)


// ─── Nav config ───
const NAV_MAIN = [
  { k: "home",     l: "Início",    ico: <Ico.home/> },
  { k: "rebanho",  l: "Animais",   ico: <Ico.herd/> },
  { k: "producao", l: "Produção",  ico: <Ico.production/> },
];
const NAV_MGMT = [
  { k: "saude",       l: "Saúde",       ico: <Ico.heart/> },
  { k: "calendar",    l: "Calendário",  ico: <Ico.calendar/> },
  { k: "pastagens",   l: "Pastagens",   ico: <Ico.field/> },
  { k: "estoque",     l: "Estoque",     ico: <Ico.box/> },
  { k: "financeiro",  l: "Financeiro",  ico: <Ico.money/> },
  { k: "reproducao",  l: "Reprodução",  ico: <Ico.babies/> },
  { k: "relatorios",  l: "Relatórios",  ico: <Ico.report/> },
];

// ─── Sidebar (tablet / desktop) ───
function Sidebar({ screen, navigate }) {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="sb-emoji">🌾</span>
        <div className="sb-names">
          <div className="sb-name">VidaNoMato</div>
          <div className="sb-sub">{FARM.name}</div>
        </div>
      </div>

      <div className="sidebar-section">Principal</div>
      {NAV_MAIN.map(item => (
        <button key={item.k}
          onClick={() => navigate(item.k)}
          className={`sidebar-item ${screen === item.k ? "active" : ""}`}
        >
          <span className="sb-ico">{item.ico}</span>
          <span className="sb-label">{item.l}</span>
        </button>
      ))}

      <div className="sidebar-div"/>
      <div className="sidebar-section">Gerência</div>
      {NAV_MGMT.map(item => (
        <button key={item.k}
          onClick={() => navigate(item.k)}
          className={`sidebar-item ${screen === item.k ? "active" : ""}`}
        >
          <span className="sb-ico">{item.ico}</span>
          <span className="sb-label">{item.l}</span>
        </button>
      ))}

      <div className="sidebar-foot">
        <button className="sidebar-item">
          <span className="sb-ico"><Ico.more/></span>
          <span className="sb-label">Configurações</span>
        </button>
        <button className="sidebar-item" onClick={logout}>
          <span className="sb-ico"><Ico.back/></span>
          <span className="sb-label">Sair</span>
        </button>
      </div>
    </aside>
  );
}

// ─── Bottom tab bar (mobile only) ───
function TabBar({ activeTab, goTab }) {
  const tabs = [
    { k: "home",     l: "Início",   ico: <Ico.home/> },
    { k: "rebanho",  l: "Animais",  ico: <Ico.herd/> },
    { k: "producao", l: "Produção", ico: <Ico.production/> },
    { k: "mais",     l: "Mais",     ico: <Ico.more/> },
  ];
  return (
    <div className="tabbar">
      <div className="tabbar-inner">
        {tabs.map(t => (
          <button key={t.k} onClick={() => goTab(t.k)}
            className={`tab ${activeTab === t.k ? "active" : ""}`}>
            <span className="tab-ico">{t.ico}</span>
            <span>{t.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── App ───
// Exige login: sem sessão válida mostra a tela de entrada
function App() {
  const [sessao, setSessao] = useState(getSessao);
  useEffect(() => onSessao(setSessao), []);
  if (!sessao) return <LoginScreen/>;
  return <AppShell key={sessao.usuario?.id}/>;
}

function AppShell() {
  const [stack, setStack] = useState([{ screen: "home" }]);
  const [toast, setToast] = useState(null);

  const current = stack[stack.length - 1];
  const screen  = current.screen;

  // Which tab is active (for mobile tabbar)
  const activeTab = (() => {
    if (["home","alerts","calendar"].includes(screen)) return "home";
    if (["rebanho","loteDetail","novoLote"].includes(screen)) return "rebanho";
    if (screen === "producao") return "producao";
    return "mais";
  })();

  const push     = (s, p = {}) => setStack(st => [...st, { screen: s, params: p }]);
  const pop      = ()          => setStack(st => st.length > 1 ? st.slice(0,-1) : st);
  const navigate = (s)         => setStack([{ screen: s }]);

  // go() decides push vs navigate
  const ROOT_SCREENS = new Set([
    "home","rebanho","producao","mais",
    "saude","calendar","pastagens","estoque",
    "financeiro","reproducao","relatorios",
  ]);
  const go     = (s) => ROOT_SCREENS.has(s) ? navigate(s) : push(s);
  const goTab  = (t) => navigate(
    t === "home" ? "home" : t === "rebanho" ? "rebanho" : t === "producao" ? "producao" : "mais"
  );

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  // Resolve back target for sub-screens
  const backTo = (fallback) => () => navigate(fallback);

  const renderScreen = () => {
    const { params = {} } = current;
    switch (screen) {
      case "home":         return <HomeScreen go={go} showToast={showToast}/>;
      case "alerts":       return <AlertsScreen go={go}/>;
      case "rebanho":      return <RebanhoScreen
                                   openLote={(l) => push("loteDetail", { codigo: l.codigo })}
                                   openAdd={() => push("novoLote")}/>;
      case "loteDetail":   return <LoteDetailScreen key={params.codigo} codigo={params.codigo} back={pop} showToast={showToast}/>;
      case "novoLote":     return <NovoLoteScreen back={pop} onCriado={(l) => {
                                   showToast(`Lote ${l.codigo} cadastrado`);
                                   setStack([{ screen: "rebanho" }, { screen: "loteDetail", params: { codigo: l.codigo } }]);
                                 }}/>;
      case "producao":     return <ProducaoScreen go={go} showToast={showToast}/>;
      case "saude":        return <SaudeScreen go={go} back={backTo("mais")} showToast={showToast}/>;
      case "mais":         return <MaisScreen go={go} onSair={logout}/>;
      case "pastagens":    return <PastagensScreen back={backTo("mais")} showToast={showToast}/>;
      case "estoque":      return <EstoqueScreen back={backTo("mais")} showToast={showToast}/>;
      case "financeiro":   return <FinanceiroScreen back={backTo("mais")} showToast={showToast}/>;
      case "calendar":     return <CalendarioScreen back={backTo("home")} showToast={showToast}/>;
      case "reproducao":   return <ReproducaoScreen back={backTo("mais")}/>;
      case "relatorios":   return <RelatoriosScreen back={backTo("mais")} showToast={showToast}/>;
      default:             return <HomeScreen go={go} showToast={showToast}/>;
    }
  };

  // Hide tabbar while in the new-lot form (full-screen flow)
  const showTabbar = screen !== "novoLote";

  return (
    <div className="layout-outer">
      <div className="layout">

        {/* ── Sidebar — tablet/desktop only (CSS controls visibility) ── */}
        <Sidebar screen={screen} navigate={navigate}/>

        {/* ── Main content ── */}
        <main className="content-area" data-screen-label={screen}>
          <div className="app-body">
            {renderScreen()}
          </div>

          {/* Bottom tab bar — mobile only (CSS controls visibility) */}
          {showTabbar && <TabBar activeTab={activeTab} goTab={goTab}/>}

          {/* Toast */}
          <Toast msg={toast} show={!!toast}/>
        </main>

      </div>
    </div>
  );
}

export default App;
