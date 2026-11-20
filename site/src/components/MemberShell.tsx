import { NavLink, Outlet } from "react-router-dom";
import { DigProgMark } from "./DigProgMark";
import "./MemberShell.css";

const links = [
  { to: "/app", end: true, label: "Dashboard" },
  { to: "/app/learn", label: "Learn" },
  { to: "/app/classroom", label: "L01 demo" },
  { to: "/app/tools", label: "Tools" },
  { to: "/app/community", label: "Community" },
  { to: "/app/live", label: "Live" },
  { to: "/app/profile", label: "Profile" },
];

export function MemberShell() {
  return (
    <div className="member-shell">
      <aside className="member-side">
        <div className="member-brand">
          <DigProgMark size={32} />
          <div>
            <strong>DigProg</strong>
            <p>Member</p>
          </div>
        </div>
        <nav className="member-nav" aria-label="Member">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="member-plan-chip">
          <span>Plan</span>
          <strong>Pro · sample</strong>
        </div>
      </aside>
      <div className="member-main">
        <header className="member-top">
          <div>
            <p className="member-hello">DigProg member area</p>
            <h1>Learn · practice · ship</h1>
          </div>
          <div className="member-top-meta">
            <span className="streak">6-day streak</span>
            <NavLink to="/" className="btn btn-ghost-light">
              Exit demo
            </NavLink>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
