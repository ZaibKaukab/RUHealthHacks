import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Desk from "./pages/Desk";
import Lab from "./pages/Lab";
import { RelayMark } from "./components/RelayMark";
import { IconBolt, IconDesk } from "./components/Icons";
import { useDemo } from "./demo/store";
import { clock } from "./lib/format";
import { brand } from "./brand";

function AppShell({ children }: { children: React.ReactNode }) {
  const { dashboard, openDecide } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();
  const isLab = location.pathname.includes("/lab");
  const label =
    (dashboard as { label?: string }).label ??
    dashboard.dataset_id ??
    "Synthetic demo";

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="app-aside">
        <div className="app-aside-top">
          <RelayMark size="nav" href="/" />
        </div>
        <div className="app-workspace">
          <strong>Harbor network</strong>
          Live ops · synthetic demo
        </div>
        <nav className="app-nav" aria-label="Primary">
          <NavLink to="/app" end>
            <IconDesk size={17} />
            {brand.deskLabel}
          </NavLink>
          <NavLink to="/app/lab">
            <IconBolt size={17} />
            {brand.labLabel}
          </NavLink>
        </nav>
        <div className="app-aside-foot">
          <div className="tabular">Now {clock(dashboard.as_of)} ET</div>
          <div>{label}</div>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <h1>{isLab ? brand.labLabel : brand.deskLabel}</h1>
          <div className="app-topbar-actions">
            {!isLab ? (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  navigate("/app");
                  openDecide();
                }}
              >
                Review intervention
              </button>
            ) : null}
          </div>
        </header>
        <main id="main" className="page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/app"
        element={
          <AppShell>
            <Desk />
          </AppShell>
        }
      />
      <Route
        path="/app/lab"
        element={
          <AppShell>
            <Lab />
          </AppShell>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}