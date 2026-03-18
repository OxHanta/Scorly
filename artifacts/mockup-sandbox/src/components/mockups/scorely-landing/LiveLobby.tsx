import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Trophy, ChevronRight, Activity } from "lucide-react";

// Mock Data Generators
const generateNames = (count: number) => {
  const firstNames = ["Alex", "Jordan", "Taylor", "Casey", "Riley", "Jamie", "Morgan", "Avery", "Sam", "Drew"];
  return Array.from({ length: count }).map(() => firstNames[Math.floor(Math.random() * firstNames.length)]);
};

const getInitials = (name: string) => name.substring(0, 1).toUpperCase();

type Player = {
  id: string;
  name: string;
  score: number;
};

type Game = {
  id: string;
  name: string;
  color: string;
  players: Player[];
};

const INITIAL_GAMES: Game[] = [
  { id: "1", name: "Monopoly", color: "bg-blue-500", players: [{ id: "p1", name: "Alex", score: 1250 }, { id: "p2", name: "Sam", score: 900 }, { id: "p3", name: "Jordan", score: 650 }] },
  { id: "2", name: "Uno", color: "bg-rose-500", players: [{ id: "p4", name: "Casey", score: 450 }, { id: "p5", name: "Riley", score: 300 }, { id: "p6", name: "Jamie", score: 150 }] },
  { id: "3", name: "Catan", color: "bg-amber-500", players: [{ id: "p7", name: "Morgan", score: 8 }, { id: "p8", name: "Avery", score: 6 }, { id: "p9", name: "Drew", score: 4 }] },
  { id: "4", name: "Chess", color: "bg-slate-300", players: [{ id: "p10", name: "Taylor", score: 1 }, { id: "p11", name: "Alex", score: 0 }] },
  { id: "5", name: "Trivia", color: "bg-purple-500", players: [{ id: "p12", name: "Jordan", score: 4200 }, { id: "p13", name: "Casey", score: 3800 }, { id: "p14", name: "Sam", score: 2100 }] },
  { id: "6", name: "Poker", color: "bg-emerald-500", players: [{ id: "p15", name: "Riley", score: 15000 }, { id: "p16", name: "Morgan", score: 8500 }, { id: "p17", name: "Jamie", score: 2000 }] },
  { id: "7", name: "Scrabble", color: "bg-yellow-500", players: [{ id: "p18", name: "Avery", score: 345 }, { id: "p19", name: "Drew", score: 290 }, { id: "p20", name: "Taylor", score: 180 }] },
  { id: "8", name: "Risk", color: "bg-red-600", players: [{ id: "p21", name: "Alex", score: 45 }, { id: "p22", name: "Sam", score: 30 }, { id: "p23", name: "Jordan", score: 12 }] },
  { id: "9", name: "Codenames", color: "bg-cyan-500", players: [{ id: "p24", name: "Red Team", score: 6 }, { id: "p25", name: "Blue Team", score: 5 }] },
];

export function LiveLobby() {
  const [games, setGames] = useState<Game[]>(INITIAL_GAMES);

  useEffect(() => {
    // Independent intervals for each game to simulate live updates
    const intervals = INITIAL_GAMES.map((game, index) => {
      // Stagger updates between 1s and 4s
      const delay = 1000 + (index * 300) + Math.random() * 2000;
      
      return setInterval(() => {
        setGames(currentGames => {
          const newGames = [...currentGames];
          const gameIndex = newGames.findIndex(g => g.id === game.id);
          
          if (gameIndex >= 0) {
            const updatedPlayers = [...newGames[gameIndex].players];
            // Pick a random player to update score
            const playerIndexToUpdate = Math.floor(Math.random() * updatedPlayers.length);
            
            // Increment score randomly based on game type (chess vs poker have different scales)
            let increment = 1;
            if (game.name === 'Poker' || game.name === 'Trivia') increment = Math.floor(Math.random() * 500) + 100;
            else if (game.name === 'Monopoly') increment = Math.floor(Math.random() * 200) + 50;
            else if (game.name === 'Scrabble' || game.name === 'Uno') increment = Math.floor(Math.random() * 25) + 5;
            
            updatedPlayers[playerIndexToUpdate] = {
              ...updatedPlayers[playerIndexToUpdate],
              score: updatedPlayers[playerIndexToUpdate].score + increment
            };
            
            // Re-sort players by score
            updatedPlayers.sort((a, b) => b.score - a.score);
            
            newGames[gameIndex] = {
              ...newGames[gameIndex],
              players: updatedPlayers
            };
          }
          return newGames;
        });
      }, delay);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              S
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Scorely</span>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]">
            Start your own
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 flex items-center gap-3">
              Game nights, <br className="hidden md:block" /> happening now
              <span className="relative flex h-4 w-4 ml-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Join the action. See who's winning across thousands of live leaderboards right now.
            </p>
          </div>
          <div className="flex items-center text-sm font-medium text-slate-400 bg-slate-900/50 py-2 px-4 rounded-full border border-slate-800">
            <Activity className="w-4 h-4 mr-2 text-emerald-500" />
            2,401 active games
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card 
              key={game.id} 
              className="relative overflow-hidden bg-slate-900/80 border-slate-700/50 backdrop-blur-sm rounded-xl transition-all duration-300 hover:border-slate-600 hover:shadow-xl hover:-translate-y-1 group"
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${game.color}`} />
              
              <div className="p-5">
                {/* Card Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight mb-1 group-hover:text-indigo-400 transition-colors">{game.name}</h3>
                    <div className="flex items-center text-slate-400 text-xs font-medium">
                      <Users className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                      {game.players.length} Players
                    </div>
                  </div>
                  <div className="flex items-center bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                    Live
                  </div>
                </div>

                {/* Leaderboard */}
                <div className="space-y-3">
                  {game.players.slice(0, 3).map((player, idx) => (
                    <div 
                      key={player.id} 
                      className={`flex items-center justify-between p-2.5 rounded-lg transition-colors duration-300 ${
                        idx === 0 ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 0 ? 'bg-yellow-500/20 text-yellow-500' : 
                          idx === 1 ? 'bg-slate-400/20 text-slate-300' : 
                          'bg-amber-700/20 text-amber-600'
                        }`}>
                          {idx === 0 ? <Trophy className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                            idx === 0 ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 
                            'bg-slate-700 border-slate-600 text-slate-300'
                          }`}>
                            {getInitials(player.name)}
                          </div>
                          <span className={`font-semibold ${idx === 0 ? 'text-white' : 'text-slate-200'}`}>
                            {player.name}
                          </span>
                        </div>
                      </div>
                      
                      <div className={`font-mono font-bold ${idx === 0 ? 'text-indigo-400' : 'text-slate-300'}`}>
                        {player.score.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-4 border-t border-slate-800/60 flex justify-end">
                  <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800 h-8 text-xs font-medium px-3 rounded-md transition-colors">
                    View full board
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
