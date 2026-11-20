import { Link } from "react-router-dom";
import "./PublicNav.css";

export function PublicNav() {
  return (
    <header className="public-nav">
      <div className="container public-nav-inner">
        <Link to="/" className="brand" aria-label="DigProg home">
          <span className="brand-mark" aria-hidden>
            D
          </span>
          <span className="brand-name">DigProg</span>
        </Link>
        <nav className="public-links" aria-label="Primary">
          <a href="/#curriculum">Curriculum</a>
          <a href="/#pricing">Pricing</a>
          <Link to="/app/classroom">Lesson demo</Link>
          <a href="/#join" className="btn btn-primary nav-login">
            Join waitlist
          </a>
        </nav>
      </div>
    </header>
  );
}
