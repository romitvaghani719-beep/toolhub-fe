/* ============================================================
   App shell — sidebar nav, top bar, routing
   ============================================================ */

const NAV_ITEMS = [
  // { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "browse",    label: "Browse tools", icon: "grid", badge: "124" },
  { id: "add",       label: "Add tool", icon: "plus" },
  // { id: "import",    label: "Import", icon: "upload" },
];
const NAV_INSIGHTS = [
  // { id: "analytics", label: "Member analytics", icon: "chart" },
  { id: "activity",  label: "Daily activity", icon: "calendar" },
  { id: "admin",     label: "Admin panel", icon: "shield" },
];

const SCREEN_META = {
  // dashboard: { title: "Dashboard", sub: "Overview of your team's AI tools" },
  browse:    { title: "Browse tools", sub: "124 tools · 8 categories" },
  detail:    { title: "Tool details", sub: "" },
  add:       { title: "Add tool", sub: "Contribute to the directory" },
  // import:    { title: "Import tools", sub: "Bulk upload" },
  // analytics: { title: "Member analytics", sub: "Contributor activity" },
  activity:  { title: "Daily activity", sub: "Contribution audit log" },
  admin:     { title: "Admin panel", sub: "Manage the directory" },
};

function Sidebar({ route, nav, open, onClose }) {
  const Item = (it) => (
    <button key={it.id} className={"nav__item" + (route === it.id ? " active" : "")} onClick={() => { nav(it.id); onClose(); }}>
      <Icon name={it.icon} size={18} />
      <span>{it.label}</span>
      {it.badge && <span className="nav__badge">{it.badge}</span>}
    </button>
  );
  return (
    <nav className={"sidebar" + (open ? " open" : "")}>
      <div className="sidebar__brand">
        <div className="brand__mark"><Icon name="layers" size={19} /></div>
        <div>
          <div className="brand__name">ToolVault</div>
          <div className="brand__sub">AI Tools Directory</div>
        </div>
      </div>
      <div className="nav">
        <div className="nav__label">Directory</div>
        {NAV_ITEMS.map(Item)}
        <div className="nav__label">Insights</div>
        {NAV_INSIGHTS.map(Item)}
      </div>
      <div className="sidebar__foot">
        <div className="user-chip">
          <Avatar name="John Carter" color="oklch(0.62 0.17 46)" size={34} />
          <div className="user-chip__meta">
            <div className="user-chip__name">John Carter</div>
            <div className="user-chip__role">Research Lead</div>
          </div>
          <div style={{ marginLeft: "auto", color: "var(--text-faint)" }}><Icon name="bell" size={16} /></div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [route, setRoute] = useState("dashboard");
  const [detailId, setDetailId] = useState("t1");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topSearch, setTopSearch] = useState("");
  const [votes, setVotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tv_votes") || "{}"); } catch (e) { return {}; }
  });
  const mainRef = useRef(null);

  useEffect(() => { localStorage.setItem("tv_votes", JSON.stringify(votes)); }, [votes]);
  useEffect(() => { if (mainRef.current) mainRef.current.scrollTop = 0; }, [route, detailId]);

  const nav = (r, id) => {
    if (id) setDetailId(id);
    setRoute(r);
    setSidebarOpen(false);
  };
  const onVote = (id) => setVotes(v => ({ ...v, [id]: !v[id] }));

  // Expose navigation for the PPTX exporter (drives screens for capture)
  useEffect(() => { window.appNav = nav; });

  const meta = SCREEN_META[route] || {};

  const renderScreen = () => {
    switch (route) {
      // case "dashboard": return <DashboardScreen nav={nav} votes={votes} onVote={onVote} />;
      case "browse":    return <BrowseScreen nav={nav} votes={votes} onVote={onVote} />;
      case "detail":    return <DetailScreen nav={nav} toolId={detailId} votes={votes} onVote={onVote} />;
      case "add":       return <AddToolScreen nav={nav} />;
      // case "import":    return <ImportScreen nav={nav} />;
      // case "analytics": return <AnalyticsScreen nav={nav} />;
      case "activity":  return <ActivityScreen nav={nav} />;
      case "admin":     return <AdminScreen nav={nav} />;
      default:          return <DashboardScreen nav={nav} votes={votes} onVote={onVote} />;
    }
  };

  return (
    <div className="app">
      <div className={"scrim" + (sidebarOpen ? " show" : "")} onClick={() => setSidebarOpen(false)}></div>
      <Sidebar route={route} nav={nav} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main" ref={mainRef}>
        <header className="topbar">
          <button className="icon-btn topbar__menu" onClick={() => setSidebarOpen(true)}><Icon name="menu" size={18} /></button>
          <div>
            <div className="page-title">{meta.title}</div>
            {meta.sub && <div className="page-sub">{meta.sub}</div>}
          </div>
          <div className="topbar__spacer"></div>
          <div className="search search--topbar">
            <Icon name="search" size={16} />
            <input value={topSearch} placeholder="Search tools…"
              onChange={e => setTopSearch(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { nav("browse"); } }}
              onFocus={() => { if (route !== "browse") nav("browse"); }} />
            <kbd>⌘K</kbd>
          </div>
          <button className="btn btn--primary btn--sm" onClick={() => nav("add")}><Icon name="plus" size={15} />Add</button>
        </header>
        {renderScreen()}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
