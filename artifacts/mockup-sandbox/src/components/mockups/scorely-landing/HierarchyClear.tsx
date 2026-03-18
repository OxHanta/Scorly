import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Activity, CheckCircle2 } from "lucide-react";

interface Player {
  id: string;
  name: string;
  score: number;
  initials: string;
  color: string;
  pattern: string;
}

const INITIAL_PLAYERS: Player[] = [
  { id: "1", name: "Alex Chen", score: 8420, initials: "AC", color: "bg-emerald-500", pattern: "diagonal-stripes" },
  { id: "2", name: "Sarah Smith", score: 7150, initials: "SS", color: "bg-blue-500", pattern: "dots" },
  { id: "3", name: "Mike Johnson", score: 6890, initials: "MJ", color: "bg-violet-500", pattern: "zigzag" },
  { id: "4", name: "Emma Davis", score: 5430, initials: "ED", color: "bg-amber-500", pattern: "checkers" },
  { id: "5", name: "Chris Wilson", score: 4920, initials: "CW", color: "bg-pink-500", pattern: "waves" },
];

export function HierarchyClear() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers(current => {
        const newPlayers = [...current];
        const randomIndex = Math.floor(Math.random() * newPlayers.length);
        const pointsToAdd = Math.floor(Math.random() * 50) + 10;
        
        newPlayers[randomIndex] = {
          ...newPlayers[randomIndex],
          score: newPlayers[randomIndex].score + pointsToAdd
        };
        
        setLastUpdate(newPlayers[randomIndex].name);
        return newPlayers.sort((a, b) => b.score - a.score);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const maxScore = Math.max(...players.map(p => p.score));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30 overflow-hidden relative flex flex-col justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 py-12 md:py-24 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Column - 45% */}
          <div className="w-full lg:w-[45%] flex flex-col justify-center max-w-xl mx-auto lg:mx-0">
            {/* 1. Logo/Wordmark */}
            <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">Scorely</span>
            </div>

            {/* 2. Value Prop */}
            <div className="mb-12">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
                Live scores that keep players <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">hooked.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-medium">
                Drop a real-time leaderboard into your app in minutes. Drive engagement with instant competitive feedback.
              </p>
            </div>

            <div className="hidden lg:block h-px w-full bg-slate-800/50 mb-12" />

            {/* 3. Social Proof before CTA */}
            <div className="mb-8 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-slate-300">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span>Trusted by 10,000+ developers</span>
                </div>
              </div>
            </div>

            {/* 4. One CTA Only */}
            <div>
              <button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-5 rounded-2xl font-bold text-lg transition-all transform hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)] active:translate-y-0 flex items-center justify-center gap-2">
                Start Building Free
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <p className="mt-4 text-sm text-slate-500 font-medium text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500/70" />
                Takes 30 seconds. No credit card required.
              </p>
            </div>
          </div>

          {/* Right Column - 55% */}
          <div className="w-full lg:w-[55%]">
            <div className="flex items-center gap-3 mb-4 pl-4 text-slate-400 font-medium">
              <span className="text-emerald-400">Live preview</span>
              <span className="w-4 h-px bg-slate-700"></span>
              <span>Watch scores update in real time</span>
              <svg className="w-4 h-4 ml-1 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden group">
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800/50">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  Global Rankings
                </h3>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Live Match</span>
                </div>
              </div>

              {/* Status indicator */}
              <div className="h-6 mb-6 flex items-center text-sm text-slate-400">
                <AnimatePresence mode="wait">
                  {lastUpdate && (
                    <motion.div
                      key={lastUpdate}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <Activity className="w-4 h-4 text-emerald-400" />
                      <span>{lastUpdate} just scored!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Leaderboard */}
              <div className="space-y-4">
                <AnimatePresence>
                  {players.map((player, index) => {
                    const width = `${Math.max((player.score / maxScore) * 100, 15)}%`;
                    
                    return (
                      <motion.div
                        key={player.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-6 text-center font-bold text-slate-500">
                          {index + 1}
                        </div>
                        
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-inner ${player.color}`}>
                          {player.initials}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-end mb-2">
                            <span className="font-semibold text-slate-200">{player.name}</span>
                            <span className="font-mono font-bold text-emerald-400 text-lg">
                              {player.score.toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                            <motion.div
                              layout
                              className={`h-full ${player.color} opacity-80`}
                              initial={{ width: 0 }}
                              animate={{ width }}
                              transition={{ type: "spring", bounce: 0, duration: 1 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
