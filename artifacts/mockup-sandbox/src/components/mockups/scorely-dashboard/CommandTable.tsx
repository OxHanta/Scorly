import React, { useState } from "react";
import { Gamepad2, ChevronRight, Trophy, Zap, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Player = {
  name: string;
  score: number;
  color: string;
};

type Game = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  players: Player[];
  winner?: { name: string; score: number };
};

const ACTIVE_GAMES: Game[] = [
  {
    id: "g1",
    name: "Catan Tournament",
    isActive: true,
    createdAt: "12 min ago",
    players: [
      { name: "Alex", score: 2450, color: "#3b82f6" },
      { name: "Jordan", score: 1820, color: "#10b981" },
      { name: "Sam", score: 1340, color: "#f59e0b" },
    ],
  },
  {
    id: "g2",
    name: "Movie Trivia",
    isActive: true,
    createdAt: "34 min ago",
    players: [
      { name: "Casey", score: 980, color: "#8b5cf6" },
      { name: "Taylor", score: 650, color: "#f43f5e" },
    ],
  },
  {
    id: "g3",
    name: "Poker Night",
    isActive: true,
    createdAt: "1 hr ago",
    players: [
      { name: "Riley", score: 3200, color: "#06b6d4" },
      { name: "Morgan", score: 2100, color: "#84cc16" },
      { name: "Jamie", score: 1500, color: "#f97316" },
      { name: "Drew", score: 800, color: "#a855f7" },
    ],
  },
];

const ENDED_GAMES: Game[] = [
  {
    id: "g4",
    name: "Monopoly",
    isActive: false,
    createdAt: "2 days ago",
    players: [{ name: "Alex", score: 5600, color: "#3b82f6" }],
    winner: { name: "Alex", score: 5600 },
  },
  {
    id: "g5",
    name: "Uno Championship",
    isActive: false,
    createdAt: "5 days ago",
    players: [{ name: "Jordan", score: 3400, color: "#10b981" }],
    winner: { name: "Jordan", score: 3400 },
  },
];

export function CommandTable() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [newGameName, setNewGameName] = useState("");

  const games = activeTab === "active" ? ACTIVE_GAMES : ENDED_GAMES;

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGameName.trim()) {
      console.log("Create game:", newGameName);
      setNewGameName("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      {/* Top Command Bar */}
      <div className="sticky top-0 z-10 w-full bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-blue-600/20 text-blue-500 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm leading-tight">Scorely</h1>
            <p className="text-xs text-slate-500 leading-tight">Score board & live sharing</p>
          </div>
        </div>

        <form onSubmit={handleCreateGame} className="flex items-center space-x-2">
          <Input
            value={newGameName}
            onChange={(e) => setNewGameName(e.target.value)}
            placeholder="New game name…"
            className="h-9 w-64 bg-slate-950 border-slate-800 focus-visible:ring-blue-500 text-sm"
          />
          <Button type="submit" size="sm" className="h-9 bg-blue-600 hover:bg-blue-700 text-white px-4">
            <Plus className="w-4 h-4 mr-1.5" />
            Create
          </Button>
        </form>

        <div className="text-sm text-slate-500 font-medium">
          <span className="text-blue-400">3 active</span> <span className="mx-1.5 opacity-50">·</span> 2 ended
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full border-b border-slate-800 px-6 pt-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 text-sm font-medium flex items-center border-b-2 transition-colors ${
              activeTab === "active"
                ? "border-blue-500 text-white"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <Zap className={`w-4 h-4 mr-2 ${activeTab === "active" ? "text-blue-500" : "text-slate-500"}`} />
            Active ({ACTIVE_GAMES.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 text-sm font-medium flex items-center border-b-2 transition-colors ${
              activeTab === "history"
                ? "border-white text-white"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <Clock className={`w-4 h-4 mr-2 ${activeTab === "history" ? "text-slate-300" : "text-slate-500"}`} />
            History ({ENDED_GAMES.length})
          </button>
        </div>
        
        {activeTab === "history" && (
          <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500 hover:text-slate-300 mb-2">
            Clear History
          </Button>
        )}
      </div>

      {/* Table Area */}
      <div className="w-full flex-1 overflow-auto">
        {/* Table Header */}
        <div className="grid grid-cols-[100px_minmax(200px,1fr)_120px_160px_100px_120px_40px] gap-4 px-6 py-3 border-b border-slate-800/80 text-[11px] font-semibold text-slate-500 tracking-wider uppercase bg-slate-900/50 sticky top-0">
          <div>Status</div>
          <div>Game Name</div>
          <div>Players</div>
          <div>Leader</div>
          <div>Top Score</div>
          <div>Started</div>
          <div className="text-center">→</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {games.map((game) => {
            const isLive = game.isActive;
            const topPlayer = game.players.reduce((prev, curr) => (curr.score > prev.score ? curr : prev), game.players[0]);
            const leaderName = isLive ? topPlayer.name : game.winner?.name || topPlayer.name;
            const leaderScore = isLive ? topPlayer.score : game.winner?.score || topPlayer.score;
            const displayPlayers = game.players.slice(0, 4);
            const extraPlayersCount = Math.max(0, game.players.length - 4);

            return (
              <button
                key={game.id}
                onClick={() => console.log(`Navigating to game ${game.id}`)}
                className="grid grid-cols-[100px_minmax(200px,1fr)_120px_160px_100px_120px_40px] gap-4 px-6 py-3.5 items-center border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors text-left group"
              >
                {/* Status */}
                <div className="flex items-center">
                  <span className="relative flex h-2.5 w-2.5 mr-2.5">
                    {isLive && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLive ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
                  </span>
                  <span className={`text-sm font-medium ${isLive ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {isLive ? 'Live' : 'Ended'}
                  </span>
                </div>

                {/* Game Name */}
                <div className="font-medium text-slate-200 truncate pr-4">
                  {game.name}
                </div>

                {/* Players */}
                <div className="flex items-center">
                  <div className="flex -space-x-1.5">
                    {displayPlayers.map((p, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border border-slate-900 flex items-center justify-center text-[10px] font-bold text-white z-10 shadow-sm"
                        style={{ backgroundColor: p.color || '#475569' }}
                        title={p.name}
                      >
                        {p.name.charAt(0)}
                      </div>
                    ))}
                    {extraPlayersCount > 0 && (
                      <div className="w-6 h-6 rounded-full border border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-medium text-slate-300 z-10">
                        +{extraPlayersCount}
                      </div>
                    )}
                  </div>
                </div>

                {/* Leader */}
                <div className="flex items-center text-sm font-medium text-slate-300">
                  {leaderName}
                  <Trophy className={`w-3.5 h-3.5 ml-2 ${isLive ? 'text-amber-500/70' : 'text-amber-400'}`} />
                </div>

                {/* Top Score */}
                <div className="font-mono text-sm font-semibold text-slate-200">
                  {leaderScore.toLocaleString()}
                </div>

                {/* Started */}
                <div className="text-sm text-slate-500">
                  {game.createdAt}
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-slate-600 group-hover:text-blue-400 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
          
          {games.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-sm">
              No games found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
