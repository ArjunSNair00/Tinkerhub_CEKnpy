import { useState, useEffect } from "react";

export type StarShape = "circle" | "diamond" | "square" | "star";

interface StarfieldProps {
  count?: number;
  speed?: number;
  minSize?: number;
  maxSize?: number;
  shape?: StarShape;
  repelRadius?: number;
  repelStrength?: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

function Starfield({
  count = 100,
  speed = 1,
  minSize = 1,
  maxSize = 3,
  shape = "circle",
  repelRadius = 30,
  repelStrength = 0.5,
}: StarfieldProps) {
  const [stars, setStars] = useState<Star[]>(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.5 * speed,
      vy: (Math.random() - 0.5) * 0.5 * speed,
      size: Math.random() * (maxSize - minSize) + minSize,
      opacity: Math.random() * 0.5 + 0.5,
    }));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStars((prev) =>
        prev.map((star) => {
          // Repel from center of screen
          const dx = star.x - 50;
          const dy = star.y - 50;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let newVx = star.vx;
          let newVy = star.vy;

          if (dist < repelRadius && dist > 0) {
            const force =
              ((repelRadius - dist) / repelRadius) * repelStrength * speed;
            newVx += (dx / dist) * force;
            newVy += (dy / dist) * force;
          }

          // Damping
          newVx *= 0.99;
          newVy *= 0.99;

          // Random drift
          newVx += (Math.random() - 0.5) * 0.05 * speed;
          newVy += (Math.random() - 0.5) * 0.05 * speed;

          let newX = star.x + newVx;
          let newY = star.y + newVy;

          // Wrap around
          if (newX < 0) newX = 100;
          if (newX > 100) newX = 0;
          if (newY < 0) newY = 100;
          if (newY > 100) newY = 0;

          return { ...star, x: newX, y: newY, vx: newVx, vy: newVy };
        }),
      );
    }, 16);

    return () => clearInterval(interval);
  }, [speed, repelRadius, repelStrength]);

  // Re-initialize when count or size props change
  useEffect(() => {
    setStars(
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.5 * speed,
        vy: (Math.random() - 0.5) * 0.5 * speed,
        size: Math.random() * (maxSize - minSize) + minSize,
        opacity: Math.random() * 0.5 + 0.5,
      })),
    );
  }, [count, minSize, maxSize, speed]);

  const shapeClass =
    shape === "diamond"
      ? "star diamond"
      : shape === "square"
        ? "star square"
        : "star";

  return (
    <div className="starfield">
      {stars.map((star) =>
        shape === "star" ? (
          <span
            key={star.id}
            className="star-symbol"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              fontSize: `${star.size * 6}px`,
              opacity: star.opacity,
            }}
          >
            ✦
          </span>
        ) : (
          <div
            key={star.id}
            className={shapeClass}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
          />
        ),
      )}
    </div>
  );
}

export default Starfield;
