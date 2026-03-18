import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

interface Player {
  name: string;
  color: string;
  twColor: string;
  score: number;
  bar: string;
}

const INITIAL_PLAYERS: Player[] = [
  { name: "Alex", color: "blue", twColor: "text-blue-400", score: 2450, bar: "████████░░" },
  { name: "Jordan", color: "green", twColor: "text-emerald-400", score: 2100, bar: "███████░░░" },
  { name: "Sam", color: "amber", twColor: "text-amber-400", score: 1850, bar: "██████░░░░" },
  { name: "Casey", color: "purple", twColor: "text-purple-400", score: 1600, bar: "█████░░░░░" },
  { name: "Taylor", color: "rose", twColor: "text-rose-400", score: 1200, bar: "████░░░░░░" },
];

const SEQUENCE = [
  { delay: 800, text: "$ scorely new", type: "command" },
  { delay: 1500, text: "Game name: Game Night 🎲", type: "input" },
  { delay: 2000, text: "Adding players...", type: "system" },
  { delay: 2500, text: "  + Alex   [blue]   ✓", type: "player", playerIndex: 0 },
  { delay: 2800, text: "  + Jordan [green]  ✓", type: "player", playerIndex: 1 },
  { delay: 3100, text: "  + Sam    [amber]  ✓", type: "player", playerIndex: 2 },
  { delay: 3400, text: "  + Casey  [purple] ✓", type: "player", playerIndex: 3 },
  { delay: 3700, text: "  + Taylor [rose]   ✓", type: "player", playerIndex: 4 },
  { delay: 4500, text: "Leaderboard created! Share link: scorely.app/game/x7k2p", type: "success" },
  { delay: 5000, text: "", type: "system" },
  { delay: 5500, text: "--- LIVE SCORES ---", type: "header" },
  { delay: 6000, text: "scores", type: "scores" }
];

export function TerminalMode() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    SEQUENCE.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setVisibleLines(index + 1);
        if (index === SEQUENCE.length - 1) {
          setTimeout(() => setShowCta(true), 1500);
        }
      }, step.delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (visibleLines >= SEQUENCE.length) {
      const interval = setInterval(() => {
        setPlayers(current => {
          let updated = [...current].map(p => {
            const add = Math.floor(Math.random() * 100);
            return { ...p, score: p.score + add };
          });
          
          updated.sort((a, b) => b.score - a.score);
          
          const maxScore = updated[0].score;
          updated = updated.map(p => {
            const filled = Math.max(1, Math.floor((p.score / maxScore) * 10));
            const bar = "█".repeat(filled) + "░".repeat(10 - filled);
            return { ...p, bar };
          });
          
          return updated;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [visibleLines]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background grid */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem'
        }}
      />
      
      <div className="z-10 w-full max-w-3xl flex flex-col items-center gap-8">
        
        {/* Terminal Window */}
        <div className="w-full bg-zinc-900 rounded-xl border border-zinc-700 shadow-2xl overflow-hidden flex flex-col">
          {/* Title bar */}
          <div className="h-10 bg-zinc-800 border-b border-zinc-700 flex items-center px-4 shrink-0 relative">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-zinc-400 text-xs font-medium font-mono">scorely — bash — 80x24</span>
            </div>
          </div>
          
          {/* Terminal Body */}
          <div className="p-6 bg-zinc-950 text-emerald-400 font-mono text-sm sm:text-base leading-relaxed min-h-[400px] shadow-inner">
            <div className="flex flex-col gap-1">
              {SEQUENCE.slice(0, visibleLines).map((step, idx) => {
                if (step.type === "scores") {
                  return (
                    <div key={idx} className="flex flex-col gap-1 mt-2">
                      {players.map((p, i) => (
                        <div key={p.name} className="flex items-center gap-4">
                          <span className={`w-16 font-bold ${p.twColor}`}>{p.name}</span>
                          <span className={p.twColor}>{p.bar}</span>
                          <span className="w-20 text-right">{p.score} pts</span>
                          <span className="text-zinc-500">#{i + 1}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                
                let textColor = "text-emerald-400";
                if (step.type === "command") textColor = "text-white";
                if (step.type === "input") textColor = "text-zinc-300";
                if (step.type === "success") textColor = "text-emerald-300 font-bold";
                if (step.type === "player" && step.playerIndex !== undefined) {
                  textColor = INITIAL_PLAYERS[step.playerIndex].twColor;
                }

                return (
                  <div key={idx} className={`${textColor}`}>
                    {step.text}
                  </div>
                );
              })}
              
              <div className="flex items-center mt-1 text-emerald-400">
                <span className="animate-pulse font-bold">_</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={`transition-all duration-1000 transform ${showCta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-8 py-6 text-lg shadow-lg shadow-blue-900/20">
            <Terminal className="mr-2 h-5 w-5" />
            Ready to play? Start your leaderboard
          </Button>
        </div>
        
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-pulse {
          animation: blink 1s step-end infinite;
        }
      `}} />
    </div>
  );
}
