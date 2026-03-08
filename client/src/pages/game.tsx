import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useParams } from "wouter";
import { useGameSocket } from "@/lib/useGameSocket";
import { useAnimatedNumber, useScoreGlow } from "@/lib/useAnimatedNumber";
import { motion, AnimatePresence } from "framer-motion";
import { Confetti } from "@/components/confetti";
import type { GameWithScores, PlayerScore } from "@shared/schema";
import { PLAYER_COLORS } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  ArrowLeft,
  Trophy,
  Plus,
  Share2,
  Check,
  Minus,
  UserPlus,
  StopCircle,
  Medal,
  Eye,
  Crown,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return (
    <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
      #{rank}
    </span>
  );
}

function WinnerBadge() {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0, y: -4 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.15 }}
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
        bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400
        border border-yellow-300 dark:border-yellow-700 flex-shrink-0"
    >
      <Crown className="w-3 h-3" />
      Winner!
    </motion.span>
  );
}

function PlayerCard({
  ps,
  isActive,
  onAddScore,
  isPending,
}: {
  ps: PlayerScore;
  isActive: boolean;
  onAddScore: (playerId: string, delta: number) => void;
  isPending: boolean;
}) {
  const [customAmount, setCustomAmount] = useState("1");
  const amount = parseInt(customAmount, 10) || 1;

  const animatedScore = useAnimatedNumber(ps.total);
  const isGlowing = useScoreGlow(ps.total);
  const isWinner = !isActive && ps.rank === 1;

  return (
    <motion.div
      data-testid={`card-player-${ps.player.id}`}
      animate={{
        boxShadow: isGlowing
          ? `0 0 0 2px ${ps.player.color}55, 0 0 18px 4px ${ps.player.color}28`
          : "0 0 0 0px transparent, 0 0 0px 0px transparent",
      }}
      transition={{ duration: isGlowing ? 0.08 : 0.7, ease: "easeOut" }}
      className="rounded-lg border border-card-border bg-card p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <RankIcon rank={ps.rank} />
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: ps.player.color }}
          />
          <span className="font-semibold text-foreground truncate max-w-[110px]">
            {ps.player.name}
          </span>
          <AnimatePresence>
            {isWinner && <WinnerBadge />}
          </AnimatePresence>
        </div>
        <span
          data-testid={`text-score-${ps.player.id}`}
          className="text-3xl font-bold tabular-nums flex-shrink-0 ml-3"
          style={{ color: ps.player.color }}
        >
          {animatedScore}
        </span>
      </div>

      {isActive && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              data-testid={`button-decrement-${ps.player.id}`}
              size="icon"
              variant="outline"
              onClick={() => onAddScore(ps.player.id, -amount)}
              disabled={isPending}
            >
              <Minus className="w-3.5 h-3.5" />
            </Button>
            <Input
              data-testid={`input-score-amount-${ps.player.id}`}
              type="number"
              min="1"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-16 text-center"
            />
            <Button
              data-testid={`button-increment-${ps.player.id}`}
              size="icon"
              variant="outline"
              onClick={() => onAddScore(ps.player.id, amount)}
              disabled={isPending}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="flex gap-1 flex-wrap">
            {[1, 5, 10].map((quick) => (
              <Button
                key={quick}
                data-testid={`button-quick-${quick}-${ps.player.id}`}
                size="sm"
                variant="secondary"
                onClick={() => onAddScore(ps.player.id, quick)}
                disabled={isPending}
              >
                +{quick}
              </Button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function AddPlayerDialog({
  gameId,
  usedColors,
}: {
  gameId: string;
  usedColors: string[];
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(
    PLAYER_COLORS.find((c) => !usedColors.includes(c)) ?? PLAYER_COLORS[0]
  );
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: { name: string; color: string }) =>
      apiRequest("POST", `/api/games/${gameId}/players`, data),
    onSuccess: async (res) => {
      const game: GameWithScores = await res.json();
      queryClient.setQueryData(["/api/games", gameId], game);
      setOpen(false);
      setName("");
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate({ name: name.trim(), color });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-player" variant="outline" size="sm">
          <UserPlus className="w-3.5 h-3.5 mr-1.5" />
          Add Player
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Player</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Player Name
            </label>
            <Input
              data-testid="input-player-name"
              placeholder="Enter player name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {PLAYER_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  data-testid={`button-color-${c}`}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                >
                  {color === c && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>
          <Button
            data-testid="button-confirm-add-player"
            type="submit"
            className="w-full"
            disabled={!name.trim() || mutation.isPending}
          >
            {mutation.isPending ? "Adding..." : "Add Player"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ShareDialog({ game }: { game: GameWithScores }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/view/${game.shareId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-share" variant="outline" size="sm">
          <Share2 className="w-3.5 h-3.5 mr-1.5" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Share View-Only Link
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <p className="text-sm text-muted-foreground">
            Anyone with this link can watch the score board in real-time without being able to edit it.
          </p>
          <div className="flex gap-2">
            <Input
              data-testid="input-share-url"
              value={shareUrl}
              readOnly
              className="text-xs font-mono"
            />
            <Button
              data-testid="button-copy-link"
              onClick={handleCopy}
              variant="outline"
              size="icon"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            data-testid="button-open-view"
            variant="secondary"
            className="w-full"
            onClick={() => window.open(shareUrl, "_blank")}
          >
            <Eye className="w-4 h-4 mr-2" />
            Open View-Only Page
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function GamePage() {
  const params = useParams<{ id: string }>();
  const gameId = params.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const prevActiveRef = useRef<boolean | undefined>(undefined);

  const { data: game, isLoading, error } = useQuery<GameWithScores>({
    queryKey: ["/api/games", gameId],
    queryFn: async () => {
      const res = await fetch(`/api/games/${gameId}`);
      if (!res.ok) throw new Error("Game not found");
      return res.json();
    },
  });

  useEffect(() => {
    if (game === undefined) return;
    if (prevActiveRef.current === true && game.isActive === false) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 4200);
      return () => clearTimeout(t);
    }
    prevActiveRef.current = game.isActive;
  }, [game?.isActive]);

  const onSocketUpdate = useCallback(
    (updatedGame: GameWithScores) => {
      queryClient.setQueryData(["/api/games", gameId], updatedGame);
    },
    [gameId]
  );

  useGameSocket(gameId, undefined, onSocketUpdate);

  const scoreMutation = useMutation({
    mutationFn: (data: { playerId: string; delta: number }) =>
      apiRequest("POST", `/api/games/${gameId}/scores`, data),
    onSuccess: async (res) => {
      const updated: GameWithScores = await res.json();
      queryClient.setQueryData(["/api/games", gameId], updated);
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const endMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/games/${gameId}/end`),
    onSuccess: async (res) => {
      const updated: GameWithScores = await res.json();
      queryClient.setQueryData(["/api/games", gameId], updated);
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      toast({ title: "Game ended", description: `"${updated.name}" has been ended.` });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-medium mb-3">Game not found</p>
          <Button onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const usedColors = game.players.map((p) => p.color);

  return (
    <div className="min-h-screen bg-background">
      <Confetti active={showConfetti} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Button
            data-testid="button-back"
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-foreground truncate">{game.name}</h1>
              <Badge variant={game.isActive ? "default" : "secondary"} data-testid="badge-game-status">
                {game.isActive ? "Live" : "Ended"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Started {formatDistanceToNow(new Date(game.createdAt), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ShareDialog game={game} />
            {game.isActive && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    data-testid="button-end-game"
                    variant="outline"
                    size="sm"
                    disabled={endMutation.isPending}
                  >
                    <StopCircle className="w-3.5 h-3.5 mr-1.5" />
                    End Game
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>End "{game.name}"?</AlertDialogTitle>
                    <AlertDialogDescription>
                      The game will be moved to history. Scores are preserved and view-only links remain active.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      data-testid="button-confirm-end"
                      onClick={() => endMutation.mutate()}
                    >
                      End Game
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Scoreboard */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Scoreboard
              </CardTitle>
              {game.isActive && (
                <AddPlayerDialog gameId={gameId} usedColors={usedColors} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {game.players.length === 0 ? (
              <div className="text-center py-8">
                <UserPlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  Add players to get started
                </p>
              </div>
            ) : (
              <motion.div layout className="flex flex-col gap-3">
                <AnimatePresence initial={false}>
                  {game.playerScores.map((ps) => (
                    <motion.div
                      key={ps.player.id}
                      layout
                      layoutId={`game-player-${ps.player.id}`}
                      transition={{ layout: { type: "spring", stiffness: 380, damping: 35 } }}
                    >
                      <PlayerCard
                        ps={ps}
                        isActive={game.isActive}
                        onAddScore={(playerId, delta) =>
                          scoreMutation.mutate({ playerId, delta })
                        }
                        isPending={scoreMutation.isPending}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Score History */}
        {game.scoreEntries.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Score Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
                {[...game.scoreEntries].reverse().map((entry) => {
                  const player = game.players.find((p) => p.id === entry.playerId);
                  if (!player) return null;
                  return (
                    <div
                      key={entry.id}
                      data-testid={`row-entry-${entry.id}`}
                      className="flex items-center justify-between text-sm py-1 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: player.color }}
                        />
                        <span className="text-foreground">{player.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <span
                        className={`font-semibold tabular-nums ${
                          entry.delta >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {entry.delta >= 0 ? "+" : ""}{entry.delta}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
