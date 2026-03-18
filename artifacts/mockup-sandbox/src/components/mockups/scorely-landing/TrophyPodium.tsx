import React, { useEffect, useState } from "react";
import { Trophy, Medal, Crown, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TrophyPodium() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* Confetti / Sparkles (CSS only) */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <Sparkles
              key={i}
              className={`absolute text-amber-300/60 animate-pulse`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto px-4 w-full">
        
        {/* Header/Brand */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 drop-shadow-lg mb-6 flex items-center justify-center gap-4">
            Scorely
          </h1>
          <p className="text-xl md:text-2xl text-purple-200/90 font-medium max-w-2xl mx-auto leading-relaxed">
            Track scores, crown winners, and make every game night competitive.
          </p>
        </div>

        {/* Podium Area */}
        <div className="relative w-full max-w-3xl h-[400px] flex items-center justify-center my-8">
          
          {/* Trophy Central */}
          <div className="relative z-20 flex flex-col items-center animate-in zoom-in duration-1000 delay-300">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400 blur-3xl opacity-30 rounded-full animate-pulse" />
              <div className="w-48 h-48 bg-gradient-to-b from-amber-300 to-amber-600 rounded-full p-1 shadow-[0_0_50px_rgba(251,191,36,0.4)] relative z-10">
                <div className="w-full h-full bg-indigo-950 rounded-full flex items-center justify-center border-4 border-indigo-900/50">
                  <Trophy className="w-24 h-24 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Player Cards */}
          <div className="absolute top-1/4 left-0 md:left-12 z-30 animate-in fade-in slide-in-from-left-12 duration-1000 delay-500 hover:-translate-y-2 transition-transform cursor-default">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl flex items-center gap-4 w-64 rotate-[-6deg]">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full flex items-center justify-center shadow-inner text-indigo-950">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Maya</p>
                <p className="text-amber-300 font-mono font-semibold">3,200 pts</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-1/4 right-0 md:right-8 z-30 animate-in fade-in slide-in-from-right-12 duration-1000 delay-700 hover:-translate-y-2 transition-transform cursor-default">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl flex items-center gap-4 w-64 rotate-[4deg]">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full flex items-center justify-center shadow-inner text-indigo-950">
                <Medal className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Leo</p>
                <p className="text-slate-300 font-mono font-semibold">2,800 pts</p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-8 left-1/4 z-30 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-1000 hover:-translate-y-2 transition-transform cursor-default hidden md:block">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl flex items-center gap-4 w-60 rotate-[-2deg]">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center shadow-inner text-white">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Sam</p>
                <p className="text-amber-700 font-mono font-semibold">2,150 pts</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* CTA */}
        <div className="mt-16 relative z-40 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1000">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-indigo-950 font-bold text-xl px-12 py-8 rounded-full shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:shadow-[0_0_60px_rgba(251,191,36,0.7)] transition-all duration-300 hover:scale-105 border-2 border-amber-300/50"
          >
            Start a Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
}
