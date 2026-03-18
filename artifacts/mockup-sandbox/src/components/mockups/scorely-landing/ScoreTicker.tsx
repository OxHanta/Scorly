import React, { useState, useEffect } from "react";
import { Crown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Player {
  id: string;
  name: string;
  score: number;
}

const INITIAL_PLAYERS: Player[] = [
  { id: "p1", name: "ALEX", score: 2450 },
  { id: "p2", name: "JORDAN", score: 1820 },
  { id: "p3", name: "SAM", score: 1340 },
  { id: "p4", name: "CASEY", score: 980 },
  { id: "p5", name: "TAYLOR", score: 650 },
];

export function ScoreTicker() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [leaderChanged, setLeaderChanged] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers((currentPlayers) => {
        const oldLeader = currentPlayers[0].id;
        
        // Add random points to random players
        const updated = currentPlayers.map((p) => {
          // 40% chance to gain points, leader gains less often
          const shouldGain = Math.random() > (p.id === oldLeader ? 0.6 : 0.4);
          const points = shouldGain ? Math.floor(Math.random() * 500) + 50 : 0;
          return { ...p, score: p.score + points };
        });

        updated.sort((a, b) => b.score - a.score);
        
        if (updated[0].id !== oldLeader) {
          setLeaderChanged(true);
          setTimeout(() => setLeaderChanged(false), 500);
        }

        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const leader = players[0];
  const runnersUp = players.slice(1, 4);
  const tickerText = players.map((p) => `${p.name} ${p.score.toLocaleString()}`).join("  ·  ") + "  ·  ";

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans overflow-hidden selection:bg-blue-500/30">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
      `}} />

      {/* TOP STRIP: Scrolling Ticker */}
      <div className="w-full bg-slate-900 border-b border-slate-800 overflow-hidden py-2 whitespace-nowrap flex">
        <div className="animate-marquee inline-block font-mono text-sm text-slate-300 tracking-wider">
          {tickerText}{tickerText}{tickerText}{tickerText}
        </div>
      </div>

      {/* CENTER HERO: Live Leader */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-4">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse-glow pointer-events-none" />

        <div className={`flex flex-col items-center transition-all duration-500 z-10 ${leaderChanged ? 'scale-110 opacity-50 blur-sm' : 'scale-100 opacity-100 blur-0'}`}>
          <Crown className="w-16 h-16 text-yellow-500 mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" strokeWidth={2.5} />
          
          <h1 className="text-[clamp(4rem,12vw,10rem)] font-black leading-none tracking-tighter text-white drop-shadow-2xl uppercase mb-2">
            {leader.name}
          </h1>
          
          <div className="text-[clamp(3rem,8vw,6rem)] font-mono font-bold bg-gradient-to-br from-blue-300 to-blue-600 bg-clip-text text-transparent tracking-tight tabular-nums">
            {leader.score.toLocaleString()}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="w-full pb-12 pt-8 px-4 flex flex-col items-center z-10 bg-gradient-to-t from-zinc-950 to-transparent">
        <p className="text-xl text-slate-400 mb-8 font-medium text-center max-w-md">
          Real-time leaderboards for game night.
        </p>
        
        <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white text-lg h-14 px-10 rounded-full font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all mb-12">
          <Play className="w-5 h-5 mr-2 fill-current" />
          Start a leaderboard
        </Button>
        
        {/* Ranking Strip */}
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl w-full">
          {runnersUp.map((player, index) => (
            <div key={player.id} className="bg-slate-900/80 border border-slate-800 backdrop-blur-sm rounded-full px-5 py-2.5 flex items-center gap-3">
              <span className="text-slate-500 font-mono font-bold">#{index + 2}</span>
              <span className="font-bold text-slate-200">{player.name}</span>
              <span className="font-mono text-blue-400">{player.score.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
