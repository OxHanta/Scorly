import React, { useEffect, useState } from "react";
import { Crown, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChallengePodium() {
  const [scores, setScores] = useState({
    p1: 24500,
    p2: 21200,
    p3: 18900,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setScores((prev) => ({
        p1: prev.p1 + Math.floor(Math.random() * 80),
        p2: prev.p2 + Math.floor(Math.random() * 60),
        p3: prev.p3 + Math.floor(Math.random() * 50),
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center overflow-hidden font-sans relative selection:bg-yellow-500/30 text-slate-50">
      {/* Dramatic Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,7,100,0.5)_0%,rgba(2,6,23,1)_80%)] pointer-events-none" />

      {/* Gold Glow behind center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto px-6 py-8 flex justify-center relative z-10">
        <div className="flex items-center gap-2 text-slate-300 font-bold tracking-wider text-sm uppercase">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          Scorely
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center relative z-10">
        
        {/* Podium Container - Takes up about 60% of vertical visual space implicitly through margins/padding */}
        <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-8 h-[50vh] min-h-[400px] w-full max-w-3xl mb-12">
          
          {/* #2 Player */}
          <div className="flex flex-col items-center w-1/3 max-w-[200px] relative">
            {/* Avatar & Info */}
            <div className="flex flex-col items-center mb-6 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100">
              <div className="text-slate-400 mb-2">
                <Medal size={24} />
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 border-2 border-slate-400 flex items-center justify-center text-xl font-bold text-slate-200 shadow-[0_0_15px_rgba(148,163,184,0.3)] mb-4">
                EK
              </div>
              <h3 className="font-semibold text-slate-200 text-lg mb-1">Elena</h3>
              <div className="font-mono text-xl md:text-2xl font-bold text-slate-400">
                {scores.p2.toLocaleString()}
              </div>
            </div>
            {/* Platform */}
            <div className="w-full h-[180px] md:h-[220px] relative">
              {/* Top face */}
              <div className="absolute top-0 w-full h-8 bg-slate-300 rounded-t-lg -skew-x-[15deg] origin-bottom scale-x-[1.05]" />
              {/* Front face */}
              <div className="absolute top-8 w-full bottom-0 bg-gradient-to-b from-slate-400 to-slate-600 rounded-b-lg shadow-2xl flex items-start justify-center pt-8">
                <span className="text-4xl md:text-6xl font-black text-slate-800/20">2</span>
              </div>
            </div>
          </div>

          {/* #1 Player */}
          <div className="flex flex-col items-center w-1/3 max-w-[240px] relative z-10">
            {/* Avatar & Info */}
            <div className="flex flex-col items-center mb-6 animate-in slide-in-from-bottom-12 fade-in duration-1000">
              <div className="text-yellow-400 mb-2 animate-bounce">
                <Crown size={32} />
              </div>
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-slate-800 border-4 border-yellow-400 flex items-center justify-center text-2xl md:text-3xl font-black text-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)] mb-4 relative">
                <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-pulse" />
                JD
              </div>
              <h3 className="font-bold text-yellow-400 text-xl md:text-2xl mb-1">Marcus</h3>
              <div className="font-mono text-2xl md:text-4xl font-black text-yellow-500 tracking-tight">
                {scores.p1.toLocaleString()}
              </div>
            </div>
            {/* Platform */}
            <div className="w-full h-[260px] md:h-[320px] relative">
              {/* Top face */}
              <div className="absolute top-0 w-full h-10 bg-yellow-300 rounded-t-lg scale-x-[1.05] shadow-[0_-5px_20px_rgba(250,204,21,0.3)]" />
              {/* Front face */}
              <div className="absolute top-10 w-full bottom-0 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-b-lg shadow-2xl flex items-start justify-center pt-10">
                <span className="text-6xl md:text-8xl font-black text-amber-900/20">1</span>
              </div>
            </div>
          </div>

          {/* #3 Player */}
          <div className="flex flex-col items-center w-1/3 max-w-[200px] relative">
            {/* Avatar & Info */}
            <div className="flex flex-col items-center mb-6 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-200">
              <div className="text-amber-700 mb-2">
                <Medal size={24} />
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 border-2 border-amber-700 flex items-center justify-center text-xl font-bold text-slate-200 shadow-[0_0_15px_rgba(180,83,9,0.3)] mb-4">
                SJ
              </div>
              <h3 className="font-semibold text-slate-200 text-lg mb-1">Sarah</h3>
              <div className="font-mono text-xl md:text-2xl font-bold text-amber-600">
                {scores.p3.toLocaleString()}
              </div>
            </div>
            {/* Platform */}
            <div className="w-full h-[140px] md:h-[160px] relative">
              {/* Top face */}
              <div className="absolute top-0 w-full h-8 bg-amber-600 rounded-t-lg skew-x-[15deg] origin-bottom scale-x-[1.05]" />
              {/* Front face */}
              <div className="absolute top-8 w-full bottom-0 bg-gradient-to-b from-amber-700 to-amber-900 rounded-b-lg shadow-2xl flex items-start justify-center pt-6">
                <span className="text-4xl md:text-6xl font-black text-amber-950/30">3</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copy & CTA */}
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif italic text-white mb-10 tracking-tight">
            Who's winning at your table?
          </h1>
          <Button 
            size="lg" 
            className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg md:text-xl px-10 py-8 h-auto rounded-full shadow-[0_0_40px_rgba(250,204,21,0.3)] hover:shadow-[0_0_60px_rgba(250,204,21,0.5)] transition-all hover:scale-105"
          >
            Start competing
          </Button>
        </div>

      </main>
    </div>
  );
}
