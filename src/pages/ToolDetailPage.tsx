import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/stores";
import { useTool } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ToolDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isError, error } = useTool(id);

  if (isLoading) {
    return (
      <div className="content">
        <LoadingSpinner />
      </div>
    );
  }
  if (isError || !data) {
    return <div className="content">{(error as Error)?.message ?? "Tool not found"}</div>;
  }

  const { tool, creator, related, activities } = data;
  const canEdit = user?.role === "admin" || user?.id === tool.created_by;
  const tags = Array.isArray(tool.tags) ? tool.tags : [];
  const features = Array.isArray(tool.features) ? tool.features : [];
  const aiCapabilities = Array.isArray(tool.ai_capabilities) ? tool.ai_capabilities : [];
  const useCases = Array.isArray(tool.use_cases) ? tool.use_cases : [];
  const models = Array.isArray(tool.models) ? tool.models : [];

  return (
    <div className="content content--narrow">
      <button className="btn btn--ghost btn--sm" onClick={() => navigate("/browse")}>
        ← Back to browse
      </button>

      <div className="detail" style={{ marginTop: 16 }}>
        <div>
          <h1 className="detail__title">{tool.name}</h1>
          <p style={{ color: "var(--text-3)", marginTop: 4 }}>{tool.category}</p>
          {tool.website_url && (
            <a href={tool.website_url} target="_blank" rel="noreferrer" className="link" style={{ display: "inline-block", marginTop: 8 }}>
              {tool.website_url}
            </a>
          )}
          {tool.image_url && (
            <img src={tool.image_url} alt={tool.name} className="mt-4 rounded-lg max-h-48 object-cover" />
          )}
          <p style={{ marginTop: 20, lineHeight: 1.6 }}>{tool.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {tags.map((t) => <span key={t} className="tag tag--mono">{t}</span>)}
          </div>

          <div className="spec-block" style={{ marginTop: 22 }}>
            <h3>Main features</h3>
            <div className="list">
              {features.map((f) => (
                <div key={f} className="list-row" style={{ padding: "8px 0" }}>{f}</div>
              ))}
            </div>
          </div>

          <div className="spec-block" style={{ marginTop: 22 }}>
            <h3>AI capabilities</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {aiCapabilities.map((c) => <span key={c} className="tag">{c}</span>)}
            </div>
          </div>

          <div className="spec-block" style={{ marginTop: 22 }}>
            <h3>Use cases</h3>
            <div className="list">
              {useCases.map((u) => (
                <div key={u} className="list-row" style={{ padding: "8px 0" }}>{u}</div>
              ))}
            </div>
          </div>

          {canEdit && (
            <Link to={`/tools/${tool.id}/edit`}>
              <Button className="mt-4">Edit tool</Button>
            </Link>
          )}
        </div>

        <aside>
          <div className="card card--pad">
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--text-faint)" }}>
              Creator
            </h3>
            <p style={{ marginTop: 8 }}>{creator?.name ?? "Unknown"}</p>
            <p style={{ fontSize: 13, color: "var(--text-3)" }}>{creator?.email}</p>
            <hr className="divider" style={{ margin: "14px 0" }} />
            <div className="kv"><span className="kv__k">Pricing</span><span className="kv__v">{tool.pricing ?? "—"}</span></div>
            <div className="kv"><span className="kv__k">API</span><span className="kv__v">{tool.api_available ? "Yes" : "No"}</span></div>
            <div className="kv"><span className="kv__k">Free plan</span><span className="kv__v">{tool.free_plan ? "Yes" : "No"}</span></div>
            <div className="kv"><span className="kv__k">Open source</span><span className="kv__v">{tool.open_source ? "Yes" : "No"}</span></div>
            <div className="kv"><span className="kv__k">Automation</span><span className="kv__v">{tool.automation ?? "—"}</span></div>
            <div className="kv"><span className="kv__k">Community</span><span className="kv__v">{tool.community ?? "—"}</span></div>
            <div className="kv"><span className="kv__k">Votes</span><span className="kv__v">{tool.votes}</span></div>
          </div>

          <div className="card card--pad" style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--text-faint)" }}>
              Supported models
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {models.map((m) => <span key={m} className="tag tag--mono">{m}</span>)}
            </div>
          </div>

          <div className="card card--pad" style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--text-faint)" }}>
              Recent activity
            </h3>
            <div className="list" style={{ marginTop: 8 }}>
              {activities.map((a) => (
                <div key={a.id} className="list-row" style={{ padding: "8px 0" }}>
                  <span className="tag tag--mono">{a.action}</span>
                  <span style={{ fontSize: 13, color: "var(--text-3)" }}>
                    {a.user_name} · {new Date(a.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2>Related tools</h2>
          <div className="tools-grid" style={{ marginTop: 16 }}>
            {related.map((t) => (
              <Link key={t.id} to={`/tools/${t.id}`} className="tool-card">
                <div className="tool-card__name">{t.name}</div>
                <div className="tool-card__desc">{t.description}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
