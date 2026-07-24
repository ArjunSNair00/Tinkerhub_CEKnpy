export default function RigTool() {
  return (
    <div id="rig" aria-hidden="true" style={{ transform: "translateY(130px)" }}>
      <div className="rigtool" data-tool="hammer">
        <span className="rot">
          <svg viewBox="0 0 48 48">
            <path className="metal" d="M14 8 h18 v8 h-18 z" />
            <path className="stroke" d="M14 12 h-6 M32 12 q6 0 6 4" />
            <path className="grip" d="M21 16 h4 v22 a2 2 0 0 1-4 0 z" />
          </svg>
        </span>
      </div>
      <div className="rigtool" data-tool="screw">
        <span className="rot">
          <svg viewBox="0 0 48 48">
            <path className="metal" d="M22 4 h4 v14 h-4 z" />
            <path className="stroke" d="M22 4 l2 -2 2 2" />
            <path
              className="grip2"
              d="M19 18 h10 v6 a3 3 0 0 1-3 3 v15 a2 2 0 0 1-4 0 v-15 a3 3 0 0 1-3-3 z"
            />
          </svg>
        </span>
      </div>
      <div className="rigtool" data-tool="solder">
        <span className="rot">
          <svg viewBox="0 0 48 48">
            <circle
              className="tipglow"
              cx="9"
              cy="39"
              r="9"
              fill="#FFC400"
              opacity=".5"
            />
            <path className="metal" d="M9 39 l8 -8" />
            <path className="stroke" d="M9 39 l3 -3" />
            <path
              className="grip"
              d="M17 31 l14 -14 a3 3 0 0 1 4 0 l4 4 a3 3 0 0 1 0 4 l-14 14 z"
            />
            <path
              className="smoke stroke"
              d="M9 36 q-3 -4 0 -8 q3 -4 0 -8"
              style={{ stroke: "#9aa1ac", strokeWidth: 1.6 }}
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
