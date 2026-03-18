import React from "react";
import { Trophy, Crown, Medal, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SPARKLES = [
  { top: "10%", left: "15%", size: 6, color: "bg-amber-300", delay: "0s" },
  { top: "25%", left: "85%", size: 8, color: "bg-amber-400", delay: "0.2s" },
  { top: "40%", left: "5%", size: 4, color: "bg-amber-200", delay: "0.5s" },
  { top: "60%", left: "95%", size: 6, color: "bg-amber-300", delay: "0.1s" },
  { top: "80%", left: "20%", size: 8, color: "bg-amber-500", delay: "0.4s" },
  { top: "85%", left: "75%", size: 5, color: "bg-amber-200", delay: "0.7s" },
  { top: "15%", left: "60%", size: 7, color: "bg-amber-400", delay: "0.3s" },
  { top: "50%", left: "12%", size: 5, color: "bg-amber-300", delay: "0.6s" },
  { top: "70%", left: "88%", size: 7, color: "bg-amber-400", delay: "0.8s" },
  { top: "30%", left: "25%", size: 4, color: "bg-amber-200", delay: "0.9s" },
  { top: "10%", left: "40%", size: 6, color: "bg-amber-300", delay: "0.2s" },
  { top: "90%", left: "50%", size: 8, color: "bg-amber-500", delay: "0.5s" },
];

export function TrophyPolished() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-950 relative overflow-hidden flex flex-col items-center justify-center font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-amber-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Deterministic Sparkles */}
      {SPARKLES.map((sparkle, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${sparkle.color} animate-pulse`}
          style={{
            top: sparkle.top,
            left: sparkle.left,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: sparkle.delay,
            animationDuration: "2s",
            boxShadow: "0 0 10px rgba(251, 191, 36, 0.5)",
          }}
        />
      ))}

      {/* Header / Typography */}
      <div className="relative z-10 text-center mb-16 mt-8 flex flex-col items-center">
        <div className="flex items-center gap-4 mb-4">
          <Crown className="w-10 h-10 text-amber-400" />
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
            Scorely
          </h1>
          <Crown className="w-10 h-10 text-amber-400" />
        </div>
        <p className="text-purple-200/90 text-lg md:text-xl font-medium tracking-wide max-w-md">
          Gamify your team's success. Track, compete, and celebrate every win.
        </p>
      </div>

      {/* Hero Section: Trophy & Cards */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl px-4">
        {/* Cards container - natural arc */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 lg:gap-8 w-full mb-16">
          
          {/* Card 2: Leo (Silver) */}
          <div className="transform md:translate-y-8 md:-rotate-6 transition-transform hover:scale-105 duration-300 w-full max-w-[280px]">
            <div className="bg-white/10 backdrop-blur-md border border-slate-300/30 rounded-2xl p-4 shadow-xl flex items-center gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-full bg-slate-300/20 flex items-center justify-center shrink-0 border border-slate-300/50">
                <span className="text-xl font-bold text-slate-200">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Leo</h3>
                <p className="text-slate-300 text-sm">2,150 pts</p>
              </div>
              <Medal className="w-6 h-6 text-slate-300 shrink-0" />
            </div>
          </div>

          {/* Central Trophy */}
          <div className="relative flex items-center justify-center shrink-0 z-20 mx-4 my-8 md:my-0">
            {/* Pure CSS radial golden glow */}
            <div className="absolute w-48 h-48 bg-amber-500/40 rounded-full blur-[40px]" />
            {/* Subtle rotating golden ring border */}
            <div className="absolute w-40 h-40 rounded-full border border-amber-400/40 border-t-amber-400 animate-[spin_4s_linear_infinite]" />
            <div className="absolute w-36 h-36 rounded-full border border-amber-500/20 border-b-amber-500 animate-[spin_6s_linear_infinite_reverse]" />
            
            <div className="relative w-28 h-28 flex items-center justify-center">
              <Trophy className="w-24 h-24 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
            </div>
          </div>

          {/* Card 1: Maya (Gold) */}
          <div className="transform md:-translate-y-4 md:rotate-3 transition-transform hover:scale-105 duration-300 w-full max-w-[280px]">
             <div className="bg-white/10 backdrop-blur-md border border-amber-300/30 rounded-2xl p-4 shadow-xl flex items-center gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-400/50">
                <span className="text-xl font-bold text-amber-200">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Maya</h3>
                <p className="text-amber-200 text-sm">3,420 pts</p>
              </div>
              <Crown className="w-6 h-6 text-amber-400 shrink-0" />
            </div>
          </div>

          {/* Card 3: Sam (Bronze) */}
          <div className="transform md:translate-y-12 md:rotate-6 transition-transform hover:scale-105 duration-300 w-full max-w-[280px]">
            <div className="bg-white/10 backdrop-blur-md border border-rose-300/30 rounded-2xl p-4 shadow-xl flex items-center gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-200/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 border border-rose-400/50">
                <span className="text-xl font-bold text-rose-200">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Sam</h3>
                <p className="text-rose-200 text-sm">1,890 pts</p>
              </div>
              <Star className="w-6 h-6 text-rose-400 shrink-0" />
            </div>
          </div>

        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 mt-8 mb-16">
        <Button 
          size="lg" 
          className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-indigo-950 font-bold text-lg px-8 py-6 shadow-[0_0_20px_rgba(251,191,36,0.4)] border-2 border-amber-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:scale-105 transition-all duration-300 flex items-center gap-3"
        >
          <Sparkles className="w-5 h-5" />
          Start Winning Today
          <Sparkles className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
