import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

function rnd(a: number, b: number) {
  return a + Math.random() * (b - a);
}
function pick<T>(a: T[]): T {
  return a[(Math.random() * a.length) | 0];
}

const PAL = {
  petal: ["#FFB7C5", "#FF8FA3", "#FFC9D6", "#FFD9E2", "#FFE9EF"],
  blossom: ["#FF8FA3", "#FFB7C5", "#FFC9D6"],
  leaf: ["#7FA86A", "#9BB06A", "#C9A24B", "#B5793A", "#88A85A"],
  bfly: ["#3A4BFF", "#FB8B00", "#FF2D78", "#16a3a3", "#222", "#ffffff"],
};

function tplPetal(c: string) {
  return `<svg viewBox="0 0 20 20"><path d="M10 0C6 3 2 8 4 14c1.5 4 6 6 6 6s4.5-2 6-6c2-6-2-11-6-14z" fill="${c}"/></svg>`;
}
function tplBlossom(c: string) {
  let e = "";
  for (let i = 0; i < 5; i++)
    e += `<ellipse cx="12" cy="6" rx="3" ry="5.4" transform="rotate(${i * 72} 12 12)"/>`;
  return `<svg viewBox="0 0 24 24"><g fill="${c}">${e}</g><circle cx="12" cy="12" r="2.3" fill="#f4c84a"/></svg>`;
}
function tplLeaf(c: string) {
  return `<svg viewBox="0 0 24 24"><path d="M12 1C4 6 4 17 12 23 20 17 20 6 12 1Z" fill="${c}"/><path d="M12 2V22" stroke="rgba(0,0,0,.22)" stroke-width="1"/></svg>`;
}
function tplBfly(c: string) {
  return `<svg class="bfly" viewBox="0 0 40 30"><g class="wingL"><path d="M20 15C9 2 1 6 3 14c1 5 10 4 17 1Z M20 15C10 16 4 22 8 27c4 3 10-5 12-12Z" fill="${c}"/></g><g class="wingR"><path d="M20 15C31 2 39 6 37 14c-1 5-10 4-17 1Z M20 15C30 16 36 22 32 27c-4 3-10-5-12-12Z" fill="${c}"/></g><rect x="19" y="6" width="2" height="18" rx="1" fill="#222"/><path d="M19 7C16 3 14 2 13 1M21 7C24 3 26 2 27 1" stroke="#222" stroke-width="1" fill="none"/></svg>`;
}
function tplBug() {
  return `<svg viewBox="0 0 14 14"><g opacity=".45" stroke="#241a10" stroke-width="1" fill="none"><path d="M7 5C3 1 1 4 4 7M7 5c4-4 6-1 3 2"/></g><ellipse cx="7" cy="8" rx="2.1" ry="3.4" fill="#241a10"/></svg>`;
}

interface NatureParticle {
  el: HTMLDivElement;
  kind: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  t: number;
  life: number;
  phase: number;
  freq: number;
  amp: number;
  sway: number;
  grav: number;
  baseVy: number;
  flip: number;
  bob: number;
}

export interface NatureHandle {
  burst: (x: number, y: number) => void;
  hoverSpawn: (el: Element) => void;
}

interface NatureProps {
  fixed?: boolean;
}

const Nature = forwardRef<NatureHandle, NatureProps>(function Nature({ fixed = true }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverCD = useRef(new WeakMap<Element, number>());
  const fnsRef = useRef<{
    spawnPetal: (x?: number, y?: number, burst?: boolean) => void;
    spawnBfly: (x: number, y: number, fromEdge: boolean) => void;
  }>({ spawnPetal: () => {}, spawnBfly: () => {} });

  useImperativeHandle(ref, () => ({
    burst(x: number, y: number) {
      const { spawnPetal, spawnBfly } = fnsRef.current;
      const n = 2 + (Math.random() < 0.5 ? 1 : 0);
      for (let i = 0; i < n; i++)
        spawnPetal(x + rnd(-26, 26), y + rnd(-18, 18), true);
      if (Math.random() < 0.35) spawnBfly(x, y, false);
    },
    hoverSpawn(el: Element) {
      const { spawnPetal, spawnBfly } = fnsRef.current;
      const now = performance.now();
      const last = hoverCD.current.get(el) || 0;
      if (now - last < 650) return;
      hoverCD.current.set(el, now);
      const r = el.getBoundingClientRect();
      spawnBfly(r.left + r.width * 0.5, r.top + r.height * 0.3, false);
      spawnPetal(
        r.left + Math.random() * r.width,
        r.top + Math.random() * r.height * 0.5,
        false,
      );
    },
  }));

  useEffect(() => {
    const reduce = !!(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    if (reduce) return;

    let natureEl = containerRef.current;
    const N: NatureParticle[] = [];
    const NCAP = 30;
    let NW = window.innerWidth;
    let NH = window.innerHeight;
    let wind = 0;
    let windTarget = 0;
    let tG = 0;
    let nRaf = 0;
    let nLast = 0;
    let idleT: ReturnType<typeof setTimeout> | null = null;

    function addP(
      kind: string,
      x: number,
      y: number,
      vx: number,
      vy: number,
      size: number,
      op: number,
      extra?: { life?: number },
    ) {
      if (!natureEl || N.length >= NCAP) return;
      const el = document.createElement("div");
      el.className = "np" + (kind === "mote" ? " mote" : "");
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.style.opacity = String(op);
      if (kind !== "mote") {
        let svg = "";
        if (kind === "petal") svg = tplPetal(pick(PAL.petal));
        else if (kind === "blossom") svg = tplBlossom(pick(PAL.blossom));
        else if (kind === "leaf") svg = tplLeaf(pick(PAL.leaf));
        else if (kind === "bfly") svg = tplBfly(pick(PAL.bfly));
        else svg = tplBug();
        el.innerHTML = svg;
      }
      natureEl.appendChild(el);
      N.push({
        el,
        kind,
        x,
        y,
        vx,
        vy,
        rot: rnd(0, 360),
        vr: rnd(-90, 90),
        t: 0,
        life: extra?.life ?? 999,
        phase: rnd(0, 6.28),
        freq: rnd(0.8, 1.8),
        amp: rnd(14, 34),
        sway: rnd(8, 22),
        grav:
          kind === "leaf"
            ? 16
            : kind === "petal" || kind === "blossom"
              ? 10
              : 0,
        baseVy: vy,
        flip: vx < 0 ? -1 : 1,
        bob: rnd(10, 26),
      });
    }

    function spawnPetal(x?: number, y?: number, burst = false) {
      addP(
        Math.random() < 0.3 ? "blossom" : "petal",
        x ?? rnd(0, NW),
        y ?? -24,
        burst ? rnd(-40, 40) : rnd(-12, 12),
        burst ? rnd(-30, 30) : rnd(14, 30),
        rnd(11, 19),
        rnd(0.6, 0.85),
      );
    }
    function spawnLeaf(x?: number, y?: number) {
      addP(
        "leaf",
        x ?? rnd(0, NW),
        y ?? -26,
        rnd(-16, 16),
        rnd(18, 34),
        rnd(15, 26),
        rnd(0.7, 0.9),
      );
    }
    function spawnMote(x?: number, y?: number) {
      addP(
        "mote",
        x ?? rnd(0, NW),
        y ?? rnd(0, NH),
        rnd(-6, 6),
        rnd(-4, 4),
        rnd(3, 7),
        0,
        { life: rnd(4, 7) },
      );
    }
    function spawnBfly(x: number, y: number, fromEdge: boolean) {
      const s = rnd(28, 44);
      let vx: number, yy: number;
      if (fromEdge) {
        const left = Math.random() < 0.5;
        x = left ? -44 : NW + 44;
        vx = left ? rnd(34, 72) : -rnd(34, 72);
        yy = rnd(NH * 0.12, NH * 0.78);
      } else {
        vx = rnd(-60, 60);
        if (vx === 0) vx = 30;
        yy = y;
      }
      addP("bfly", x, yy, vx, rnd(-6, 6), s, rnd(0.8, 0.95), {
        life: fromEdge ? 999 : rnd(3, 5),
      });
    }
    function spawnBug(x?: number, y?: number) {
      const left = Math.random() < 0.5;
      addP(
        "bug",
        x ?? (left ? -14 : NW + 14),
        y ?? rnd(NH * 0.2, NH * 0.8),
        x != null ? rnd(-90, 90) : left ? rnd(60, 120) : -rnd(60, 120),
        rnd(-30, 30),
        rnd(8, 13),
        rnd(0.6, 0.8),
        { life: rnd(2.2, 4) },
      );
    }

    // Expose spawn functions to imperative handle
    fnsRef.current = { spawnPetal, spawnBfly };

    function updateP(p: NatureParticle, dt: number, ew: number): boolean {
      p.t += dt;
      if (p.kind === "petal" || p.kind === "blossom") {
        p.vy += p.grav * dt;
        p.vy = Math.min(p.vy, 70);
        p.x +=
          (p.vx + ew * 0.7 + Math.sin(p.t * p.freq + p.phase) * p.sway) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        const ry = Math.sin(p.t * 3 + p.phase) * 42;
        p.el.style.transform = `translate3d(${p.x}px,${p.y}px,0) rotate(${p.rot}deg) rotateY(${ry}deg)`;
        return p.y > NH + 40 || p.x < -60 || p.x > NW + 60;
      }
      if (p.kind === "leaf") {
        p.vy = p.baseVy + Math.sin(p.t * 4 + p.phase) * 10;
        p.x +=
          (p.vx + ew * 0.9 + Math.sin(p.t * p.freq + p.phase) * p.amp) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * 1.4 * dt;
        p.el.style.transform = `translate3d(${p.x}px,${p.y}px,0) rotate(${p.rot}deg)`;
        return p.y > NH + 40 || p.x < -60 || p.x > NW + 60;
      }
      if (p.kind === "bfly") {
        p.x += (p.vx + ew * 0.25) * dt;
        p.y += (Math.sin(p.t * p.freq + p.phase) * p.bob + p.vy) * dt;
        const bank = Math.max(
          -26,
          Math.min(26, Math.sin(p.t * p.freq + p.phase) * 18),
        );
        p.el.style.transform = `translate3d(${p.x}px,${p.y}px,0) scaleX(${p.flip}) rotate(${bank}deg)`;
        return (p.flip > 0 ? p.x > NW + 60 : p.x < -60) || p.t > p.life;
      }
      if (p.kind === "mote") {
        p.x += (p.vx + ew * 1.3) * dt;
        p.y += (Math.sin(p.t * 2 + p.phase) * 7 + p.vy) * dt;
        const o = Math.sin(Math.PI * Math.min(p.t / p.life, 1));
        p.el.style.opacity = (o * 0.5).toFixed(2);
        p.el.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
        return p.t > p.life;
      }
      p.vx += rnd(-1, 1) * 220 * dt;
      p.vy += rnd(-1, 1) * 220 * dt;
      const sp = Math.hypot(p.vx, p.vy);
      const mx = 130;
      if (sp > mx) {
        p.vx *= mx / sp;
        p.vy *= mx / sp;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot = Math.atan2(p.vy, p.vx) * 57.3;
      p.el.style.transform = `translate3d(${p.x}px,${p.y}px,0) rotate(${p.rot + 90}deg)`;
      return (
        p.t > p.life || p.x < -30 || p.x > NW + 30 || p.y < -30 || p.y > NH + 30
      );
    }

    function nLoop(ts: number) {
      nRaf = requestAnimationFrame(nLoop);
      if (!nLast) nLast = ts;
      const dt = Math.min((ts - nLast) / 1000, 0.05);
      nLast = ts;
      tG += dt;
      wind += (windTarget - wind) * Math.min(1, dt * 3);
      windTarget *= Math.pow(0.9, dt * 60);
      const ew = wind + Math.sin(tG * 0.25) * 6;
      for (let i = N.length - 1; i >= 0; i--) {
        if (updateP(N[i], dt, ew)) {
          N[i].el.remove();
          N.splice(i, 1);
        }
      }
    }

    function idleSpawn() {
      idleT = setTimeout(
        () => {
          if (!document.hidden) {
            const r = Math.random();
            if (r < 0.42) spawnPetal();
            else if (r < 0.7) spawnMote();
            else if (r < 0.85) spawnLeaf();
            else if (r < 0.95) spawnBfly(0, 0, true);
            else spawnBug();
          }
          idleSpawn();
        },
        rnd(850, 2300),
      );
    }

    natureEl = containerRef.current;
    if (!natureEl) return;
    NW = window.innerWidth;
    NH = window.innerHeight;
    const onResize = () => {
      NW = window.innerWidth;
      NH = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    nRaf = requestAnimationFrame(nLoop);
    idleSpawn();
    let lastSY = window.scrollY || 0;
    const onScroll = () => {
      const sy = window.scrollY || 0;
      const d = sy - lastSY;
      lastSY = sy;
      windTarget = Math.max(-130, Math.min(130, windTarget + d * 0.5));
      if (Math.abs(d) > 10 && Math.random() < 0.5 && N.length < NCAP) {
        (Math.random() < 0.5 ? spawnPetal : spawnLeaf)();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    let lmX = 0,
      lmY = 0,
      lmT = 0;
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const dtm = now - lmT || 16;
      const sp = (Math.hypot(e.clientX - lmX, e.clientY - lmY) / dtm) * 16;
      lmX = e.clientX;
      lmY = e.clientY;
      lmT = now;
      if (sp > 14 && Math.random() < 0.1 && N.length < NCAP)
        spawnMote(e.clientX, e.clientY);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(nRaf);
      if (idleT) clearTimeout(idleT);
    };
  }, []);

  const posClass = fixed ? "nature-fixed" : "nature-scroll";

  return <div id="nature" ref={containerRef} className={posClass} aria-hidden="true" />;
});

export default Nature;
