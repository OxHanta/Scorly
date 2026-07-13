import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Trophy, Medal, Crown, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const DEMO_PLAYERS = [
  { id: 1, name: "Ogunmepon", score: 2450, barColor: "bg-red-500", icon: <Crown className="w-5 h-5 text-yellow-400" /> },
  { id: 2, name: "Victoria", score: 1820, barColor: "bg-pink-500", icon: <Medal className="w-5 h-5 text-slate-300" /> },
  { id: 3, name: "Sam", score: 1340, barColor: "bg-amber-500", icon: <Medal className="w-5 h-5 text-amber-700" /> },
  { id: 4, name: "Abdul", score: 980, barColor: "bg-purple-500", icon: <Star className="w-5 h-5 text-slate-400" /> },
  { id: 5, name: "Favor", score: 650, barColor: "bg-emerald-500", icon: <Star className="w-5 h-5 text-slate-500" /> },
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
    <main className="app-shell min-h-screen flex flex-col justify-center" data-theme="bubblegum">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="max-w-6xl w-full z-10 grid lg:grid-cols-2 gap-12 items-center content-wrap">
        {/* ── Left column: copy + CTA ── */}
        <div className="flex flex-col items-start text-left space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#1A1A1A]">
              <img
                src="https://res.cloudinary.com/dba2kof3v/image/upload/v1783945770/Black_2x_j4urn8.png"
                alt="Scorely"
                className="h-16 sm:h-20 md:h-24 w-auto"
              />
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-[#6B6B6B] max-w-lg leading-relaxed">
              Track scores, crown winners, and make every game night competitive.
            </p>
          </div>

          <Button
            data-testid="button-start-leaderboard"
            size="lg"
            onClick={() => setLocation("/dashboard")}
            className="h-14 px-8 text-lg font-bold bg-[#3F7D58] hover:bg-[#2e5e41] text-white rounded-xl shadow-sm transition-all"
          >
            Start a Leaderboard
            <Play className="ml-2 w-5 h-5 fill-current" />
          </Button>

          <div className="flex items-center gap-3 text-sm text-[#6B6B6B] font-medium pt-2">
            <div className="flex -space-x-2">
              {["B", "S", "N", "O"].map((letter, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 border-[#EFEFEF] flex items-center justify-center text-xs font-bold text-white ${INITIALS_COLORS[i % INITIALS_COLORS.length]}`}
                >
                  {letter}
                </div>
              ))}
            </div>
            <p>Join 100+ competitive players</p>
          </div>
        </div>

        {/* ── Right column: live demo scoreboard ── */}
        <div className="relative">

          <Card className="bg-white border-[#D4D4D4] shadow-sm overflow-hidden rounded-2xl">
            {/* Card header */}
            <div className="p-6 border-b border-[#EFEFEF] flex items-center gap-3 bg-[#EBF3EE]">
              <div className="p-2 bg-white rounded-lg border border-[#D4D4D4]">
                <Trophy className="w-6 h-6 text-[#3F7D58]" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-[#1A1A1A]">Game Night: Runner</h2>
                <p className="text-sm text-[#3F7D58] font-medium flex items-center gap-1.5">
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
                  <div key={player.id} className="group">
                    <div className="flex items-center gap-4 mb-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-600"
                            : index === 1
                              ? "bg-slate-100 text-slate-500"
                              : index === 2
                                ? "bg-orange-100 text-orange-600"
                                : "bg-[#EFEFEF] text-[#6B6B6B]"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <InitialAvatar
                        name={player.name}
                        colorClass={INITIALS_COLORS[player.colorIdx % INITIALS_COLORS.length]}
                      />

                      <div className="flex-1 font-semibold text-lg text-[#1A1A1A] truncate">
                        {player.name}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span>{player.icon}</span>
                        <span className="font-mono text-2xl font-bold text-[#1A1A1A] tracking-tight tabular-nums">
                          {player.score.toLocaleString()}
                        </span>
                        <span className="text-[#6B6B6B] text-sm font-medium">pts</span>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div
                      className="h-2.5 bg-[#EFEFEF] rounded-full overflow-hidden"
                      style={{ marginLeft: "3rem" }}
                    >
                      <div
                        className={`h-full ${player.barColor} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Card footer */}
            <div className="p-4 bg-[#FAFAFA] border-t border-[#EFEFEF] text-center">
              <p className="text-[#6B6B6B] text-sm font-medium">Live demo</p>
            </div>
          </Card>
        </div>
      </div>


    </main>
  );
}
