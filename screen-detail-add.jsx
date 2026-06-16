/* ============================================================
   Screens: Tool Detail & Add Tool
   ============================================================ */

/* ---------------- TOOL DETAIL ---------------- */
function DetailScreen({ nav, toolId, votes, onVote }) {
  const tool = toolById(toolId) || TOOLS[0];
  const [copied, setCopied] = useState(false);
  const related = TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 3);

  const share = () => { setCopied(true); setTimeout(() => setCopied(false), 1600); };

  return (
    <div className="content content--narrow">
      <button className="btn btn--ghost btn--sm" style={{ marginBottom: 18, marginLeft: -6 }} onClick={() => nav("browse")}>
        <Icon name="arrowRight" size={15} style={{ transform: "rotate(180deg)" }} />Back to browse
      </button>

      <div className="detail">
        {/* Left: main */}
        <div>
          <div className="detail__hero fade-in">
            <LogoTile name={tool.name} color={tool.logoColor} size={64} radius={16} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h1 className="detail__title">{tool.name}</h1>
                <CapBadges tool={tool} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, color: "var(--text-3)", fontSize: 14 }}>
                <span className="dot" style={{ background: catColor(tool.category) }}></span>
                {catName(tool.category)}
                <span style={{ color: "var(--border-strong)" }}>·</span>
                <a href={"https://" + tool.website} target="_blank" rel="noreferrer"
                  style={{ color: "var(--accent-text)", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Icon name="link" size={14} />{tool.website}
                </a>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text)", margin: "20px 0 26px" }}>{tool.description}</p>

          <div className="spec-block">
            <h3>Main features</h3>
            <div>
              {tool.features.map(f => (
                <div key={f} className="feature-li"><Icon name="checkCircle" size={18} />{f}</div>
              ))}
            </div>
          </div>

          <div className="spec-block">
            <h3>AI capabilities</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tool.aiCapabilities.map(c => <span key={c} className="tag"><Icon name="spark" size={13} style={{ color: "var(--accent)" }} />{c}</span>)}
            </div>
          </div>

          <div className="spec-block">
            <h3>Use cases</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {tool.useCases.map((u, i) => (
                <div key={u} className="card card--pad" style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px" }}>
                  <span className="leader-rank">{i + 1}</span>
                  <span style={{ fontSize: 14, fontWeight: 550 }}>{u}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="spec-block">
            <h3>Tags</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tool.tags.map(t => <span key={t} className="tag tag--mono">{t}</span>)}
            </div>
          </div>
        </div>

        {/* Right: sidebar facts */}
        <aside style={{ position: "sticky", top: 92 }}>
          <div className="card card--pad fade-in" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <Upvote tool={tool} voted={!!votes[tool.id]} onVote={onVote} />
              <a className="btn btn--primary" style={{ flex: 1 }} href={"https://" + tool.website} target="_blank" rel="noreferrer">
                <Icon name="external" size={16} />Visit website
              </a>
            </div>
            <button className="btn btn--secondary btn--block" onClick={share}>
              <Icon name={copied ? "check" : "share"} size={16} />{copied ? "Link copied!" : "Share"}
            </button>

            <hr className="divider" style={{ margin: "18px 0" }} />

            <div className="kv"><span className="kv__k">Pricing</span><span className="kv__v">{tool.pricing}</span></div>
            <div className="kv"><span className="kv__k">Free plan</span><span className="kv__v">{tool.freePlan ? "Yes" : "No"}</span></div>
            <div className="kv"><span className="kv__k">API available</span><span className="kv__v">{tool.apiAvailable ? "Yes" : "No"}</span></div>
            <div className="kv"><span className="kv__k">Open source</span><span className="kv__v">{tool.openSource ? "Yes" : "No"}</span></div>
            <div className="kv"><span className="kv__k">Automation</span><span className="kv__v">{tool.automation}</span></div>
            <div className="kv"><span className="kv__k">Community</span><span className="kv__v">{tool.community}</span></div>
          </div>

          <div className="card card--pad fade-in" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-faint)", margin: "0 0 12px" }}>Supported models</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tool.models.map(m => <span key={m} className="tag tag--mono">{m}</span>)}
            </div>
          </div>

          <div className="card card--pad fade-in">
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-faint)", margin: "0 0 12px" }}>Metadata</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Avatar name={memberName(tool.addedBy)} color={memberColor(tool.addedBy)} size={30} />
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{memberName(tool.addedBy)}</div>
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>Added this tool</div>
              </div>
            </div>
            <div className="kv" style={{ paddingTop: 0 }}><span className="kv__k"><Icon name="clock" size={13} style={{ verticalAlign: -2, marginRight: 5 }} />Last updated</span><span className="kv__v">{tool.lastUpdated}</span></div>
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <div className="section-head"><h2>Related in {catName(tool.category)}</h2></div>
          <div className="tools-grid">
            {related.map(t => <ToolCard key={t.id} tool={t} voted={!!votes[t.id]} onVote={onVote} onOpen={(id) => nav("detail", id)} />)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- ADD TOOL ---------------- */
const ADD_STEPS = ["Basics", "Features", "Technical", "Business", "Review"];

function AddToolScreen({ nav }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", website: "", category: "chat", description: "",
    features: "", aiCapabilities: "", useCases: "",
    apiAvailable: true, openSource: false, models: "", automation: "",
    pricing: "", freePlan: true, community: "", tags: "", notes: "",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const pct = Math.round(((step + 1) / ADD_STEPS.length) * 100);

  const next = () => setStep(s => Math.min(s + 1, ADD_STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="content content--narrow">
      <PageHeader title="Add a tool" sub="Contribute a new AI tool to the team directory." />

      {/* progress */}
      <div className="card card--pad fade-in" style={{ marginBottom: 22 }}>
        <div className="form-steps">
          {ADD_STEPS.map((s, i) => (
            <button key={s} className={"step-pill" + (i === step ? " active" : i < step ? " done" : "")}
              onClick={() => i <= step && setStep(i)} style={{ background: "none", border: "none", cursor: i <= step ? "pointer" : "default" }}>
              <span className="step-pill__num">{i < step ? <Icon name="check" size={14} stroke={3} /> : i + 1}</span>
              <span className="step-pill__label">{s}</span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
          <div className="progress-track" style={{ flex: 1 }}><div className="progress-fill" style={{ width: pct + "%" }}></div></div>
          <span style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, color: "var(--accent-text)" }}>{pct}%</span>
        </div>
      </div>

      {/* step body */}
      <div className="card card--pad fade-in" key={step}>
        {step === 0 && <>
          <div className="field-row">
            <div className="field"><label className="field__label">Tool name <span className="field__req">*</span></label>
              <input className="input" placeholder="e.g. Orion Chat" value={form.name} onChange={e => set("name", e.target.value)} /></div>
            <div className="field"><label className="field__label">Website <span className="field__req">*</span></label>
              <input className="input" placeholder="example.ai" value={form.website} onChange={e => set("website", e.target.value)} /></div>
          </div>
          <div className="field"><label className="field__label">Category <span className="field__req">*</span></label>
            <select className="select" style={{ width: "100%" }} value={form.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select></div>
          <div className="field"><label className="field__label">Description <span className="field__hint">— one or two sentences</span></label>
            <textarea className="textarea" placeholder="What does this tool do?" value={form.description} onChange={e => set("description", e.target.value)} /></div>
        </>}

        {step === 1 && <>
          <div className="field"><label className="field__label">Main features <span className="field__hint">— one per line</span></label>
            <textarea className="textarea" placeholder={"Long-context document chat\nInline citations\nTeam workspaces"} value={form.features} onChange={e => set("features", e.target.value)} /></div>
          <div className="field"><label className="field__label">AI capabilities <span className="field__hint">— comma separated</span></label>
            <input className="input" placeholder="Reasoning, Summarization, Vision" value={form.aiCapabilities} onChange={e => set("aiCapabilities", e.target.value)} /></div>
          <div className="field"><label className="field__label">Use cases <span className="field__hint">— one per line</span></label>
            <textarea className="textarea" placeholder={"Summarize research\nDraft replies"} value={form.useCases} onChange={e => set("useCases", e.target.value)} /></div>
        </>}

        {step === 2 && <>
          <div className="toggle-row">
            <div><div className="toggle-row__label">API available</div><div className="toggle-row__desc">Does the tool expose a developer API?</div></div>
            <Toggle on={form.apiAvailable} onChange={v => set("apiAvailable", v)} />
          </div>
          <div className="toggle-row">
            <div><div className="toggle-row__label">Open source</div><div className="toggle-row__desc">Is the source code publicly available?</div></div>
            <Toggle on={form.openSource} onChange={v => set("openSource", v)} />
          </div>
          <div className="field" style={{ marginTop: 18 }}><label className="field__label">Supported models <span className="field__hint">— comma separated</span></label>
            <input className="input" placeholder="GPT-4o, Claude 3.5, Gemini 1.5" value={form.models} onChange={e => set("models", e.target.value)} /></div>
          <div className="field"><label className="field__label">Automation support</label>
            <input className="input" placeholder="Webhooks, Zapier, CLI…" value={form.automation} onChange={e => set("automation", e.target.value)} /></div>
        </>}

        {step === 3 && <>
          <div className="field"><label className="field__label">Pricing</label>
            <input className="input" placeholder="Freemium · $20/mo Pro" value={form.pricing} onChange={e => set("pricing", e.target.value)} /></div>
          <div className="toggle-row">
            <div><div className="toggle-row__label">Free plan</div><div className="toggle-row__desc">Is there a free tier?</div></div>
            <Toggle on={form.freePlan} onChange={v => set("freePlan", v)} />
          </div>
          <div className="field" style={{ marginTop: 18 }}><label className="field__label">Community / support</label>
            <input className="input" placeholder="Discord, forum, docs…" value={form.community} onChange={e => set("community", e.target.value)} /></div>
          <div className="field"><label className="field__label">Tags <span className="field__hint">— comma separated</span></label>
            <input className="input" placeholder="LLM, Assistant, Summarize" value={form.tags} onChange={e => set("tags", e.target.value)} /></div>
          <div className="field"><label className="field__label">Internal notes <span className="field__hint">— optional</span></label>
            <textarea className="textarea" placeholder="Anything the team should know…" value={form.notes} onChange={e => set("notes", e.target.value)} /></div>
        </>}

        {step === 4 && <>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <LogoTile name={form.name || "New tool"} color="var(--accent)" size={52} />
            <div>
              <div style={{ fontSize: 19, fontWeight: 750 }}>{form.name || "Untitled tool"}</div>
              <div style={{ color: "var(--text-3)", fontSize: 13.5 }}>{catName(form.category)}{form.website ? " · " + form.website : ""}</div>
            </div>
          </div>
          <p style={{ color: "var(--text-2)", fontSize: 14.5, lineHeight: 1.6 }}>{form.description || "No description provided yet."}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {form.apiAvailable && <span className="badge badge--blue">API</span>}
            {form.freePlan && <span className="badge badge--green">Free</span>}
            {form.openSource && <span className="badge badge--violet">Open source</span>}
          </div>
          <div className="card" style={{ background: "var(--accent-soft)", border: "1px solid var(--accent-soft-2)", padding: 14, marginTop: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Icon name="checkCircle" size={18} style={{ color: "var(--accent-text)", marginTop: 1 }} />
            <div style={{ fontSize: 13.5, color: "var(--accent-text)" }}>Looks good! Submitting adds this tool to the directory and credits it to your profile.</div>
          </div>
        </>}

        {/* nav */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, gap: 10 }}>
          {step > 0
            ? <button className="btn btn--secondary" onClick={prev}><Icon name="arrowRight" size={15} style={{ transform: "rotate(180deg)" }} />Back</button>
            : <button className="btn btn--ghost" onClick={() => nav("dashboard")}>Cancel</button>}
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn--ghost" onClick={() => nav("dashboard")}>Save draft</button>
            {step < ADD_STEPS.length - 1
              ? <button className="btn btn--primary" onClick={next}>Continue<Icon name="arrowRight" size={15} /></button>
              : <button className="btn btn--primary" onClick={() => nav("browse")}><Icon name="check" size={16} />Submit tool</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DetailScreen, AddToolScreen });
