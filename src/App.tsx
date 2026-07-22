import { useState, useEffect } from "react";
// import Starfield from "./components/Starfield";
// import type { StarShape } from "./components/Starfield";
// import DevControls from "./components/DevControls";

function App() {
  const [dots, setDots] = useState("");
  // const [count, setCount] = useState(100);
  // const [speed, setSpeed] = useState(1);
  // const [minSize, setMinSize] = useState(1);
  // const [maxSize, setMaxSize] = useState(3);
  // const [shape, setShape] = useState<StarShape>("circle");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      {/* <Starfield
        count={count}
        speed={speed}
        minSize={minSize}
        maxSize={maxSize}
        shape={shape}
      /> */}
      <h1
        className="micro-5-charted-regular"
        style={{ fontSize: "10rem", zIndex: 10 }}
      >
        Working on it{dots}
      </h1>

      {/* <DevControls
        count={count}
        speed={speed}
        minSize={minSize}
        maxSize={maxSize}
        shape={shape}
        onCountChange={setCount}
        onSpeedChange={setSpeed}
        onMinSizeChange={setMinSize}
        onMaxSizeChange={setMaxSize}
        onShapeChange={setShape}
      /> */}
    </div>
  );
}

export default App;
