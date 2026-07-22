import Logo from "./components/Logo";
import Workingonit from "./components/workingonit";

function App() {
  // const [count, setCount] = useState(100);
  // const [speed, setSpeed] = useState(1);
  // const [minSize, setMinSize] = useState(1);
  // const [maxSize, setMaxSize] = useState(3);
  // const [shape, setShape] = useState<StarShape>("circle");

  return (
    <div className="app-container" style={{ flexDirection: "column" }}>
      {/* <Starfield
        count={count}
        speed={speed}
        minSize={minSize}
        maxSize={maxSize}
        shape={shape}
      /> */}

      <Workingonit />
      <Logo />
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
