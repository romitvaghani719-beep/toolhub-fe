/* ============================================================
   Shared components & icons
   ============================================================ */
import { catColor, catName } from "./data.js";

/* ---- Icon (Lucide-style stroke paths) ---- */
const ICONS = {
  home: "M3 9.5 12 3l9 6.5M5 9v11h14V9",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  plus: "M12 5v14M5 12h14",
  upload: "M12 16V4M7 9l5-5 5 5M5 20h14",
  chart: "M3 3v18h18M8 14v4M13 9v9M18 5v13",
  calendar: "M8 2v4M16 2v4M3 9h18M5 5h14v16H5z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5",
  message: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  image: "M3 4h18v16H3zM8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM21 16l-5-5L5 21",
  pen: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
  wave: "M2 12h2l2-6 4 14 4-18 3 10h5",
  bolt: "M13 2 4 14h7l-2 8 9-12h-7z",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  arrowUp: "M12 19V5M6 11l6-6 6 6",
  check: "M20 6 9 17l-5-5",
  checkCircle: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
  external: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3",
  share: "M4 12v8h16v-8M16 6l-4-4-4 4M12 2v14",
  edit: "M11 4H4v16h16v-7M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6",
  menu: "M3 6h18M3 12h18M3 18h18",
  close: "M18 6 6 18M6 6l12 12",
  filter: "M3 4h18l-7 8v6l-4 2v-8z",
  download: "M12 4v12M7 11l5 5 5-5M5 20h14",
  sort: "M3 6h12M3 12h9M3 18h6M17 8V4m0 0-3 3m3-3 3 3",
  bell: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z",
  layers: "M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  star: "M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.3 3.2L7 14.2l-5-4.8 7-.9z",
  trending: "M22 7l-8.5 8.5-4-4L2 19M16 7h6v6",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18",
  doc: "M14 2H6v20h12V8zM14 2v6h6",
  dollar: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  link: "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5",
};

function Icon({ name, size = 18, stroke = 2, fill = "none", style, className }) {
  const d = ICONS[name];
  if (!d) return null;
  const filled = fill !== "none";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke={filled && name === "star" ? fill : "currentColor"} strokeWidth={filled ? 0 : stroke}
      strokeLinecap="round" strokeLinejoin="round" style={style} className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* ---- Logo monogram tile ---- */
function LogoTile({ name, color, size = 42, radius }) {
  const letter = (name || "?").trim()[0].toUpperCase();
  return (
    <div className="logo-tile" style={{
      width: size, height: size, background: color,
      fontSize: size * 0.42, borderRadius: radius || size * 0.26,
    }}>{letter}</div>
  );
}

/* ---- Avatar ---- */
function Avatar({ name, color, size = 34 }) {
  const initials = (name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}

/* ---- Pricing / capability badges ---- */
function PricingBadge({ tool }) {
  if (!tool.freePlan && tool.pricing && tool.pricing.toLowerCase().includes("free")) {
    return <span className="badge badge--green">Freemium</span>;
  }
  if (tool.freePlan) return <span className="badge badge--green">Free plan</span>;
  return <span className="badge badge--gray">Paid</span>;
}

function CapBadges({ tool, compact }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {tool.apiAvailable && <span className="badge badge--blue">API</span>}
      {tool.freePlan && <span className="badge badge--green">Free</span>}
      {tool.openSource && <span className="badge badge--violet">Open source</span>}
      {!compact && tool.featured && <span className="badge badge--amber"><Icon name="star" size={11} fill="currentColor" />Featured</span>}
    </div>
  );
}

/* ---- Upvote ---- */
function Upvote({ tool, voted, onVote, row }) {
  const count = tool.votes + (voted ? 1 : 0);
  return (
    <button className={"upvote" + (voted ? " voted" : "") + (row ? " upvote--row" : "")}
      onClick={(e) => { e.stopPropagation(); onVote(tool.id); }}>
      <Icon name="arrowUp" size={15} stroke={2.5} />
      <span>{count}</span>
      {!row && <small>votes</small>}
    </button>
  );
}

/* ---- Tool card (browse grid) ---- */
function ToolCard({ tool, voted, onVote, onOpen }) {
  return (
    <div className="tool-card fade-in" role="button" tabIndex={0}
      onClick={() => onOpen(tool.id)}
      onKeyDown={e => { if (e.key === "Enter") onOpen(tool.id); }}>
      <div className="tool-card__top">
        <LogoTile name={tool.name} color={tool.logoColor} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="tool-card__name">{tool.name}</div>
          <div className="tool-card__cat" style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span className="dot" style={{ background: catColor(tool.category) }}></span>
            {catName(tool.category)}
          </div>
        </div>
        <Upvote tool={tool} voted={voted} onVote={onVote} />
      </div>
      <div className="tool-card__desc">{tool.description}</div>
      <div className="tool-card__tags">
        {tool.tags.slice(0, 3).map(t => <span key={t} className="tag tag--mono">{t}</span>)}
      </div>
      <div className="tool-card__foot">
        <CapBadges tool={tool} compact />
        <span className="link" style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-text)", display: "inline-flex", alignItems: "center", gap: 4 }}>
          Details <Icon name="arrowRight" size={14} />
        </span>
      </div>
    </div>
  );
}

/* ---- Stat card ---- */
function StatCard({ icon, value, label, delta, tint }) {
  return (
    <div className="stat fade-in">
      <div className="stat__icon" style={{ background: tint.bg, color: tint.fg }}>
        <Icon name={icon} size={19} />
      </div>
      <div className="stat__val">{value}</div>
      <div className="stat__label">{label}</div>
      {delta && <div className="stat__delta up"><Icon name="trending" size={13} />{delta}</div>}
    </div>
  );
}

/* ---- Search input ---- */
function SearchInput({ value, onChange, placeholder, size, kbd, className }) {
  return (
    <div className={"search" + (size === "lg" ? " search--lg" : "") + (className ? " " + className : "")}>
      <Icon name="search" size={size === "lg" ? 18 : 16} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || "Search…"} />
      {kbd && <kbd>⌘K</kbd>}
    </div>
  );
}

/* ---- Toggle ---- */
function Toggle({ on, onChange }) {
  return <button className={"toggle" + (on ? " on" : "")} onClick={() => onChange(!on)} aria-pressed={on}></button>;
}

/* ---- Checkbox row (filters) ---- */
function CheckRow({ label, count, checked, onChange }) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="check__box">{checked && <Icon name="check" size={12} stroke={3} />}</span>
      {label}
      {count != null && <span className="check__count">{count}</span>}
    </label>
  );
}

/* ---- Page header (inside content, above sections) ---- */
function PageHeader({ title, sub, actions }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 750, letterSpacing: "-0.02em", margin: 0 }}>{title}</h1>
        {sub && <p style={{ color: "var(--text-3)", margin: "4px 0 0", fontSize: 14 }}>{sub}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{actions}</div>}
    </div>
  );
}

export {
  Icon, LogoTile, Avatar, PricingBadge, CapBadges, Upvote,
  ToolCard, StatCard, SearchInput, Toggle, CheckRow, PageHeader,
};
