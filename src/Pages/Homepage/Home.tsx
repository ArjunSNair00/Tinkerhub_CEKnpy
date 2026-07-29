import { useEffect } from "react";
import Lenis from "lenis";
import Hero from "./sections/hero.tsx";
import Workingonit from "./components/workingonit.tsx";
import Timeline from "../../../TINKERHUBTIMELINE TREE/timeline";

export default function Homepage() {
  useEffect(() => {
    const reduce = !!(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    if (reduce) return;

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    document.documentElement.classList.add("lenis");

    function raf(t: number) {
      lenis.raf(t);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return (
    <>
      {/* <Header /> */}
      <Hero />
      <div
        style={{
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          // top: "-px",
        }}
      >
        <Workingonit />
      </div>
      <Timeline />
    </>
  );
}
