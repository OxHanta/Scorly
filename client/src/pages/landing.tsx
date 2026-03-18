import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Trophy, Medal, Crown, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const DEMO_PLAYERS = [
  { id: 1, name: "Alex",   score: 2450, barColor: "bg-blue-500",    icon: <Crown className="w-5 h-5 text-yellow-400" /> },
  { id: 2, name: "Jordan", score: 1820, barColor: "bg-emerald-500",  icon: <Medal className="w-5 h-5 text-slate-300" /> },
  { id: 3, name: "Sam",    score: 1340, barColor: "bg-amber-500",    icon: <Medal className="w-5 h-5 text-amber-700" /> },
  { id: 4, name: "Casey",  score:  980, barColor: "bg-purple-500",   icon: <Star  className="w-5 h-5 text-slate-400" /> },
  { id: 5, name: "Taylor", score:  650, barColor: "bg-rose-500",     icon: <Star  className="w-5 h-5 text-slate-500" /> },
];

const INITIALS_COLORS = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-purple-600",
  "bg-rose-600",
];

function InitialAvatar({ name, colorClass }: { name: string; colorClass: string }) {
  return (
    <div
      className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-sm text-white ${colorClass}`}
      aria-label={name}
    >
      {name[0]}
    </div>
  );
}

export default function LandingPage() {
  const [, setLocation] = useLocation();

  const [scores, setScores] = useState(
    DEMO_PLAYERS.map((p, i) => ({ ...p, colorIdx: i }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setScores((prev) => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * next.length);
        next[idx] = {
          ...next[idx],
          score: next[idx].score + Math.floor(Math.random() * 50) + 10,
        };
        return next.sort((a, b) => b.score - a.score);
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const maxScore = Math.max(...scores.map((s) => s.score));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-6xl w-full z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* ── Left column: copy + CTA ── */}
        <div className="flex flex-col items-start text-left space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-sm">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Scorely
              </span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-slate-300 max-w-lg leading-relaxed">
              Track scores, crown winners, and make every game night competitive.
            </p>
          </div>

          <Button
            data-testid="button-start-leaderboard"
            size="lg"
            onClick={() => setLocation("/dashboard")}
            className="h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] transition-all hover:scale-105"
          >
            Start a Leaderboard
            <Play className="ml-2 w-5 h-5 fill-current" />
          </Button>

          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium pt-2">
            <div className="flex -space-x-2">
              {["A", "B", "C", "D"].map((letter, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 border-slate-950 flex items-center justify-center text-xs font-bold text-white ${INITIALS_COLORS[i % INITIALS_COLORS.length]}`}
                >
                  {letter}
                </div>
              ))}
            </div>
            <p>Join 10,000+ competitive players</p>
          </div>
        </div>

        {/* ── Right column: live demo scoreboard ── */}
        <div className="relative">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden rounded-2xl transition-transform hover:-translate-y-2 duration-500">
            {/* Card header */}
            <div className="p-6 border-b border-slate-800/50 flex items-center gap-3 bg-slate-950/40">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Trophy className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-white">Game Night: Catan</h2>
                <p className="text-sm text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  Live Match
                </p>
              </div>
            </div>

            {/* Player rows */}
            <div className="p-6 space-y-6">
              {scores.map((player, index) => {
                const pct = Math.max(10, (player.score / maxScore) * 100);
                return (
                  <div key={player.id} className="group transition-all duration-300">
                    <div className="flex items-center gap-4 mb-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          index === 0
                            ? "bg-yellow-500/20 text-yellow-500"
                            : index === 1
                            ? "bg-slate-300/20 text-slate-300"
                            : index === 2
                            ? "bg-amber-600/20 text-amber-600"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <InitialAvatar
                        name={player.name}
                        colorClass={INITIALS_COLORS[player.colorIdx % INITIALS_COLORS.length]}
                      />

                      <div className="flex-1 font-semibold text-lg text-slate-200 group-hover:text-white transition-colors truncate">
                        {player.name}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={index === 0 ? "animate-bounce" : ""}>
                          {player.icon}
                        </span>
                        <span className="font-mono text-2xl font-bold text-white tracking-tight tabular-nums">
                          {player.score.toLocaleString()}
                        </span>
                        <span className="text-slate-500 text-sm font-medium">pts</span>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div
                      className="h-3 bg-slate-800/50 rounded-full overflow-hidden"
                      style={{ marginLeft: "3rem" }}
                    >
                      <div
                        className={`h-full ${player.barColor} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                        style={{ width: `${pct}%` }}
                      >
                        <div
                          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                          style={{
                            backgroundImage:
                              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Card footer */}
            <div className="p-4 bg-slate-950/60 border-t border-slate-800/50 text-center">
              <p className="text-slate-500 text-sm font-medium">Live demo · updates every 2s</p>
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
