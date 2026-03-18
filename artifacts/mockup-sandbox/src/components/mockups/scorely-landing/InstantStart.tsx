import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Zap, Link as LinkIcon, Unlock } from "lucide-react";

export function InstantStart() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans text-slate-50">
      {/* Subtle background grid */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 100%)'
        }}
      />

      <div className="z-10 w-full max-w-xl px-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Header Section */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 inline-block">
            Scorely
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium">
            Real-time leaderboards for game night
          </p>
        </div>

        {/* Hero Form Card */}
        <Card className="w-full bg-slate-900/80 border-slate-700/50 backdrop-blur-md rounded-2xl shadow-2xl shadow-indigo-500/10">
          <CardContent className="p-6 md:p-8 space-y-6">
            
            <div className="space-y-2.5">
              <Label htmlFor="game-name" className="text-slate-300 font-medium ml-1">
                Game name
              </Label>
              <Input 
                id="game-name" 
                placeholder="e.g. Catan Tournament, Movie Trivia..." 
                className="h-14 text-lg bg-slate-950/50 border-slate-700 focus-visible:ring-indigo-500 rounded-xl px-4 placeholder:text-slate-600 text-slate-100 transition-all focus:bg-slate-950"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="players" className="text-slate-300 font-medium ml-1">
                Players &mdash; separate with commas
              </Label>
              <Input 
                id="players" 
                placeholder="Alex, Jordan, Sam, Casey" 
                className="h-14 text-lg bg-slate-950/50 border-slate-700 focus-visible:ring-indigo-500 rounded-xl px-4 placeholder:text-slate-600 text-slate-100 transition-all focus:bg-slate-950"
              />
            </div>

            <Button 
              className="w-full h-14 mt-4 text-lg font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all duration-300 group overflow-hidden relative border border-indigo-500/50"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Create Leaderboard
                <Play className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''} fill-white`} />
              </span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </Button>
            
          </CardContent>
        </Card>

        {/* Trust Signals */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800/80 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Ready in seconds</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800/80 backdrop-blur-sm">
            <LinkIcon className="w-4 h-4 text-blue-400" />
            <span>Shareable link included</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800/80 backdrop-blur-sm">
            <Unlock className="w-4 h-4 text-purple-400" />
            <span>Free, no account</span>
          </div>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
