import React from 'react';
import { Trophy, Crown, ChevronRight } from 'lucide-react';

export function TrophyGrand() {
  return (
    <div className="relative min-h-screen bg-[#1a0030] overflow-hidden flex flex-col items-center pt-12 pb-24 font-sans">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes pulse-glow {
          0% { opacity: 0.5; transform: scale(0.9) translateX(-50%); }
          50% { opacity: 1; transform: scale(1.1) translateX(-45%); }
          100% { opacity: 0.5; transform: scale(0.9) translateX(-50%); }
        }
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .confetti {
          position: absolute;
          animation: fall linear infinite;
        }
      `}</style>

      {/* Confetti Elements */}
      {Array.from({ length: 30 }).map((_, i) => {
        const randomX = (i * 137.5) % 100;
        const randomDelay = (i * 0.7) % 5;
        const randomDuration = 4 + ((i * 1.3) % 4);
        const randomSize = 6 + ((i * 3) % 8);
        const colors = ['#fcd34d', '#fb7185', '#a78bfa', '#38bdf8', '#34d399'];
        const color = colors[i % colors.length];
        const shape = i % 2 === 0 ? '50%' : '0%';

        return (
          <div
            key={i}
            className="confetti"
            style={{
              left: \`\${randomX}%\`,
              top: '-5%',
              width: \`\${randomSize}px\`,
              height: \`\${randomSize * (i % 3 === 0 ? 2 : 1)}px\`,
              backgroundColor: color,
              borderRadius: shape,
              animationDelay: \`\${randomDelay}s\`,
              animationDuration: \`\${randomDuration}s\`,
              zIndex: 10,
            }}
          />
        );
      })}

      {/* Background Radial Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Typography */}
      <div className="relative z-20 text-center mt-4 mb-8 px-4 flex-shrink-0">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight flex flex-col items-center gap-2 leading-none">
          <span className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] flex items-center gap-2">
            SCORE<Crown className="w-12 h-12 md:w-16 md:h-16 text-amber-300 -mt-4 md:-mt-6" />Y
          </span>
        </h1>
        <p className="mt-6 text-xl text-purple-200/90 font-medium max-w-lg mx-auto">
          Elevate your game night. Track scores, crown champions.
        </p>
      </div>

      {/* Podium Stage Container */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-end w-full max-w-4xl mx-auto px-4 mt-8">
        
        {/* The Platforms */}
        <div className="flex items-end justify-center gap-1 md:gap-4 w-full relative">
          
          {/* 2nd Place */}
          <div className="relative w-[30%] max-w-[160px] h-[160px] md:h-[200px] bg-gradient-to-t from-slate-900 to-slate-400 rounded-t-lg border-t-4 border-slate-300 shadow-[0_0_20px_rgba(148,163,184,0.2)] flex flex-col items-center pt-4 z-10">
            <span className="text-4xl font-bold text-slate-800 drop-shadow-sm">2</span>
            <div className="mt-4 bg-slate-900/60 px-3 py-1.5 rounded text-sm text-slate-100 font-semibold backdrop-blur-sm border border-slate-500/30 whitespace-nowrap">Leo (1,840)</div>
          </div>

          {/* 1st Place */}
          <div className="relative w-[35%] max-w-[200px] h-[240px] md:h-[280px] bg-gradient-to-t from-amber-900 to-amber-400 rounded-t-lg border-t-4 border-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.3)] flex flex-col items-center pt-6 z-20">
            {/* Glow behind trophy */}
            <div 
              className="absolute -top-32 left-1/2 w-64 h-64 bg-amber-500/40 rounded-full blur-3xl pointer-events-none"
              style={{ animation: 'pulse-glow 4s ease-in-out infinite' }}
            />
            {/* Trophy */}
            <div className="absolute -top-28 md:-top-36 left-1/2 -translate-x-1/2" style={{ animation: 'float 6s ease-in-out infinite' }}>
              <Trophy className="w-32 h-32 md:w-48 md:h-48 text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] fill-amber-500/20" strokeWidth={1.5} />
            </div>

            <span className="text-5xl font-black text-amber-900 drop-shadow-sm">1</span>
            <div className="mt-4 bg-amber-900/60 px-4 py-2 rounded text-base text-amber-100 font-bold backdrop-blur-sm border border-amber-500/40 whitespace-nowrap">Maya (2,450)</div>
          </div>

          {/* 3rd Place */}
          <div className="relative w-[30%] max-w-[160px] h-[120px] md:h-[150px] bg-gradient-to-t from-orange-950 to-orange-700 rounded-t-lg border-t-4 border-orange-400 shadow-[0_0_15px_rgba(234,88,12,0.2)] flex flex-col items-center pt-3 z-10">
            <span className="text-3xl font-bold text-orange-950 drop-shadow-sm">3</span>
            <div className="mt-3 bg-orange-950/60 px-3 py-1.5 rounded text-sm text-orange-100 font-semibold backdrop-blur-sm border border-orange-500/30 whitespace-nowrap">Sam (1,200)</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-30 mt-16 px-4 w-full flex justify-center flex-shrink-0">
        <button className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-black tracking-wide text-amber-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(251,191,36,0.4)] hover:shadow-[0_0_60px_rgba(251,191,36,0.6)] w-full max-w-md uppercase">
          <Trophy className="w-6 h-6 fill-amber-950" />
          Start a Leaderboard
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 rounded-full border border-white/40 pointer-events-none" />
        </button>
      </div>
    </div>
  );
}
