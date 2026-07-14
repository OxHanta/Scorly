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
        className="bg-white border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] focus-visible:ring-[var(--theme-a)] focus-visible:border-[var(--theme-a)]"
      />
      <Button
        data-testid="button-create-game"
        type="submit"
        disabled={!name.trim() || mutation.isPending}
        className="w-full bg-[#3F7D58] hover:bg-[#2e5e41] text-white font-extrabold shadow-sm border-0 transition-colors active:scale-95"
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
      className="bg-white/80 backdrop-blur-md border-[var(--line)] hover:border-[var(--theme-a)] transition-all cursor-pointer overflow-hidden group hover:shadow-lg hover:shadow-[var(--theme-a)]/5 rounded-[17px]"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-[var(--ink)] group-hover:text-[var(--theme-a)] transition-colors">
                {game.name}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1">Started {createdAt}</p>
            </div>
            <Badge
              data-testid={`badge-status-${game.id}`}
              className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 flex gap-1.5 items-center font-bold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </Badge>
          </div>

          <div className="bg-[color-mix(in_srgb,var(--theme-a)_4%,white)] rounded-xl p-4 flex items-center justify-between border border-[var(--line)]">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {game.playerScores.slice(0, 3).map((ps) => (
                  <div
                    key={ps.player.id}
                    data-testid={`avatar-player-${ps.player.id}`}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white text-white shadow-sm"
                    style={{ backgroundColor: ps.player.color }}
                    title={ps.player.name}
                  >
                    {ps.player.name.charAt(0)}
                  </div>
                ))}
                {game.playerScores.length > 3 && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white bg-slate-200 text-slate-700">
                    +{game.playerScores.length - 3}
                  </div>
                )}
              </div>
              <span className="text-sm text-[var(--muted)] font-semibold">
                {game.players.length} player{game.players.length !== 1 ? "s" : ""}
              </span>
            </div>

            {leader ? (
              <div className="text-right">
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider font-bold mb-1">
                  Current Leader
                </p>
                <p className="text-sm font-bold text-[var(--theme-a)] flex items-center justify-end gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  {leader.player.name} ({leader.total})
                </p>
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)] italic">No players yet</p>
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
      className="bg-white/50 backdrop-blur-md border-[var(--line)] hover:bg-white/80 hover:border-[var(--theme-a)] transition-all cursor-pointer rounded-[17px]"
      onClick={onClick}
    >
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-[var(--ink)]">{game.name}</h3>
            <Badge
              data-testid={`badge-status-${game.id}`}
              variant="outline"
              className="text-[10px] uppercase border-[var(--line)] text-[var(--muted)] h-5 px-1.5 font-bold"
            >
              Ended
            </Badge>
          </div>
          <p className="text-xs text-[var(--muted)]">{createdAt}</p>
        </div>

        {winner && (
          <div className="bg-[var(--theme-wash)] border border-pink-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[var(--theme-a)]" />
            <div>
              <p className="text-[10px] text-[var(--theme-a)] font-bold uppercase leading-tight">Winner</p>
              <p className="text-sm font-bold text-[var(--ink)] leading-tight">
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
    refetchInterval: 5000,
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
    <main className="app-shell flex h-screen w-full overflow-hidden font-sans" data-theme="bubblegum">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {/* ── Sidebar ── */}
      <div className="w-64 flex flex-col bg-white/70 backdrop-blur-md border-r border-[var(--line)] shrink-0 z-10">

        {/* Logo */}
        <div className="p-6 pb-4 flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/dba2kof3v/image/upload/v1783945770/Black_2x_j4urn8.png"
            alt="Scorely"
            className="h-7 w-auto"
          />
        </div>

        <Separator className="bg-[var(--line)]" />

        {/* Quick stats */}
        <div className="p-4 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--theme-wash)] text-[var(--theme-a)] text-sm font-semibold">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </div>
            <span>{isLoading ? "—" : activeGames.length} Active {activeGames.length === 1 ? "Game" : "Games"}</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--muted)] text-sm font-semibold">
            <Archive className="w-4 h-4 text-[var(--muted)]" />
            <span>{isLoading ? "—" : endedGames.length} Ended {endedGames.length === 1 ? "Game" : "Games"}</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--muted)] text-sm font-semibold">
            <Users className="w-4 h-4 text-[var(--muted)]" />
            <span>{isLoading ? "—" : totalPlayers} {totalPlayers === 1 ? "Player" : "Players"} total</span>
          </div>
        </div>

        <Separator className="bg-[var(--line)]" />

        {/* Create game form */}
        <div className="p-6 flex-1">
          <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-4">Start New</h2>
          <CreateGameForm onCreated={(id) => setLocation(`/game/${id}`)} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--line)] text-center">
          <p className="text-xs text-[var(--muted)] font-medium">Game night leaderboards</p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-[var(--theme-wash)]/30 pointer-events-none" />

        <div className="p-8 max-w-5xl mx-auto space-y-10 relative z-10">

          {/* Active games */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://res.cloudinary.com/dba2kof3v/image/upload/v1783977420/dice_xkjtfk.png"
                alt="dice"
                className="w-9 h-9"
              />
              <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Active Games</h2>
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
    </main>
  );
}
