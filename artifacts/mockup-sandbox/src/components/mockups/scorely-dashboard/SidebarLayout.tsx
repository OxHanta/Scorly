import React, { useState } from 'react';
import { Gamepad2, Star, Clock, Trophy, Plus, ChevronRight, Activity, Users, ArchiveRestore, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ACTIVE_GAMES = [
  {
    id: 'g1', name: 'Catan Tournament', isActive: true, createdAt: '12 min ago',
    players: [
      { name: 'Alex', score: 2450, color: '#3b82f6' },
      { name: 'Jordan', score: 1820, color: '#10b981' },
      { name: 'Sam', score: 1340, color: '#f59e0b' }
    ]
  },
  {
    id: 'g2', name: 'Movie Trivia', isActive: true, createdAt: '34 min ago',
    players: [
      { name: 'Casey', score: 980, color: '#8b5cf6' },
      { name: 'Taylor', score: 650, color: '#f43f5e' }
    ]
  },
  {
    id: 'g3', name: 'Poker Night', isActive: true, createdAt: '1 hr ago',
    players: [
      { name: 'Riley', score: 3200, color: '#06b6d4' },
      { name: 'Morgan', score: 2100, color: '#84cc16' },
      { name: 'Jamie', score: 1500, color: '#f97316' },
      { name: 'Drew', score: 800, color: '#a855f7' }
    ]
  }
];

const ENDED_GAMES = [
  { id: 'g4', name: 'Monopoly', isActive: false, createdAt: '2 days ago', winner: 'Alex (5600 pts)' },
  { id: 'g5', name: 'Uno Championship', isActive: false, createdAt: '5 days ago', winner: 'Jordan (3400 pts)' }
];

export function SidebarLayout() {
  const [newGameName, setNewGameName] = useState('');

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameName.trim()) return;
    console.log('Creating game:', newGameName);
    setNewGameName('');
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-50 overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <div className="w-64 flex flex-col bg-slate-900 border-r border-slate-800 shrink-0 z-10">
        
        {/* LOGO AREA */}
        <div className="p-6 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Gamepad2 className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white">Scorely</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Score board</p>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        {/* QUICK STATS */}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 text-slate-300 text-sm font-medium">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <span>3 Active Games</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 text-sm font-medium hover:bg-slate-800/30 transition-colors">
            <ArchiveRestore className="w-4 h-4 text-slate-500" />
            <span>2 Ended Games</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 text-sm font-medium hover:bg-slate-800/30 transition-colors">
            <Users className="w-4 h-4 text-slate-500" />
            <span>12 Players total</span>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        {/* NEW GAME ACTION */}
        <div className="p-6 flex-1">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Start New</h2>
          <form onSubmit={handleCreateGame} className="space-y-3">
            <div className="space-y-1">
              <Input 
                placeholder="e.g. Catan Night" 
                value={newGameName}
                onChange={(e) => setNewGameName(e.target.value)}
                className="bg-slate-950 border-slate-700 focus-visible:ring-blue-500 text-slate-200 placeholder:text-slate-600"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              <Plus className="w-4 h-4 mr-2" /> Create Game
            </Button>
          </form>
        </div>

        {/* BOTTOM */}
        <div className="p-4 mt-auto border-t border-slate-800 text-center">
          <p className="text-xs text-slate-600 font-medium">Game night leaderboards</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Top gradient for depth */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
        
        <div className="p-8 max-w-5xl mx-auto space-y-10 relative z-10">
          
          {/* ACTIVE GAMES SECTION */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Star className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Active Games</h2>
              <Badge variant="outline" className="ml-2 border-slate-700 bg-slate-800 text-slate-300">{ACTIVE_GAMES.length}</Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {ACTIVE_GAMES.map(game => (
                <Card 
                  key={game.id} 
                  className="bg-slate-900 border-slate-800 hover:border-slate-600 transition-all cursor-pointer overflow-hidden group hover:shadow-lg hover:shadow-blue-900/5"
                  onClick={() => console.log('Navigate to', game.id)}
                >
                  <CardContent className="p-0">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                            {game.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">Started {game.createdAt}</p>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20 flex gap-1.5 items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Live
                        </Badge>
                      </div>

                      <div className="bg-slate-950/50 rounded-lg p-4 flex items-center justify-between border border-slate-800/50">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {game.players.slice(0, 3).map((p, i) => (
                              <div 
                                key={i} 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-slate-900 text-white shadow-sm"
                                style={{ backgroundColor: p.color }}
                                title={p.name}
                              >
                                {p.name.charAt(0)}
                              </div>
                            ))}
                            {game.players.length > 3 && (
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-slate-900 bg-slate-700 text-white">
                                +{game.players.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-slate-400 font-medium">{game.players.length} players</span>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Current Leader</p>
                          <p className="text-sm font-bold text-amber-400 flex items-center justify-end gap-1.5">
                            <Trophy className="w-3.5 h-3.5" />
                            {game.players[0].name} ({game.players[0].score})
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* GAME HISTORY SECTION */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-200 tracking-tight">Game History</h2>
                <Badge variant="outline" className="ml-2 border-slate-800 bg-slate-900/50 text-slate-400">{ENDED_GAMES.length}</Badge>
              </div>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 h-8 text-xs">
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear History
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 opacity-80">
              {ENDED_GAMES.map(game => (
                <Card 
                  key={game.id} 
                  className="bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer"
                  onClick={() => console.log('Navigate to ended game', game.id)}
                >
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-slate-300">{game.name}</h3>
                        <Badge variant="outline" className="text-[10px] uppercase border-slate-700 text-slate-500 h-5 px-1.5">Ended</Badge>
                      </div>
                      <p className="text-xs text-slate-500">{game.createdAt}</p>
                    </div>
                    
                    <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <div>
                        <p className="text-[10px] text-amber-500/70 font-bold uppercase leading-tight">Winner</p>
                        <p className="text-sm font-bold text-amber-400 leading-tight">{game.winner}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
