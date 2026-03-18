import React, { useState, useEffect } from "react";
import { Trophy, Medal, Star, Circle, ChevronRight, Activity } from "lucide-react";

interface Player {
  id: string;
  name: string;
  score: number;
  colorClass: string;
}

const INITIAL_PLAYERS: Player[] = [
  { id: "1", name: "Alex R.", score: 850, colorClass: "bg-blue-600" },
  { id: "2", name: "Jordan M.", score: 720, colorClass: "bg-green-600" },
  { id: "3", name: "Casey T.", score: 640, colorClass: "bg-purple-600" },
  { id: "4", name: "Riley S.", score: 510, colorClass: "bg-amber-600" },
];

export function AccessibilityFirst() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);

  // Live score simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers((currentPlayers) => {
        const newPlayers = [...currentPlayers];
        // Pick a random player to receive points
        const randomIndex = Math.floor(Math.random() * newPlayers.length);
        const points = Math.floor(Math.random() * 50) + 10;
        
        newPlayers[randomIndex] = {
          ...newPlayers[randomIndex],
          score: newPlayers[randomIndex].score + points,
        };

        // Re-sort by score
        return newPlayers.sort((a, b) => b.score - a.score);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const maxScore = Math.max(...players.map((p) => p.score), 1000);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-400" aria-label="First place" />;
      case 1:
        return <Medal className="w-6 h-6 text-slate-300" aria-label="Second place" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-700" aria-label="Third place" />;
      case 3:
        return <Star className="w-6 h-6 text-blue-400" aria-label="Fourth place" />;
      default:
        return <Circle className="w-6 h-6 text-slate-400" aria-label={`Rank ${index + 1}`} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-900 overflow-hidden relative">
      {/* Reduced Motion CSS */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *, ::before, ::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* Background Decor - Accessible Contrast */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" aria-hidden="true" />
      
      {/* Orbs - Lowered opacity so they don't interfere with text contrast */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[100px]" aria-hidden="true" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-green-900/20 blur-[100px]" aria-hidden="true" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left Column: Copy & CTA */}
        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
          <div className="flex items-center space-x-3 bg-slate-900 border border-slate-700 rounded-full px-4 py-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-base font-semibold text-green-400 tracking-wide uppercase">
              Live System Online
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Clear, accessible leaderboards.
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl">
            Design scoreboards that everyone can read. We prioritize high contrast, 
            semantic markup, and clear typography over confusing visual noise.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
              Start Building Free
              <ChevronRight className="w-6 h-6" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="flex -space-x-3" aria-hidden="true">
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-sm font-bold text-white">A</div>
                <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-950 flex items-center justify-center text-sm font-bold text-white">B</div>
                <div className="w-10 h-10 rounded-full bg-slate-600 border-2 border-slate-950 flex items-center justify-center text-sm font-bold text-white">C</div>
              </div>
              <span className="text-base font-medium">Join 10,000+ creators</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Accessible Preview */}
        <div className="w-full lg:w-1/2">
          <section 
            aria-labelledby="scoreboard-title"
            className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 lg:p-10 shadow-2xl"
          >
            <header className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="bg-slate-800 p-3 rounded-xl" aria-hidden="true">
                  <Activity className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h2 id="scoreboard-title" className="text-2xl font-bold text-white">Live Match Rankings</h2>
                  <p className="text-slate-300 text-base mt-1">Updating in real-time</p>
                </div>
              </div>
            </header>

            <ol className="space-y-6" aria-live="polite" aria-atomic="false">
              {players.map((player, index) => {
                const widthPercentage = Math.max(10, (player.score / maxScore) * 100);
                
                return (
                  <li key={player.id} className="relative group">
                    <div className="flex items-center gap-5 mb-2">
                      <div className="flex items-center justify-center w-12 h-12 bg-slate-800 rounded-full shrink-0 border border-slate-700" aria-hidden="true">
                        {getRankIcon(index)}
                      </div>
                      <div className="flex-grow flex items-center justify-between">
                        <div className="flex items-baseline gap-3">
                          <span className="text-xl font-bold text-white min-w-[3ch]">#{index + 1}</span>
                          <span className="text-lg font-semibold text-slate-100">{player.name}</span>
                        </div>
                        <span className="text-2xl font-black text-white tabular-nums">
                          {player.score.toLocaleString()} <span className="text-sm font-normal text-slate-400">pts</span>
                        </span>
                      </div>
                    </div>
                    {/* Score bar with high contrast */}
                    <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden" aria-hidden="true">
                      <div 
                        className={`h-full rounded-full ${player.colorClass} transition-all duration-500 ease-out`}
                        style={{ width: `${widthPercentage}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
        
      </main>
    </div>
  );
}

export default AccessibilityFirst;
