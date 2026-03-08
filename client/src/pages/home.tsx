import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { GameWithScores } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  Plus,
  Trophy,
  Clock,
  Trash2,
  ChevronRight,
  Gamepad2,
  Users,
  Star,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = max === 0 ? 0 : Math.max(0, Math.min(100, (score / max) * 100));
  return (
    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: "hsl(var(--primary))" }}
      />
    </div>
  );
}

function GameCard({ game, onClick }: { game: GameWithScores; onClick: () => void }) {
  const top = game.playerScores[0];
  const maxScore = Math.max(1, ...game.playerScores.map((ps) => ps.total));

  return (
    <div
      data-testid={`card-game-${game.id}`}
      className="cursor-pointer rounded-lg border border-card-border bg-card p-5 hover-elevate transition-all"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate text-base leading-tight">
            {game.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3 flex-shrink-0" />
            {formatDistanceToNow(new Date(game.createdAt), { addSuffix: true })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant={game.isActive ? "default" : "secondary"} data-testid={`badge-status-${game.id}`}>
            {game.isActive ? "Live" : "Ended"}
          </Badge>
        </div>
      </div>

      {game.players.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No players yet</p>
      ) : (
        <div className="space-y-2.5">
          {game.playerScores.slice(0, 3).map((ps) => (
            <div key={ps.player.id} data-testid={`row-player-${ps.player.id}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {ps.rank === 1 && <Trophy className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />}
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: ps.player.color }}
                  />
                  <span className="text-sm text-foreground truncate max-w-[120px]">{ps.player.name}</span>
                </div>
                <span className="text-sm font-semibold tabular-nums" data-testid={`text-score-${ps.player.id}`}>
                  {ps.total}
                </span>
              </div>
              <ScoreBar score={ps.total} max={maxScore} />
            </div>
          ))}
          {game.playerScores.length > 3 && (
            <p className="text-xs text-muted-foreground">
              +{game.playerScores.length - 3} more players
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-card-border">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Users className="w-3 h-3" />
          {game.players.length} player{game.players.length !== 1 ? "s" : ""}
        </span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
}

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
    <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
      <Input
        data-testid="input-game-name"
        placeholder="Enter game name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 min-w-[200px]"
        disabled={mutation.isPending}
      />
      <Button
        data-testid="button-create-game"
        type="submit"
        disabled={!name.trim() || mutation.isPending}
      >
        <Plus className="w-4 h-4 mr-1.5" />
        {mutation.isPending ? "Creating..." : "New Game"}
      </Button>
    </form>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Gamepad2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground leading-tight">Game Night</h1>
              <p className="text-sm text-muted-foreground">Score board & live sharing</p>
            </div>
          </div>
        </div>

        {/* Create new game */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Start a New Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateGameForm onCreated={(id) => setLocation(`/game/${id}`)} />
          </CardContent>
        </Card>

        {/* Active games */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Active Games
              {activeGames.length > 0 && (
                <Badge variant="secondary" className="ml-1">{activeGames.length}</Badge>
              )}
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <div className="text-destructive text-sm p-4 rounded-lg border border-destructive/20 bg-destructive/5">
              Failed to load games. Please refresh the page.
            </div>
          ) : activeGames.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center">
              <Gamepad2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No active games. Start one above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Game History */}
        {!isLoading && endedGames.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Game History
                <Badge variant="secondary">{endedGames.length}</Badge>
              </h2>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid="button-clear-history"
                    disabled={clearMutation.isPending}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {endedGames.map((game) => (
                <GameCard
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
  );
}
