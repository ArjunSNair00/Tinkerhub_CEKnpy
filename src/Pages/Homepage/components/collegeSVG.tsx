export default function CollegeSVG() {
  return (
    <svg
      className="cek"
      id="cekBuilding"
      viewBox="0 0 320 300"
      role="img"
      aria-label="College of Engineering Karunagappally"
    >
      <defs>
        <pattern id="ht" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1.4" cy="1.4" r="1.05" fill="#1c1c1c" />
        </pattern>
        <filter id="wob" x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.013"
            numOctaves="2"
            seed="7"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.7" />
        </filter>
      </defs>
      <g filter="url(#wob)">
        <rect
          x="8"
          y="170"
          width="64"
          height="80"
          fill="#f1f0ec"
          stroke="#1b1b1b"
          strokeWidth="2"
        />
        <polygon
          points="4,170 40,150 76,170"
          fill="#6e6e6e"
          stroke="#1b1b1b"
          strokeWidth="1.6"
        />
        <rect x="28" y="192" width="24" height="34" fill="#161616" />
        <rect
          x="248"
          y="170"
          width="64"
          height="80"
          fill="#f1f0ec"
          stroke="#1b1b1b"
          strokeWidth="2"
        />
        <polygon
          points="244,170 280,150 316,170"
          fill="#6e6e6e"
          stroke="#1b1b1b"
          strokeWidth="1.6"
        />
        <rect x="268" y="192" width="24" height="34" fill="#161616" />
        <rect
          x="72"
          y="120"
          width="176"
          height="130"
          fill="#f1f0ec"
          stroke="#1b1b1b"
          strokeWidth="2"
        />
        <polygon
          points="62,120 112,84 208,84 258,120"
          fill="#6e6e6e"
          stroke="#1b1b1b"
          strokeWidth="1.6"
        />
        <line
          x1="92"
          y1="96"
          x2="228"
          y2="96"
          stroke="#4a4a4a"
          strokeWidth="1"
        />
        <line
          x1="82"
          y1="106"
          x2="238"
          y2="106"
          stroke="#4a4a4a"
          strokeWidth="1"
        />
        <line
          x1="72"
          y1="116"
          x2="248"
          y2="116"
          stroke="#4a4a4a"
          strokeWidth="1"
        />
        <rect
          x="142"
          y="62"
          width="36"
          height="22"
          fill="#f1f0ec"
          stroke="#1b1b1b"
          strokeWidth="1.6"
        />
        <line
          x1="150"
          y1="62"
          x2="150"
          y2="84"
          stroke="#1b1b1b"
          strokeWidth="1"
        />
        <line
          x1="160"
          y1="62"
          x2="160"
          y2="84"
          stroke="#1b1b1b"
          strokeWidth="1"
        />
        <line
          x1="170"
          y1="62"
          x2="170"
          y2="84"
          stroke="#1b1b1b"
          strokeWidth="1"
        />
        <polygon
          points="138,62 160,44 182,62"
          fill="#6e6e6e"
          stroke="#1b1b1b"
          strokeWidth="1.6"
        />
        <line
          x1="160"
          y1="44"
          x2="160"
          y2="18"
          stroke="#1b1b1b"
          strokeWidth="2"
        />
        <polygon points="160,19 184,24 160,31" fill="#4a4a4a" />
        <rect x="96" y="132" width="26" height="40" fill="#161616" />
        <rect x="147" y="132" width="26" height="40" fill="#161616" />
        <rect x="198" y="132" width="26" height="40" fill="#161616" />
        <rect
          x="78"
          y="176"
          width="164"
          height="20"
          fill="#f4f3ef"
          stroke="#1b1b1b"
          strokeWidth="1.6"
        />
        <rect x="80" y="196" width="160" height="54" fill="#262626" />
        <rect
          x="86"
          y="196"
          width="14"
          height="54"
          fill="#e9e8e3"
          stroke="#1b1b1b"
          strokeWidth="1.2"
        />
        <rect
          x="122"
          y="196"
          width="14"
          height="54"
          fill="#e9e8e3"
          stroke="#1b1b1b"
          strokeWidth="1.2"
        />
        <rect
          x="184"
          y="196"
          width="14"
          height="54"
          fill="#e9e8e3"
          stroke="#1b1b1b"
          strokeWidth="1.2"
        />
        <rect
          x="220"
          y="196"
          width="14"
          height="54"
          fill="#e9e8e3"
          stroke="#1b1b1b"
          strokeWidth="1.2"
        />
        <rect x="70" y="250" width="180" height="6" fill="#d9d8d3" />
        <rect x="6" y="250" width="68" height="5" fill="#d9d8d3" />
        <rect x="246" y="250" width="68" height="5" fill="#d9d8d3" />
        <rect
          x="160"
          y="120"
          width="98"
          height="130"
          fill="url(#ht)"
          opacity="0.16"
        />
        <rect
          x="248"
          y="170"
          width="64"
          height="80"
          fill="url(#ht)"
          opacity="0.14"
        />
      </g>
      <text
        x="160"
        y="190"
        textAnchor="middle"
        fontFamily="'Chakra Petch',sans-serif"
        fontWeight="700"
        fontSize="6.7"
        letterSpacing="0.3"
        fill="#161616"
      >
        GOVERNMENT ENGINEERING COLLEGE, KERALA
      </text>
    </svg>
  );
}
