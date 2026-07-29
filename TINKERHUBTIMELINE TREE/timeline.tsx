import {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  type FormEvent,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./timeline.css";

/* ===== TREE STYLE SWITCHES =====
   SHOW_ROOTS  — the root cluster that spreads across the top edge
   SHOW_LEAVES — all foliage (sprouts at card junctions, trunk leaves, root tips)
   Both are off for a clean trunk + branches + cards look. Flip to true to restore. */
const SHOW_ROOTS = false;
const SHOW_LEAVES = false;

/* ===== DATA ===== */
type Milestone = {
  id: string;
  year: number;
  title: string;
  category: "FOUNDING" | "CAMPUS" | "PROGRAMS" | "SPACES";
  badgeBg: string;
  shortDesc: string;
  fullDesc: string;
  impact: string[];
  likes: number;
  image?: string;
};

const defaultMilestones: Milestone[] = [
  {
    id: "m1",
    year: 2021,
    title: "Chapter Establishment at CE Karunagappally",
    category: "FOUNDING",
    badgeBg: "yellow",
    shortDesc:
      "TinkerHub CEKNPY chapter was established at College of Engineering Karunagappally under the TinkerHub Foundation ecosystem.",
    fullDesc:
      "A group of passionate students at CE Karunagappally came together to launch the TinkerHub campus chapter, aiming to foster a self-learning and peer-learning culture. The chapter was officially onboarded into the TinkerHub Foundation network, becoming part of Kerala's largest student-led tech community.",
    impact: [
      "First TinkerHub chapter in Kollam district",
      "Initial cohort of 30+ enthusiastic student makers",
      "Established peer-learning pods as core methodology",
    ],
    likes: 156,
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "m2",
    year: 2022,
    title: "Foundational Bootcamps & Peer Learning",
    category: "PROGRAMS",
    badgeBg: "blue",
    shortDesc:
      "Kicked off beginner-friendly bootcamps covering Git/GitHub, Linux basics, Python, and web fundamentals.",
    fullDesc:
      "The chapter's early focus centered on demystifying core tech tools through hands-on bootcamps. Senior students led peer-learning sessions to help beginners get comfortable with version control, the Linux command line, Python programming, and basic web development — building a strong foundation for the community.",
    impact: [
      "Ran 10+ foundational bootcamps in the first year",
      "80+ students introduced to Git & open-source workflows",
      "Established weekly peer-learning pod sessions",
    ],
    likes: 112,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "m3",
    year: 2023,
    title: "Cross-Community Collaboration",
    category: "CAMPUS",
    badgeBg: "green",
    shortDesc:
      "Collaborated with FOSS Club, GDSC, and IEDC CEKNPY to co-host hackathons and tech conferences.",
    fullDesc:
      "Deep alignment with other campus technical bodies became a hallmark of the chapter. By co-hosting events with FOSS Club CEKNPY, Google Developer Student Clubs, and IEDC, TinkerHub CEKNPY amplified its reach and brought diverse perspectives to the campus tech ecosystem.",
    impact: [
      "Co-hosted 8+ cross-community events and hackathons",
      "500+ total participant reach across collaborative events",
      "Strong integration with FOSS Club, GDSC & IEDC",
    ],
    likes: 198,
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "m4",
    year: 2023,
    title: "Women in Tech — Tink-Her-Hack Participation",
    category: "PROGRAMS",
    badgeBg: "purple",
    shortDesc:
      "Active participation in TinkerHub's statewide Tink-Her-Hack program, fostering women developers on campus.",
    fullDesc:
      "TinkerHub CEKNPY championed gender diversity by participating in Tink-Her-Hack, TinkerHub's flagship women-in-tech initiative. The chapter facilitated dedicated hackathons, mentorship circles, and skill-building workshops specifically designed to encourage and empower women developers on campus.",
    impact: [
      "40+ female students participated in dedicated hackathons",
      "Established mentorship circles for women in tech",
      "Increased female participation in tech events by 60%",
    ],
    likes: 267,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "m5",
    year: 2024,
    title: "Open Source & Campus Coding Challenges",
    category: "PROGRAMS",
    badgeBg: "yellow",
    shortDesc:
      "Launched campus-wide coding challenges and ramped up open-source contributions across GitHub.",
    fullDesc:
      "With a growing community of motivated developers, the chapter organized campus-wide coding challenges and hackathons. Students were encouraged to contribute to open-source projects during Hacktoberfest and beyond, with senior members mentoring newcomers through their first pull requests.",
    impact: [
      "200+ open-source contributions during Hacktoberfest",
      "Organized 5 campus-wide coding challenges",
      "15+ student-led open-source projects initiated",
    ],
    likes: 234,
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "m6",
    year: 2025,
    title: "Campus In Build & Builder Culture",
    category: "SPACES",
    badgeBg: "pink",
    shortDesc:
      "Launched the 'Campus In Build' cohort and builder-centric talk series to shift toward project-first learning.",
    fullDesc:
      "The chapter pivoted toward a builder-first mindset with the launch of 'Campus In Build' — a cohort-based program encouraging students to ship real-world software, tools, and experimental web apps. The builder talk series 'Building Makes Me Happy!' featured student builders sharing their project journeys.",
    impact: [
      "50+ students participated in the first Campus In Build cohort",
      "15+ real-world projects shipped during the program",
      "Builder talk series attracted 200+ attendees per session",
    ],
    likes: 321,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "m7",
    year: 2025,
    title: "120+ Events & 90+ Community Projects",
    category: "CAMPUS",
    badgeBg: "green",
    shortDesc:
      "Crossed 120 hosted events and logged 90+ student-led hardware, web, mobile, and AI projects.",
    fullDesc:
      "TinkerHub CEKNPY reached major milestones: over 120 events including hands-on bootcamps, hackathons, and peer-to-peer tech talks, and 90+ student-led projects across web development, mobile apps, AI/ML, hardware, and UI/UX design logged by the community.",
    impact: [
      "120+ total events hosted since inception",
      "90+ student-led projects documented",
      "370+ active makers in the community",
    ],
    likes: 456,
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "m8",
    year: 2026,
    title: "Campus Credibility Platform",
    category: "SPACES",
    badgeBg: "orange",
    shortDesc:
      "Internal development of a campus portal to showcase student portfolios and project track records to recruiters.",
    fullDesc:
      "To bridge the gap between student builders and external opportunities, the chapter initiated development of a dedicated campus ecosystem platform. This portal showcases individual student portfolios, project histories, and contribution track records — making it easier for recruiters and communities to discover talent from CEKNPY.",
    impact: [
      "Built a centralized student portfolio showcase platform",
      "Integrated project logging and contribution tracking",
      "Direct pipeline for recruiters to discover campus talent",
    ],
    likes: 189,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "m9",
    year: 2026,
    title: "Notable Student Projects Showcase",
    category: "PROGRAMS",
    badgeBg: "blue",
    shortDesc:
      "Students built remarkable projects — Monk Mode, AospEnhanced, CampusZone, Scholar Roof, and more.",
    fullDesc:
      "The community's learn-by-doing ethos produced an impressive range of student projects: 'Monk Mode' (React Native mindfulness app), 'CampusZone' (Flutter campus utility), 'Scholar Roof' (scholarship aggregation platform), 'AospEnhanced' (custom Android ROM optimizations), along with various ML pose-correction tools, browser extensions, and experimental UI prototypes.",
    impact: [
      "Projects span Web, Mobile, AI/ML, and Systems domains",
      "Multiple projects showcased at state-level tech fests",
      "Open-source tools used by students across campuses",
    ],
    likes: 278,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "m10",
    year: 2026,
    title: "Building the Future — Vision 2027",
    category: "FOUNDING",
    badgeBg: "yellow",
    shortDesc:
      "Continuing to expand the builder movement with new initiatives, industry connects, and peer-driven learning.",
    fullDesc:
      "With a strong foundation of 370+ active makers, 120+ events, and 90+ projects, TinkerHub CEKNPY looks ahead to deepening industry partnerships, launching advanced skill tracks in AI/ML and DevOps, and expanding the campus credibility platform to serve as a launchpad for student careers in tech.",
    impact: [
      "370+ active tinkerers and growing",
      "Planned expansion of AI/ML and DevOps bootcamps",
      "Strengthening industry partnerships for student placements",
    ],
    likes: 145,
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
  },
];

/* ===== CATEGORY COLOR MAP ===== */
const categoryColors: Record<string, string> = {
  FOUNDING: "orange",
  CAMPUS: "green",
  PROGRAMS: "blue",
  SPACES: "pink",
};

/* ===== THEMES ===== */
const themes = [
  { bg: "#FFFBF0", name: "Default Warm" },
  { bg: "#E3F2FD", name: "Cyber Blue" },
  { bg: "#F3E5F5", name: "Neon Purple" },
  { bg: "#E8F5E9", name: "Mint Fresh" },
];

/* ===== SVG TREE HELPERS ===== */
const SVG_NS = "http://www.w3.org/2000/svg";
type Pt = { x: number; y: number };

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

/** Catmull-Rom → cubic bezier: a smooth curve passing exactly through every point. */
function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Leaf pointing +x, base at origin (so it scales/rotates from its stem). */
const LEAF_D = "M 0 0 Q 6 -5.5 14 0 Q 6 5.5 0 0 Z";

type TreeParts = {
  longPaths: SVGPathElement[]; // trunk + veins
  roots: SVGPathElement[];
  rootLeaves: SVGPathElement[];
  branches: SVGPathElement[];
  sprouts: SVGPathElement[][]; // leaf pair at each card junction
  deco: SVGPathElement[][]; // leaves along trunk segments
};

/**
 * Measures real row/card positions and draws the upside-down tree in
 * pixel-accurate coordinates so branches stay welded to their cards.
 * Trunk hangs from the top edge, weaves down through every node, and a
 * branch reaches out to each card.
 */
function buildTree(
  svg: SVGSVGElement,
  container: HTMLElement,
): TreeParts | null {
  const rows = Array.from(container.querySelectorAll<HTMLElement>(".tl-row"));
  const W = container.offsetWidth;
  const H = container.scrollHeight;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("width", String(W));
  svg.setAttribute("height", String(H));
  svg.style.height = `${H}px`;
  svg.replaceChildren();
  if (!rows.length) return null;

  const cRect = container.getBoundingClientRect();
  const desktop = window.matchMedia("(min-width: 768px)").matches;

  const pts = rows.map((row) => {
    const card = row.querySelector<HTMLElement>(".tl-card")!;
    const node = row.querySelector<HTMLElement>(".tl-node");
    const cr = card.getBoundingClientRect();
    const p = {
      cardLeft: cr.left - cRect.left,
      cardRight: cr.right - cRect.left,
      cardTop: cr.top - cRect.top,
      cardH: cr.height,
      nx: 20, // mobile trunk x (aligns with .tl-mobile-dot centre)
      ny: cr.top - cRect.top + 32,
    };
    if (desktop && node) {
      const nr = node.getBoundingClientRect();
      p.nx = nr.left + nr.width / 2 - cRect.left;
      p.ny = nr.top + nr.height / 2 - cRect.top;
    }
    return p;
  });

  /* ---- Spine: hangs from the top edge, weaves through every node, tapers off ---- */
  const first = pts[0];
  const last = pts[pts.length - 1];
  // To start the trunk at the first node instead of the top edge, use:
  //   { x: first.nx, y: Math.max(0, first.ny - 46) }
  const spine: Pt[] = [{ x: first.nx, y: 0 }];
  pts.forEach((p, i) => {
    spine.push({ x: p.nx, y: p.ny });
    if (i < pts.length - 1) {
      spine.push({
        x: p.nx + (i % 2 === 0 ? 1 : -1) * (desktop ? 16 : 5),
        y: (p.ny + pts[i + 1].ny) / 2,
      });
    }
  });
  spine.push({
    x: last.nx + (desktop ? 12 : 4),
    y: Math.min(H - 4, last.ny + 72),
  });

  /* ---- Layers (paint order: roots → veins → trunk → branches → leaves) ---- */
  const gRoots = svgEl("g", {});
  const gVines = svgEl("g", {});
  const gTrunk = svgEl("g", {});
  const gBranch = svgEl("g", {});
  const gLeaf = svgEl("g", {});
  svg.append(gRoots, gVines, gTrunk, gBranch, gLeaf);

  const longPaths: SVGPathElement[] = [];

  const trunk = svgEl("path", { d: smoothPath(spine), class: "tl-gen-trunk" });
  gTrunk.appendChild(trunk);
  longPaths.push(trunk);

  // Two thinner veins hugging the trunk, organically offset
  [
    [7, 1.3],
    [9, 4.1],
  ].forEach(([amp, seed]) => {
    const wob = spine.map((p, i) => ({
      x: p.x + Math.sin(i * 2.7 + seed) * amp,
      y: p.y,
    }));
    const v = svgEl("path", { d: smoothPath(wob), class: "tl-gen-vine" });
    gVines.appendChild(v);
    longPaths.push(v);
  });

  /* ---- Roots gripping the top edge (optional) ---- */
  const roots: SVGPathElement[] = [];
  const rootLeaves: SVGPathElement[] = [];
  if (SHOW_ROOTS) {
    const sx = spine[0].x;
    const rootDefs = [
      { s: -1, reach: 0.34, drop: 34, w: 5 },
      { s: 1, reach: 0.38, drop: 28, w: 5 },
      { s: -1, reach: 0.19, drop: 52, w: 3.5 },
      { s: 1, reach: 0.22, drop: 48, w: 3.5 },
      { s: -1, reach: 0.47, drop: 14, w: 4 },
      { s: 1, reach: 0.5, drop: 12, w: 4 },
    ];
    rootDefs.forEach((r) => {
      const endX = Math.max(10, Math.min(W - 10, sx + r.s * r.reach * W));
      const d = `M ${sx} 2 Q ${sx + r.s * Math.abs(endX - sx) * 0.55} ${r.drop * 0.35} ${endX} ${r.drop}`;
      const p = svgEl("path", {
        d,
        class: "tl-gen-root",
        "stroke-width": r.w,
      });
      gRoots.appendChild(p);
      roots.push(p);
      if (SHOW_LEAVES) {
        const wrap = svgEl("g", {
          transform: `translate(${endX} ${r.drop}) rotate(${r.s > 0 ? 24 : 156}) scale(0.9)`,
        });
        const lf = svgEl("path", {
          d: LEAF_D,
          class: "tl-gen-leaf tl-gen-deco",
        });
        wrap.appendChild(lf);
        gLeaf.appendChild(wrap);
        rootLeaves.push(lf);
      }
    });
  }

  /* ---- Branches → cards, with an optional sprout leaf pair at each junction ---- */
  const branches: SVGPathElement[] = [];
  const sprouts: SVGPathElement[][] = [];
  pts.forEach((p, i) => {
    const dir = desktop ? (i % 2 === 0 ? -1 : 1) : 1; // even rows: card left
    const edgeX = dir === -1 ? p.cardRight : p.cardLeft;
    const attachY = desktop ? p.cardTop + Math.max(30, p.cardH * 0.32) : p.ny;
    const d = desktop
      ? `M ${p.nx} ${p.ny} C ${p.nx + dir * 44} ${p.ny - 6}, ${edgeX - dir * 58} ${attachY + 6}, ${edgeX - dir * 2} ${attachY}`
      : `M ${p.nx} ${p.ny} C ${p.nx + 10} ${p.ny}, ${edgeX - 14} ${attachY}, ${edgeX - 4} ${attachY}`;
    const br = svgEl("path", { d, class: "tl-gen-branch" });
    gBranch.appendChild(br);
    branches.push(br);

    if (SHOW_LEAVES) {
      const sprX = edgeX - dir * 2; // just outside the card edge
      const base = dir === 1 ? 180 : 0; // leaves point back toward the trunk
      const mk = (ang: number, s: number) => {
        const wrap = svgEl("g", {
          transform: `translate(${sprX} ${attachY}) rotate(${ang}) scale(${s})`,
        });
        const lf = svgEl("path", {
          d: LEAF_D,
          class: "tl-gen-leaf tl-gen-sprout",
        });
        wrap.appendChild(lf);
        gLeaf.appendChild(wrap);
        return lf;
      };
      sprouts.push([mk(base - 36, 1.2), mk(base + 28, 0.9)]);
    } else {
      sprouts.push([]);
    }
  });

  /* ---- Optional decorative foliage along the trunk between nodes ---- */
  const deco: SVGPathElement[][] = pts.slice(0, -1).map((p, i) => {
    if (!SHOW_LEAVES) return [];
    const next = pts[i + 1];
    const side = i % 2 === 0 ? 1 : -1;
    return [0.36, 0.7].map((t, j) => {
      const x = p.nx + side * (j ? -1 : 1) * (desktop ? 13 : 7);
      const y = p.ny + (next.ny - p.ny) * t;
      const ang =
        (j ? 180 : 0) + side * (j ? -1 : 1) * 42 + (Math.random() * 16 - 8);
      const wrap = svgEl("g", {
        transform: `translate(${x} ${y}) rotate(${ang}) scale(${desktop ? 1 : 0.8})`,
      });
      const lf = svgEl("path", { d: LEAF_D, class: "tl-gen-leaf tl-gen-deco" });
      wrap.appendChild(lf);
      gLeaf.appendChild(wrap);
      return lf;
    });
  });

  return { longPaths, roots, rootLeaves, branches, sprouts, deco };
}

/* ===== COMPONENT ===== */
export default function Timeline() {
  const [milestones, setMilestones] = useState<Milestone[]>(defaultMilestones);
  const [currentFilter, setCurrentFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState<"timeline" | "grid">(
    "timeline",
  );
  const [themeIdx, setThemeIdx] = useState(0);
  const [detailItem, setDetailItem] = useState<Milestone | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const treeSvgRef = useRef<SVGSVGElement>(null);

  /* ---- Derived: filtered list ---- */
  const filtered = milestones.filter((item) => {
    const matchesCategory =
      currentFilter === "ALL" || item.category === currentFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      item.title.toLowerCase().includes(query) ||
      item.shortDesc.toLowerCase().includes(query) ||
      item.year.toString().includes(query) ||
      item.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  const filteredKey = filtered.map((m) => m.id).join("|");

  /* ---- One-time header entrance ---- */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tl-header-box",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
      );
      gsap.fromTo(
        ".tl-controls",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.12, ease: "power3.out" },
      );
      gsap.fromTo(
        ".tl-stat-card",
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.07,
          delay: 0.2,
          ease: "power2.out",
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* ---- Tree geometry + scroll animations (rebuilds on filter/view/resize) ---- */
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const container = timelineContainerRef.current;
    const svg = treeSvgRef.current;
    if (!container || !svg) return;

    const ctx = gsap.context(() => {});
    let raf = 0;

    const build = () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());

      const isTimeline = currentView === "timeline" && filtered.length > 0;

      if (isTimeline) {
        const parts = buildTree(svg, container);
        if (parts) {
          ctx.add(() => {
            const desktop = window.matchMedia("(min-width: 768px)").matches;

            /* Trunk + veins grow continuously down the whole scroll */
            parts.longPaths.forEach((p) => {
              const len = p.getTotalLength() + 2;
              gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
            });
            gsap.to(parts.longPaths, {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: container,
                start: "top 82%",
                end: "bottom 76%",
                scrub: 1.1,
              },
            });

            /* Roots take hold as the section arrives (only if enabled) */
            if (parts.roots.length) {
              parts.roots.forEach((p) => {
                const len = p.getTotalLength() + 2;
                gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
              });
              gsap.to(parts.roots, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: container,
                  start: "top 90%",
                  end: "top 42%",
                  scrub: 0.7,
                },
              });
            }
            if (parts.rootLeaves.length) {
              gsap.fromTo(
                parts.rootLeaves,
                { scale: 0, opacity: 0 },
                {
                  scale: 1,
                  opacity: 0.85,
                  transformOrigin: "left center",
                  ease: "back.out(2.5)",
                  stagger: 0.05,
                  scrollTrigger: {
                    trigger: container,
                    start: "top 74%",
                    end: "top 34%",
                    scrub: 0.7,
                  },
                },
              );
            }

            /* Per row: bud pops → branch draws → (sprout) → card unfurls */
            const rows = container.querySelectorAll<HTMLElement>(".tl-row");
            rows.forEach((row, i) => {
              const branch = parts.branches[i];
              const card = row.querySelector<HTMLElement>(".tl-card");
              const node = row.querySelector<HTMLElement>(".tl-node");
              if (!branch || !card) return;

              const len = branch.getTotalLength() + 2;
              gsap.set(branch, { strokeDasharray: len, strokeDashoffset: len });

              const hasSprout = parts.sprouts[i].length > 0;
              const hasDeco = (parts.deco[i]?.length ?? 0) > 0;
              if (hasSprout) {
                gsap.set(parts.sprouts[i], {
                  scale: 0,
                  opacity: 0,
                  transformOrigin: "left center",
                });
              }
              if (hasDeco) {
                gsap.set(parts.deco[i], {
                  scale: 0,
                  opacity: 0,
                  transformOrigin: "left center",
                });
              }

              const dir = desktop ? (i % 2 === 0 ? -1 : 1) : 1;
              const origin = desktop
                ? i % 2 === 0
                  ? "100% 50%"
                  : "0% 50%"
                : "0% 32px";

              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger: row,
                  start: "top 88%",
                  end: "top 38%",
                  scrub: 1,
                },
              });
              tl.to(
                branch,
                { strokeDashoffset: 0, ease: "none", duration: 0.45 },
                0,
              );
              if (node) {
                tl.fromTo(
                  node,
                  { scale: 0, opacity: 0 },
                  { scale: 1, opacity: 1, ease: "back.out(4)", duration: 0.2 },
                  0.02,
                );
              }
              if (hasDeco) {
                tl.to(
                  parts.deco[i],
                  {
                    scale: 1,
                    opacity: 0.8,
                    transformOrigin: "left center",
                    ease: "back.out(2.5)",
                    duration: 0.24,
                    stagger: 0.05,
                  },
                  0.18,
                );
              }
              if (hasSprout) {
                tl.to(
                  parts.sprouts[i],
                  {
                    scale: 1,
                    opacity: 0.9,
                    transformOrigin: "left center",
                    ease: "back.out(3)",
                    duration: 0.28,
                    stagger: 0.06,
                  },
                  0.3,
                );
              }
              tl.fromTo(
                card,
                {
                  opacity: 0,
                  scale: 0.3,
                  rotate: -dir * 14,
                  x: -dir * 16,
                  y: 20,
                },
                {
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  x: 0,
                  y: 0,
                  transformOrigin: origin,
                  ease: "back.out(1.6)",
                  duration: 0.55,
                },
                0.4,
              );
            });

            /* Ambient breeze on foliage (only if leaves exist) */
            if (SHOW_LEAVES) {
              svg
                .querySelectorAll<SVGPathElement>(".tl-gen-leaf")
                .forEach((lf) => {
                  gsap.to(lf, {
                    rotation: "random(-7, 7)",
                    duration: "random(2.4, 4.2)",
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: "random(0.2, 1.4)",
                    transformOrigin: "left center",
                  });
                });
            }
          });
        }
      } else {
        svg.replaceChildren();
        ctx.add(() => {
          container
            .querySelectorAll<HTMLElement>(".tl-grid-card")
            .forEach((gc) => {
              gsap.fromTo(
                gc,
                { opacity: 0, y: 44, scale: 0.9, rotate: -1.5 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotate: 0,
                  duration: 0.55,
                  ease: "back.out(1.5)",
                  scrollTrigger: {
                    trigger: gc,
                    start: "top 92%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            });
        });
      }
      ScrollTrigger.refresh();
    };

    build();

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(build);
    });
    ro.observe(container);

    let alive = true;
    document.fonts?.ready?.then(() => {
      if (alive) build(); // card heights shift when webfonts land
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredKey, currentView]);

  /* ---- Handlers ---- */
  const handleLike = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, likes: m.likes + 1 } : m)),
    );
    if (detailItem?.id === id) {
      setDetailItem((prev) =>
        prev ? { ...prev, likes: prev.likes + 1 } : prev,
      );
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCurrentFilter("ALL");
  };

  const handleAddMemory = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const year = parseInt(data.get("year") as string, 10);
    const category = data.get("category") as Milestone["category"];
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const impact = data.get("impact") as string;
    const newItem: Milestone = {
      id: "m_" + Date.now(),
      year,
      title,
      category,
      badgeBg: categoryColors[category] || "yellow",
      shortDesc: description,
      fullDesc: description,
      impact: impact ? [impact] : ["Submitted by community member"],
      likes: 1,
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    };
    setMilestones((prev) => {
      const updated = [newItem, ...prev];
      updated.sort((a, b) => a.year - b.year);
      return updated;
    });
    form.reset();
    setShowAddModal(false);
  };

  /* ---- Render helpers ---- */
  const renderTimelineCard = (item: Milestone, index: number) => {
    const isEven = index % 2 === 0;
    return (
      <div className={`tl-row ${!isEven ? "reverse" : ""}`} key={item.id}>
        {/* Card Body */}
        <div className="tl-card-wrap">
          <div className={`tl-card ${isEven ? "branch-left" : "branch-right"}`}>
            {/* Mobile Node Dot */}
            <div className="tl-mobile-dot">●</div>
            {/* Card Header */}
            <div className="tl-card-header">
              <div className="tl-card-header-left">
                <span className="tl-year-badge">{item.year}</span>
                <span className={`tl-cat-badge ${item.badgeBg}`}>
                  {item.category}
                </span>
              </div>
              <span className="tl-card-number">#{index + 1}</span>
            </div>
            <h3 className="tl-card-title">{item.title}</h3>
            <p className="tl-card-desc">{item.shortDesc}</p>
            {/* Footer */}
            <div className="tl-card-footer">
              <button
                className="tl-btn tl-btn-details"
                onClick={() => setDetailItem(item)}
              >
                View Details <span className="tl-icon-arrow">→</span>
              </button>
              <button
                className="tl-btn tl-btn-like"
                onClick={() => handleLike(item.id)}
              >
                ❤️ <span>{item.likes}</span>
              </button>
            </div>
          </div>
        </div>
        {/* Center Node (Desktop) */}
        <div className="tl-node">
          <span>{item.year.toString().slice(2)}</span>
        </div>
        {/* Spacer for opposite side */}
        <div className="tl-spacer" />
      </div>
    );
  };

  const renderGridCard = (item: Milestone) => (
    <div className="tl-grid-card" key={item.id}>
      <div>
        <div className="tl-card-header">
          <div className="tl-card-header-left">
            <span className="tl-year-badge">{item.year}</span>
            <span className={`tl-cat-badge ${item.badgeBg}`}>
              {item.category}
            </span>
          </div>
        </div>
        <h3 className="tl-card-title" style={{ fontSize: "1.1rem" }}>
          {item.title}
        </h3>
        <p className="tl-card-desc">{item.shortDesc}</p>
      </div>
      <div
        className="tl-card-footer"
        style={{ borderTop: "2px solid #000", paddingTop: 12, marginTop: 0 }}
      >
        <button
          className="tl-btn tl-btn-details"
          onClick={() => setDetailItem(item)}
        >
          Read More
        </button>
        <button
          className="tl-btn tl-btn-like"
          onClick={() => handleLike(item.id)}
        >
          ❤️ <span>{item.likes}</span>
        </button>
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="tl-section"
      style={{ backgroundColor: themes[themeIdx].bg }}
    >
      {/* ===== Marquee ===== */}
      <div className="tl-marquee-wrap">
        <div className="tl-marquee-inner">
          <span>🚀 TINKERHUB CEKNPY TIMELINE</span>
          <span>★</span>
          <span>COLLEGE OF ENGINEERING KARUNAGAPPALLY</span>
          <span>★</span>
          <span>370+ ACTIVE MAKERS</span>
          <span>★</span>
          <span>120+ EVENTS & WORKSHOPS</span>
          <span>★</span>
          <span>90+ COMMUNITY PROJECTS</span>
          <span>★</span>
          <span>BUILT BY STUDENTS, FOR STUDENTS</span>
          <span>★</span>
          <span>🚀 TINKERHUB CEKNPY TIMELINE</span>
          <span>★</span>
          <span>COLLEGE OF ENGINEERING KARUNAGAPPALLY</span>
          <span>★</span>
          <span>370+ ACTIVE MAKERS</span>
          <span>★</span>
          <span>120+ EVENTS & WORKSHOPS</span>
          <span>★</span>
          <span>90+ COMMUNITY PROJECTS</span>
          <span>★</span>
          <span>BUILT BY STUDENTS, FOR STUDENTS</span>
          <span>★</span>
        </div>
      </div>

      {/* ===== Header ===== */}
      <div className="tl-max-w" style={{ paddingTop: 32, paddingBottom: 16 }}>
        <div className="tl-header-box">
          <div className="tl-corner-badge">CEKNPY // CAMPUS ARCHIVE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <span className="tl-badge">TinkerHub CEKNPY</span>
                <span className="tl-badge-live">● CAMPUS CHAPTER</span>
              </div>
              <h1 className="tl-title">
                CEKNPY <span className="tl-title-highlight">Timeline</span>
              </h1>
              <p className="tl-subtitle-box">
                The story of how students at College of Engineering
                Karunagappally built a thriving peer-learning community — 370+
                makers, 120+ events, 90+ projects and counting.
              </p>
            </div>
            {/* Action Buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <button
                className="tl-btn-add"
                onClick={() => setShowAddModal(true)}
              >
                <span>+</span> Add Memory
              </button>
              <button
                className="tl-btn-theme"
                onClick={() =>
                  setThemeIdx((prev) => (prev + 1) % themes.length)
                }
                title="Toggle Theme Palette"
              >
                🎨
              </button>
            </div>
            {/* Stats */}
            <div className="tl-stats-grid">
              <div className="tl-stat-card white">
                <div className="tl-stat-value">2021</div>
                <div className="tl-stat-label">Chapter Founded</div>
              </div>
              <div className="tl-stat-card green">
                <div className="tl-stat-value">370+</div>
                <div className="tl-stat-label">Active Makers</div>
              </div>
              <div className="tl-stat-card purple">
                <div className="tl-stat-value">120+</div>
                <div className="tl-stat-label">Events & Workshops</div>
              </div>
              <div className="tl-stat-card orange">
                <div className="tl-stat-value">90+</div>
                <div className="tl-stat-label">Projects Built</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Controls ===== */}
      <div className="tl-max-w" style={{ marginTop: 24 }}>
        <div className="tl-controls">
          <div className="tl-search-wrap">
            <div className="tl-search-icon">🔍</div>
            <input
              type="text"
              className="tl-search-input"
              placeholder="SEARCH MILESTONES (E.G. 'BOOTCAMP', 'HACKATHON', '2024')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="tl-view-switch">
            <button
              className={`tl-view-btn ${currentView === "timeline" ? "active" : ""}`}
              onClick={() => setCurrentView("timeline")}
            >
              <span>⏳</span> Timeline
            </button>
            <button
              className={`tl-view-btn ${currentView === "grid" ? "active" : ""}`}
              onClick={() => setCurrentView("grid")}
            >
              <span>📇</span> Grid
            </button>
          </div>
        </div>
        {/* Filter Pills */}
        <div className="tl-filters">
          {[
            {
              label: `⚡ ALL (${milestones.length})`,
              value: "ALL",
              cls: "yellow",
            },
            { label: "🏁 FOUNDING", value: "FOUNDING", cls: "yellow" },
            { label: "🏫 CAMPUS", value: "CAMPUS", cls: "green" },
            { label: "💡 PROGRAMS", value: "PROGRAMS", cls: "blue" },
            { label: "🏢 SPACES & PLATFORMS", value: "SPACES", cls: "pink" },
          ].map((f) => (
            <button
              key={f.value}
              className={`tl-filter-btn ${f.cls} ${currentFilter === f.value ? "active" : ""}`}
              onClick={() => setCurrentFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== Timeline / Grid ===== */}
      <div className="tl-max-w" style={{ marginTop: 32 }}>
        <div ref={timelineContainerRef} className="tl-timeline-container">
          {/* Generated upside-down tree (trunk grows down, branches reach cards) */}
          <svg
            ref={treeSvgRef}
            className="tl-tree-svg"
            aria-hidden="true"
            style={{ display: currentView === "grid" ? "none" : undefined }}
          />
          {filtered.length === 0 ? (
            <div className="tl-empty">
              <div className="tl-empty-icon">🔍</div>
              <h3 className="tl-empty-title">NO MILESTONES FOUND!</h3>
              <p className="tl-empty-desc">
                Try searching for something else or clear your category filters.
              </p>
              <button className="tl-btn-reset" onClick={handleResetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={`tl-timeline-list ${currentView === "grid" ? "grid-view" : "timeline-view"}`}
            >
              {filtered.map((item, index) =>
                currentView === "grid"
                  ? renderGridCard(item)
                  : renderTimelineCard(item, index),
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== Footer =====
      <div className="tl-footer">
        <div className="tl-footer-box">
          <div>
            <h3 className="tl-footer-title">TINKERHUB CEKNPY</h3>
            <p className="tl-footer-text">
              College of Engineering Karunagappally's student-led tech
              community. Fostering peer learning, building real-world projects,
              and equipping students with practical engineering & developer
              skills.
            </p>
          </div>
          <div className="tl-footer-links">
            <a
              href="https://tinkerhub.org"
              target="_blank"
              rel="noopener noreferrer"
              className="tl-footer-link"
            >
              TinkerHub ↗
            </a>
            <a
              href="https://github.com/tinkerhub-ceknpy"
              target="_blank"
              rel="noopener noreferrer"
              className="tl-footer-link yellow"
            >
              <span>🐙</span> GitHub
            </a>
          </div>
        </div>
        <div className="tl-footer-credit">
          HANDCRAFTED WITH 💛 BY TINKERHUB CEKNPY // CAMPUS ARCHIVE
        </div>
      </div> */}

      {/* ===== Detail Modal ===== */}
      {detailItem && (
        <div className="tl-modal-overlay" onClick={() => setDetailItem(null)}>
          <div className="tl-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="tl-modal-header">
              <div className="tl-modal-header-left">
                <span className="tl-modal-year">{detailItem.year}</span>
                <span className="tl-modal-cat">{detailItem.category}</span>
              </div>
              <button
                className="tl-modal-close"
                onClick={() => setDetailItem(null)}
              >
                &times;
              </button>
            </div>
            <div className="tl-modal-body">
              <h2 className="tl-modal-title">{detailItem.title}</h2>
              {detailItem.image && (
                <div className="tl-modal-img-box">
                  <img
                    className="tl-modal-img"
                    src={detailItem.image}
                    alt={detailItem.title}
                  />
                </div>
              )}
              <p className="tl-modal-desc">{detailItem.fullDesc}</p>
              <div className="tl-modal-impact">
                <h4 className="tl-modal-impact-title">
                  <span>🎯</span> Key Impact & Takeaways
                </h4>
                <ul className="tl-modal-impact-list">
                  {detailItem.impact.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
              <div className="tl-modal-footer">
                <button
                  className="tl-btn tl-btn-like"
                  onClick={() => handleLike(detailItem.id)}
                  style={{ margin: 0 }}
                >
                  ❤️ <span>{detailItem.likes}</span> Likes
                </button>
                <button
                  className="tl-btn tl-btn-details"
                  onClick={() => setDetailItem(null)}
                  style={{ background: "#000", color: "#fff" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Add Memory Modal ===== */}
      {showAddModal && (
        <div
          className="tl-modal-overlay"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="tl-modal-box"
            style={{ maxWidth: 500 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tl-add-modal-header">
              <h3 className="tl-add-modal-title">
                <span>📮</span> Submit Milestone / Memory
              </h3>
              <button
                className="tl-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            <form className="tl-form" onSubmit={handleAddMemory}>
              <div className="tl-form-group">
                <label className="tl-form-label">Year</label>
                <input
                  className="tl-form-input"
                  type="number"
                  name="year"
                  min={2021}
                  max={2026}
                  defaultValue={2026}
                  required
                />
              </div>
              <div className="tl-form-group">
                <label className="tl-form-label">Category</label>
                <select
                  className="tl-form-select"
                  name="category"
                  defaultValue="PROGRAMS"
                >
                  <option value="FOUNDING">FOUNDING</option>
                  <option value="CAMPUS">CAMPUS</option>
                  <option value="PROGRAMS">PROGRAMS</option>
                  <option value="SPACES">SPACES & PLATFORMS</option>
                </select>
              </div>
              <div className="tl-form-group">
                <label className="tl-form-label">Milestone Title</label>
                <input
                  className="tl-form-input"
                  type="text"
                  name="title"
                  placeholder="E.g., Organized State-level Hackathon"
                  required
                />
              </div>
              <div className="tl-form-group">
                <label className="tl-form-label">Description</label>
                <textarea
                  className="tl-form-textarea"
                  name="description"
                  rows={3}
                  placeholder="Describe what happened and why it mattered..."
                  required
                />
              </div>
              <div className="tl-form-group">
                <label className="tl-form-label">
                  Impact Highlight (Optional)
                </label>
                <input
                  className="tl-form-input"
                  type="text"
                  name="impact"
                  placeholder="E.g., 500+ attendees, 30 projects built"
                />
              </div>
              <div className="tl-form-actions">
                <button
                  type="button"
                  className="tl-btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="tl-btn-submit">
                  🚀 Add To Timeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
