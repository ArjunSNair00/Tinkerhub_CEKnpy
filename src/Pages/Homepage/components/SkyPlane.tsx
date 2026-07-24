import { useState, useCallback, useEffect, useRef } from "react";

// const SECTIONS = [
//   {
//     emoji: "\uD83C\uDF33",
//     place: "The Tree",
//     section: "community",
//     desc: "Where ideas are born",
//   },
//   {
//     emoji: "\uD83C\uDFE2",
//     place: "TinkerSpace",
//     section: "builds",
//     desc: "Projects on workbenches",
//   },
//   {
//     emoji: "\u2615",
//     place: "Chai Spot",
//     section: "about",
//     desc: "Sit down, hear our story",
//   },
//   {
//     emoji: "\uD83C\uDFA4",
//     place: "Event Stage",
//     section: "events",
//     desc: "Moments that happened",
//   },
//   {
//     emoji: "\uD83D\uDEE0",
//     place: "Hardware Bench",
//     section: "learning",
//     desc: "Skills are built here",
//   },
//   {
//     emoji: "\uD83D\uDEAA",
//     place: "Main Building",
//     section: "history",
//     desc: "Walk through the years",
//   },
// ];
const SECTIONS = [
  {
    emoji: "🏠",
    place: "Home",
    section: "community",
    desc: "Homepage of Tinkerhub CEKnpy",
  },
  {
    emoji: "\uD83C\uDFA4",
    place: "Events",
    section: "events",
    desc: "Moments that happened",
  },
  {
    emoji: "\uD83C\uDF33",
    place: "The Tree",
    section: "community",
    desc: "Where ideas are freely shared",
  },
  // {
  //   emoji: "\uD83C\uDFE2",
  //   place: "TinkerSpace",
  //   section: "builds",
  //   desc: "Projects on workbenches",
  // },
  // {
  //   emoji: "\u2615",
  //   place: "Chai Spot",
  //   section: "about",
  //   desc: "Sit down, hear our story",
  // },

  // {
  //   emoji: "\uD83D\uDEE0",
  //   place: "Hardware Bench",
  //   section: "learning",
  //   desc: "Skills are built here",
  // },
  // {
  //   emoji: "\uD83D\uDEAA",
  //   place: "Main Building",
  //   section: "history",
  //   desc: "Walk through the years",
  // },
  {
    emoji: "\uD83D\uDC65",
    place: "Team",
    section: "team",
    desc: "The people behind TinkerHub CEK",
  },
  {
    emoji: "\uD83D\uDCA1",
    place: "Projects",
    section: "projects",
    desc: "What we've built",
  },
  {
    emoji: "\uD83C\uDFC6",
    place: "Top Makers",
    section: "top-makers",
    desc: "Our finest builders",
  },
  {
    emoji: "\uD83D\uDCE7",
    place: "Contact",
    section: "contact",
    desc: "Get in touch with us",
  },
];
//
// About
// Team
// Events
// Projects
// Top Makers
// Contact
/* ── Rope physics (Verlet integration) ────────────────────────────── */

const ROPE_SEGMENTS = 1;
const ROPE_GRAVITY = 0.3;
const ROPE_DAMPING = 0.985;
const ROPE_ITERATIONS = 8;

interface RopePoint {
  x: number;
  y: number;
  ox: number;
  oy: number;
}

function initRope(
  anchorX: number,
  anchorY: number,
  segLen: number,
): RopePoint[] {
  const pts: RopePoint[] = [];
  for (let i = 0; i <= ROPE_SEGMENTS; i++) {
    pts.push({
      x: anchorX,
      y: anchorY + i * segLen,
      ox: anchorX,
      oy: anchorY + i * segLen,
    });
  }
  return pts;
}

function stepRope(
  pts: RopePoint[],
  anchorX: number,
  anchorY: number,
  segLen: number,
  windX: number,
  windY: number,
) {
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    const vx = (p.x - p.ox) * ROPE_DAMPING;
    const vy = (p.y - p.oy) * ROPE_DAMPING;
    p.ox = p.x;
    p.oy = p.y;
    p.x += vx + windX * (i / pts.length);
    p.y += vy + ROPE_GRAVITY + windY * (i / pts.length);
  }
  pts[0].x = anchorX;
  pts[0].y = anchorY;
  for (let iter = 0; iter < ROPE_ITERATIONS; iter++) {
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      const diff = ((segLen - dist) / dist) * 0.5;
      const ox = dx * diff;
      const oy = dy * diff;
      if (i !== 0) {
        a.x -= ox;
        a.y -= oy;
      }
      b.x += ox;
      b.y += oy;
    }
  }
}

function ropeToPath(pts: RopePoint[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const xc = (pts[i].x + pts[i + 1].x) / 2;
    const yc = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${xc.toFixed(1)} ${yc.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  return d;
}

/* ── Drone SVG ────────────────────────────────────────────────────── */

function DroneSVG() {
  return (
    <svg
      viewBox="0 0 100 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="sky-drone-svg"
      aria-hidden="true"
    >
      <line
        x1="22"
        y1="18"
        x2="8"
        y2="8"
        stroke="#1a140b"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="78"
        y1="18"
        x2="92"
        y2="8"
        stroke="#1a140b"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="22"
        y1="32"
        x2="8"
        y2="42"
        stroke="#1a140b"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="78"
        y1="32"
        x2="92"
        y2="42"
        stroke="#1a140b"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx="8"
        cy="8"
        r="9"
        fill="none"
        stroke="#ff2d78"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <circle
        cx="92"
        cy="8"
        r="9"
        fill="none"
        stroke="#ff2d78"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <circle
        cx="8"
        cy="42"
        r="9"
        fill="none"
        stroke="#ff2d78"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <circle
        cx="92"
        cy="42"
        r="9"
        fill="none"
        stroke="#ff2d78"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <circle cx="8" cy="8" r="2.5" fill="#ff2d78" />
      <circle cx="92" cy="8" r="2.5" fill="#ff2d78" />
      <circle cx="8" cy="42" r="2.5" fill="#ff2d78" />
      <circle cx="92" cy="42" r="2.5" fill="#ff2d78" />
      <rect x="30" y="15" width="40" height="20" rx="5" fill="#1a140b" />
      <rect x="30" y="23" width="40" height="4" rx="2" fill="#c4005a" />
      <rect x="44" y="35" width="12" height="6" rx="2" fill="#7a4a22" />
      <circle cx="50" cy="38" r="2" fill="#f2c84b" />
      <circle cx="22" cy="18" r="2" fill="#ffc400" />
      <circle cx="78" cy="18" r="2" fill="#ffc400" />
      <circle cx="22" cy="32" r="2" fill="#ff2d78" />
      <circle cx="78" cy="32" r="2" fill="#ff2d78" />
    </svg>
  );
}

/* ── Index Banner (reusable) ──────────────────────────────────────── */

function IndexBanner({
  bannerRef,
  onClick,
}: {
  bannerRef: React.RefObject<HTMLDivElement | null>;
  onClick: () => void;
}) {
  return (
    <div
      ref={bannerRef}
      className="sky-drone-banner"
      role="button"
      tabIndex={0}
      aria-label="Open site index"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <span className="sp-banner-text">INDEX</span>
      <span className="sp-banner-icon">&#9776;</span>
    </div>
  );
}

/* ── Component ────────────────────────────────────────────────────── */

export default function SkyPlane() {
  const [indexOpen, setIndexOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Drone refs (fixed, stays on screen)
  const heroWrapRef = useRef<HTMLDivElement>(null);
  const heroDroneRef = useRef<HTMLDivElement>(null);
  const heroRopeRef = useRef<SVGPathElement>(null);
  const heroBannerRef = useRef<HTMLDivElement>(null);

  const heroRopePtsRef = useRef<RopePoint[]>([]);
  const rafRef = useRef<number>(0);
  const scrollRef = useRef(0);

  const toggleIndex = useCallback(() => setIndexOpen((p) => !p), []);
  const closeIndex = useCallback(() => setIndexOpen(false), []);

  // Escape key closes panel
  useEffect(() => {
    if (!indexOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeIndex();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [indexOpen, closeIndex]);

  // Focus first interactive element when panel opens
  useEffect(() => {
    if (!indexOpen || !panelRef.current) return;
    const f = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], [tabindex]:not([tabindex="-1"])',
    );
    if (f.length) f[0].focus();
  }, [indexOpen]);

  // Scroll tracking — uses hero's bottom edge relative to viewport
  useEffect(() => {
    const heroEl = document.querySelector<HTMLElement>(".hero");
    if (!heroEl) return;

    const onScroll = () => {
      const rect = heroEl.getBoundingClientRect();
      // scroll = 0 when hero top is at viewport top
      // scroll = 1 when hero bottom is at viewport top (hero fully scrolled past)
      const progress = -rect.top / rect.height;
      scrollRef.current = Math.max(0, Math.min(1, progress));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Physics + render loop
  useEffect(() => {
    const hw = heroWrapRef.current;
    const hd = heroDroneRef.current;
    const hr = heroRopeRef.current;
    const hb = heroBannerRef.current;
    if (!hw || !hd || !hr || !hb) return;

    // Narrowed aliases for closures
    const _hw = hw;
    const _hd = hd;
    const _hr = hr;
    const _hb = hb;

    const segLen = 12;
    heroRopePtsRef.current = initRope(0, 0, segLen);

    let mfX = 0;
    let mfY = 0;

    // Mouse interaction pushes rope
    const onMouseMove = (e: MouseEvent) => {
      if (_hb.contains(e.target as Node)) return;
      const rect = _hw.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const pts = heroRopePtsRef.current;
      for (let i = 1; i < pts.length; i++) {
        const dx = mx - pts[i].x;
        const dy = my - pts[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 50) {
          const force = (1 - dist / 50) * 5;
          mfX += (dx / dist) * force * 0.15;
          mfY += (dy / dist) * force * 0.08;
        }
      }
    };
    _hw.addEventListener("mousemove", onMouseMove);

    function tick() {
      rafRef.current = requestAnimationFrame(tick);

      const w = _hw.clientWidth;
      const h = _hw.clientHeight;
      const scroll = scrollRef.current;

      // ── Hero-layer drone position ──
      // At scroll=0: drone at center-top, just above fold
      // At scroll=1: drone at left side, descended
      const startX = w * 0.5;
      const startY = 20;
      const endX = w * 0.08;
      const endY = h * 0.3;

      // Cubic ease-out for X, quadratic for Y
      const easeX = 1 - Math.pow(1 - scroll, 3);
      const easeY = 1 - Math.pow(1 - scroll, 2);

      const droneX = startX + (endX - startX) * easeX;
      const droneY = startY + (endY - startY) * easeY;

      // Step hero rope
      const heroPts = heroRopePtsRef.current;
      stepRope(heroPts, droneX, droneY, segLen, mfX, mfY);
      mfX *= 0.85;
      mfY *= 0.85;

      const heroPath = ropeToPath(heroPts);
      const heroLast = heroPts[heroPts.length - 1];

      // Position hero layer
      _hd.style.left = droneX + "px";
      _hd.style.top = droneY + "px";
      _hr.setAttribute("d", heroPath);
      _hb.style.left = heroLast.x + "px";
      _hb.style.top = heroLast.y + "px";
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      _hw.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <>
      {/* ── Drone (fixed, stays on screen) ──────────────────────── */}
      <div className="sky-drone-wrap" ref={heroWrapRef}>
        <div className="sky-drone-body" ref={heroDroneRef} aria-hidden="true">
          <DroneSVG />
        </div>
        <svg className="sky-rope-svg">
          <path ref={heroRopeRef} className="sky-rope-path" d="" />
        </svg>
        <IndexBanner bannerRef={heroBannerRef} onClick={toggleIndex} />
      </div>

      {/* ── Index Panel ─────────────────────────────────────────── */}
      {indexOpen && (
        <div className="sp-overlay" onClick={closeIndex}>
          <div
            ref={panelRef}
            className="sp-panel"
            role="dialog"
            aria-label="Site index"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sp-panel-head">
              <span className="sp-panel-title">INDEX</span>
              <span className="sp-panel-sub">Navigate the campus</span>
              <button
                className="sp-close"
                onClick={closeIndex}
                aria-label="Close index"
              >
                &#10005;
              </button>
            </div>
            <div className="sp-sections">
              {SECTIONS.map((s) => (
                <a
                  key={s.section}
                  href={`#${s.section}`}
                  className="sp-section-row"
                  onClick={closeIndex}
                >
                  <span className="sp-sec-emoji">{s.emoji}</span>
                  <div className="sp-sec-info">
                    <span className="sp-sec-place">{s.place}</span>
                    <span className="sp-sec-desc">{s.desc}</span>
                  </div>
                  <span className="sp-sec-arrow">&rarr;</span>
                </a>
              ))}
            </div>
            <div className="sp-panel-foot">
              <span className="sp-foot-label">TinkerHub CEK</span>
              <span className="sp-foot-dot">&bull;</span>
              <span className="sp-foot-label">Est. 1999</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
