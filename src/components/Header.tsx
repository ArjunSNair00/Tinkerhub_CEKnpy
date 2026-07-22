import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav-in">
        <a
          className="lockup has-term"
          href="#top"
          aria-label="TinkerHub CE Karunagappally home"
        >
          <svg
            className="mark"
            viewBox="0 0 80 80"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="0" y="0" width="48" height="20" rx="6" />
            <rect x="56" y="0" width="24" height="20" rx="6" />
            <rect x="0" y="30" width="80" height="20" rx="6" />
            <rect x="0" y="60" width="32" height="20" rx="6" />
            <rect x="40" y="60" width="16" height="20" rx="6" />
            <rect x="64" y="60" width="16" height="20" rx="6" />
          </svg>
          <span className="lk-text">
            <span className="lk-brand">
              <b>Tinker</b>
              <span>Hub</span>
            </span>
            <span className="lk-place">CE Karunagappally</span>
          </span>
          <span className="logo-term">
            <span className="p">$</span> git status
            <br />
            On branch <b>main</b>
            <br />
            nothing to commit,
            <br />
            working tree clean
          </span>
        </a>
        <div className="nav-links" id="navLinks">
          <a href="#about">About</a>
          <a href="#space">Space</a>
          <a href="#events">Events</a>
          <a href="#builds">Builds</a>
          <a href="#team">Team</a>
          <a href="#join" className="btn btn--ghost">
            Join us <span className="ar">→</span>
          </a>
        </div>
        <button
          className={`nav-toggle${menuOpen ? " open" : ""}`}
          id="navToggle"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((p) => !p)}
        ></button>
      </div>
    </nav>
  );
}
