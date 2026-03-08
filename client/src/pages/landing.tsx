import { useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Gamepad2, Trophy, Zap } from "lucide-react";

const PARTICLE_COUNT = 22;

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

function useParticles(): Particle[] {
  return useMemo(() => {
    const colors = [
      "rgba(139,92,246,0.55)",
      "rgba(99,102,241,0.45)",
      "rgba(56,189,248,0.40)",
      "rgba(168,85,247,0.50)",
      "rgba(59,130,246,0.35)",
      "rgba(236,72,153,0.30)",
    ];
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: (i * 4.7 + 3) % 96,
      y: (i * 7.3 + 5) % 92,
      size: 3 + (i % 5) * 2.2,
      color: colors[i % colors.length],
      duration: 5 + (i % 6) * 1.4,
      delay: (i * 0.38) % 4,
      driftX: ((i % 3) - 1) * 18,
      driftY: -28 - (i % 4) * 14,
    }));
  }, []);
}

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const particles = useParticles();

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 40%, #1a0b3e 0%, #0d0a2e 35%, #060016 70%, #020008 100%)",
      }}
    >
      {/* Ambient orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "15%",
          left: "20%",
          width: 340,
          height: 340,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "18%",
          right: "18%",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          filter: "blur(36px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "55%",
          left: "55%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56,189,248,0.10) 0%, transparent 70%)",
          filter: "blur(32px)",
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
          animate={{
            x: [0, p.driftX, 0],
            y: [0, p.driftY, 0],
            opacity: [0.2, 0.9, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          className="mb-8 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.7, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div
            className="relative flex items-center justify-center"
            animate={{
              filter: [
                "drop-shadow(0 0 10px rgba(139,92,246,0.7)) drop-shadow(0 0 24px rgba(99,102,241,0.4))",
                "drop-shadow(0 0 22px rgba(139,92,246,1)) drop-shadow(0 0 50px rgba(99,102,241,0.65)) drop-shadow(0 0 80px rgba(56,189,248,0.3))",
                "drop-shadow(0 0 10px rgba(139,92,246,0.7)) drop-shadow(0 0 24px rgba(99,102,241,0.4))",
              ],
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(99,102,241,0.20) 50%, rgba(56,189,248,0.15) 100%)",
                border: "1px solid rgba(139,92,246,0.35)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Gamepad2 className="w-12 h-12" style={{ color: "#a78bfa" }} />
            </div>
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-black leading-tight mb-4 tracking-tight"
          style={{
            fontSize: "clamp(2.2rem, 6vw, 4rem)",
            background:
              "linear-gradient(135deg, #e9d5ff 0%, #a78bfa 35%, #818cf8 65%, #38bdf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          Scorely
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="mb-10 leading-relaxed font-medium"
          style={{
            color: "rgba(196,181,253,0.82)",
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            maxWidth: 440,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          Track scores, crown winners, and make every game night competitive.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.button
            data-testid="button-start-leaderboard"
            onClick={() => setLocation("/dashboard")}
            className="relative group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg text-white cursor-pointer select-none overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #3b82f6 100%)",
              border: "1px solid rgba(139,92,246,0.5)",
              boxShadow:
                "0 4px 24px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
            whileHover={{
              scale: 1.04,
              boxShadow:
                "0 0 0 2px rgba(167,139,250,0.5), 0 8px 48px rgba(124,58,237,0.7), 0 0 80px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            {/* Inner shimmer overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
              }}
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            <Zap className="w-5 h-5 flex-shrink-0" />
            Start a Leaderboard
            <Trophy className="w-5 h-5 flex-shrink-0" />
          </motion.button>
        </motion.div>

        {/* Feature hints */}
        <motion.div
          className="flex items-center gap-6 mt-10 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {["Real-time updates", "Shareable links", "Live animations"].map((feat) => (
            <span
              key={feat}
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "rgba(167,139,250,0.65)" }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "rgba(139,92,246,0.8)" }}
              />
              {feat}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
