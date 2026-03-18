import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronUp, Trophy } from "lucide-react";

export function StoryFirst() {
  const [scores, setScores] = useState([
    { id: 1, name: "Jordan", score: 8, color: "bg-blue-500" },
    { id: 2, name: "Alex", score: 7, color: "bg-purple-500" },
    { id: 3, name: "Sam", score: 5, color: "bg-emerald-500" },
  ]);

  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setScores((prevScores) => {
        const newScores = [...prevScores];
        const targetIndex = Math.floor(Math.random() * newScores.length);
        newScores[targetIndex] = {
          ...newScores[targetIndex],
          score: newScores[targetIndex].score + 1,
        };
        setLastUpdate(newScores[targetIndex].id);
        
        // Sort by score descending
        return newScores.sort((a, b) => b.score - a.score);
      });
      
      setTimeout(() => setLastUpdate(null), 1000);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center py-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-32">
        
        {/* TOP - Scene Setter */}
        <div className="space-y-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-white leading-relaxed md:leading-relaxed lg:leading-relaxed max-w-3xl mx-auto tracking-wide">
            "It is Saturday night. Eight players. One game of Catan. And absolutely nobody can agree on the score."
          </h1>
          
          {/* MIDDLE - Editorial Problem */}
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Every game night ends the same way. A phone calculator, someone's memory, a piece of paper no one can read. The winner is whoever argues loudest.
          </p>
        </div>

        {/* TRANSITION & BRAND REVEAL */}
        <div className="w-full flex flex-col items-center space-y-12">
          <div className="w-24 h-px bg-slate-700"></div>
          
          <div className="space-y-4">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 pb-2">
              Scorely.
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium tracking-wide">
              Real-time leaderboards. No arguments. Just winners.
            </p>
          </div>
        </div>

        {/* BOTTOM - CTA & Demo */}
        <div className="w-full max-w-md flex flex-col items-center space-y-12">
          <Button size="lg" className="h-14 px-10 text-lg font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)]">
            Start your first leaderboard
          </Button>

          {/* Mini Scoreboard */}
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Demo</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            
            <Card className="bg-slate-900/50 border-slate-800 p-2 backdrop-blur-sm shadow-xl">
              <div className="space-y-2">
                {scores.map((player, index) => (
                  <div 
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800/60 transition-all duration-500 ease-in-out"
                    style={{
                      transform: \`translateY(0)\`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={\`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-inner \${player.color}\`}>
                          {player.name.charAt(0)}
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-3 -right-2 text-yellow-400 drop-shadow-md animate-bounce" style={{ animationDuration: '2s' }}>
                            <Trophy className="w-5 h-5 fill-yellow-400" />
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-lg text-slate-200">{player.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={\`flex items-center transition-opacity duration-300 \${lastUpdate === player.id ? 'opacity-100 text-emerald-400' : 'opacity-0 text-slate-500'}\`}>
                        <ChevronUp className="w-4 h-4" />
                        <span className="text-xs font-bold">+1</span>
                      </div>
                      <div className="w-12 text-right">
                        <span className={\`text-2xl font-black transition-colors duration-300 \${lastUpdate === player.id ? 'text-white' : 'text-slate-300'}\`}>
                          {player.score}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
