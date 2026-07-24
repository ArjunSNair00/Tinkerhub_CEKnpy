export default function Details() {
  return (
    <>
      <svg
        className="hero-bp"
        viewBox="0 0 420 420"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{
          left: "50%",
          top: "50%",
          width: "min(680px, 120%)",
          height: "auto",
          transform: "translate(-50%, -50%)",
        }}
      >
        <path className="tr" d="M95 161 A98 98 0 1 1 95 259" />
        <path className="tr" d="M107 168 A84 84 0 1 1 107 252" />
        <path className="tr" d="M119 175 A70 70 0 1 1 119 245" />
        <polyline className="tr" points="278,210 320,210 340,190 384,190" />
        <polyline className="tr" points="262,150 300,150 318,120 360,120" />
        <polyline className="tr" points="262,270 300,270 318,300 360,300" />
        <polyline className="tr" points="210,116 210,80 240,52 240,24" />
        <polyline className="tr" points="210,304 210,340 240,368 240,396" />
        <polyline className="tr" points="150,120 150,86 120,60" />
        <polyline className="tr" points="150,300 150,334 120,360" />
        <polygon className="pour" points="300,150 318,120 348,138 330,168" />
        <polygon className="pour" points="300,270 318,300 348,282 330,252" />
        <polygon className="pour" points="210,340 240,368 214,388 188,360" />
        <g className="pad">
          <circle cx="384" cy="190" r="3.4" />
          <circle cx="360" cy="120" r="3.4" />
          <circle cx="360" cy="300" r="3.4" />
          <circle cx="240" cy="24" r="3.4" />
          <circle cx="240" cy="396" r="3.4" />
          <circle cx="120" cy="60" r="3.4" />
          <circle cx="120" cy="360" r="3.4" />
        </g>
        <text x="250" y="16">
          x:0240 y:0024
        </text>
        <text x="300" y="312">
          grid · 20px
        </text>
      </svg>
      <svg
        className="riso star"
        style={{ top: "15%", left: "7%", transform: "rotate(8deg)" }}
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
        />
      </svg>
      <svg
        className="riso star"
        style={{
          bottom: "24%",
          right: "9%",
          width: "22px",
          height: "22px",
          color: "var(--pink)",
        }}
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
        />
      </svg>
      {/* kollam map location */}
      <svg
        className="riso pin"
        style={{ top: "25%", right: "11.3%" }}
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 0 C6 0 2 4 2 9 c0 7 10 15 10 15 s10-8 10-15 c0-5-4-9-10-9z"
        />
        <circle cx="12" cy="9" r="3.4" fill="#fff" />
      </svg>
      <svg
        className="riso cur"
        style={{ bottom: "30%", left: "11%" }}
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M3 2 L3 20 L8 15 L11 22 L14 21 L11 14 L18 14 Z"
        />
      </svg>
      <span className="riso coord" style={{ top: "12%", right: "4%" }}>
        9.0546°N, 76.5334°E
      </span>
      <span className="riso coord h" style={{ bottom: "10%", left: "6%" }}>
        {/* layer · hero.v1 */}
        Never Give Up
      </span>
    </>
  );
}
