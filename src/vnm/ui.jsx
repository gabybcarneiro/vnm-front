// VidaNoMato — UI primitives + icons

// ───────── Icons ─────────
const Ico = {
  home: (p={}) => <svg width={p.s||22} height={p.s||22} viewBox="0 0 24 24" fill="none"><path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  herd: (p={}) => <svg width={p.s||22} height={p.s||22} viewBox="0 0 24 24" fill="none"><circle cx="8" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.7"/><circle cx="16" cy="13" r="3" stroke="currentColor" strokeWidth="1.7"/><path d="M4 19c0-2 2-3.5 4-3.5s4 1.5 4 3.5M12 20c0-1.5 1.7-3 4-3s4 1.5 4 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  production: (p={}) => <svg width={p.s||22} height={p.s||22} viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="13" rx="6" ry="8" stroke="currentColor" strokeWidth="1.7"/><path d="M9 11c.5-2 1.5-3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  more: (p={}) => <svg width={p.s||22} height={p.s||22} viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="1.7" fill="currentColor"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/><circle cx="18" cy="12" r="1.7" fill="currentColor"/></svg>,
  chevron: (p={}) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={p.c||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  back: (p={}) => <svg width={p.s||22} height={p.s||22} viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus: (p={}) => <svg width={p.s||22} height={p.s||22} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={p.c||"currentColor"} strokeWidth="2.2" strokeLinecap="round"/></svg>,
  bell: (p={}) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none"><path d="M6 16V11a6 6 0 1112 0v5l1.5 2H4.5L6 16z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M10 20a2 2 0 004 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  search: (p={}) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8"/><path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  check: (p={}) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-10" stroke={p.c||"currentColor"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  sun: (p={}) => <svg width={p.s||22} height={p.s||22} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  cloud: (p={}) => <svg width={p.s||22} height={p.s||22} viewBox="0 0 24 24" fill="none"><path d="M7 18a4 4 0 010-8 5 5 0 019.6-1A4 4 0 0117 18H7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  partly: (p={}) => <svg width={p.s||22} height={p.s||22} viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M9 3v1.5M3 9h1.5M14 5l-1 1M5 14l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 18a3.5 3.5 0 010-7 4 4 0 017.7-1A3.5 3.5 0 0119 18H10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="currentColor" fillOpacity="0.08"/></svg>,
  rain: (p={}) => <svg width={p.s||22} height={p.s||22} viewBox="0 0 24 24" fill="none"><path d="M6 15a4 4 0 010-8 5 5 0 019.6-1A4 4 0 0116 15H6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 18l-1 2M12 18l-1 2M16 18l-1 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  egg: (p={}) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="13" rx="6" ry="8" stroke={p.c||"currentColor"} strokeWidth="1.6" fill={p.fill||"none"}/></svg>,
  milk: (p={}) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none"><path d="M9 3h6l1 4v13a1 1 0 01-1 1H9a1 1 0 01-1-1V7l1-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M8 9h8" stroke="currentColor" strokeWidth="1.4"/></svg>,
  vaccine: (p={}) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none"><path d="M14 4l6 6M16 6l3-3M11 7l6 6-7 7H4v-6l7-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/><path d="M12 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  field: (p={}) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none"><path d="M3 18l9-12 9 12H3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M12 6v12M7 15h10" stroke="currentColor" strokeWidth="1.4"/></svg>,
  water: (p={}) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none"><path d="M12 3s6 7 6 12a6 6 0 11-12 0c0-5 6-12 6-12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  scale: (p={}) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M10 6V4h4v2" stroke="currentColor" strokeWidth="1.6"/></svg>,
  money: (p={}) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6"/></svg>,
  box: (p={}) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none"><path d="M3 7l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M3 7v10l9 4 9-4V7M12 11v10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  calendar: (p={}) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  report: (p={}) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none"><path d="M5 4h10l4 4v12H5V4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M14 4v5h5M8 14h8M8 17h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  heart: (p={}) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  babies: (p={}) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none"><circle cx="8" cy="10" r="3" stroke="currentColor" strokeWidth="1.6"/><circle cx="16" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M3 20c0-2 2-3.5 5-3.5s5 1.5 5 3.5M13 20c0-1.5 1.7-3 3.5-3s3.5 1.5 3.5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  offline: (p={}) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M5 12a7 7 0 0114 0M8 12a4 4 0 018 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  alert: (p={}) => <svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none"><path d="M12 3l10 18H2L12 3z" stroke={p.c||"currentColor"} strokeWidth="1.6" strokeLinejoin="round"/><path d="M12 10v5M12 18v.5" stroke={p.c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  close: (p={}) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  filter: (p={}) => <svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none"><path d="M4 5h16l-6 8v6l-4-2v-4L4 5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>,
  trend: (p={}) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none"><path d="M4 17l5-5 4 4 7-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 7h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  trendDown: (p={}) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none"><path d="M4 7l5 5 4-4 7 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 17h6v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  edit: (p={}) => <svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.6"/></svg>,
  // Species emoji-glyphs drawn as illustration (placeholders, friendly)
  cowFace: () => <span style={{fontSize: 26}}>🐄</span>,
  sheepFace: () => <span style={{fontSize: 26}}>🐑</span>,
  chickFace: () => <span style={{fontSize: 26}}>🐔</span>,
};

// ───── Avatar by species ─────
function SpeciesAvatar({ species, size = 52 }) {
  const cls = species === "Aves" ? "chicken" : species === "Ovino" ? "sheep" : "cow";
  const glyph = species === "Aves" ? "🐔" : species === "Ovino" ? "🐑" : "🐄";
  return (
    <div className={`avatar ${cls}`} style={{ width: size, height: size, fontSize: size*0.46 }}>
      {glyph}
    </div>
  );
}

// ───── Top header (page) ─────
function PageHeader({ title, subtitle, onBack, action }) {
  return (
    <div style={{padding: "8px 16px 14px", display: "flex", alignItems: "center", gap: 10}}>
      {onBack && (
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 999,
          background: "var(--surface)", border: "1px solid var(--line)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)",
        }}><Ico.back /></button>
      )}
      <div style={{flex: 1, minWidth: 0}}>
        <div className="serif" style={{fontSize: 30, lineHeight: 1.05, color: "var(--ink)"}}>{title}</div>
        {subtitle && <div style={{fontSize: 13, color: "var(--ink-3)", marginTop: 2}}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

// ───── Stat tile ─────
function StatTile({ label, value, unit, sub, tone = "ink", icon }) {
  const colorMap = { terra: "var(--terra)", moss: "var(--moss)", yolk: "var(--yolk)", ink: "var(--ink)" };
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--line)",
      borderRadius: "var(--r-lg)", padding: "16px 16px 14px", flex: 1, minWidth: 0,
    }}>
      <div style={{display:"flex", alignItems:"center", gap: 6, color: "var(--ink-3)"}}>
        {icon && <span style={{color: colorMap[tone]}}>{icon}</span>}
        <span className="stat-label">{label}</span>
      </div>
      <div style={{marginTop: 8, display: "flex", alignItems: "baseline", gap: 4}}>
        <span className="stat-num small" style={{color: colorMap[tone]}}>{value}</span>
        {unit && <span style={{fontSize: 14, color: "var(--ink-3)", fontWeight: 600}}>{unit}</span>}
      </div>
      {sub && <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 4}}>{sub}</div>}
    </div>
  );
}

// ───── Bottom sheet ─────
function Sheet({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="handle" />
        {title && (
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 12}}>
            <div className="serif" style={{fontSize: 24}}>{title}</div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 999,
              border: "1px solid var(--line)", background: "var(--surface)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><Ico.close s={16} /></button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ───── Sparkline ─────
function Sparkline({ data, color = "var(--terra)", fill = true, height = 60 }) {
  const max = Math.max(...data.map(d => d.v));
  const min = Math.min(...data.map(d => d.v));
  const range = (max - min) || 1;
  const w = 280, h = height;
  const step = w / (data.length - 1);
  const pts = data.map((d, i) => [i * step, h - 6 - ((d.v - min) / range) * (h - 16)]);
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  const areaPath = `${path} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="spark" preserveAspectRatio="none">
      {fill && <path d={areaPath} fill={color} opacity="0.12" />}
      <path d={path} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => i === pts.length - 1 ? (
        <circle key={i} cx={p[0]} cy={p[1]} r="4" fill={color} stroke="var(--surface)" strokeWidth="2"/>
      ) : null)}
    </svg>
  );
}

// ───── Bar chart (simple) ─────
function BarChart({ data, color = "var(--terra)", height = 120, valSuffix = "" }) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{display: "flex", alignItems: "flex-end", gap: 8, height, padding: "0 4px"}}>
      {data.map((d, i) => {
        const h = (d.v / max) * (height - 28);
        const isLast = i === data.length - 1;
        return (
          <div key={i} style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6}}>
            <div style={{fontSize: 10, color: "var(--ink-3)", fontWeight: 600}}>{d.v}{valSuffix}</div>
            <div style={{
              width: "100%", height: h,
              background: color,
              opacity: isLast ? 1 : 0.32,
              borderRadius: 6,
            }}/>
            <div style={{fontSize: 11, color: isLast ? "var(--ink)" : "var(--ink-3)", fontWeight: isLast ? 700 : 500}}>{d.d}</div>
          </div>
        );
      })}
    </div>
  );
}

// ───── Donut (financeiro) ─────
function Donut({ data, size = 140 }) {
  const total = data.reduce((s, d) => s + d.v, 0);
  const r = size / 2 - 14;
  const c = size / 2;
  const len = 2 * Math.PI * r;
  const starts = data.map((_, i) => data.slice(0, i).reduce((s, d) => s + d.v, 0) / total);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="var(--line-soft)" strokeWidth="18"/>
      {data.map((d, i) => {
        const frac = d.v / total;
        const dash = `${frac * len} ${len}`;
        const offset = -starts[i] * len;
        return (
          <circle key={i} cx={c} cy={c} r={r} fill="none"
            stroke={d.cor} strokeWidth="18"
            strokeDasharray={dash} strokeDashoffset={offset}
            transform={`rotate(-90 ${c} ${c})`}
            strokeLinecap="butt"
          />
        );
      })}
      <text x={c} y={c-2} textAnchor="middle" fontFamily="Instrument Serif" fontSize="22" fill="var(--ink)">R$ {total.toLocaleString('pt-BR')}</text>
      <text x={c} y={c+16} textAnchor="middle" fontSize="10" fill="var(--ink-3)" fontWeight="700" letterSpacing="0.06em">DESPESAS</text>
    </svg>
  );
}

// ───── Empty state ─────
function Empty({ title, sub }) {
  return (
    <div style={{padding: "40px 24px", textAlign: "center", color: "var(--ink-3)"}}>
      <div className="serif" style={{fontSize: 22, color: "var(--ink-2)"}}>{title}</div>
      {sub && <div style={{fontSize: 13, marginTop: 4}}>{sub}</div>}
    </div>
  );
}

// ───── Toast ─────
function Toast({ msg, show }) {
  if (!show) return null;
  return (
    <div className="toast">
      <Ico.check s={14} />
      <span>{msg}</span>
    </div>
  );
}

export {
  Ico, SpeciesAvatar, PageHeader, StatTile, Sheet, Sparkline, BarChart, Donut, Empty, Toast,
};
