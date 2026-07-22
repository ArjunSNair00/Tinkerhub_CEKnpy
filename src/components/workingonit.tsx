import { useState, useEffect } from "react";

export default function Workingonit() {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);
  return (
    <h1
      className="micro-5-charted-regular"
      style={{ fontSize: "10rem", zIndex: 10 }}
    >
      Working on it{dots}
    </h1>
  );
}
