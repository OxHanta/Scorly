import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Share2, History, X, Check, ArrowRight, Zap, RefreshCw, Smartphone, Users } from "lucide-react";

export function BeforeAfter() {
  const [scores, setScores] = useState([
    { name: "Alex", score: 850, color: "bg-blue-500" },
    { name: "Sam", score: 620, color: "bg-purple-500" },
    { name: "Taylor", score: 410, color: "bg-pink-500" },
    { name: "Jordan", score: 250, color: "bg-amber-500" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setScores(prev => 
        prev.map(p => ({
          ...p,
          score: p.score + Math.floor(Math.random() * 50)
        })).sort((a, b) => b.score - a.score)
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const maxScore = Math.max(...scores.map(s => s.score));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center z-10 pointer-events-none">
        <div className="flex items-center gap-2 text-slate-300 font-semibold tracking-wide">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
            <Trophy className="w-3.5 h-3.5 text-white" />
          </div>
          Scorely
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row relative">
        {/* Left Panel: Chaos */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-slate-800/50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-950/10 via-zinc-950 to-zinc-950">
          
          <div className="absolute top-20 flex items-center gap-2 text-red-400 font-medium tracking-widest uppercase text-sm px-4 py-1.5 rounded-full bg-red-950/30 border border-red-900/50">
            <X className="w-4 h-4" />
            Without Scorely
          </div>

          {/* Messy Note Card */}
          <div className="relative mt-12 w-full max-w-sm">
            {/* Floating bubbles */}
            <div className="absolute -top-12 -left-8 bg-slate-800 text-slate-200 text-xs px-3 py-2 rounded-xl rounded-br-sm border border-slate-700 shadow-xl -rotate-6 z-10">
              Wait, I had 1200!
            </div>
            <div className="absolute top-32 -right-12 bg-slate-800 text-slate-200 text-xs px-3 py-2 rounded-xl rounded-bl-sm border border-slate-700 shadow-xl rotate-3 z-10">
              Who's keeping score??
            </div>
            <div className="absolute -bottom-6 left-12 bg-slate-800 text-slate-200 text-xs px-3 py-2 rounded-xl rounded-tr-sm border border-slate-700 shadow-xl -rotate-2 z-10">
              That's not right!
            </div>

            <Card className="bg-[#fdfbf7] p-6 pb-12 rotate-2 shadow-2xl border-none text-slate-800 font-mono relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-8 w-px bg-red-300/50"></div>
              
              <div className="pl-6 space-y-6 text-lg relative">
                <div className="border-b border-blue-200 pb-2 mb-4">
                  <h3 className="font-bold text-xl uppercase tracking-widest text-slate-600">Game Night</h3>
                </div>
                
                <div className="flex justify-between items-center relative">
                  <span>Alex</span>
                  <div className="flex gap-2 items-center">
                    <span className="line-through text-slate-400 decoration-red-500 decoration-2">800</span>
                    <span className="font-bold relative">
                      850
                      <svg className="absolute -top-2 -left-2 w-12 h-12 text-blue-500 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span>Sam</span>
                  <div className="flex gap-2 items-center">
                    <span className="line-through text-slate-400 decoration-red-500 decoration-2">550</span>
                    <span className="text-red-600 font-bold">???</span>
                  </div>
                </div>

                <div className="flex justify-between items-center relative">
                  <span>Taylor</span>
                  <span className="-rotate-6 inline-block transform origin-right">410</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Jordan</span>
                  <div className="flex gap-2 items-center">
                    <span className="opacity-50">200 + 50 = </span>
                    <span>250</span>
                  </div>
                </div>

                {/* Random scribbles */}
                <svg className="absolute bottom-0 right-4 w-24 h-12 text-slate-300" viewBox="0 0 100 50" fill="none" stroke="currentColor">
                  <path d="M10,40 Q30,10 50,30 T90,20" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </Card>
          </div>

          <div className="mt-20 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400 max-w-sm">
            <span>• Lost papers</span>
            <span>• Score disputes</span>
            <span>• No history</span>
            <span>• Manual math</span>
          </div>

        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block absolute top-1/4 bottom-1/4 left-1/2 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent z-10 -translate-x-1/2 shadow-[0_0_15px_rgba(255,255,255,0.1)]"></div>

        {/* Right Panel: Clean */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/20 via-slate-950 to-slate-950">
          
          <div className="absolute top-20 flex items-center gap-2 text-emerald-400 font-medium tracking-widest uppercase text-sm px-4 py-1.5 rounded-full bg-emerald-950/30 border border-emerald-900/50">
            <Check className="w-4 h-4" />
            With Scorely
          </div>

          {/* Clean Leaderboard Card */}
          <div className="relative mt-12 w-full max-w-sm">
            <div className="absolute -top-3 -right-3 flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-700/50 text-xs font-medium text-emerald-400 z-10 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE
            </div>

            <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-1 shadow-2xl overflow-hidden rounded-2xl">
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800/50">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-lg text-slate-200">Game Night</h3>
                  <div className="flex gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors">
                      <Users className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {scores.map((player, i) => (
                    <div key={player.name} className="relative group transition-all duration-500 ease-out" style={{ transform: `translateY(${i * 0}px)` }}>
                      <div className="flex items-center justify-between mb-1.5 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-6 text-center text-sm font-bold text-slate-500">
                            {i === 0 ? <Trophy className="w-4 h-4 text-yellow-500 mx-auto" /> : i + 1}
                          </div>
                          <div className="font-medium text-slate-200">{player.name}</div>
                        </div>
                        <div className="font-bold tabular-nums text-slate-100">{player.score}</div>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${player.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${(player.score / maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-20 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400 max-w-sm">
            <span className="text-emerald-400/80">• Live scores</span>
            <span>• Instant winners</span>
            <span>• Shareable links</span>
            <span>• Full history</span>
          </div>

        </div>
      </div>

      {/* Shared CTA Bar */}
      <div className="relative border-t border-slate-800/60 bg-slate-950/80 backdrop-blur-md p-6 z-20">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-100">Stop the arguments.</h2>
            <p className="text-slate-400 mt-1">Start a leaderboard in seconds.</p>
          </div>
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all">
            Get Started Free
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
