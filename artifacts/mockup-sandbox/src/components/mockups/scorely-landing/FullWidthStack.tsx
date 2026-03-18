import React, { useState, useEffect } from "react";
import { Play, Trophy } from "lucide-react";

type Player = {
  id: string;
  name: string;
  initials: string;
  color: string;
  score: number;
};

const INITIAL_PLAYERS: Player[] = [
  { id: "1", name: "Alex", initials: "A", color: "bg-blue-500", score: 85 },
  { id: "2", name: "Jordan", initials: "J", color: "bg-emerald-500", score: 72 },
  { id: "3", name: "Sam", initials: "S", color: "bg-amber-500", score: 64 },
  { id: "4", name: "Casey", initials: "C", color: "bg-purple-500", score: 58 },
  { id: "5", name: "Taylor", initials: "T", color: "bg-rose-500", score: 45 },
];

export function FullWidthStack() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers((prev) => {
        const newPlayers = prev.map((p) => ({
          ...p,
          score: p.score + Math.floor(Math.random() * 5),
        }));
        return newPlayers.sort((a, b) => b.score - a.score);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const maxScore = Math.max(...players.map((p) => p.score), 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden font-sans flex flex-col items-center pt-24 pb-32 px-6">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-600/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center space-y-12">
        
        {/* 1. Headline */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text drop-shadow-sm w-full">
          Scorely
        </h1>
        
        {/* 2. Tagline */}
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl text-center leading-relaxed font-medium">
          Track scores, crown winners, and make every game night competitive.
        </p>

        {/* 3. CTA button */}
        <button className="h-14 px-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)]">
          <Play className="w-5 h-5 fill-current" />
          <span className="text-lg">Start a Leaderboard</span>
        </button>

        {/* 4. Social proof row */}
        <div className="flex items-center gap-4 text-sm font-medium text-slate-300 bg-slate-900/50 backdrop-blur-sm py-2 px-5 rounded-full border border-slate-800">
          <div className="flex -space-x-3">
            {['A', 'B', 'C', 'D'].map((initial, i) => {
              const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-amber-600', 'bg-purple-600'];
              return (
                <div key={i} className={`w-8 h-8 rounded-full ${colors[i]} border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
                  {initial}
                </div>
              );
            })}
          </div>
          <span>Join 10,000+ competitive players</span>
        </div>

        {/* 5. Scoreboard - WIDE HORIZONTAL CARD */}
        <div className="w-full max-w-[900px] bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mt-8">
          
          <div className="flex items-center justify-between p-6 border-b border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                <Trophy className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="font-semibold text-slate-200 tracking-wide text-lg">Game Night: Catan</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-400 tracking-wide uppercase">Live Match</span>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-5 gap-4 h-[400px]">
              {players.map((player, index) => {
                const heightPercent = Math.max(10, (player.score / maxScore) * 100);
                return (
                  <div key={player.id} className="flex flex-col items-center justify-end h-full group">
                    
                    {/* Player Info (Above the bar) */}
                    <div className="flex flex-col items-center mb-4 z-10 w-full text-center">
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-800 text-slate-400 text-xs font-bold mb-3 shadow-md border border-slate-700">
                        {index + 1}
                      </div>
                      <div className={`w-14 h-14 rounded-full ${player.color} flex items-center justify-center text-xl font-bold text-white shadow-xl ring-4 ring-slate-900 mb-3 z-10 relative overflow-hidden`}>
                        {player.initials}
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      </div>
                      <span className="font-semibold text-slate-200 text-base tracking-wide mb-1 truncate w-full">{player.name}</span>
                      <span className="font-mono text-2xl font-bold text-white tabular-nums drop-shadow-sm">{player.score}</span>
                    </div>

                    {/* Vertical Bar Chart */}
                    <div 
                      className="w-16 bg-slate-800/50 rounded-t-xl relative overflow-hidden flex-shrink-0 transition-all duration-700 ease-out border-x border-t border-slate-700/50 group-hover:bg-slate-800/80" 
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className={`absolute inset-0 ${player.color} opacity-20 transition-opacity duration-300 group-hover:opacity-30`} />
                      <div className={`absolute top-0 left-0 right-0 h-1 ${player.color} shadow-[0_0_10px_rgba(255,255,255,0.5)]`} />
                      
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 translate-y-[100%] animate-[shimmer_2s_infinite] bg-gradient-to-t from-transparent via-white/10 to-transparent" />
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
