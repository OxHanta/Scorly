import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { GameWithScores } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Gamepad2,
  Star,
  Clock,
  Trophy,
  Plus,
  Users,
  Trash2,
  Archive,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function CreateGameForm({ onCreated }: { onCreated: (id: string) => void }) {
  const [name, setName] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: { name: string }) =>
      apiRequest("POST", "/api/games", data),
    onSuccess: async (res) => {
      const game: GameWithScores = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      setName("");
      onCreated(game.id);
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate({ name: name.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        data-testid="input-game-name"
        placeholder="e.g. Catan Night"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={mutation.isPending}
        className="bg-slate-950 border-slate-700 focus-visible:ring-blue-500 text-slate-200 placeholder:text-slate-600"
      />
      <Button
        data-testid="button-create-game"
        type="submit"
        disabled={!name.trim() || mutation.isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md"
      >
        <Plus className="w-4 h-4 mr-2" />
        {mutation.isPending ? "Creating..." : "Create Game"}
      </Button>
    </form>
  );
}

function GameCard({ game, onClick }: { game: GameWithScores; onClick: () => void }) {
  const leader = game.playerScores[0];
  const createdAt = formatDistanceToNow(new Date(game.createdAt), { addSuffix: true });

  return (
    <Card
      data-testid={`card-game-${game.id}`}
      className="bg-slate-900 border-slate-800 hover:border-slate-600 transition-all cursor-pointer overflow-hidden group hover:shadow-lg hover:shadow-blue-900/5"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                {game.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Started {createdAt}</p>
            </div>
            <Badge
              data-testid={`badge-status-${game.id}`}
              className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20 flex gap-1.5 items-center"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </Badge>
          </div>

          <div className="bg-slate-950/50 rounded-lg p-4 flex items-center justify-between border border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {game.playerScores.slice(0, 3).map((ps) => (
                  <div
                    key={ps.player.id}
                    data-testid={`avatar-player-${ps.player.id}`}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-slate-900 text-white shadow-sm"
                    style={{ backgroundColor: ps.player.color }}
                    title={ps.player.name}
                  >
                    {ps.player.name.charAt(0)}
                  </div>
                ))}
                {game.playerScores.length > 3 && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-slate-900 bg-slate-700 text-white">
                    +{game.playerScores.length - 3}
                  </div>
                )}
              </div>
              <span className="text-sm text-slate-400 font-medium">
                {game.players.length} player{game.players.length !== 1 ? "s" : ""}
              </span>
            </div>

            {leader ? (
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  Current Leader
                </p>
                <p className="text-sm font-bold text-amber-400 flex items-center justify-end gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  {leader.player.name} ({leader.total})
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-600 italic">No players yet</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EndedGameCard({ game, onClick }: { game: GameWithScores; onClick: () => void }) {
  const winner = game.playerScores[0];
  const createdAt = formatDistanceToNow(new Date(game.createdAt), { addSuffix: true });

  return (
    <Card
      data-testid={`card-game-${game.id}`}
      className="bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-slate-300">{game.name}</h3>
            <Badge
              data-testid={`badge-status-${game.id}`}
              variant="outline"
              className="text-[10px] uppercase border-slate-700 text-slate-500 h-5 px-1.5"
            >
              Ended
            </Badge>
          </div>
          <p className="text-xs text-slate-500">{createdAt}</p>
        </div>

        {winner && (
          <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <div>
              <p className="text-[10px] text-amber-500/70 font-bold uppercase leading-tight">Winner</p>
              <p className="text-sm font-bold text-amber-400 leading-tight">
                {winner.player.name} ({winner.total} pts)
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: games, isLoading, error } = useQuery<GameWithScores[]>({
    queryKey: ["/api/games"],
  });

  const clearMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", "/api/history"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      toast({ title: "History cleared", description: "Ended games have been removed." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const activeGames = games?.filter((g) => g.isActive) ?? [];
  const endedGames = games?.filter((g) => !g.isActive) ?? [];
  const totalPlayers = games?.reduce((acc, g) => acc + g.players.length, 0) ?? 0;

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-50 overflow-hidden font-sans">

      {/* ── Sidebar ── */}
      <div className="w-64 flex flex-col bg-slate-900 border-r border-slate-800 shrink-0 z-10">

        {/* Logo */}
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

        {/* Quick stats */}
        <div className="p-4 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 text-slate-300 text-sm font-medium">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </div>
            <span>{isLoading ? "—" : activeGames.length} Active {activeGames.length === 1 ? "Game" : "Games"}</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 text-sm font-medium">
            <Archive className="w-4 h-4 text-slate-500" />
            <span>{isLoading ? "—" : endedGames.length} Ended {endedGames.length === 1 ? "Game" : "Games"}</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 text-sm font-medium">
            <Users className="w-4 h-4 text-slate-500" />
            <span>{isLoading ? "—" : totalPlayers} {totalPlayers === 1 ? "Player" : "Players"} total</span>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        {/* Create game form */}
        <div className="p-6 flex-1">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Start New</h2>
          <CreateGameForm onCreated={(id) => setLocation(`/game/${id}`)} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-600 font-medium">Game night leaderboards</p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

        <div className="p-8 max-w-5xl mx-auto space-y-10 relative z-10">

          {/* Active games */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Star className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Active Games</h2>
              {!isLoading && (
                <Badge variant="outline" className="ml-1 border-slate-700 bg-slate-800 text-slate-300">
                  {activeGames.length}
                </Badge>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[1, 2].map((i) => <Skeleton key={i} className="h-40 rounded-xl bg-slate-800" />)}
              </div>
            ) : error ? (
              <div className="text-red-400 text-sm p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                Failed to load games. Please refresh.
              </div>
            ) : activeGames.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center">
                <Gamepad2 className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No active games yet. Create one in the sidebar!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onClick={() => setLocation(`/game/${game.id}`)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Game history */}
          {!isLoading && endedGames.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-200 tracking-tight">Game History</h2>
                  <Badge variant="outline" className="ml-1 border-slate-800 bg-slate-900/50 text-slate-400">
                    {endedGames.length}
                  </Badge>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid="button-clear-history"
                      disabled={clearMutation.isPending}
                      className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 h-8 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Clear History
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear Game History?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all ended games. Active games will not be affected.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        data-testid="button-confirm-clear"
                        onClick={() => clearMutation.mutate()}
                        className="bg-destructive text-destructive-foreground"
                      >
                        Clear History
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 opacity-80">
                {endedGames.map((game) => (
                  <EndedGameCard
                    key={game.id}
                    game={game}
                    onClick={() => setLocation(`/game/${game.id}`)}
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
