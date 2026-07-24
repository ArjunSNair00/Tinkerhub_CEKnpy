import styles from "./collegeHead.module.css";

export default function CollegeHead() {
  return (
    <div
      style={{
        // backdropFilter: "blur(18px)",
        // background: "rgba(255,255,255,0.22)",
        border: "1px solid rgba(255,255,255,.2)",
      }}
    >
      <div style={{ position: "relative", top: "clamp(20px, 5vw, 60px)" }}>
        <span className="mh-tick l"></span>
        <span className="mh-tick r"></span>
        <span className="mh-tick l b"></span>
        <span className="mh-tick r b"></span>
        <div className="mh-kick">
          <span>Est. 1999</span>
          <span className="dot">•</span>
          <span>Government Engineering College</span>
          <span className="dot">•</span>
          <span>KTU</span>
          <span className="dot">•</span>
          <span>AICTE</span>
          <span className="dot">•</span>
          <span>Thodiyur, Kollam</span>
        </div>
      </div>
      <div
        className={styles.mhTitle}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          position: "relative",
          top: "clamp(-60px, -8vw, -100px)",
        }}
      >
        <span className={styles.mhCaps}>College of Engineering</span>
        <span className={styles.mhSerif}>Karunagappally</span>
      </div>
    </div>
  );
}
