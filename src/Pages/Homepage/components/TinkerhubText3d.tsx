import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const FONT_URL =
  "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json";

/* ── Animation Presets ─────────────────────────────────────────────── */

type AnimPreset =
  | "none"
  | "pulse"
  | "wave"
  | "spin"
  | "bounce"
  | "float"
  | "shake";

const ANIM_PRESETS: { value: AnimPreset; label: string }[] = [
  { value: "none", label: "None" },
  { value: "pulse", label: "Pulse" },
  { value: "wave", label: "Wave" },
  { value: "spin", label: "Spin" },
  { value: "bounce", label: "Bounce" },
  { value: "float", label: "Float" },
  { value: "shake", label: "Shake" },
];

/* ── Dev panel defaults ─────────────────────────────────────────────── */

interface DevProps {
  text: string;
  fontSize: number;
  extrudeHeight: number;
  bevelThickness: number;
  bevelSize: number;
  colorTop: string;
  colorBot: string;
  colorSide: string;
  dripColor: string;
  wobbleAmount: number;
  dripIntensity: number;
  dripCount: number;
  cameraZ: number;
  rotSpeed: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  posX: number;
  posY: number;
  posZ: number;
  borderWidth: number;
  borderColor: string;
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  animPreset: AnimPreset;
  showPanel: boolean;
}

const DEFAULTS: DevProps = {
  text: "TINKERHUB",
  fontSize: 31,
  extrudeHeight: 30,
  bevelThickness: 5,
  bevelSize: 0.8,
  colorTop: "#ffb7c5",
  colorBot: "rgb(255, 45, 168)",
  colorSide: "rgb(140,8,70)",
  dripColor: "#ff2d78",
  wobbleAmount: 1,
  dripIntensity: 1,
  dripCount: 90,
  cameraZ: 300,
  rotSpeed: 3,
  rotX: 0,
  rotY: 12,
  rotZ: 0,
  posX: -17,
  posY: 51,
  posZ: -23,
  borderWidth: 0,
  borderColor: "#ff2d78",
  shadowBlur: 0,
  shadowColor: "#ff2d78",
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  animPreset: "float",
  showPanel: false,
};

/* ── Shaders ───────────────────────────────────────────────────────── */

const textVert = /* glsl */ `
  uniform float uTime;
  uniform float uWobble;
  uniform float uDripIntensity;
  varying vec2 vUv;
  varying float vY;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec3 vWorldNormal;

  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
  vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
    vec2 i=floor(v+dot(v,C.yy));
    vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
    vec4 x12=x0.xyxy+C.xxzz;
    x12.xy-=i1;
    i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
    vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
    m=m*m; m=m*m;
    vec3 x=2.*fract(p*C.www)-1.;
    vec3 h=abs(x)-.5;
    vec3 ox=floor(x+.5);
    vec3 a0=x-ox;
    m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
    vec3 g;
    g.x=a0.x*x0.x+h.x*x0.y;
    g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.*dot(m,g);
  }

  void main(){
    vUv=uv;
    vNormal=normalize(normalMatrix*normal);
    vWorldNormal=normalize((modelMatrix*vec4(normal,0.)).xyz);
    vec3 pos=position;
    float t=uTime;
    float yNorm=(pos.y+50.)/100.;
    float bottomW=smoothstep(0.4,0.,yNorm);
    float wx=snoise(vec2(pos.x*.015+t*.4, pos.z*.02))*.8*bottomW*uWobble;
    float wz=snoise(vec2(pos.y*.012+t*.3, pos.x*.02))*.6*bottomW*uWobble;
    pos.x+=wx;
    pos.z+=wz;
    float dripNoise=snoise(vec2(pos.x*.04+t*.25, pos.z*.03))*.5+.5;
    float dripZone=smoothstep(0.15,0.,yNorm);
    pos.y-=dripZone*dripNoise*6.*uDripIntensity;
    vec4 mv=modelViewMatrix*vec4(pos,1.);
    vViewPos=mv.xyz;
    vY=pos.y;
    gl_Position=projectionMatrix*mv;
  }
`;

const textFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorTop;
  uniform vec3 uColorBot;
  uniform vec3 uColorSide;
  varying vec2 vUv;
  varying float vY;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec3 vWorldNormal;

  void main(){
    float t=uTime;

    vec3 viewNormal=normalize(vNormal);
    float facing=abs(viewNormal.z);
    float sideFactor=smoothstep(0.7,0.3,facing);

    float g=smoothstep(60.,-60.,vY);
    vec3 frontCol=mix(uColorTop,uColorBot,g);

    vec3 col=mix(frontCol,uColorSide,sideFactor);

    float grain=sin(vUv.x*120.+t*2.)*sin(vUv.y*90.-t*1.5)*.04;
    col+=grain;

    vec3 lightDir=normalize(vec3(.3,.6,1.));
    float diff=max(dot(vNormal,lightDir),0.);
    col*=.7+diff*.4;

    vec3 viewDir=normalize(-vViewPos);
    float rim=1.-max(dot(viewDir,vNormal),0.);
    rim=pow(rim,3.);
    col+=rim*.15*uColorBot;

    gl_FragColor=vec4(col,1.);
  }
`;

const dripVert = /* glsl */ `
  uniform float uTime;
  attribute float aOffset;
  attribute float aSpeed;
  attribute float aPhase;
  attribute float aSize;
  varying float vAlpha;
  varying float vGlow;

  void main(){
    float t=uTime*aSpeed+aPhase;
    float cycle=mod(t,8.);
    float y=-mod(t*30.,200.)-10.;
    float x=aOffset+sin(t*2.)*8.;
    float z=sin(t*1.7+aPhase)*4.;
    vAlpha=smoothstep(0.,.5,cycle)*smoothstep(8.,7.,cycle);
    vAlpha*=smoothstep(-180.,-140.,y);
    vGlow=smoothstep(-60.,-10.,y);
    vec3 pos=vec3(x,y,z);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
    gl_PointSize=aSize*(1.+vGlow*.5);
  }
`;

const dripFrag = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vGlow;

  void main(){
    vec2 c=gl_PointCoord-.5;
    float d=length(c);
    if(d>.5) discard;
    float shape=smoothstep(.5,.1,d);
    float glow=vGlow*.3;
    vec3 col=uColor+glow;
    float a=shape*vAlpha;
    gl_FragColor=vec4(col,a);
  }
`;

/* ── Dev Panel ──────────────────────────────────────────────────────── */

function DevPanel({
  p,
  set,
}: {
  p: DevProps;
  set: <K extends keyof DevProps>(k: K, v: DevProps[K]) => void;
}) {
  const row = (label: string, children: React.ReactNode) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 4,
      }}
    >
      <span
        style={{
          width: 100,
          fontSize: 11,
          color: "#ccc",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );

  const slider = (
    key: keyof DevProps,
    min: number,
    max: number,
    step: number,
  ) => (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={p[key] as number}
      onChange={(e) => set(key, Number(e.target.value))}
      style={{ flex: 1, accentColor: "#ff2d78" }}
    />
  );

  const num = (key: keyof DevProps, min: number, max: number, step: number) => (
    <>
      {slider(key, min, max, step)}
      <span
        style={{
          fontSize: 11,
          color: "#aaa",
          width: 40,
          textAlign: "right",
        }}
      >
        {(p[key] as number).toFixed(step < 1 ? 1 : 0)}
      </span>
    </>
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        width: 280,
        background: "rgba(10,10,14,0.92)",
        border: "1px solid #333",
        borderRadius: 8,
        padding: "10px 14px",
        color: "#eee",
        fontFamily: "monospace",
        fontSize: 12,
        zIndex: 9999,
        backdropFilter: "blur(8px)",
        boxShadow: "0 8px 32px rgba(0,0,0,.5)",
        maxHeight: "calc(100vh - 24px)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 13, color: "#ff2d78" }}>
          Dev Tools
        </span>
        <button
          onClick={() => set("showPanel", false)}
          style={{
            background: "none",
            border: "1px solid #555",
            borderRadius: 4,
            color: "#aaa",
            fontSize: 14,
            cursor: "pointer",
            padding: "0 6px",
            lineHeight: "18px",
          }}
        >
          ×
        </button>
      </div>

      {/* text */}
      <div style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "#999" }}>text</span>
        <input
          value={p.text}
          onChange={(e) => set("text", e.target.value)}
          style={{
            width: "100%",
            marginTop: 2,
            background: "#1a1a24",
            border: "1px solid #444",
            borderRadius: 4,
            color: "#fff",
            padding: "4px 6px",
            fontFamily: "monospace",
            fontSize: 12,
            outline: "none",
          }}
        />
      </div>

      {/* animation preset */}
      <div
        style={{
          borderTop: "1px solid #333",
          paddingTop: 6,
          marginTop: 6,
        }}
      >
        <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>
          ANIMATION PRESET
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {ANIM_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => set("animPreset", preset.value)}
              style={{
                padding: "3px 8px",
                fontSize: 10,
                borderRadius: 4,
                border:
                  p.animPreset === preset.value
                    ? "1px solid #ff2d78"
                    : "1px solid #444",
                background:
                  p.animPreset === preset.value
                    ? "rgba(255,45,120,0.2)"
                    : "rgba(30,30,40,0.8)",
                color: p.animPreset === preset.value ? "#ff2d78" : "#aaa",
                cursor: "pointer",
                fontFamily: "monospace",
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* geometry */}
      <div
        style={{
          borderTop: "1px solid #333",
          paddingTop: 6,
          marginTop: 6,
        }}
      >
        <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>
          GEOMETRY
        </div>
        {row("font size", num("fontSize", 8, 40, 1))}
        {row("extrude", num("extrudeHeight", 0, 30, 0.5))}
        {row("bevel thick", num("bevelThickness", 0, 5, 0.1))}
        {row("bevel size", num("bevelSize", 0, 5, 0.1))}
      </div>

      {/* position */}
      <div
        style={{
          borderTop: "1px solid #333",
          paddingTop: 6,
          marginTop: 6,
        }}
      >
        <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>
          POSITION
        </div>
        {row("pos X", num("posX", -200, 200, 1))}
        {row("pos Y", num("posY", -200, 200, 1))}
        {row("pos Z", num("posZ", -200, 200, 1))}
      </div>

      {/* colors */}
      <div
        style={{
          borderTop: "1px solid #333",
          paddingTop: 6,
          marginTop: 6,
        }}
      >
        <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>
          COLORS
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <label
            style={{
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            front
            <input
              type="color"
              value={p.colorTop}
              onChange={(e) => set("colorTop", e.target.value)}
              style={{
                width: 28,
                height: 20,
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            />
          </label>
          <label
            style={{
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            back
            <input
              type="color"
              value={p.colorBot}
              onChange={(e) => set("colorBot", e.target.value)}
              style={{
                width: 28,
                height: 20,
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            />
          </label>
          <label
            style={{
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            side
            <input
              type="color"
              value={p.colorSide}
              onChange={(e) => set("colorSide", e.target.value)}
              style={{
                width: 28,
                height: 20,
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            />
          </label>
          <label
            style={{
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            drip
            <input
              type="color"
              value={p.dripColor}
              onChange={(e) => set("dripColor", e.target.value)}
              style={{
                width: 28,
                height: 20,
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            />
          </label>
        </div>
      </div>

      {/* effects */}
      <div
        style={{
          borderTop: "1px solid #333",
          paddingTop: 6,
          marginTop: 6,
        }}
      >
        <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>
          EFFECTS
        </div>
        {row("wobble", num("wobbleAmount", 0, 3, 0.1))}
        {row("drip intensity", num("dripIntensity", 0, 3, 0.1))}
        {row("drip count", num("dripCount", 0, 300, 10))}
      </div>

      {/* camera */}
      <div
        style={{
          borderTop: "1px solid #333",
          paddingTop: 6,
          marginTop: 6,
        }}
      >
        <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>
          CAMERA
        </div>
        {row("distance", num("cameraZ", 80, 600, 10))}
        {row("rot speed", num("rotSpeed", 0, 3, 0.1))}
      </div>

      {/* rotation */}
      <div
        style={{
          borderTop: "1px solid #333",
          paddingTop: 6,
          marginTop: 6,
        }}
      >
        <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>
          ROTATION (deg)
        </div>
        {row("x", num("rotX", -180, 180, 1))}
        {row("y", num("rotY", -180, 180, 1))}
        {row("z", num("rotZ", -180, 180, 1))}
      </div>

      {/* border */}
      <div
        style={{
          borderTop: "1px solid #333",
          paddingTop: 6,
          marginTop: 6,
        }}
      >
        <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>
          BORDER
        </div>
        {row("width", num("borderWidth", 0, 20, 0.5))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{ width: 100, fontSize: 11, color: "#ccc", flexShrink: 0 }}
          >
            color
          </span>
          <input
            type="color"
            value={p.borderColor}
            onChange={(e) => set("borderColor", e.target.value)}
            style={{
              width: 28,
              height: 20,
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          />
        </div>
      </div>

      {/* shadow */}
      <div
        style={{
          borderTop: "1px solid #333",
          paddingTop: 6,
          marginTop: 6,
        }}
      >
        <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>
          SHADOW
        </div>
        {row("blur", num("shadowBlur", 0, 80, 1))}
        {row("offset X", num("shadowOffsetX", -40, 40, 1))}
        {row("offset Y", num("shadowOffsetY", -40, 40, 1))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{ width: 100, fontSize: 11, color: "#ccc", flexShrink: 0 }}
          >
            color
          </span>
          <input
            type="color"
            value={p.shadowColor}
            onChange={(e) => set("shadowColor", e.target.value)}
            style={{
              width: 28,
              height: 20,
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Toggle button (always visible) ─────────────────────────────────── */

function DevToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Toggle Dev Tools"
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 6,
        border: "1px solid #444",
        background: "rgba(10,10,14,0.8)",
        color: "#ff2d78",
        fontSize: 16,
        cursor: "pointer",
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
      }}
    >
      ⚙
    </button>
  );
}

/* ── Component ─────────────────────────────────────────────────────── */

export default function TinkerhubText3d() {
  const mountRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef<DevProps>({ ...DEFAULTS });
  const [props, setProps] = useState<DevProps>({ ...DEFAULTS });

  const set = useCallback(<K extends keyof DevProps>(k: K, v: DevProps[K]) => {
    setProps((prev) => {
      const next = { ...prev, [k]: v };
      propsRef.current = next;
      return next;
    });
  }, []);

  const togglePanel = useCallback(() => {
    set("showPanel", !propsRef.current.showPanel);
  }, [set]);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    const cfg = propsRef.current;
    const el = host; // narrowed for closures

    /* renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    /* scene + camera */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 2000);
    camera.position.set(0, 0, cfg.cameraZ);

    /* lights */
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(50, 80, 120);
    scene.add(dir);

    const group = new THREE.Group();
    scene.add(group);

    /* text material */
    const textMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uWobble: { value: cfg.wobbleAmount },
        uDripIntensity: { value: cfg.dripIntensity },
        uColorTop: { value: new THREE.Color(cfg.colorTop) },
        uColorBot: { value: new THREE.Color(cfg.colorBot) },
        uColorSide: { value: new THREE.Color(cfg.colorSide) },
      },
      vertexShader: textVert,
      fragmentShader: textFrag,
      side: THREE.DoubleSide,
    });

    /* drip material */
    const dripMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(cfg.dripColor) },
      },
      vertexShader: dripVert,
      fragmentShader: dripFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    let textMesh: THREE.Mesh | null = null;
    let outlineMesh: THREE.Mesh | null = null;
    let shadowMesh: THREE.Mesh | null = null;
    let dripPoints: THREE.Points | null = null;
    let textWidth = 0;
    let loadedFont: any = null;

    /* materials for outline and shadow */
    const outlineMat = new THREE.MeshBasicMaterial({
      color: cfg.borderColor,
      side: THREE.DoubleSide,
    });
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });

    /* ── rebuild text when geometry props change ──────────────────── */
    function rebuildText() {
      if (!loadedFont) return;

      // remove old meshes
      for (const m of [textMesh, outlineMesh, shadowMesh]) {
        if (m) {
          group.remove(m);
          m.geometry.dispose();
        }
      }
      textMesh = null;
      outlineMesh = null;
      shadowMesh = null;

      const c = propsRef.current;

      const effectiveHeight = c.extrudeHeight <= 0 ? 0.001 : c.extrudeHeight;
      const hasDepth = c.extrudeHeight > 0;

      const geo = new TextGeometry(c.text, {
        font: loadedFont,
        size: c.fontSize,
        depth: effectiveHeight,
        curveSegments: 12,
        bevelEnabled: hasDepth && (c.bevelThickness > 0 || c.bevelSize > 0),
        bevelThickness: hasDepth ? c.bevelThickness : 0,
        bevelSize: hasDepth ? c.bevelSize : 0,
        bevelSegments: hasDepth ? 5 : 1,
      });
      geo.computeBoundingBox();
      const bb = geo.boundingBox!;
      const w = bb.max.x - bb.min.x;
      const h = bb.max.y - bb.min.y;
      textWidth = w;
      geo.translate(-w / 2, -h / 2, -effectiveHeight / 2);

      textMesh = new THREE.Mesh(geo, textMat);
      group.add(textMesh);

      /* ── outline (border) mesh ────────────────────────────────── */
      if (c.borderWidth > 0) {
        const outGeo = new TextGeometry(c.text, {
          font: loadedFont,
          size: c.fontSize + c.borderWidth * 2,
          depth: effectiveHeight + 0.5,
          curveSegments: 12,
          bevelEnabled: false,
        });
        outGeo.computeBoundingBox();
        const obb = outGeo.boundingBox!;
        const ow = obb.max.x - obb.min.x;
        const oh = obb.max.y - obb.min.y;
        outGeo.translate(-ow / 2, -oh / 2, -(effectiveHeight + 0.5) / 2 - 0.3);

        outlineMat.color.set(c.borderColor);
        outlineMesh = new THREE.Mesh(outGeo, outlineMat);
        group.add(outlineMesh);
      }

      /* ── shadow mesh ──────────────────────────────────────────── */
      if (c.shadowBlur > 0) {
        const shGeo = new TextGeometry(c.text, {
          font: loadedFont,
          size: c.fontSize,
          depth: effectiveHeight,
          curveSegments: 12,
          bevelEnabled: false,
        });
        shGeo.computeBoundingBox();
        const sb = shGeo.boundingBox!;
        const sw = sb.max.x - sb.min.x;
        const sh2 = sb.max.y - sb.min.y;
        shGeo.translate(-sw / 2, -sh2 / 2, -effectiveHeight / 2);

        shadowMat.opacity = Math.min(c.shadowBlur / 80, 0.6);
        shadowMesh = new THREE.Mesh(shGeo, shadowMat);
        shadowMesh.position.set(
          c.shadowOffsetX,
          c.shadowOffsetY,
          -effectiveHeight - 2,
        );
        group.add(shadowMesh);
      }

      rebuildDrips();
    }

    /* ── rebuild drips when count changes ─────────────────────────── */
    function rebuildDrips() {
      if (dripPoints) {
        group.remove(dripPoints);
        dripPoints.geometry.dispose();
        dripPoints = null;
      }
      if (textWidth <= 0) return;

      const c = propsRef.current;
      const COUNT = Math.round(c.dripCount);
      if (COUNT <= 0) return;

      const positions = new Float32Array(COUNT * 3);
      const offsets = new Float32Array(COUNT);
      const speeds = new Float32Array(COUNT);
      const phases = new Float32Array(COUNT);
      const sizes = new Float32Array(COUNT);

      for (let i = 0; i < COUNT; i++) {
        offsets[i] = (Math.random() - 0.5) * textWidth;
        speeds[i] = 0.4 + Math.random() * 0.8;
        phases[i] = Math.random() * Math.PI * 2;
        sizes[i] = 2 + Math.random() * 4;
        positions[i * 3] = offsets[i];
        positions[i * 3 + 1] = -100 - Math.random() * 80;
        positions[i * 3 + 2] = 0;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));
      geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
      geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
      geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

      dripPoints = new THREE.Points(geo, dripMat);
      group.add(dripPoints);
    }

    /* ── load font ────────────────────────────────────────────────── */
    const loader = new FontLoader();
    loader.load(
      FONT_URL,
      (font) => {
        loadedFont = font;
        rebuildText();
      },
      undefined,
      () => {},
    );

    /* ── resize — canvas is 3x container so 3D text has room ──────── */
    function resize() {
      const rect = el.getBoundingClientRect();
      const w = rect.width || 800;
      const h = rect.height || 260;
      const S = 3;
      renderer.setSize(w * S, h * S, false);
      renderer.domElement.style.width = w + "px";
      renderer.domElement.style.height = h + "px";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    /* ── animation loop ──────────────────────────────────────────── */
    let raf = 0;
    let t = 0;
    let last = performance.now();

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      const c = propsRef.current;

      // hot-update uniforms
      textMat.uniforms.uTime.value = t;
      textMat.uniforms.uWobble.value = c.wobbleAmount;
      textMat.uniforms.uDripIntensity.value = c.dripIntensity;
      textMat.uniforms.uColorTop.value.set(c.colorTop);
      textMat.uniforms.uColorBot.value.set(c.colorBot);
      textMat.uniforms.uColorSide.value.set(c.colorSide);

      dripMat.uniforms.uTime.value = t;
      dripMat.uniforms.uColor.value.set(c.dripColor);

      camera.position.z = c.cameraZ;

      // position from dev controls
      group.position.set(c.posX, c.posY, c.posZ);

      // base rotation from dev controls
      const deg2rad = Math.PI / 180;
      let rx = c.rotX * deg2rad;
      let ry = c.rotY * deg2rad;
      let rz = c.rotZ * deg2rad;
      let sx = 1;
      let sy = 1;
      let sz = 1;

      // animation presets
      switch (c.animPreset) {
        case "pulse": {
          const pulse = 1 + Math.sin(t * 3) * 0.08;
          sx = sy = sz = pulse;
          break;
        }
        case "wave": {
          ry += Math.sin(t * 1.5) * 0.3;
          rx += Math.cos(t * 1.2) * 0.1;
          group.position.y += Math.sin(t * 2) * 5;
          break;
        }
        case "spin": {
          ry += t * 1.2 * c.rotSpeed;
          break;
        }
        case "bounce": {
          const bounce = Math.abs(Math.sin(t * 2.5)) * 20;
          group.position.y += bounce;
          // squash & stretch
          const squash = 1 - Math.abs(Math.sin(t * 2.5)) * 0.1;
          sy = squash;
          sx = sz = 1 + (1 - squash) * 0.5;
          break;
        }
        case "float": {
          group.position.y += Math.sin(t * 0.8) * 8;
          group.position.x += Math.cos(t * 0.5) * 3;
          ry += Math.sin(t * 0.6) * 0.05;
          rx += Math.cos(t * 0.4) * 0.03;
          break;
        }
        case "shake": {
          const intensity = 2;
          group.position.x += (Math.random() - 0.5) * intensity;
          group.position.y += (Math.random() - 0.5) * intensity;
          rz += (Math.random() - 0.5) * 0.02;
          break;
        }
        case "none":
        default:
          break;
      }

      // idle wobble (always subtle unless animPreset overrides)
      rx += Math.sin(t * 0.2) * 0.008 * c.rotSpeed;
      ry += Math.sin(t * 0.3) * 0.025 * c.rotSpeed;

      group.rotation.set(rx, ry, rz);
      group.scale.set(sx, sy, sz);

      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(tick);

    /* ── watch for geometry rebuilds ──────────────────────────────── */
    let prevText = cfg.text;
    let prevFontSize = cfg.fontSize;
    let prevExtrude = cfg.extrudeHeight;
    let prevBt = cfg.bevelThickness;
    let prevBs = cfg.bevelSize;
    let prevDripCount = cfg.dripCount;
    let prevBorderWidth = cfg.borderWidth;
    let prevBorderColor = cfg.borderColor;
    let prevShadowBlur = cfg.shadowBlur;
    let prevShadowOffsetX = cfg.shadowOffsetX;
    let prevShadowOffsetY = cfg.shadowOffsetY;

    const checkRebuild = setInterval(() => {
      const c = propsRef.current;
      const geomChanged =
        c.text !== prevText ||
        c.fontSize !== prevFontSize ||
        c.extrudeHeight !== prevExtrude ||
        c.bevelThickness !== prevBt ||
        c.bevelSize !== prevBs;
      if (geomChanged) {
        prevText = c.text;
        prevFontSize = c.fontSize;
        prevExtrude = c.extrudeHeight;
        prevBt = c.bevelThickness;
        prevBs = c.bevelSize;
        rebuildText();
      }
      const borderShadowChanged =
        c.borderWidth !== prevBorderWidth ||
        c.borderColor !== prevBorderColor ||
        c.shadowBlur !== prevShadowBlur ||
        c.shadowOffsetX !== prevShadowOffsetX ||
        c.shadowOffsetY !== prevShadowOffsetY;
      if (borderShadowChanged) {
        prevBorderWidth = c.borderWidth;
        prevBorderColor = c.borderColor;
        prevShadowBlur = c.shadowBlur;
        prevShadowOffsetX = c.shadowOffsetX;
        prevShadowOffsetY = c.shadowOffsetY;
        rebuildText();
      }
      if (c.dripCount !== prevDripCount) {
        prevDripCount = c.dripCount;
        rebuildDrips();
      }
    }, 200);

    /* ── cleanup ─────────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(checkRebuild);
      ro.disconnect();
      renderer.dispose();
      el.removeChild(renderer.domElement);
      textMat.dispose();
      dripMat.dispose();
      outlineMat.dispose();
      shadowMat.dispose();
      for (const m of [textMesh, outlineMesh, shadowMesh]) {
        if (m) m.geometry.dispose();
      }
      if (dripPoints) dripPoints.geometry.dispose();
    };
  }, []);

  return (
    <>
      <div className="hero-art" id="heroArt" style={{ overflow: "visible" }}>
        <div className="wordmark-pos" style={{ overflow: "visible" }}>
          <div
            className="wordmark asm"
            data-asm="hammer"
            id="heroWord"
            style={{ overflow: "visible" }}
          >
            <div
              ref={mountRef}
              style={{
                width: "300%",
                height: "600px",
                position: "absolute",
                left: "-100%",
                top: "-170px",
                overflow: "visible",
              }}
            />
          </div>
        </div>

        <span className="corner-box tl">
          <svg viewBox="0 0 112 82" aria-hidden="true">
            <rect x="0" y="0" width="82" height="22" rx="7" />
            <rect x="90" y="0" width="22" height="22" rx="7" />
            <rect x="0" y="30" width="82" height="22" rx="7" />
            <rect x="0" y="60" width="22" height="22" rx="7" />
            <rect x="30" y="60" width="22" height="22" rx="11" />
            <rect x="60" y="60" width="22" height="22" rx="11" />
          </svg>
          <span className="cb-txt">EST · 1999</span>
        </span>
        <span className="corner-box br">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
          </svg>
          <span className="cb-txt">KOLLAM · KL</span>
        </span>
      </div>

      {/* dev tools */}
      {props.showPanel ? (
        <DevPanel p={props} set={set} />
      ) : (
        <DevToggle onClick={togglePanel} />
      )}
    </>
  );
}
