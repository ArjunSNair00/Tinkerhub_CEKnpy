export default function TinkerhubText() {
  return (
    <>
      <div className="hero-art" id="heroArt">
        <div className="wordmark-pos">
          <div className="wordmark clip-reveal" id="heroWord">
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(2rem, 7vw, 5.5rem)",
                textAlign: "center",
                lineHeight: 1.1,
                userSelect: "none",
                color: "black",
                // color: "var(--pink)",
                display: "inline-block",
                // padding: "0.15em 0.6em",
                paddingTop: "0.1em",
                paddingBottom: "0.1em",
                paddingLeft: "0.1em",
                paddingRight: "0.1em",
                borderRadius: 0,
                background: "rgba(256,256,256,0.07)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(256,256,256,0.4)",
              }}
            >
              <span style={{ fontWeight: 700, letterSpacing: "-0.03em" }}>
                Tinker
              </span>
              <span style={{ fontWeight: 400, letterSpacing: "-0.02em" }}>
                Hub
              </span>
            </div>
          </div>
        </div>
        {/* Logo */}
        <div
          className="corner-box tl reveal"
          style={{ animationDelay: "0.8s" }}
        >
          <svg
            viewBox="0 0 80 80"
            fill="none"
            aria-hidden="true"
            style={{ width: 22, height: 22 }}
          >
            <rect x="0" y="0" width="48" height="20" rx="6" fill="white" />
            <rect x="56" y="0" width="24" height="20" rx="6" fill="white" />
            <rect x="0" y="30" width="80" height="20" rx="6" fill="white" />
            <rect x="0" y="60" width="32" height="20" rx="6" fill="white" />
            <rect x="40" y="60" width="16" height="20" rx="6" fill="white" />
            <rect x="64" y="60" width="16" height="20" rx="6" fill="white" />
          </svg>
          <span
            className="cb-txt"
            style={{
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1,
              whiteSpace: "nowrap",
              letterSpacing: "normal",
              fontSize: "10px",
              color: "#000",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: "20px",
                letterSpacing: "-0.03em",
                color: "white",
              }}
            >
              Tinker
            </span>
            <span
              style={{
                fontSize: "15px",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "white",
              }}
            >
              Hub
            </span>
            <br />
            <span
              style={{
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "white",
                transform: "translateX(5px)",
                display: "inline-block",
              }}
            >
              CE Karunagappally
            </span>
          </span>
        </div>
        <span
          className="corner-box br reveal"
          style={{
            background: "transparent",
            boxShadow: "0px 0px 0 rgba(0, 0, 0, 0.25)",
            animationDelay: "1s",
          }}
        >
          {/* <span className="corner-box br"> */}
          {/* <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
          </svg> */}
          {/* <svg
            viewBox="0 0 80 80"
            fill="none"
            aria-hidden="true"
            style={{ width: 22, height: 22 }}
          >
            <rect x="0" y="0" width="48" height="20" rx="6" fill="white" />
            <rect x="56" y="0" width="24" height="20" rx="6" fill="white" />
            <rect x="0" y="30" width="80" height="20" rx="6" fill="white" />
            <rect x="0" y="60" width="32" height="20" rx="6" fill="white" />
            <rect x="40" y="60" width="16" height="20" rx="6" fill="white" />
            <rect x="64" y="60" width="16" height="20" rx="6" fill="white" />
          </svg> */}
          <span className="cb-txt">KOLLAM · KL</span>
        </span>
      </div>
    </>
  );
}
