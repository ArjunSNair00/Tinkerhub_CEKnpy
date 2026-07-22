export default function CollegeName() {
  const scale = 0.8;
  return (
    <>
      <span
        className="bungee-inline-regular"
        style={{
          // fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          fontSize: "2rem",
          // fontWeight: 400,
          color: "#000000",
          // letterSpacing: "-0.02em",
          transform: `scale(${scale})`,
        }}
      >
        College of Engineering Karunagappally · Est. 2000
      </span>
    </>
  );
}
