import { Link } from "react-router-dom";
import { DigProgMark } from "./DigProgMark";
import "./PublicNav.css";

export function PublicNav() {
  return (
    <header className="public-nav digprog-nav">
      <div className="shell public-nav-inner">
        <Link to="/" className="brand" aria-label="DigProg home">
          <DigProgMark size={34} />
          <span className="brand-name">DigProg</span>
        </Link>
        <nav className="public-links" aria-label="Primary">
          <a href="/#curriculum">Curriculum</a>
          <a href="/#pricing">Pricing</a>
          <Link to="/app/learn">Course</Link>
          <a href="mailto:hello@digprog.app">hello@digprog.app</a>
          <a href="/#join" className="btn btn-primary nav-login">
            Join waitlist
          </a>
        </nav>
      </div>
    </header>
  );
}
