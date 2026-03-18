import React, { useState, useEffect } from "react";
import { Trophy, Medal, Crown, Star, ArrowUpRight, Play, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function LiveScoreboard() {
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
        // Randomly pick a player to give points to
        const randomIdx = Math.floor(Math.random() * newScores.length);
        newScores[randomIdx] = {
          ...newScores[randomIdx],
          score: newScores[randomIdx].score + Math.floor(Math.random() * 50) + 10
        };
        // Sort by score descending
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
        <div className="flex flex-col items-start text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-sm font-medium text-blue-400 backdrop-blur-sm">
            <Activity className="w-4 h-4" />
            <span>Live Sync 2.0 Now Available</span>
          </div>
          
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

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
            <Button size="lg" className="h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] transition-all hover:scale-105">
              Start a Leaderboard
              <Play className="ml-2 w-5 h-5 fill-current" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl transition-all bg-slate-900/50 backdrop-blur-sm">
              View Demo
            </Button>
          </div>
          
          <div className="flex items-center gap-4 pt-4 text-sm text-slate-500 font-medium">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=1e293b`} alt="avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p>Join 10,000+ competitive players</p>
          </div>
        </div>

        {/* Right Column: The Product (Scoreboard) */}
        <div className="relative">
          {/* Decorative elements around board */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
          
          <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden rounded-2xl transform transition-transform hover:-translate-y-2 duration-500">
            {/* Board Header */}
            <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Trophy className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">Game Night: Catan</h3>
                  <p className="text-sm text-emerald-400 font-medium flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Live Match
                  </p>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white">
                <ArrowUpRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Players List */}
            <div className="p-6 space-y-6">
              {scores.map((player, index) => {
                const percentage = Math.max(10, (player.score / maxScore) * 100);
                return (
                  <div key={player.id} className="relative group transition-all duration-300">
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' : index === 1 ? 'bg-slate-300/20 text-slate-300' : index === 2 ? 'bg-amber-600/20 text-amber-600' : 'bg-slate-800 text-slate-400'}`}>
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}&backgroundColor=1e293b`} alt={player.name} className="w-full h-full" />
                      </div>
                      <div className="flex-1 font-semibold text-lg text-slate-200 group-hover:text-white transition-colors">
                        {player.name}
                      </div>
                      <div className="flex items-center gap-2">
                        {index === 0 && <span className="animate-bounce">{player.icon}</span>}
                        {index !== 0 && player.icon}
                        <div className="font-mono text-2xl font-bold text-white tracking-tight tabular-nums">
                          {player.score.toLocaleString()}
                        </div>
                        <span className="text-slate-500 text-sm font-medium">pts</span>
                      </div>
                    </div>
                    {/* Score Bar */}
                    <div className="w-full h-3 bg-slate-800/50 rounded-full overflow-hidden ml-12" style={{ width: 'calc(100% - 3rem)' }}>
                      <div 
                        className={`h-full ${player.color} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] -translate-x-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Board Footer */}
            <div className="p-4 bg-slate-950/60 border-t border-slate-800/50 text-center">
              <p className="text-slate-500 text-sm font-medium">Last updated: Just now</p>
            </div>
          </Card>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
