import type { StarShape } from "./Starfield";

interface DevControlsProps {
  count: number;
  speed: number;
  minSize: number;
  maxSize: number;
  shape: StarShape;
  onCountChange: (v: number) => void;
  onSpeedChange: (v: number) => void;
  onMinSizeChange: (v: number) => void;
  onMaxSizeChange: (v: number) => void;
  onShapeChange: (v: StarShape) => void;
}

const shapes: StarShape[] = ["circle", "diamond", "square", "star"];

function DevControls({
  count,
  speed,
  minSize,
  maxSize,
  shape,
  onCountChange,
  onSpeedChange,
  onMinSizeChange,
  onMaxSizeChange,
  onShapeChange,
}: DevControlsProps) {
  return (
    <div className="dev-controls">
      <div className="dev-header">⚙ Starfield Controls</div>

      <label>
        Count: {count}
        <input
          type="range"
          min={10}
          max={500}
          value={count}
          onChange={(e) => onCountChange(Number(e.target.value))}
        />
      </label>

      <label>
        Speed: {speed.toFixed(1)}
        <input
          type="range"
          min={0}
          max={5}
          step={0.1}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        />
      </label>

      <label>
        Min Size: {minSize}px
        <input
          type="range"
          min={0.5}
          max={10}
          step={0.5}
          value={minSize}
          onChange={(e) => onMinSizeChange(Number(e.target.value))}
        />
      </label>

      <label>
        Max Size: {maxSize}px
        <input
          type="range"
          min={1}
          max={15}
          step={0.5}
          value={maxSize}
          onChange={(e) => onMaxSizeChange(Number(e.target.value))}
        />
      </label>

      <label>
        Shape:
        <select
          value={shape}
          onChange={(e) => onShapeChange(e.target.value as StarShape)}
        >
          {shapes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default DevControls;
