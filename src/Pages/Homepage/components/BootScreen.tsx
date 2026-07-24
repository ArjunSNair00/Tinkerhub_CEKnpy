import { useEffect, useRef, useCallback } from "react";
import Logo from "./Logo";

const BOOT_LINES = [
  { ic: "⚙", t: "spooling up the workbench…" },
  { ic: "🔥", t: "heating soldering iron → 220°C" },
  { ic: "🔧", t: "calibrating calipers & bolts…" },
  { ic: "🍃", t: "opening the windows (a breeze blows in)…" },
  { ic: "☕", t: "warming the chai (pours on scroll)…" },
  { ic: "✓", t: "tools ready — walk in.", ok: true },
];

interface BootScreenProps {
  onComplete: () => void;
  loadedCount?: number;
  totalCount?: number;
}

export default function BootScreen({
  onComplete,
  loadedCount = 0,
  totalCount = 1,
}: BootScreenProps) {
  const barWidth = Math.min(
    Math.round((loadedCount / Math.max(totalCount, 1)) * 100),
    100,
  );
  const bootRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pixelRef = useRef<HTMLSpanElement>(null);

  const stableOnComplete = useCallback(onComplete, []);

  const countsRef = useRef({ loadedCount, totalCount });

  useEffect(() => {
    countsRef.current = { loadedCount, totalCount };
  }, [loadedCount, totalCount]);

  useEffect(() => {
    const reduce = !!(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    if (reduce) {
      stableOnComplete();
      return;
    }

    const bEl = bootRef.current;
    const logEl = logRef.current;
    const barEl = barRef.current;
    const pixEl = pixelRef.current;
    if (!bEl || !logEl || !barEl || !pixEl) return;
    const boot = bEl;
    const log = logEl;
    const bar = barEl;
    const pixel = pixEl;

    let bootTimer: ReturnType<typeof setTimeout> | null = null;
    let bootDone = false;

    function finishBoot() {
      if (bootDone) return;

      if (countsRef.current.loadedCount < countsRef.current.totalCount) {
        bootTimer = setTimeout(finishBoot, 200);
        return;
      }

      bootDone = true;
      if (bootTimer) {
        clearTimeout(bootTimer);
        bootTimer = null;
      }
      pixel.textContent = "built.";
      bar.style.width = "100%";
      setTimeout(() => {
        boot.classList.add("done");
        document.documentElement.classList.remove("is-booting");
        setTimeout(() => {
          boot.style.display = "none";
        }, 720);
        stableOnComplete();
      }, 430);
    }

    function setTxt(div: HTMLDivElement, t: string) {
      let span = div.querySelector(".tx") as HTMLSpanElement;
      if (!span) {
        span = document.createElement("span");
        span.className = "tx";
        div.appendChild(span);
      }
      span.textContent = t;
    }

    function typeBootLine(div: HTMLDivElement, text: string, cb?: () => void) {
      div.classList.add("typing");
      let ci = 0;
      function tc() {
        if (ci <= text.length) {
          setTxt(div, text.slice(0, ci));
          ci++;
          bootTimer = setTimeout(tc, 16 + Math.random() * 20);
        } else {
          div.classList.remove("typing");
          cb && cb();
        }
      }
      tc();
    }

    function runBoot() {
      document.documentElement.classList.add("is-booting");
      let i = 0;
      function step() {
        if (i >= BOOT_LINES.length) {
          bootTimer = setTimeout(finishBoot, 520);
          return;
        }
        const L = BOOT_LINES[i];
        const div = document.createElement("div");
        div.className = "bm-line" + (L.ok ? " ok" : "");
        const ic = document.createElement("span");
        ic.className = "ic";
        ic.textContent = L.ic;
        div.appendChild(ic);
        log.appendChild(div);
        typeBootLine(div, L.t, () => {
          i++;
          bootTimer = setTimeout(step, L.ok ? 260 : 150);
        });
      }
      step();
    }

    const onSkip = () => finishBoot();
    const onBootClick = (e: MouseEvent) => {
      if (e.target === boot) finishBoot();
    };
    const onKey = (e: KeyboardEvent) => {
      if (bootDone) return;
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        finishBoot();
      }
    };

    const skipBtn = boot.querySelector(".boot-skip");
    skipBtn?.addEventListener("click", onSkip);
    boot.addEventListener("click", onBootClick);
    document.addEventListener("keydown", onKey);

    runBoot();

    return () => {
      if (bootTimer) clearTimeout(bootTimer);
      skipBtn?.removeEventListener("click", onSkip);
      boot.removeEventListener("click", onBootClick);
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("is-booting");
    };
  }, [stableOnComplete]);

  return (
    <div id="boot" ref={bootRef} role="status" aria-live="polite">
      <div className="boot-pixel">
        <span ref={pixelRef}>Working on it...</span>
        <span className="cursor"></span>
      </div>
      <div className="boot-machine">
        <div className="bm-bar">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span>workbench · powering up</span>
        </div>
        <div className="bm-body" ref={logRef}></div>
      </div>
      <div className="boot-bar">
        <i ref={barRef} style={{ width: barWidth + "%" }}></i>
      </div>
      <button className="boot-skip">skip ⏎</button>
      <Logo scale={0.5} />
    </div>
  );
}
