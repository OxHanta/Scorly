import React, { useState } from "react";
import { Gamepad2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Types
type Player = {
  name: string;
  rank: number;
  score: number;
  color: string;
};

type Game = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  players?: Player[];
  winner?: string;
  winnerScore?: number;
};

// Mock Data
const INITIAL_ACTIVE_GAMES: Game[] = [
  {
    id: "g1",
    name: "Catan Tournament",
    isActive: true,
    createdAt: "12 min ago",
    players: [
      { name: "Alex", rank: 1, score: 2450, color: "#3b82f6" },
      { name: "Jordan", rank: 2, score: 1820, color: "#10b981" },
      { name: "Sam", rank: 3, score: 1340, color: "#f59e0b" },
    ],
  },
  {
    id: "g2",
    name: "Movie Trivia",
    isActive: true,
    createdAt: "34 min ago",
    players: [
      { name: "Casey", rank: 1, score: 980, color: "#8b5cf6" },
      { name: "Taylor", rank: 2, score: 650, color: "#f43f5e" },
    ],
  },
  {
    id: "g3",
    name: "Poker Night",
    isActive: true,
    createdAt: "1 hr ago",
    players: [
      { name: "Riley", rank: 1, score: 3200, color: "#06b6d4" },
      { name: "Morgan", rank: 2, score: 2100, color: "#84cc16" },
      { name: "Jamie", rank: 3, score: 1500, color: "#f97316" },
      { name: "Drew", rank: 4, score: 800, color: "#a855f7" },
    ],
  },
];

const INITIAL_ENDED_GAMES: Game[] = [
  {
    id: "g4",
    name: "Monopoly",
    isActive: false,
    createdAt: "2 days ago",
    winner: "Alex",
    winnerScore: 5600,
  },
  {
    id: "g5",
    name: "Uno Championship",
    isActive: false,
    createdAt: "5 days ago",
    winner: "Jordan",
    winnerScore: 3400,
  },
];

export function TimelineFeed() {
  const [activeGames, setActiveGames] = useState<Game[]>(INITIAL_ACTIVE_GAMES);
  const [endedGames, setEndedGames] = useState<Game[]>(INITIAL_ENDED_GAMES);
  const [newGameName, setNewGameName] = useState("");

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameName.trim()) return;

    const newGame: Game = {
      id: `g${Date.now()}`,
      name: newGameName,
      isActive: true,
      createdAt: "Just now",
      players: [],
    };

    setActiveGames([newGame, ...activeGames]);
    setNewGameName("");
  };

  const handleClearHistory = () => {
    setEndedGames([]);
  };

  const renderGameCard = (game: Game) => {
    return (
      <div 
        key={game.id} 
        className="relative pl-6 pb-8 last:pb-0"
        onClick={() => console.log(`Navigate to /game/${game.id}`)}
      >
        {/* Timeline Line */}
        <div className="absolute left-[7px] top-8 bottom-0 w-0.5 bg-slate-800" />
        
        {/* Timeline Dot */}
        <div className="absolute left-0 top-[26px] flex flex-col items-center">
          <div className="text-[10px] text-slate-500 font-medium whitespace-nowrap -ml-10 mb-1 absolute -top-5">
            {game.createdAt}
          </div>
          <div 
            className={`w-4 h-4 rounded-full border-2 border-slate-950 flex items-center justify-center ${
              game.isActive ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-slate-600"
            }`}
          >
            {game.isActive && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
          </div>
        </div>

        {/* Card */}
        <div className="ml-4 bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm hover:border-slate-700 hover:bg-slate-800/50 transition-colors cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                {game.name}
              </h3>
            </div>
            {game.isActive ? (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                Live
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">
                Ended
              </Badge>
            )}
          </div>

          {game.isActive && game.players && game.players.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {game.players.map((p) => (
                <div key={p.name} className="flex items-center gap-2 bg-slate-950/50 rounded-full pr-3 border border-slate-800/80">
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-medium leading-none mb-0.5">{p.name}</span>
                    <span className="text-xs font-bold text-slate-200 leading-none">{p.score.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-800/50">
            <div className="text-sm text-slate-500 font-medium">
              {game.isActive ? (
                <span>{game.players?.length || 0} players</span>
              ) : (
                <span className="flex items-center gap-1 text-amber-500/80">
                  Winner: {game.winner} 🏆
                </span>
              )}
            </div>
            {game.isActive ? (
              <div className="text-xs text-slate-400 flex items-center gap-1">
                In progress<span className="animate-pulse">...</span>
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-medium">
                {game.winnerScore?.toLocaleString()} pts
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="py-6 px-8 flex justify-between items-center bg-slate-950/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-900">
        <div className="flex items-center gap-2 text-blue-500">
          <Gamepad2 className="w-6 h-6" />
          <span className="text-xl font-bold tracking-tight text-slate-100">Scorely</span>
        </div>
        <p className="text-sm font-medium text-slate-500">Your game history</p>
      </header>

      {/* Main Timeline */}
      <main className="px-8 pt-8 pb-32 max-w-3xl mx-auto">
        <div className="relative">
          {/* Active Games */}
          {activeGames.length > 0 && (
            <div className="mb-10">
              {activeGames.map(renderGameCard)}
            </div>
          )}

          {/* Divider */}
          {activeGames.length > 0 && endedGames.length > 0 && (
            <div className="flex items-center gap-4 my-8 relative z-0">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-widest bg-slate-950 px-2">Earlier</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-700/50 to-transparent" />
            </div>
          )}

          {/* Ended Games */}
          {endedGames.length > 0 && (
            <div>
              {endedGames.map(renderGameCard)}
            </div>
          )}
          
          {activeGames.length === 0 && endedGames.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <Gamepad2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No games yet. Start one below!</p>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 p-4 px-8 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block text-sm font-medium text-slate-400 whitespace-nowrap">
            Start a new game:
          </div>
          
          <form onSubmit={handleCreateGame} className="flex-1 flex items-center gap-3">
            <Input 
              value={newGameName}
              onChange={(e) => setNewGameName(e.target.value)}
              placeholder="e.g. Scrabble Night..."
              className="bg-slate-950/50 border-slate-700 text-slate-200 placeholder:text-slate-600 focus-visible:ring-blue-500/50 h-10"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-900/20 whitespace-nowrap h-10 px-5">
              Create <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {endedGames.length > 0 && (
            <button 
              onClick={handleClearHistory}
              className="text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors hidden md:block whitespace-nowrap ml-4"
            >
              Clear History
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
