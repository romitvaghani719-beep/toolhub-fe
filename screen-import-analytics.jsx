/* ============================================================
   Screens: Import Tools & Member Analytics
   ============================================================ */

/* ---------------- IMPORT ---------------- */
function ImportScreen({ nav }) {
  const [mode, setMode] = useState("upload"); // upload | paste
  const [drag, setDrag] = useState(false);
  const [json, setJson] = useState("");
  const [validated, setValidated] = useState(false);

  const sampleRows = [
    { name: "Orion Chat", category: "Chat & Assistants", api: true, status: "valid" },
    { name: "Quillstream", category: "Writing", api: true, status: "valid" },
    { name: "Forge IDE", category: "Code & Dev", api: true, status: "valid" },
    { name: "Lumen Vision", category: "Image Generation", api: true, status: "valid" },
    { name: "Cadence Flow", category: "Automation", api: true, status: "duplicate" },
    { name: "Echo Transcribe", category: "Audio & Video", api: true, status: "valid" },
    { name: "Insight Grid", category: "Data & Analytics", api: false, status: "valid" },
    { name: "Scout Research", category: "Search & Research", api: true, status: "valid" },
    { name: "", category: "Writing", api: false, status: "invalid" },
    { name: "Pixel Motion", category: "Audio & Video", api: true, status: "duplicate" },
  ];
  const counts = { total: 24, valid: 19, invalid: 2, duplicate: 3 };

  const validate = () => setValidated(true);

  return (
    <div className="content content--narrow">
      <PageHeader title="Import tools" sub="Bulk-add tools by uploading a JSON file or pasting records."
        actions={<button className="btn btn--secondary" onClick={() => {
          const blob = new Blob([TEMPLATE_JSON], { type: "application/json" });
          const url = URL.createObjectURL(blob); const a = document.createElement("a");
          a.href = url; a.download = "tools-template.json"; a.click(); URL.revokeObjectURL(url);
        }}><Icon name="download" size={16} />Download template</button>} />

      {/* mode toggle */}
      <div className="chips" style={{ marginBottom: 18 }}>
        <button className={"chip" + (mode === "upload" ? " active" : "")} onClick={() => setMode("upload")}><Icon name="upload" size={15} />Upload file</button>
        <button className={"chip" + (mode === "paste" ? " active" : "")} onClick={() => setMode("paste")}><Icon name="code" size={15} />Paste JSON</button>
      </div>

      {mode === "upload" ? (
        <div className={"dropzone fade-in" + (drag ? " drag" : "")}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); validate(); }}>
          <div className="dropzone__icon"><Icon name="upload" size={26} /></div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Drag &amp; drop your JSON file</div>
          <div style={{ color: "var(--text-3)", fontSize: 13.5, margin: "6px 0 16px" }}>or click to browse · accepts <span style={{ fontFamily: "var(--mono)" }}>.json</span> up to 5 MB</div>
          <button className="btn btn--secondary" onClick={validate}><Icon name="doc" size={16} />Choose file</button>
        </div>
      ) : (
        <div className="fade-in">
          <label className="field__label">Paste JSON array of tool records</label>
          <textarea className="code-area" placeholder={TEMPLATE_JSON} value={json} onChange={e => setJson(e.target.value)} />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <button className="btn btn--primary" onClick={validate}><Icon name="checkCircle" size={16} />Validate records</button>
          </div>
        </div>
      )}

      {validated && (
        <div className="fade-in" style={{ marginTop: 28 }}>
          <div className="section-head"><h2>Validation results</h2>
            <span className="tag tag--mono">tools-batch.json</span>
          </div>
          <div className="validation-grid" style={{ marginBottom: 22 }}>
            <div className="val-card"><div className="val-card__val">{counts.total}</div><div className="val-card__label" style={{ color: "var(--text-3)" }}>Total records</div></div>
            <div className="val-card" style={{ borderColor: "color-mix(in oklab, var(--green), white 60%)" }}><div className="val-card__val" style={{ color: "oklch(0.5 0.13 155)" }}>{counts.valid}</div><div className="val-card__label">Valid</div></div>
            <div className="val-card" style={{ borderColor: "color-mix(in oklab, var(--red), white 60%)" }}><div className="val-card__val" style={{ color: "var(--red)" }}>{counts.invalid}</div><div className="val-card__label">Invalid</div></div>
            <div className="val-card" style={{ borderColor: "var(--accent-soft-2)" }}><div className="val-card__val" style={{ color: "var(--accent-text)" }}>{counts.duplicate}</div><div className="val-card__label">Duplicates</div></div>
          </div>

          <div className="section-head"><h2 style={{ fontSize: 15 }}>Preview · first 10 records</h2></div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Tool name</th><th>Category</th><th>API</th><th style={{ textAlign: "right" }}>Status</th></tr></thead>
              <tbody>
                {sampleRows.map((r, i) => (
                  <tr key={i}>
                    <td><div className="table__name">
                      {r.name ? <LogoTile name={r.name} color={catColor(CATEGORIES.find(c => c.name === r.category)?.id)} size={28} /> : <span className="logo-tile" style={{ width: 28, height: 28, background: "var(--surface-2)", color: "var(--text-faint)" }}>?</span>}
                      {r.name || <span style={{ color: "var(--text-faint)", fontStyle: "italic" }}>Missing name</span>}
                    </div></td>
                    <td style={{ color: "var(--text-2)" }}>{r.category}</td>
                    <td>{r.api ? <span className="badge badge--blue">API</span> : <span className="badge badge--gray">—</span>}</td>
                    <td style={{ textAlign: "right" }}>
                      {r.status === "valid" && <span className="badge badge--green"><span className="dot" style={{ background: "var(--green)" }}></span>Valid</span>}
                      {r.status === "invalid" && <span className="badge badge--red"><span className="dot" style={{ background: "var(--red)" }}></span>Invalid</span>}
                      {r.status === "duplicate" && <span className="badge badge--amber"><span className="dot" style={{ background: "var(--accent)" }}></span>Duplicate</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, gap: 10 }}>
            <button className="btn btn--ghost" onClick={() => setValidated(false)}>Cancel</button>
            <button className="btn btn--primary" onClick={() => nav("browse")}><Icon name="download" size={16} />Import {counts.valid} valid tools</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- MEMBER ANALYTICS ---------------- */
function AnalyticsScreen({ nav }) {
  const [from, setFrom] = useState("2026-03-01");
  const [to, setTo] = useState("2026-06-15");

  const ranked = [...MEMBERS].sort((a, b) => MEMBER_STATS[b.id].added - MEMBER_STATS[a.id].added);
  const maxAdded = Math.max(...MEMBERS.map(m => MEMBER_STATS[m.id].added));

  return (
    <div className="content">
      <PageHeader title="Member analytics" sub="Track contributor activity across the directory."
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", padding: "0 12px", height: 38 }}>
            <Icon name="calendar" size={15} style={{ color: "var(--text-faint)" }} />
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} style={{ border: "none", outline: "none", fontSize: 13, color: "var(--text-2)", fontFamily: "var(--mono)", background: "none" }} />
            <span style={{ color: "var(--text-faint)" }}>→</span>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} style={{ border: "none", outline: "none", fontSize: 13, color: "var(--text-2)", fontFamily: "var(--mono)", background: "none" }} />
          </div>
        } />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 22, alignItems: "start" }} className="analytics-cols">
        <div>
          {/* chart */}
          <div className="card card--pad fade-in" style={{ marginBottom: 22 }}>
            <div className="section-head"><h2>Submissions per member</h2><span className="tag tag--mono">{from} → {to}</span></div>
            <div className="bar-chart">
              {ranked.map(m => {
                const v = MEMBER_STATS[m.id].added;
                return (
                  <div key={m.id} className="bar-col">
                    <div className="bar" style={{ height: (v / maxAdded * 100) + "%", background: `linear-gradient(180deg, ${m.color}, color-mix(in oklab, ${m.color}, black 18%))` }}>
                      <span className="bar__val">{v}</span>
                    </div>
                    <div className="bar-label">{m.name.split(" ")[0]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* member cards */}
          <div className="section-head"><h2>Contributors</h2></div>
          <div className="member-grid">
            {ranked.map(m => {
              const s = MEMBER_STATS[m.id];
              return (
                <div key={m.id} className="member-card fade-in">
                  <div className="member-card__head">
                    <Avatar name={m.name} color={m.color} size={42} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14.5 }}>{m.name}</div>
                      <div style={{ fontSize: 12.5, color: "var(--text-3)" }}>{m.role}</div>
                    </div>
                  </div>
                  <div className="member-stats">
                    <div className="mini-stat"><div className="mini-stat__val">{s.added}</div><div className="mini-stat__label">Tools added</div></div>
                    <div className="mini-stat"><div className="mini-stat__val">{s.avgFill}</div><div className="mini-stat__label">Avg fill time</div></div>
                    <div className="mini-stat"><div className="mini-stat__val" style={{ fontSize: 14 }}>{s.first}</div><div className="mini-stat__label">First submission</div></div>
                    <div className="mini-stat"><div className="mini-stat__val" style={{ fontSize: 14 }}>{s.last}</div><div className="mini-stat__label">Last submission</div></div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--text-3)", marginBottom: 6 }}>
                      <span>Contribution score</span><span style={{ fontFamily: "var(--mono)", fontWeight: 700, color: "var(--text-2)" }}>{s.score}</span>
                    </div>
                    <div className="leader-bar"><div className="leader-fill" style={{ width: s.score + "%", background: m.color }}></div></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* leaderboard */}
        <aside style={{ position: "sticky", top: 92 }}>
          <div className="card card--pad fade-in">
            <div className="section-head"><h2 style={{ display: "flex", alignItems: "center", gap: 7 }}><Icon name="star" size={16} fill="var(--accent)" />Leaderboard</h2></div>
            {ranked.map((m, i) => {
              const s = MEMBER_STATS[m.id];
              return (
                <div key={m.id} className="leader-row">
                  <span className={"leader-rank" + (i === 0 ? " g1" : i === 1 ? " g2" : i === 2 ? " g3" : "")}>{i + 1}</span>
                  <Avatar name={m.name} color={m.color} size={30} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 650 }}>{m.name.split(" ")[0]} {m.name.split(" ")[1][0]}.</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "var(--mono)" }}>{s.added} tools</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card card--pad fade-in" style={{ marginTop: 16, background: "linear-gradient(180deg, var(--accent-soft), var(--surface))" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-text)", marginBottom: 6 }}>Team total</div>
            <div style={{ fontSize: 32, fontWeight: 750, fontFamily: "var(--mono)", letterSpacing: "-0.02em" }}>{MEMBERS.reduce((a, m) => a + MEMBER_STATS[m.id].added, 0)}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-3)" }}>tools contributed all-time</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { ImportScreen, AnalyticsScreen });
