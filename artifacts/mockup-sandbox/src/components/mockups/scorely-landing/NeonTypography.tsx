import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export function NeonTypography() {
  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden flex flex-col items-center justify-center selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      
      {/* Background grid / scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay"
        style={{
          background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
      
      {/* Radial gradient to highlight center faintly */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.05)_0%,transparent_50%)]" />

      <main className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto space-y-12">
        {/* Glow behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[20vh] bg-fuchsia-600/20 blur-[100px] rounded-[100%] pointer-events-none" />

        {/* Brand Name */}
        <h1 
          className="font-black tracking-tighter text-white uppercase select-none"
          style={{
            fontSize: 'clamp(5rem, 15vw, 12rem)',
            lineHeight: 1,
            textShadow: `
              0 0 10px rgba(217, 70, 239, 0.7),
              0 0 20px rgba(217, 70, 239, 0.5),
              0 0 40px rgba(217, 70, 239, 0.3),
              0 0 80px rgba(217, 70, 239, 0.1)
            `
          }}
        >
          Scorely
        </h1>

        <div className="space-y-8 flex flex-col items-center">
          {/* Tagline */}
          <p className="text-zinc-400 text-lg md:text-2xl font-light tracking-wide max-w-2xl balance-text">
            Track scores, crown winners, and make every game night competitive.
          </p>

          {/* CTA Button */}
          <button className="group relative px-8 py-4 bg-transparent text-fuchsia-100 font-medium uppercase tracking-widest text-sm transition-all duration-300 hover:text-white">
            <span className="relative z-10 flex items-center gap-2">
              Start a Leaderboard
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
            
            {/* Outline layers for neon button effect */}
            <div className="absolute inset-0 border border-fuchsia-500/50 rounded-sm transition-all duration-300 group-hover:border-fuchsia-400 group-hover:bg-fuchsia-500/10 group-hover:shadow-[0_0_20px_rgba(217,70,239,0.4)_inset,0_0_20px_rgba(217,70,239,0.4)]" />
            
            {/* Inner corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </main>

    </div>
  );
}