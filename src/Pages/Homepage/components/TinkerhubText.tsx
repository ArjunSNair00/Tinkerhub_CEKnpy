import { useEffect, useRef } from "react";

function buildDrips(host: HTMLElement) {
  if (host.dataset.built) return;
  host.dataset.built = "1";
  const count = 48;
  let seed = 1337;
  function lrnd() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  }
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const r = lrnd();
    const h =
      r < 0.5 ? 4 + lrnd() * 9 : r < 0.82 ? 12 + lrnd() * 20 : 26 + lrnd() * 44;
    const w = 2.4 + lrnd() * 3.2;
    const left = ((i + 0.5) / count) * 100 + (lrnd() - 0.5) * 1.3;
    const d = document.createElement("i");
    d.style.left = left + "%";
    d.style.width = w + "px";
    d.style.height = h + "px";
    d.style.marginLeft = -w / 2 + "px";
    frag.appendChild(d);
    if (lrnd() < 0.22) {
      const drop = document.createElement("i");
      drop.className = "drop";
      const ds = 2.6 + lrnd() * 3;
      drop.style.left = left + "%";
      drop.style.width = ds + "px";
      drop.style.height = ds + "px";
      drop.style.marginLeft = -ds / 2 + "px";
      drop.style.top = h + 4 + lrnd() * 12 + "px";
      frag.appendChild(drop);
    }
  }
  host.appendChild(frag);
}

export default function TinkerhubText() {
  const dripsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (dripsRef.current) buildDrips(dripsRef.current);
  }, []);

  return (
    <>
      <div className="hero-art" id="heroArt">
        <div className="wordmark-pos">
          <div
            className="wordmark clip-reveal asm"
            data-asm="hammer"
            id="heroWord"
          >
            <svg
              viewBox="0 0 1000 250" /* Increased height from 220 to 250 */
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="TinkerHub"
            >
              <defs>
                {/* Expanded filter region coordinates to prevent the grunge filter from clipping the new top stroke */}
                <filter
                  id="grunge"
                  x="-10%"
                  y="-25%"
                  width="120%"
                  height="160%"
                >
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.012 0.05"
                    numOctaves="3"
                    seed="11"
                    result="n"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="n"
                    scale="6"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>
              <text
                className="wtxt"
                x="500"
                y="195" /* Shifted down from 172 to make space for the top stroke */
                textAnchor="middle"
                textLength="800"
                lengthAdjust="spacingAndGlyphs"
                fontSize="150"
                // filter="url(#grunge)"
                style={{
                  // transform: "translate(10px,10px)",
                  // fontFamily: '"Anton", sans-serif',
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "1000",
                  fill: "var(--pink)",
                  stroke: "black",
                  strokeWidth: "3px",
                  strokeLinejoin: "round",
                  paintOrder: "stroke fill",
                }}
              >
                TINKERHUB
              </text>
            </svg>

            {/* <span className="drips" ref={dripsRef}></span> */}
          </div>
        </div>
        {/* Logo */}
        <div className="corner-box tl reveal" style={{ animationDelay: "0.8s" }}>
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
