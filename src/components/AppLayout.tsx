import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthStore, useUiStore } from "@/stores";
import { useLogout } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const NAV = [
  { to: "/browse", label: "Browse tools" },
  { to: "/add", label: "Add tool" },
  { to: "/activity", label: "Daily activity" },
  { to: "/admin", label: "Admin panel", adminOnly: true },
];

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin());
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const logout = useLogout();
  const location = useLocation();

  return (
    <div className="app">
      <div className={"scrim" + (sidebarOpen ? " show" : "")} onClick={() => setSidebarOpen(false)} />
      <nav className={"sidebar" + (sidebarOpen ? " open" : "")}>
        <div className="sidebar__brand">
          <div className="brand__mark" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="brand__text">
            <div className="brand__name">ToolVault</div>
            <div className="brand__sub">AI Tools Directory</div>
          </div>
        </div>
        <div className="nav">
          {NAV.filter((n) => !n.adminOnly || isAdmin).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={"nav__item" + (location.pathname.startsWith(item.to) ? " active" : "")}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="sidebar__foot">
          <div className="user-chip">
            <div className="user-chip__meta">
              <div className="user-chip__name">{user?.name}</div>
              <div className="user-chip__email">{user?.email}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="user-chip__logout"
              onClick={() => logout.mutate()}
              aria-label="Logout"
            >
              <LogOut size={16} />
              <span className="user-chip__logout-text">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="main">
        <header className="topbar">
          <button className="icon-btn topbar__menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            ☰
          </button>
          <div className="page-title">ToolVault</div>
          <div className="topbar__spacer" />
          <Link to="/add">
            <Button size="sm">Add</Button>
          </Link>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
