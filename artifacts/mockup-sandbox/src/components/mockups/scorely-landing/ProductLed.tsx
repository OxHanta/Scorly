import React, { useState, useEffect } from "react";
import { Trophy, Play, Plus } from "lucide-react";

interface Player {
  id: string;
  name: string;
  initials: string;
  score: number;
  color: string;
}

const INITIAL_PLAYERS: Player[] = [
  { id: "1", name: "Alex", initials: "A", score: 850, color: "bg-blue-500" },
  { id: "2", name: "Jordan", initials: "J", score: 720, color: "bg-emerald-500" },
  { id: "3", name: "Sam", initials: "S", score: 640, color: "bg-amber-500" },
  { id: "4", name: "Casey", initials: "C", score: 590, color: "bg-purple-500" },
  { id: "5", name: "Taylor", initials: "T", score: 480, color: "bg-rose-500" },
];

export function ProductLed() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers((current) => {
        const updated = current.map((p) => {
          // Only top 3 players get score boosts occasionally to simulate real updates
          if (Math.random() > 0.4) {
            return { ...p, score: p.score + Math.floor(Math.random() * 50) };
          }
          return p;
        });
        return updated.sort((a, b) => b.score - a.score);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const topScore = Math.max(...players.map((p) => p.score), 1000); // ensure some headroom

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <main className="relative z-10 container mx-auto px-4 py-12 lg:py-24 max-w-7xl min-h-screen flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20 items-start">
          
          {/* LEFT COLUMN - SCOREBOARD (Dominant) */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[700px]">
            {/* Card Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Game Night: Catan</h2>
                  <p className="text-sm text-slate-400">First to 10 victory points (1000 pts)</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Live Match</span>
              </div>
            </div>

            {/* Players List */}
            <div className="p-8 flex-1 flex flex-col space-y-8">
              {players.map((player, index) => (
                <div key={player.id} className="group relative">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-6 text-center font-mono font-bold text-slate-500">
                      {index + 1}
                    </div>
                    <div className={`w-10 h-10 rounded-full ${player.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {player.initials}
                    </div>
                    <div className="flex-1 font-semibold text-lg text-slate-200">
                      {player.name}
                    </div>
                    <div className="font-mono text-xl font-bold text-white">
                      {player.score.toLocaleString()}
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="ml-10 h-3 rounded-full bg-slate-800 overflow-hidden relative">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full ${player.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${Math.min((player.score / topScore) * 100, 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] -translate-x-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}></div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Player Row */}
              <div className="flex items-center gap-4 pt-4 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                <div className="w-6"></div>
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-500">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="flex-1 font-medium text-slate-400 border-b border-dashed border-slate-700 pb-1">
                  Add player...
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/80 text-center">
              <span className="text-xs font-mono text-slate-500 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                Live demo &middot; updates every 2s
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN - COPY & CONVERSION */}
          <div className="flex flex-col pt-12 lg:sticky lg:top-24">
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Scorely</span>
            </h1>
            
            <p className="text-lg text-slate-300 mb-10 max-w-sm leading-relaxed">
              Track scores, crown winners, and make every game night competitive.
            </p>

            <button className="group w-full max-w-sm bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.6)] hover:-translate-y-1">
              <Play className="w-5 h-5 fill-current" />
              <span>Start a Leaderboard</span>
            </button>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {['A', 'B', 'C', 'D'].map((initial, i) => {
                  const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-amber-600', 'bg-purple-600'];
                  return (
                    <div key={initial} className={`w-8 h-8 rounded-full ${colors[i]} border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-1 ring-white/10`}>
                      {initial}
                    </div>
                  );
                })}
              </div>
              <div className="text-sm font-medium text-slate-400">
                Join <span className="text-slate-200">10,000+</span> competitive players
              </div>
            </div>

            {/* Features List */}
            <div className="mt-12 space-y-3">
              <div className="flex items-center gap-3 text-slate-300 bg-slate-800/30 w-fit px-4 py-2 rounded-full border border-slate-700/50">
                <span>⚡</span>
                <span className="text-sm font-medium">Real-time sync</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 bg-slate-800/30 w-fit px-4 py-2 rounded-full border border-slate-700/50">
                <span>🔗</span>
                <span className="text-sm font-medium">Shareable links</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 bg-slate-800/30 w-fit px-4 py-2 rounded-full border border-slate-700/50">
                <span>🏆</span>
                <span className="text-sm font-medium">Winner animations</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
