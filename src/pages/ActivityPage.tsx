import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useActivities } from "@/hooks/use-api";
import { useAdminUsers } from "@/hooks/use-api";
import { useAuthStore } from "@/stores";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";

export default function ActivityPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin());
  const [page, setPage] = useState(1);
  const [userFilter, setUserFilter] = useState(isAdmin ? "" : user?.id ?? "");
  const [actionFilter, setActionFilter] = useState("");

  const { data, isLoading, isError, error } = useActivities({
    page,
    limit: 20,
    user_id: userFilter || undefined,
  });
  const { data: usersData } = useAdminUsers({ page: 1, search: undefined });

  const filteredItems = useMemo(() => {
    const items = data?.items ?? [];
    if (!actionFilter) return items;
    return items.filter((item) => item.action === actionFilter);
  }, [actionFilter, data?.items]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, typeof filteredItems> = {};
    filteredItems.forEach((item) => {
      const dateKey = item.created_at.slice(0, 10);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    });
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filteredItems]);

  function formatGroupDate(dateKey: string) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const todayKey = today.toISOString().slice(0, 10);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);
    const dt = new Date(`${dateKey}T00:00:00`);
    if (dateKey === todayKey) {
      return `Today · ${dt.toLocaleDateString([], { month: "long", day: "numeric" })}`;
    }
    if (dateKey === yesterdayKey) {
      return `Yesterday · ${dt.toLocaleDateString([], { month: "long", day: "numeric" })}`;
    }
    return dt.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  }

  return (
    <div className="content content--narrow">
      <h1 className="page-header__title" style={{ marginBottom: 8 }}>Daily activity log</h1>
      <p style={{ color: "var(--text-3)", marginBottom: 20 }}>
        Audit every contribution to the directory, grouped by day.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {isAdmin && (
          <select
            className="select"
            value={userFilter}
            onChange={(e) => {
              setUserFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All members</option>
            {(usersData?.items ?? []).map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        )}
        <select
          className="select"
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All actions</option>
          <option value="created">Created</option>
          <option value="updated">Updated</option>
          <option value="deleted">Deleted</option>
        </select>
        <div style={{ flex: 1 }} />
        <span className="result-count" style={{ alignSelf: "center" }}>
          {filteredItems.length} events
        </span>
      </div>

      {isLoading && (
        <div className="card">
          <LoadingSpinner />
        </div>
      )}
      {isError && <div className="empty card">{(error as Error).message}</div>}

      {!isLoading && filteredItems.length === 0 && (
        <div className="empty card">No activity yet.</div>
      )}

      {groupedByDate.map(([dateKey, items]) => (
        <div key={dateKey} className="day-group fade-in">
          <div className="day-head">
            <span className="day-head__date">{formatGroupDate(dateKey)}</span>
            <span className="day-head__line" />
            <span className="day-head__count">
              {items.length} {items.length === 1 ? "event" : "events"}
            </span>
          </div>
          {items.map((a) => (
            <div key={a.id} className="activity-row">
              <span className="activity-time">
                {new Date(a.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <div style={{ flex: 1 }}>
                <Link to={`/tools/${a.tool_id}`} className="link" style={{ fontWeight: 600 }}>
                  {a.tool_name}
                </Link>
                <div style={{ fontSize: 13, color: "var(--text-3)" }}>
                  {a.user_name} ·{" "}
                  <span className={`badge ${a.action === "created" ? "badge--green" : "badge--amber"}`}>
                    {a.action}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {data && (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
