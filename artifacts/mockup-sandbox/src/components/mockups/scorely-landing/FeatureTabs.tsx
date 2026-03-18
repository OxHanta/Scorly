import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Link as LinkIcon, 
  Activity, 
  History, 
  Smartphone, 
  Users, 
  Share2, 
  Award,
  Crown,
  ChevronRight,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FeatureTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [hasExplored, setHasExplored] = useState(false);

  useEffect(() => {
    if (activeTab !== 0) {
      setHasExplored(true);
    }
  }, [activeTab]);

  const tabs = [
    { id: 0, label: "Live Scores", icon: Activity, color: "text-red-500" },
    { id: 1, label: "Share Links", icon: LinkIcon, color: "text-blue-500" },
    { id: 2, label: "Winner Moment", icon: Trophy, color: "text-yellow-500" },
    { id: 3, label: "Game History", icon: History, color: "text-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6 font-sans selection:bg-blue-500/30">
      
      {/* Header */}
      <div className="text-center space-y-4 mb-12 max-w-2xl mx-auto mt-12">
        <div className="inline-flex items-center space-x-2 bg-slate-900/50 rounded-full px-4 py-1.5 border border-slate-800">
          <Trophy className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-slate-300 tracking-wide uppercase">Scorely</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Everything your game night needs
        </h1>
        <p className="text-slate-400 text-lg">
          Explore the features that make keeping score effortless and fun.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 w-full max-w-4xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                ${isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20 scale-105" 
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700"}
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="w-full max-w-4xl relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 blur-3xl -z-10 rounded-[3rem]" />
        
        <div className="bg-slate-900/80 border border-slate-700/50 backdrop-blur-xl rounded-2xl min-h-[400px] overflow-hidden flex flex-col shadow-2xl">
          
          <div className="flex-1 p-8 md:p-12 flex items-center justify-center relative">
            {activeTab === 0 && <LiveScoresDemo />}
            {activeTab === 1 && <ShareLinksDemo />}
            {activeTab === 2 && <WinnerMomentDemo />}
            {activeTab === 3 && <GameHistoryDemo />}
          </div>

          {/* Label Bar */}
          <div className="bg-slate-950/50 border-t border-slate-800/50 p-4 text-center">
            <p className="text-slate-300 font-medium">
              {activeTab === 0 && "Scores sync to all devices in real time"}
              {activeTab === 1 && "Anyone with the link can follow along — no account needed"}
              {activeTab === 2 && "Celebrate the winner with a crown animation when the game ends"}
              {activeTab === 3 && "Every game is saved so you can settle the rivalry"}
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className={`transition-all duration-700 ease-in-out transform ${hasExplored ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-50'}`}>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)]">
          Start your first leaderboard
        </Button>
      </div>
      
      <div className="h-24" /> {/* Bottom spacing */}
    </div>
  );
}

// --- Tab Demos ---

function LiveScoresDemo() {
  const [scores, setScores] = useState([
    { name: "Alex", score: 42, color: "bg-emerald-500" },
    { name: "Jordan", score: 38, color: "bg-blue-500" },
    { name: "Sam", score: 25, color: "bg-purple-500" },
    { name: "Casey", score: 19, color: "bg-amber-500" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setScores(prev => {
        const newScores = [...prev];
        const randomIdx = Math.floor(Math.random() * prev.length);
        newScores[randomIdx] = { 
          ...newScores[randomIdx], 
          score: newScores[randomIdx].score + Math.floor(Math.random() * 5) + 1 
        };
        return newScores.sort((a, b) => b.score - a.score);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const maxScore = Math.max(...scores.map(s => s.score), 50);

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
      <Card className="bg-slate-950/80 border-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Game Night: Catan
          </h3>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">LIVE</span>
        </div>
        
        <div className="space-y-5">
          {scores.map((player, index) => (
            <div key={player.name} className="relative">
              <div className="flex justify-between items-end mb-1 relative z-10">
                <span className="font-medium text-slate-200 text-sm flex items-center gap-2">
                  <span className="text-slate-500 w-4">{index + 1}.</span> {player.name}
                </span>
                <span className="font-bold text-white font-mono">{player.score}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative z-0">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${player.color}`}
                  style={{ width: `${(player.score / maxScore) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ShareLinksDemo() {
  return (
    <div className="w-full max-w-lg flex flex-col md:flex-row items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      
      {/* Host Phone */}
      <div className="relative w-48 h-80 bg-slate-950 rounded-[2rem] border-4 border-slate-800 p-3 shadow-2xl flex flex-col">
        <div className="absolute top-0 inset-x-0 h-4 bg-slate-800 rounded-b-xl mx-12" /> {/* Notch */}
        
        <div className="mt-6 flex-1 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3 shadow-lg">
            <span className="text-xl font-bold text-white">A</span>
          </div>
          <div className="text-xs text-slate-400 mb-1">Host</div>
          <div className="font-semibold text-white text-sm mb-6">Alex</div>
          
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 w-full mt-auto mb-2 relative group cursor-pointer">
            <div className="text-[10px] text-slate-400 mb-1">Invite Link</div>
            <div className="text-xs text-blue-400 font-mono truncate">scorely.app/v/abc123</div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 p-1.5 rounded-md opacity-80">
              <Share2 className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Connection Animation */}
      <div className="hidden md:flex flex-col items-center justify-center gap-2">
        <div className="bg-slate-800 rounded-full p-2 animate-bounce shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <LinkIcon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="h-0.5 w-16 bg-gradient-to-r from-slate-700 via-blue-500 to-slate-700" />
      </div>

      {/* Spectator Phone */}
      <div className="relative w-48 h-80 bg-slate-950 rounded-[2rem] border-4 border-slate-800 p-3 shadow-2xl flex flex-col opacity-90 transform md:translate-y-4">
         <div className="absolute top-0 inset-x-0 h-4 bg-slate-800 rounded-b-xl mx-12" />
         
         <div className="mt-8 flex-1 flex flex-col">
           <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 mb-3">
             <div className="w-full h-2 bg-slate-800 rounded mb-2 w-1/2" />
             <div className="w-full h-1.5 bg-slate-800 rounded mb-1" />
             <div className="w-full h-1.5 bg-slate-800 rounded w-4/5" />
           </div>
           
           <div className="flex -space-x-2 justify-center mt-auto mb-6">
              <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-emerald-500 flex items-center justify-center"><span className="text-[10px] text-white font-bold">J</span></div>
              <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-amber-500 flex items-center justify-center"><span className="text-[10px] text-white font-bold">S</span></div>
              <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center"><span className="text-[10px] text-slate-300 font-bold">+3</span></div>
           </div>
           
           <div className="text-center">
             <div className="text-xs text-slate-400 mb-1">Spectators</div>
             <div className="font-semibold text-white text-sm">No account needed</div>
           </div>
         </div>
      </div>

    </div>
  );
}

function WinnerMomentDemo() {
  return (
    <div className="w-full max-w-md relative flex justify-center items-center h-full min-h-[300px] animate-in zoom-in duration-700">
      
      {/* Confetti (CSS-only approach) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className={`absolute rounded-full w-2 h-2 ${
              ['bg-blue-500', 'bg-yellow-400', 'bg-red-500', 'bg-emerald-400', 'bg-purple-500'][i % 5]
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.7 + (Math.random() * 0.3),
              transform: `scale(${0.5 + Math.random()})`,
              animation: `float ${2 + Math.random() * 3}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(45deg); }
        }
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 20px -5px rgba(250, 204, 21, 0.4); }
          50% { box-shadow: 0 0 40px 5px rgba(250, 204, 21, 0.6); }
          100% { box-shadow: 0 0 20px -5px rgba(250, 204, 21, 0.4); }
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] animate-bounce">
            <Crown size={40} weight="fill" />
          </div>
          <div 
            className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-4xl font-bold text-white border-4 border-slate-900 z-10 relative"
            style={{ animation: 'pulse-glow 2s infinite' }}
          >
            A
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Alex wins! 🎉</h2>
        <p className="text-yellow-400/80 font-medium bg-yellow-400/10 px-4 py-1 rounded-full border border-yellow-400/20">
          Final Score: 42
        </p>
      </div>

    </div>
  );
}

function GameHistoryDemo() {
  const games = [
    { title: "Game Night: Catan", date: "3 days ago", winner: "Alex", score: "42 pts" },
    { title: "Movie Trivia", date: "Last week", winner: "Jordan", score: "18 pts" },
    { title: "Mario Kart Tourney", date: "2 weeks ago", winner: "Sam", score: "150 pts" },
  ];

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-2 shadow-inner">
        
        <div className="p-4 flex items-center gap-3 border-b border-slate-800/50 mb-2">
          <div className="bg-slate-800 p-2 rounded-lg">
            <History className="w-5 h-5 text-slate-300" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Past Games</h3>
            <p className="text-xs text-slate-400">Your gaming legacy</p>
          </div>
        </div>

        <div className="space-y-2">
          {games.map((game, i) => (
            <div key={i} className="bg-slate-900/50 hover:bg-slate-800/80 transition-colors p-4 rounded-lg border border-slate-800/50 flex items-center justify-between cursor-pointer group">
              <div>
                <div className="font-medium text-slate-200 mb-1 group-hover:text-white transition-colors">{game.title}</div>
                <div className="flex items-center text-xs text-slate-500 gap-2">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {game.date}</span>
                  <span>•</span>
                  <span className="text-yellow-500/80 flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> {game.winner} won
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
          ))}
        </div>
        
        <div className="p-3 text-center mt-2">
          <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">View all history</button>
        </div>

      </div>
    </div>
  );
}
