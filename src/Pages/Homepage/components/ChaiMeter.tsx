import { useEffect, useRef, useId, type CSSProperties } from "react";

export default function ChaiMeter() {
  const meterRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const glassClipId = `chai-glass-clip-${uid}`;
  const liquidMaskId = `chai-liquid-mask-${uid}`;
  const liquidGradientId = `chai-liquid-gradient-${uid}`;
  const foamGradientId = `chai-foam-gradient-${uid}`;
  const surfaceGlowId = `chai-surface-glow-${uid}`;

  useEffect(() => {
    const el = meterRef.current;
    const pctLabel = pctRef.current;
    if (!el || !pctLabel) return;

    const FILL_TRAVEL = 70;

    let ticking = false;
    let rafId = 0;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    let lastY = window.scrollY;
    let lastTime = performance.now();

    const getDocHeight = () =>
      Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      ) - window.innerHeight;

    let docHeight = getDocHeight();

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        const now = performance.now();

        const pct = docHeight > 0 ? Math.min(100, (y / docHeight) * 100) : 0;

        const dt = Math.max(16, now - lastTime);
        const velocity = (y - lastY) / dt;

        // Scroll velocity drives a subtle liquid slosh.
        const slosh = Math.max(-7, Math.min(7, velocity * 22));

        lastY = y;
        lastTime = now;

        const offset = FILL_TRAVEL * (1 - pct / 100);

        el.classList.toggle("filled", pct > 1.5);
        el.classList.toggle("full", pct >= 98);
        el.classList.toggle("pouring", Math.abs(velocity) > 0.015);

        el.style.setProperty("--offset", `${offset}px`);
        el.style.setProperty("--slosh", `${slosh}deg`);
        el.setAttribute("aria-valuenow", String(Math.round(pct)));

        pctLabel.textContent = `${Math.round(pct)}%`;

        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          el.classList.remove("pouring");
          el.style.setProperty("--slosh", "0deg");
        }, 280);

        ticking = false;
      });
    };

    const onResize = () => {
      docHeight = getDocHeight();
      onScroll();
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(document.documentElement);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    onScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();

      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div
      className="chai-meter"
      ref={meterRef}
      role="progressbar"
      aria-label="Scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      style={{ "--offset": "70px", "--slosh": "0deg" } as CSSProperties}
    >
      <span className="chai-side" aria-hidden="true">
        scroll progress
      </span>

      <div className="pour" aria-hidden="true">
        <span className="stream" />
        <span className="pdot" />
        <span className="pdot d1" />
        <span className="pdot d2" />
      </div>

      <div className="glass" aria-hidden="true">
        <svg className="chai-svg" viewBox="0 0 62 80" fill="none">
          <defs>
            <clipPath id={glassClipId}>
              <path d="M10 6 L52 6 Q55 6 55 9 L52.5 71 Q52 75.5 47.5 75.5 L14.5 75.5 Q10 75.5 9.5 71 L7 9 Q7 6 10 6 Z" />
            </clipPath>

            <mask
              id={liquidMaskId}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="62"
              height="80"
            >
              <rect
                className="chai-mask-rect"
                x="0"
                y="6"
                width="62"
                height="70"
                fill="white"
              />
            </mask>

            <linearGradient
              id={liquidGradientId}
              x1="0"
              y1="6"
              x2="0"
              y2="76"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#f0c89b" />
              <stop offset="14%" stopColor="#dd9f62" />
              <stop offset="42%" stopColor="#bb7137" />
              <stop offset="74%" stopColor="#8a4c22" />
              <stop offset="100%" stopColor="#5a2d12" />
            </linearGradient>

            <radialGradient id={foamGradientId} cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#fff9ef" />
              <stop offset="52%" stopColor="#f6e2c8" />
              <stop offset="100%" stopColor="#d9b289" />
            </radialGradient>

            <linearGradient
              id={surfaceGlowId}
              x1="0"
              y1="8"
              x2="0"
              y2="26"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#fff1dc" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#fff1dc" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g clipPath={`url(#${glassClipId})`}>
            {/* Liquid body */}
            <g mask={`url(#${liquidMaskId})`}>
              <rect
                x="0"
                y="6"
                width="62"
                height="70"
                fill={`url(#${liquidGradientId})`}
              />

              <circle className="bubble b1" cx="20" cy="42" r="1.15" />
              <circle className="bubble b2" cx="34" cy="54" r="0.9" />
              <circle className="bubble b3" cx="43" cy="36" r="0.7" />

              <circle className="speck sp1" cx="25" cy="24" r="0.55" />
              <circle className="speck sp2" cx="37" cy="31" r="0.5" />
              <circle className="speck sp3" cx="30" cy="49" r="0.6" />
            </g>

            {/* Moving surface + foam */}
            <g className="surface-mover">
              <g className="liquid-top">
                <rect
                  className="surface-glow"
                  x="0"
                  y="8"
                  width="62"
                  height="18"
                  fill={`url(#${surfaceGlowId})`}
                />

                <ellipse
                  className="surface"
                  cx="31"
                  cy="8.2"
                  rx="22.5"
                  ry="3.1"
                />

                <g className="foam" fill={`url(#${foamGradientId})`}>
                  <circle cx="15.5" cy="7.7" r="2.1" />
                  <circle cx="21.5" cy="6.7" r="1.6" />
                  <circle cx="31" cy="7.5" r="2.35" />
                  <circle cx="39.5" cy="6.6" r="1.5" />
                  <circle cx="45.5" cy="7.8" r="2" />
                </g>
              </g>
            </g>
          </g>

          {/* Glass */}
          <path
            className="glass-body"
            d="M8 4 L54 4 Q58 4 58 8 L55 72 Q54 78 48 78 L14 78 Q8 78 7 72 L4 8 Q4 4 8 4Z"
          />
          <path
            className="glass-outline"
            d="M8 4 L54 4 Q58 4 58 8 L55 72 Q54 78 48 78 L14 78 Q8 78 7 72 L4 8 Q4 4 8 4Z"
          />
          <path className="glass-shine" d="M12.5 9 C11 24 11 46 13.5 67" />
          <path
            className="glass-shine thin"
            d="M47.5 10 C48.7 22 48.7 36 47.3 52"
          />
        </svg>

        <span className="steam s1" />
        <span className="steam s2" />
        <span className="steam s3" />
      </div>

      <span className="chai-pct" ref={pctRef} aria-hidden="true">
        0%
      </span>
    </div>
  );
}
