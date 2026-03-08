import { useEffect, useRef } from "react";

const COLORS = [
  "#f1c40f", "#e74c3c", "#3498db", "#2ecc71",
  "#9b59b6", "#e67e22", "#1abc9c", "#ff6b6b",
  "#ffd93d", "#6bcb77", "#4d96ff", "#ff922b",
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  w: number;
  h: number;
  rotation: number;
  rotSpeed: number;
  shape: "rect" | "circle" | "ribbon";
}

function createParticles(width: number): Particle[] {
  return Array.from({ length: 130 }, (_, i) => {
    const spread = width * 0.8;
    const origin = width * 0.1 + Math.random() * spread;
    const shape = i % 3 === 0 ? "circle" : i % 3 === 1 ? "ribbon" : "rect";
    return {
      x: origin,
      y: -10 - Math.random() * 60,
      vx: (Math.random() - 0.5) * 5,
      vy: Math.random() * 3 + 2.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      w: shape === "circle" ? Math.random() * 9 + 5 : Math.random() * 12 + 6,
      h: shape === "circle" ? 0 : Math.random() * 5 + 3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.15,
      shape,
    };
  });
}

interface ConfettiProps {
  active: boolean;
}

export function Confetti({ active }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const particles = createParticles(canvas.width);
    const DURATION = 3800;
    let startTime: number | null = null;

    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let anyAlive = false;

      for (const p of particles) {
        p.x += p.vx;
        p.vy += 0.08;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.vx *= 0.995;

        const alpha = Math.max(0, 1 - Math.pow(progress, 1.6));
        if (alpha <= 0 || p.y > canvas.height + 30) continue;

        anyAlive = true;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "ribbon") {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }

        ctx.restore();
      }

      if (anyAlive && elapsed < DURATION) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
}
