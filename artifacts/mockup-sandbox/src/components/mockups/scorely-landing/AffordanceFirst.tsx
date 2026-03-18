import React, { useState, useEffect } from "react";
import { Trophy, Medal, Crown, Star, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AffordanceFirst() {
  const [scores, setScores] = useState([
    { id: 1, name: "Alex", score: 2450, color: "bg-blue-500", icon: <Crown className="w-5 h-5 text-yellow-400" /> },
    { id: 2, name: "Jordan", score: 1820, color: "bg-emerald-500", icon: <Medal className="w-5 h-5 text-slate-300" /> },
    { id: 3, name: "Sam", score: 1340, color: "bg-amber-500", icon: <Medal className="w-5 h-5 text-amber-700" /> },
    { id: 4, name: "Casey", score: 980, color: "bg-purple-500", icon: <Star className="w-5 h-5 text-slate-400" /> },
    { id: 5, name: "Taylor", score: 650, color: "bg-rose-500", icon: <Star className="w-5 h-5 text-slate-500" /> },
  ]);

  // Simulate live score updates
  useEffect(() => {
    const interval = setInterval(() => {
      setScores(prev => {
        const newScores = [...prev];
        const randomIdx = Math.floor(Math.random() * newScores.length);
        newScores[randomIdx] = {
          ...newScores[randomIdx],
          score: newScores[randomIdx].score + Math.floor(Math.random() * 50) + 10
        };
        return newScores.sort((a, b) => b.score - a.score);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const maxScore = Math.max(...scores.map(s => s.score));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="max-w-6xl w-full z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Copy & CTA */}
        <div className="flex flex-col items-start text-left space-y-10">
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-sm">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Scorely
              </span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-slate-200 max-w-lg leading-relaxed">
              Track scores, crown winners, and make every game night competitive.
            </p>
          </div>

          <div className="w-full max-w-md space-y-4">
            <Button size="lg" className="w-full h-16 sm:h-20 text-xl sm:text-2xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-[0_0_40px_-5px_rgba(79,70,229,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-10px_rgba(79,70,229,0.7)] group border-2 border-indigo-400/50 relative overflow-hidden">
              <span className="relative z-10 flex items-center justify-center">
                Start a Leaderboard
                <Play className="ml-3 w-6 h-6 sm:w-8 sm:h-8 fill-current group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] -translate-x-full @media (prefers-reduced-motion: reduce) { hidden }" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}></div>
            </Button>
            
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm sm:text-base text-slate-300 font-medium">
              <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400"/> No account needed</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400"/> Start free</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400"/> Sharable links</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 pt-4 text-sm text-slate-400 font-medium bg-slate-900/40 p-3 rounded-2xl border border-slate-800/60">
            <div className="flex -space-x-2">
              {['J', 'A', 'M', 'K'].map((initial, i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-slate-950 flex items-center justify-center text-white font-bold text-sm
                  ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-emerald-600' : i === 2 ? 'bg-purple-600' : 'bg-rose-600'}`}>
                  {initial}
                </div>
              ))}
            </div>
            <p className="text-slate-200">Join <strong className="text-white">10,000+</strong> competitive players</p>
          </div>
        </div>

        {/* Right Column: The Product (Scoreboard) */}
        <div className="relative group/board">
          {/* Decorative elements around board */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
          
          {/* Try Clicking Hint */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 -translate-x-full hidden lg:flex items-center gap-3 text-indigo-400 font-bold animate-pulse pointer-events-none">
            <span className="bg-indigo-950/80 px-4 py-2 rounded-xl border border-indigo-500/30 whitespace-nowrap">Scores updating live</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="rotate-180">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <Card className="bg-slate-900/90 border-slate-700 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden rounded-2xl transform transition-transform hover:-translate-y-1 duration-300 cursor-default border-t-slate-600">
            {/* Board Header */}
            <div className="p-6 border-b border-slate-700/80 flex justify-between items-center bg-slate-950/60">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <Trophy className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-white">Game Night: Catan</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                    </span>
                    <p className="text-base text-emerald-400 font-bold tracking-wide uppercase">
                      Live Match
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Players List */}
            <div className="p-2 space-y-1 bg-slate-900/50">
              {scores.map((player, index) => {
                const percentage = Math.max(10, (player.score / maxScore) * 100);
                // Assign a contrasting pattern for colorblind visibility in addition to color
                const colorMap: Record<string, string> = {
                  "bg-blue-500": "bg-blue-500",
                  "bg-emerald-500": "bg-emerald-500",
                  "bg-amber-500": "bg-amber-500",
                  "bg-purple-500": "bg-purple-500",
                  "bg-rose-500": "bg-rose-500",
                };
                
                return (
                  <div key={player.id} className="relative group transition-all duration-200 p-4 rounded-xl hover:bg-slate-800/80 hover:shadow-lg border border-transparent hover:border-slate-700 cursor-pointer">
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-inner ${index === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : index === 1 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/30' : index === 2 ? 'bg-amber-600/20 text-amber-500 border border-amber-600/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                        {index + 1}
                      </div>
                      
                      {/* Initials Avatar */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-slate-800 shrink-0 ${colorMap[player.color]}`}>
                        {player.name.charAt(0)}
                      </div>
                      
                      <div className="flex-1 font-bold text-xl text-slate-100 group-hover:text-white transition-colors">
                        {player.name}
                      </div>
                      
                      <div className="flex items-center gap-3 bg-slate-950/50 px-4 py-2 rounded-lg border border-slate-800/50">
                        {index === 0 && <span className="animate-bounce drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">{player.icon}</span>}
                        {index !== 0 && player.icon}
                        <div className="font-mono text-3xl font-black text-white tracking-tight tabular-nums drop-shadow-md">
                          {player.score.toLocaleString()}
                        </div>
                        <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">pts</span>
                      </div>
                    </div>
                    
                    {/* Score Bar */}
                    <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden ml-[4.5rem] shadow-inner border border-slate-800" style={{ width: 'calc(100% - 4.5rem)' }}>
                      <div 
                        className={`h-full ${player.color} rounded-full transition-all duration-1000 ease-out relative overflow-hidden flex items-center`}
                        style={{ width: `${percentage}%` }}
                      >
                         {/* Stripe pattern overlay for better accessibility / distinction */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.5) 10px, rgba(0,0,0,0.5) 20px)' }}></div>
                        
                        <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] -translate-x-full @media (prefers-reduced-motion: reduce) { hidden }" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[shimmer_2s_infinite\\] {
            animation: none !important;
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
