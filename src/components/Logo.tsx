export default function Logo() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "stretch",
        gap: "1.5rem",
        zIndex: 10,
        userSelect: "none",
      }}
    >
      {/* TinkerHub Icon */}
      <svg
        width="80"
        height="70"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Top Row */}
        <rect x="0" y="0" width="48" height="20" rx="6" fill="#000000" />
        <rect x="56" y="0" width="24" height="20" rx="6" fill="#000000" />

        {/* Middle Row */}
        <rect x="0" y="30" width="80" height="20" rx="6" fill="#000000" />

        {/* Bottom Row */}
        <rect x="0" y="60" width="32" height="20" rx="6" fill="#000000" />
        <rect x="40" y="60" width="16" height="20" rx="6" fill="#000000" />
        <rect x="64" y="60" width="16" height="20" rx="6" fill="#000000" />
      </svg>

      {/* Brand Text Block */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "2px 0 1px 0",
        }}
      >
        {/* Main Title: TinkerHub */}
        <div style={{ lineHeight: 1 }}>
          <span
            style={{
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              fontSize: "2.75rem",
              fontWeight: 700,
              color: "#000000",
              letterSpacing: "-0.03em",
            }}
          >
            Tinker
          </span>
          <span
            style={{
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              fontSize: "2.75rem",
              fontWeight: 400,
              color: "#000000",
              letterSpacing: "-0.02em",
            }}
          >
            Hub
          </span>
        </div>

        {/* Subtitle / Chapter Name */}
        <span
          style={{
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            fontSize: "1.45rem",
            fontWeight: 400,
            color: "#000000",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            transform: "translateY(0px)" + " " + "translateX(5px)",
          }}
        >
          CE Karunagappally
        </span>
      </div>
    </div>
  );
}
