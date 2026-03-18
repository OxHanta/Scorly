import React, { useState, useEffect } from 'react';
import { Play, Trophy, Crown, Zap, Link as LinkIcon } from 'lucide-react';

const INITIAL_PLAYERS = [
  { id: 1, name: 'Alex', color: 'bg-blue-500', score: 42, initials: 'A' },
  { id: 2, name: 'Jordan', color: 'bg-emerald-500', score: 38, initials: 'J' },
  { id: 3, name: 'Sam', color: 'bg-amber-500', score: 31, initials: 'S' },
  { id: 4, name: 'Casey', color: 'bg-purple-500', score: 24, initials: 'C' },
  { id: 5, name: 'Taylor', color: 'bg-rose-500', score: 18, initials: 'T' },
];

export function BentoGrid() {
  const [players, setPlayers] = useState(INITIAL_PLAYERS);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers(prev => {
        const newPlayers = prev.map(p => ({
          ...p,
          score: p.score + Math.floor(Math.random() * 3)
        })).sort((a, b) => b.score - a.score);
        return newPlayers;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const leader = players[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden font-sans selection:bg-blue-500/30 p-4 md:p-8 flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] pointer-events-none"></div>

      {/* Main Grid Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* ROW 1: Cell A (col-7) */}
        <div className="col-span-1 md:col-span-7 bg-slate-900/60 border border-slate-700/40 rounded-2xl backdrop-blur-sm p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Scorely
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-lg">
            Track scores, crown winners, and make every game night competitive.
          </p>
        </div>

        {/* ROW 1: Cell B (col-5) */}
        <div className="col-span-1 md:col-span-5 bg-slate-900/70 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-8 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider">Live</span>
          </div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-4 mt-4">Currently Leading</p>
          <div className={`w-20 h-20 rounded-full ${leader.color} flex items-center justify-center text-3xl font-bold mb-6 shadow-lg shadow-${leader.color.replace('bg-', '')}/20`}>
            {leader.initials}
          </div>
          <Crown className="w-12 h-12 text-amber-400 mb-2 drop-shadow-lg" />
          <h2 className="text-4xl font-bold text-white mb-2">{leader.name}</h2>
          <div className="text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600">
            {leader.score}
          </div>
        </div>

        {/* ROW 2: Cell C (col-4) */}
        <div className="col-span-1 md:col-span-4 bg-slate-900/70 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-8 flex flex-col items-center justify-center text-center">
          <button className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25 mb-8">
            <Play className="w-5 h-5 fill-current" />
            <span>Start a Leaderboard</span>
          </button>
          
          <div className="flex flex-col items-center space-y-3">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold border-2 border-slate-900 z-40">A</div>
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold border-2 border-slate-900 z-30">B</div>
              <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-sm font-bold border-2 border-slate-900 z-20">C</div>
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold border-2 border-slate-900 z-10">D</div>
            </div>
            <p className="text-sm text-slate-400 font-medium">Join 10,000+ competitive players</p>
          </div>
        </div>

        {/* ROW 2: Cell D (col-8) */}
        <div className="col-span-1 md:col-span-8 bg-slate-900/70 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
            <div className="flex items-center space-x-3 text-slate-300">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="font-semibold">Game Night: Catan</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Match</span>
            </div>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
            {players.map((player, idx) => (
              <div key={player.id} className="flex flex-col items-center justify-center flex-1 bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
                <div className="text-xs font-bold text-slate-500 mb-2">#{idx + 1}</div>
                <div className={`w-12 h-12 rounded-full ${player.color} flex items-center justify-center text-lg font-bold mb-3 shadow-inner`}>
                  {player.initials}
                </div>
                <div className="font-medium text-slate-200 mb-1">{player.name}</div>
                <div className="font-mono text-2xl font-bold text-white">{player.score}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 3: Cell E (col-4) */}
        <div className="col-span-1 md:col-span-4 bg-slate-900/70 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-6 flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-100">Real-time sync</h3>
          </div>
          <p className="text-slate-400 text-sm">Scores update live for everyone in the room.</p>
        </div>

        {/* ROW 3: Cell F (col-4) */}
        <div className="col-span-1 md:col-span-4 bg-slate-900/70 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-6 flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <LinkIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-100">Shareable links</h3>
          </div>
          <p className="text-slate-400 text-sm">Share a link — spectators see scores without an account.</p>
        </div>

        {/* ROW 3: Cell G (col-4) */}
        <div className="col-span-1 md:col-span-4 bg-slate-900/70 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-6 flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-100">Winner moment</h3>
          </div>
          <p className="text-slate-400 text-sm">Confetti and a crown when the game ends.</p>
        </div>

      </div>
    </div>
  );
}
