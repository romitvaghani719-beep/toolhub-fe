/* ============================================================
   Screens: Daily Activity Log & Admin Panel
   ============================================================ */

/* ---------------- DAILY ACTIVITY ---------------- */
function ActivityScreen({ nav }) {
  const [member, setMember] = useState("all");
  const [cat, setCat] = useState("all");

  const filtered = ACTIVITY.filter(a => {
    if (member !== "all" && a.member !== member) return false;
    if (cat !== "all" && toolById(a.toolId)?.category !== cat) return false;
    return true;
  });

  // group by date
  const groups = {};
  filtered.forEach(a => { (groups[a.date] = groups[a.date] || []).push(a); });
  const dates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  const fmtDate = (d) => {
    const dt = new Date(d + "T00:00:00");
    const today = "2026-06-15";
    if (d === today) return "Today · " + dt.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    if (d === "2026-06-14") return "Yesterday · " + dt.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    return dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  };

  return (
    <div className="content content--narrow">
      <PageHeader title="Daily activity log" sub="Audit every contribution to the directory, grouped by day." />

      {/* filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <select className="select" value={member} onChange={e => setMember(e.target.value)}>
          <option value="all">All members</option>
          {MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select className="select" value={cat} onChange={e => setCat(e.target.value)}>
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{ flex: 1 }}></div>
        <span className="result-count" style={{ alignSelf: "center" }}>{filtered.length} events</span>
      </div>

      {dates.length === 0 ? (
        <div className="empty card"><div className="empty__icon"><Icon name="calendar" size={48} stroke={1.5} /></div>
          <div style={{ fontWeight: 650, color: "var(--text-2)" }}>No activity for these filters</div></div>
      ) : dates.map(d => (
        <div key={d} className="day-group fade-in">
          <div className="day-head">
            <span className="day-head__date">{fmtDate(d)}</span>
            <span className="day-head__line"></span>
            <span className="day-head__count">{groups[d].length} {groups[d].length === 1 ? "event" : "events"}</span>
          </div>
          {groups[d].map(a => {
            const t = toolById(a.toolId);
            return (
              <div key={a.id} className="activity-row" style={{ cursor: "pointer" }} onClick={() => nav("detail", t.id)}>
                <span className="activity-time">{a.time}</span>
                <LogoTile name={t.name} color={t.logoColor} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {t.name} <span style={{ color: "var(--text-3)", fontWeight: 500 }}>· {catName(t.category)}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 6, marginTop: 1 }}>
                    <Avatar name={memberName(a.member)} color={memberColor(a.member)} size={16} />
                    {memberName(a.member)}
                    <span className={"badge " + (a.action === "added" ? "badge--green" : "badge--amber")} style={{ marginLeft: 4 }}>{a.action}</span>
                  </div>
                </div>
                <Icon name="arrowRight" size={16} style={{ color: "var(--text-faint)" }} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ---------------- ADMIN PANEL ---------------- */
function AdminScreen({ nav }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState(TOOLS);

  const filtered = rows.filter(t => !query || (t.name + " " + catName(t.category)).toLowerCase().includes(query.toLowerCase()));
  const allChecked = filtered.length > 0 && filtered.every(t => selected.includes(t.id));

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(allChecked ? [] : filtered.map(t => t.id));
  const del = (id) => { setRows(r => r.filter(t => t.id !== id)); setSelected(s => s.filter(x => x !== id)); };
  const delSelected = () => { setRows(r => r.filter(t => !selected.includes(t.id))); setSelected([]); };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "directory-export.json"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="content">
      <PageHeader title="Admin panel" sub="Manage, edit and export the entire directory."
        actions={<>
          <button className="btn btn--secondary" onClick={exportJson}><Icon name="download" size={16} />Export JSON</button>
          <button className="btn btn--danger" onClick={() => { setRows([]); setSelected([]); }}><Icon name="trash" size={16} />Clear all</button>
        </>} />

      <div className="browse__bar" style={{ marginBottom: 16 }}>
        <SearchInput value={query} onChange={setQuery} placeholder="Search tools to manage…" />
        <div style={{ flex: 1 }}></div>
        <span className="result-count">{filtered.length} tools</span>
      </div>

      {/* bulk action bar */}
      {selected.length > 0 && (
        <div className="card fade-in" style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 16px", marginBottom: 14, background: "var(--accent-soft)", border: "1px solid var(--accent-soft-2)" }}>
          <span style={{ fontWeight: 650, fontSize: 13.5, color: "var(--accent-text)" }}>{selected.length} selected</span>
          <div style={{ flex: 1 }}></div>
          <button className="btn btn--secondary btn--sm" onClick={exportJson}><Icon name="download" size={14} />Export</button>
          <button className="btn btn--danger btn--sm" onClick={delSelected}><Icon name="trash" size={14} />Delete</button>
          <button className="btn btn--ghost btn--sm" onClick={() => setSelected([])}>Clear</button>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="empty card">
          <div className="empty__icon"><Icon name="layers" size={48} stroke={1.5} /></div>
          <div style={{ fontWeight: 650, color: "var(--text-2)" }}>The directory is empty</div>
          <div style={{ fontSize: 13.5, marginTop: 4, marginBottom: 16 }}>Add a tool or import a batch to get started.</div>
          <button className="btn btn--primary" onClick={() => nav("add")} style={{ margin: "0 auto" }}><Icon name="plus" size={16} />Add tool</button>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <label className="check" style={{ padding: 0 }}>
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} />
                    <span className="check__box">{allChecked && <Icon name="check" size={12} stroke={3} />}</span>
                  </label>
                </th>
                <th>Name</th><th>Category</th><th>Pricing</th><th>API</th>
                <th style={{ textAlign: "right" }}>Votes</th><th>Updated</th><th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td>
                    <label className="check" style={{ padding: 0 }}>
                      <input type="checkbox" checked={selected.includes(t.id)} onChange={() => toggle(t.id)} />
                      <span className="check__box">{selected.includes(t.id) && <Icon name="check" size={12} stroke={3} />}</span>
                    </label>
                  </td>
                  <td><button className="table__name" style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => nav("detail", t.id)}>
                    <LogoTile name={t.name} color={t.logoColor} size={30} />{t.name}
                  </button></td>
                  <td><span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-2)" }}>
                    <span className="dot" style={{ background: catColor(t.category) }}></span>{catName(t.category)}</span></td>
                  <td style={{ color: "var(--text-2)" }}>{t.freePlan ? "Freemium" : "Paid"}</td>
                  <td>{t.apiAvailable ? <span className="badge badge--blue">Yes</span> : <span className="badge badge--gray">No</span>}</td>
                  <td style={{ textAlign: "right", fontFamily: "var(--mono)", fontWeight: 700 }}>{t.votes}</td>
                  <td style={{ color: "var(--text-3)", whiteSpace: "nowrap" }}>{t.lastUpdated}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <button className="icon-btn" title="Edit" onClick={() => nav("add")}><Icon name="edit" size={15} /></button>
                      <button className="icon-btn icon-btn--danger" title="Delete" onClick={() => del(t.id)}><Icon name="trash" size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ActivityScreen, AdminScreen });
