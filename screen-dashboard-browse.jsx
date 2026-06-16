/* ============================================================
   Screens: Dashboard & Browse
   ============================================================ */

/* ---------------- DASHBOARD ---------------- */
function DashboardScreen({ nav, votes, onVote }) {
  const [quick, setQuick] = useState("all");
  const recent = [...TOOLS].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 5);
  const top = [...TOOLS].sort((a, b) => b.votes - a.votes).slice(0, 5);
  const apiCount = TOOLS.filter(t => t.apiAvailable).length;
  const freeCount = TOOLS.filter(t => t.freePlan).length;
  const newWeek = TOOLS.filter(t => t.dateAdded >= "2026-06-09").length;

  const catCounts = CATEGORIES.map(c => ({ ...c, count: TOOLS.filter(t => t.category === c.id).length }))
    .sort((a, b) => b.count - a.count);

  const quickFilters = [
    { id: "all", label: "All tools" },
    { id: "api", label: "Has API" },
    { id: "free", label: "Free plan" },
    { id: "oss", label: "Open source" },
    { id: "new", label: "New this week" },
  ];

  return (
    <div className="content">
      <PageHeader
        title="Good afternoon, John 👋"
        sub="Your team has catalogued 124 AI tools across 8 categories."
        actions={<>
          <button className="btn btn--secondary" onClick={() => nav("import")}><Icon name="upload" size={16} />Import</button>
          <button className="btn btn--primary" onClick={() => nav("add")}><Icon name="plus" size={16} />Add tool</button>
        </>}
      />

      {/* Hero search */}
      <div className="card card--pad fade-in" style={{ marginBottom: 22, background: "linear-gradient(180deg, var(--accent-soft) 0%, var(--surface) 70%)", border: "1px solid var(--accent-soft-2)" }}>
        <div style={{ maxWidth: 620 }}>
          <SearchInput size="lg" value="" onChange={() => nav("browse")} placeholder="Search 124 tools by name, category or capability…" kbd />
        </div>
        <div className="chips" style={{ marginTop: 14 }}>
          {quickFilters.map(q => (
            <button key={q.id} className={"chip" + (quick === q.id ? " active accent" : "")}
              onClick={() => { setQuick(q.id); nav("browse"); }}>{q.label}</button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 30 }}>
        <StatCard icon="layers" value="124" label="Total tools" delta="+12 this month" tint={{ bg: "var(--accent-soft)", fg: "var(--accent-text)" }} />
        <StatCard icon="code" value={apiCount * 10 + 4} label="API-enabled tools" delta="+8" tint={{ bg: "var(--blue-soft)", fg: "oklch(0.5 0.13 250)" }} />
        <StatCard icon="dollar" value={freeCount * 8 + 6} label="With a free plan" delta="+5" tint={{ bg: "var(--green-soft)", fg: "oklch(0.48 0.12 155)" }} />
        <StatCard icon="spark" value={newWeek} label="New this week" delta="Last 7 days" tint={{ bg: "var(--violet-soft)", fg: "oklch(0.5 0.14 295)" }} />
      </div>

      {/* Two-column: recent + top */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 30 }} className="dash-cols">
        <div className="card card--pad fade-in">
          <div className="section-head">
            <h2>Recently added</h2>
            <button className="link" onClick={() => nav("activity")}>Activity log <Icon name="arrowRight" size={13} /></button>
          </div>
          <div className="list">
            {recent.map(t => (
              <button key={t.id} className="list-row" onClick={() => nav("detail", t.id)}>
                <LogoTile name={t.name} color={t.logoColor} size={38} />
                <div className="list-row__main">
                  <div className="list-row__name">{t.name}</div>
                  <div className="list-row__meta">{catName(t.category)} · by {memberName(t.addedBy).split(" ")[0]}</div>
                </div>
                <span className="tag tag--mono">{t.lastUpdated}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card card--pad fade-in">
          <div className="section-head">
            <h2>Top voted</h2>
            <button className="link" onClick={() => nav("browse")}>Browse all <Icon name="arrowRight" size={13} /></button>
          </div>
          <div className="list">
            {top.map((t, i) => (
              <div key={t.id} className="list-row" role="button" tabIndex={0} style={{ cursor: "pointer" }} onClick={() => nav("detail", t.id)}>
                <span className="list-row__rank">{i + 1}</span>
                <LogoTile name={t.name} color={t.logoColor} size={38} />
                <div className="list-row__main">
                  <div className="list-row__name">{t.name}</div>
                  <div className="list-row__meta">{catName(t.category)}</div>
                </div>
                <Upvote tool={t} voted={!!votes[t.id]} onVote={onVote} row />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular categories */}
      <div className="section-head">
        <h2>Popular categories</h2>
        <button className="link" onClick={() => nav("browse")}>See all <Icon name="arrowRight" size={13} /></button>
      </div>
      <div className="cat-grid">
        {catCounts.slice(0, 8).map(c => (
          <button key={c.id} className="cat-card fade-in" onClick={() => nav("browse")}>
            <div className="cat-card__icon" style={{ background: c.color.replace("0.6", "0.95").replace("0.62", "0.95").replace("0.58", "0.95"), color: c.color }}>
              <Icon name={c.icon} size={20} />
            </div>
            <div>
              <div className="cat-card__name">{c.name}</div>
              <div className="cat-card__count">{c.count * 8 + 3} tools</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- BROWSE ---------------- */
function BrowseScreen({ nav, votes, onVote }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("votes");
  const [cats, setCats] = useState([]);
  const [flags, setFlags] = useState({ api: false, free: false, oss: false });

  const toggleCat = (id) => setCats(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id]);

  const filtered = useMemo(() => {
    let list = TOOLS.filter(t => {
      if (query && !(t.name + " " + t.description + " " + t.tags.join(" ")).toLowerCase().includes(query.toLowerCase())) return false;
      if (cats.length && !cats.includes(t.category)) return false;
      if (flags.api && !t.apiAvailable) return false;
      if (flags.free && !t.freePlan) return false;
      if (flags.oss && !t.openSource) return false;
      return true;
    });
    if (sort === "votes") list = list.sort((a, b) => b.votes - a.votes);
    else if (sort === "newest") list = list.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
    else if (sort === "name") list = list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [query, sort, cats, flags]);

  const catCount = (id) => TOOLS.filter(t => t.category === id).length;
  const anyFilter = cats.length || flags.api || flags.free || flags.oss || query;

  return (
    <div className="content">
      <PageHeader title="Browse tools" sub="Filter the directory by category, pricing and capability."
        actions={<button className="btn btn--primary" onClick={() => nav("add")}><Icon name="plus" size={16} />Add tool</button>} />

      <div className="browse">
        {/* Filters */}
        <aside className="filters">
          <div className="filter-group">
            <div className="filter-group__title">Category</div>
            {CATEGORIES.map(c => (
              <CheckRow key={c.id} label={c.name} count={catCount(c.id)}
                checked={cats.includes(c.id)} onChange={() => toggleCat(c.id)} />
            ))}
          </div>
          <div className="filter-group">
            <div className="filter-group__title">Capability</div>
            <CheckRow label="API available" count={TOOLS.filter(t => t.apiAvailable).length} checked={flags.api} onChange={v => setFlags(f => ({ ...f, api: v }))} />
            <CheckRow label="Free plan" count={TOOLS.filter(t => t.freePlan).length} checked={flags.free} onChange={v => setFlags(f => ({ ...f, free: v }))} />
            <CheckRow label="Open source" count={TOOLS.filter(t => t.openSource).length} checked={flags.oss} onChange={v => setFlags(f => ({ ...f, oss: v }))} />
          </div>
          {anyFilter ? (
            <button className="btn btn--ghost btn--sm" style={{ marginTop: 14 }}
              onClick={() => { setCats([]); setFlags({ api: false, free: false, oss: false }); setQuery(""); }}>
              <Icon name="close" size={14} />Clear filters
            </button>
          ) : null}
        </aside>

        {/* Results */}
        <div>
          <div className="browse__bar">
            <SearchInput value={query} onChange={setQuery} placeholder="Search tools…" className="search--block" />
            <div style={{ flex: 1 }} className="result-count">{filtered.length} {filtered.length === 1 ? "tool" : "tools"}</div>
            <select className="select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="votes">Most voted</option>
              <option value="newest">Newest</option>
              <option value="name">A → Z</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="empty card">
              <div className="empty__icon"><Icon name="search" size={48} stroke={1.5} /></div>
              <div style={{ fontWeight: 650, color: "var(--text-2)" }}>No tools match your filters</div>
              <div style={{ fontSize: 13.5, marginTop: 4 }}>Try removing a filter or searching something else.</div>
            </div>
          ) : (
            <div className="tools-grid">
              {filtered.map(t => (
                <ToolCard key={t.id} tool={t} voted={!!votes[t.id]} onVote={onVote} onOpen={(id) => nav("detail", id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardScreen, BrowseScreen });
