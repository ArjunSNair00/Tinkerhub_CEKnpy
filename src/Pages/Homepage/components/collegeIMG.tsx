import { useRef, useState, useEffect } from "react";
import Collegee from "./College.png";
import Sky from "./Sky.png";
import Dirt from "./dirt.png";
import Trees from "./trees.png";
import MainTree from "./mainTree.png";
import Cloud1 from "./cloud1.png";
import Cloud2 from "./cloud2.png";
import Cloud3 from "./cloud3.png";
import Cloud4 from "./cloud4.png";
import styles from "./clouds.module.css";
import popStyles from "./treePop.module.css";

const CLOUDS = [Cloud1, Cloud2, Cloud3, Cloud4];

interface CloudInstance {
  id: number;
  cloudIdx: number;
  createdAt: number;
  startProgress: number;
}

export default function CollegeIMG() {
  const treeRef = useRef<HTMLImageElement>(null);
  const [popPos, setPopPos] = useState({ x: 0, y: 0 });
  const [popShow, setPopShow] = useState(false);
  const [clouds, setClouds] = useState<CloudInstance[]>(() => [
    {
      id: Date.now(),
      cloudIdx: Math.floor(Math.random() * CLOUDS.length),
      createdAt: Date.now(),
      startProgress: 0,
    },
  ]);

  useEffect(() => {
    const CYCLE = 45000;
    const SPAWN_CHANCE = 0.4;
    const spawnedRef = new Set<number>();
    let nextId = Date.now() + 1;

    const tick = () => {
      const now = Date.now();
      setClouds((prev) => {
        const active = prev.filter((c) => {
          const elapsed = now - c.createdAt;
          const totalDuration = CYCLE * (1 - c.startProgress);
          return elapsed < totalDuration;
        });

        for (const c of active) {
          const elapsed = now - c.createdAt;
          const progress = c.startProgress + elapsed / CYCLE;

          if (progress >= 0.5 && !spawnedRef.has(c.id)) {
            spawnedRef.add(c.id);

            if (Math.random() < SPAWN_CHANCE) {
              const jitter = (Math.random() - 0.5) * 0.06;
              active.push({
                id: nextId++,
                cloudIdx: Math.floor(Math.random() * CLOUDS.length),
                createdAt: now,
                startProgress: Math.min(progress + jitter, 0.55),
              });
            }
          }
        }

        if (active.length === 0) {
          active.push({
            id: nextId++,
            cloudIdx: Math.floor(Math.random() * CLOUDS.length),
            createdAt: now,
            startProgress: 0,
          });
        }

        return active;
      });
    };

    const iv = setInterval(tick, 500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const el = treeRef.current;
    if (!el) return;

    // Build an offscreen canvas once the image loads for pixel-perfect hit testing
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let imgData: ImageData | null = null;

    const buildMask = () => {
      if (!ctx || !el.naturalWidth) return;
      canvas.width = el.naturalWidth;
      canvas.height = el.naturalHeight;
      ctx.drawImage(el, 0, 0);
      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    if (el.complete && el.naturalWidth) buildMask();
    el.addEventListener("load", buildMask);

    const onMove = (e: MouseEvent) => {
      if (!imgData) return;
      const r = el.getBoundingClientRect();
      // Map mouse position to image pixel coordinates
      const px = Math.floor(((e.clientX - r.left) / r.width) * imgData.width);
      const py = Math.floor(((e.clientY - r.top) / r.height) * imgData.height);

      if (px < 0 || px >= imgData.width || py < 0 || py >= imgData.height) {
        setPopShow(false);
        el.classList.remove(styles.MainTreeHover);
        document.body.style.cursor = "";
        return;
      }

      const alpha = imgData.data[(py * imgData.width + px) * 4 + 3];
      if (alpha > 30) {
        setPopPos({ x: e.clientX, y: e.clientY });
        setPopShow(true);
        el.classList.add(styles.MainTreeHover);
        document.body.style.cursor = "pointer";
      } else {
        setPopShow(false);
        el.classList.remove(styles.MainTreeHover);
        document.body.style.cursor = "";
      }
    };

    const onLeave = () => {
      setPopShow(false);
      el.classList.remove(styles.MainTreeHover);
      document.body.style.cursor = "";
    };

    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("load", buildMask);
    };
  }, []);

  return (
    <>
      {popShow && (
        <div
          className={popStyles.popup}
          style={{ left: popPos.x + 16, top: popPos.y - 10 }}
        >
          <span className={popStyles.title}>The Tree</span>
          <span className={popStyles.desc}>Where ideas are freely shared</span>
        </div>
      )}

      {/* z-index: 0 — sky */}
      <img
        src={Sky}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          clipPath:
            "inset(0 0 200px 0)" /* Cropped exactly 50px off the bottom */,
        }}
      />

      {/* z-index: 1 — clouds drift across sky */}
      {clouds.map((c) => {
        const duration = 45000 * (1 - c.startProgress);
        const delay = -(45000 * c.startProgress);
        return (
          <img
            key={c.id}
            src={CLOUDS[c.cloudIdx]}
            alt=""
            className={styles.cloudDrift}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1,
              animationDuration: `${duration}ms`,
              animationDelay: `${delay}ms`,
            }}
          />
        );
      })}

      {/* z-index: 2 — college building (behind dirt/trees) */}
      <img
        src={Collegee}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 2,
          filter: "grayscale(100%)",
        }}
      />

      {/* z-index: 3 — dirt ground */}
      <img
        src={Dirt}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 3,
          filter: "grayscale(100%)",
        }}
      />

      {/* z-index: 4 — background trees */}
      <img
        src={Trees}
        alt=""
        className={styles.treeSwaySlow}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 4,
        }}
      />

      {/* z-index: 5 — main tree (foreground) */}
      <img
        src={MainTree}
        alt=""
        ref={treeRef}
        className={`${styles.MainTreeSvg} ${styles.treeSway}`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 5,
        }}
      />
    </>
  );
}
