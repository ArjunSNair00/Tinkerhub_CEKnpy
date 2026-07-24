import { useEffect, useRef, useCallback, useState } from "react";
import BootScreen from "../components/BootScreen";
import Nature, { type NatureHandle } from "../components/Nature";
import "./hero.css";
import TinkerhubText from "../components/TinkerhubText";
import RigTool from "../components/rigTool";
import Details from "../components/details";
import CollegeIMG from "../components/collegeIMG";
import CollegeHead from "../components/collegeHead";
import SkyPlane from "../components/SkyPlane";
import ChaiMeter from "../components/ChaiMeter";
import WhoWeAre from "../components/whoWeAre";

// Images to preload before dismissing boot screen
import Collegee from "../components/College.png";
import Sky from "../components/Sky.png";
import Dirt from "../components/dirt.png";
import Trees from "../components/trees.png";
import MainTree from "../components/mainTree.png";
import Cloud1 from "../components/cloud1.png";
import Cloud2 from "../components/cloud2.png";
import Cloud3 from "../components/cloud3.png";
import Cloud4 from "../components/cloud4.png";

const PRELOAD_IMAGES = [
  Collegee,
  Sky,
  Dirt,
  Trees,
  MainTree,
  Cloud1,
  Cloud2,
  Cloud3,
  Cloud4,
];

export default function Hero() {
  const NATURE_FIXED = false; // true = fixed in viewport, false = scrolls with page
  const bootIsOn = true;
  const [bootDone, setBootDone] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const totalResources = PRELOAD_IMAGES.length;
  const natureRef = useRef<NatureHandle>(null);

  const startAnimations = useCallback(() => {
    document.body.classList.add("ready");

    const mantraEl = document.getElementById("mantra");
    const mantras = [
      "don't fly solo",
      "be kind",
      "skills pay the bills",
      "coding is a superpower",
      "Never Give Up",
    ];
    let mi = 0;
    const mantraIv = setInterval(() => {
      if (!mantraEl) return;
      mantraEl.classList.add("swap");
      setTimeout(() => {
        mi = (mi + 1) % mantras.length;
        mantraEl.textContent = mantras[mi];
        mantraEl.classList.remove("swap");
      }, 300);
    }, 2400);

    // Reveal animation system — staggered riseIn after boot
    function delayFor(i: number) {
      return Math.min(i * 0.035, 0.55).toFixed(3) + "s";
    }
    function makeW(t: string, c: { n: number }) {
      const s = document.createElement("span");
      s.className = "w";
      s.textContent = t;
      s.style.transitionDelay = delayFor(c.n++);
      return s;
    }
    function walk(parent: Node, c: { n: number }) {
      Array.prototype.slice
        .call(parent.childNodes)
        .forEach((node: ChildNode) => {
          if (node.nodeType === 3) {
            const v = node.nodeValue;
            if (!v) return;
            const parts = v.split(/(\s+)/);
            const frag = document.createDocumentFragment();
            parts.forEach((tok) => {
              if (/^\s+$/.test(tok))
                frag.appendChild(document.createTextNode(tok));
              else if (tok.length) frag.appendChild(makeW(tok, c));
            });
            parent.replaceChild(frag, node);
          } else if (node.nodeType === 1) {
            const el = node as HTMLElement;
            if (el.classList && el.classList.contains("mark-word")) {
              el.classList.add("w");
              el.style.transitionDelay = delayFor(c.n++);
            } else walk(el, c);
          }
        });
    }
    function wordReveal(el: Element) {
      el.classList.remove("reveal");
      el.classList.add("wr");
      walk(el, { n: 0 });
    }
    function buildStagger() {
      document.querySelectorAll("[data-stagger]").forEach((container) => {
        container.classList.remove("reveal");
        Array.prototype.forEach.call(
          container.children,
          (child: HTMLElement, i: number) => {
            child.classList.add("reveal-fade");
            child.style.animationDelay =
              (Math.min(i, 12) * 0.06).toFixed(2) + "s";
          },
        );
      });
    }
    function triggerReveals() {
      // All hero elements that need to animate in after boot
      const heroReveals = document.querySelectorAll(
        ".hero .reveal, .hero .wr, .hero .clip-reveal",
      );
      heroReveals.forEach((el, i) => {
        setTimeout(() => el.classList.add("in"), 120 + i * 140);
      });
      // Hero stagger children
      const heroFades = document.querySelectorAll(".hero .reveal-fade");
      heroFades.forEach((el) => el.classList.add("in"));
      // CEK building — delayed reveal
      const ck = document.getElementById("cekBuilding");
      if (ck) setTimeout(() => ck.classList.add("in"), 420);
    }

    document.querySelectorAll("h2, .statement").forEach(wordReveal);
    buildStagger();
    triggerReveals();

    // Tool rig — hammer, screwdriver, soldering iron
    const SPARK_COLORS = ["#1B2BFF", "#FF2D78", "#FFC400", "#ffffff"];
    function emitSparks(x: number, y: number, count?: number) {
      count = count || 12;
      for (let i = 0; i < count; i++) {
        const s = document.createElement("span");
        const star = Math.random() < 0.4;
        s.className = "spark" + (star ? " star" : "");
        const size = star ? 8 + Math.random() * 10 : 3 + Math.random() * 5;
        s.style.width = size + "px";
        s.style.height = size + "px";
        s.style.left = x + "px";
        s.style.top = y + "px";
        s.style.background =
          SPARK_COLORS[(Math.random() * SPARK_COLORS.length) | 0];
        s.style.boxShadow = star
          ? "0 0 8px currentColor"
          : "0 0 5px currentColor";
        document.body.appendChild(s);
        const ang = Math.random() * Math.PI * 2;
        const dist = 20 + Math.random() * 60;
        const dx = Math.cos(ang) * dist;
        const dy = Math.sin(ang) * dist - 14;
        requestAnimationFrame(() => {
          s.style.transform = `translate(${dx}px,${dy}px) rotate(${Math.random() * 360}deg) scale(${0.3 + Math.random() * 0.6})`;
          s.style.opacity = "0";
        });
        setTimeout(() => {
          if (s.parentNode) s.parentNode.removeChild(s);
        }, 720);
      }
    }

    const rig = document.getElementById("rig");
    const tools: Record<string, HTMLElement> = {};
    if (rig) {
      rig.querySelectorAll<HTMLElement>(".rigtool").forEach((t) => {
        const toolName = t.getAttribute("data-tool");
        if (toolName) tools[toolName] = t;
      });
    }
    let queue: { el: HTMLElement; action: string }[] = [];
    let busy = false;
    let cycleIdx = 0;
    const cycle = ["hammer", "screw", "solder"];

    function showTool(name: string) {
      Object.keys(tools).forEach((k) => {
        tools[k].classList.toggle("active", k === name);
        tools[k].classList.remove("swing", "spin", "on");
      });
    }
    function placeTool(name: string, x: number, y: number) {
      const t = tools[name];
      if (!t) return;
      t.style.left = x + "px";
      t.style.top = y + "px";
      t.style.transform = "translate(-50%,-50%)";
    }

    function doAssemble(el: HTMLElement, action: string) {
      const rect = el.getBoundingClientRect();
      el.classList.add("assembled");
      if (action === "hammer") {
        const hx = rect.left + rect.width / 2;
        const hy = rect.top - 8;
        showTool("hammer");
        placeTool("hammer", hx, hy - 22);
        void tools.hammer.offsetWidth;
        tools.hammer.classList.add("swing");
        setTimeout(() => {
          emitSparks(hx, hy, 14);
          el.classList.add("bang");
          setTimeout(() => el.classList.remove("bang"), 340);
        }, 300);
        setTimeout(() => showTool(""), 760);
      } else if (action === "screw") {
        const sx = rect.right - 16;
        const sy = rect.top + 16;
        showTool("screw");
        placeTool("screw", sx, sy);
        void tools.screw.offsetWidth;
        tools.screw.classList.add("spin");
        setTimeout(() => emitSparks(sx, sy, 7), 640);
        setTimeout(() => showTool(""), 900);
      } else {
        showTool("solder");
        tools.solder.classList.add("on");
        const dur = 900;
        let start: number | null = null;
        function step(now: number) {
          if (start === null) start = now;
          const p = Math.min((now - start) / dur, 1);
          const r = el.getBoundingClientRect();
          const x = r.left + r.width * p;
          placeTool("solder", x, r.top + 3);
          if (Math.random() < 0.5) emitSparks(x, r.top + 6, 2);
          if (p < 1) requestAnimationFrame(step);
          else {
            emitSparks(r.right - 4, r.top + 6, 8);
            setTimeout(() => {
              showTool("");
              tools.solder.classList.remove("on");
            }, 200);
          }
        }
        requestAnimationFrame(step);
      }
    }
    function scheduleAssemble(el: HTMLElement) {
      if ((el as any).dataset.asmDone) return;
      (el as any).dataset.asmDone = "1";
      const action = el.getAttribute("data-asm") || cycle[cycleIdx++ % 3];
      queue.push({ el, action });
      if (!busy) pump();
    }
    function pump() {
      if (!queue.length) {
        busy = false;
        return;
      }
      busy = true;
      const job = queue.shift()!;
      doAssemble(job.el, job.action);
      const wait =
        job.action === "solder" ? 1150 : job.action === "screw" ? 950 : 800;
      setTimeout(pump, wait);
    }

    // Trigger assemble on .asm elements when they enter viewport
    if ("IntersectionObserver" in window) {
      const asmObs = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting) {
              scheduleAssemble(e.target as HTMLElement);
              asmObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -8% 0px" },
      );
      document
        .querySelectorAll<HTMLElement>(".asm")
        .forEach((el) => asmObs.observe(el));
    } else {
      document.querySelectorAll<HTMLElement>(".asm").forEach((el) => {
        el.classList.add("assembled");
      });
    }

    return () => {
      clearInterval(mantraIv);
      document.body.classList.remove("ready");
    };
  }, []);

  useEffect(() => {
    if (bootDone) startAnimations();
  }, [bootDone, startAnimations]);

  // Preload hero images — progress driven by actual loaded count
  useEffect(() => {
    let loaded = 0;
    PRELOAD_IMAGES.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
      };
      img.src = src;
    });
  }, []);

  // Nature particle interactions (burst on click, hover spawn)
  useEffect(() => {
    if (!bootDone) return;

    const onPointerDown = (e: PointerEvent) => {
      natureRef.current?.burst(e.clientX, e.clientY);
    };

    const hoverSel =
      ".btn,.pcard,.pillar,.wev-row,.pcard2,.badge,.jam,#heroWord,.lockup,.chip";
    const onMouseOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest(hoverSel);
      if (el) natureRef.current?.hoverSpawn(el);
    };

    window.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, [bootDone]);

  return (
    <>
      {bootIsOn && !bootDone && (
        <BootScreen
          onComplete={() => setBootDone(true)}
          loadedCount={loadedCount}
          totalCount={totalResources}
        />
      )}
      <RigTool />

      <div className="hero" id="top">
        <CollegeIMG />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 6,
            pointerEvents: "none",
          }}
        >
          <Details />
        </div>
        <SkyPlane />

        <div className="wrap">
          <TinkerhubText />
          <div className="college-head-wrap reveal">
            <CollegeHead />
          </div>
          {/* <LogoSection scale={2} /> */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <div className="mantra-chip reveal">
              <span className="ml2">today's mantra</span>
              <span className="mt" id="mantra">
                don't fly solo
              </span>
            </div>
          </div>

          <div
            className="hero-sub reveal"
            style={{ "--mx": "30%", "--my": "18%" } as React.CSSProperties}
            onMouseMove={(e) => {
              if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
                return;
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty(
                "--mx",
                ((e.clientX - r.left) / r.width) * 100 + "%",
              );
              e.currentTarget.style.setProperty(
                "--my",
                ((e.clientY - r.top) / r.height) * 100 + "%",
              );
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.setProperty("--mx", "30%");
              e.currentTarget.style.setProperty("--my", "18%");
            }}
          >
            <span className="hs-eyebrow" aria-hidden="true">
              {"\u2726"} who we are
            </span>
            <span className="hs-sticker" aria-hidden="true">
              {"\u2726"}
            </span>

            <WhoWeAre />
          </div>

          <div className="hero-cta reveal">
            <a href="#join" className="btn btn--solid">
              Join <span className="ar">→</span>
            </a>
            <a href="#builds" className="btn btn--ghost">
              See what we made
            </a>
          </div>

          <div className="hero-meta" data-stagger>
            <span>
              <b>1999</b>established
            </span>
            <span>
              <b>KTU</b>affiliated
            </span>
            <span>
              <b>AICTE</b>approved
            </span>
            <span>
              <b>'25</b>campus of the month
            </span>
          </div>
          <div className="scroll-cue reveal">
            <span>scroll To Explore</span>
            <span className="ln"></span>
          </div>
        </div>

        <Nature ref={natureRef} fixed={NATURE_FIXED} />
      </div>
      <ChaiMeter />
    </>
  );
}
