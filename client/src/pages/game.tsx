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
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return (
    <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-slate-500">
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
        bg-yellow-900/40 text-yellow-400 border border-yellow-700 flex-shrink-0"
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
  maxScore,
}: {
  ps: PlayerScore;
  isActive: boolean;
  onAddScore: (playerId: string, delta: number) => void;
  isPending: boolean;
  maxScore: number;
}) {
  const [customAmount, setCustomAmount] = useState("1");
  const amount = parseInt(customAmount, 10) || 1;

  const animatedScore = useAnimatedNumber(ps.total);
  const isWinner = !isActive && ps.rank === 1;

  return (
    <div
      data-testid={`card-player-${ps.player.id}`}
      className="bg-white/80 border border-[var(--line)] rounded-[17px] p-4 shadow-sm"
    >
      <div className="grid grid-cols-[25px_48px_1fr_68px_78px] items-center gap-3">
        <span className="rank-number font-bold text-[var(--muted)] text-center">{ps.rank}</span>
        <div className="player-avatar" style={{ "--avatar": ps.player.color } as React.CSSProperties}>
          {ps.player.name[0].toUpperCase()}
        </div>
        <div className="player-info min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-[var(--ink)] truncate">{ps.player.name}</h3>
            {isWinner && <WinnerBadge />}
          </div>
          <div className="meter">
            <i style={{ width: `${Math.max(12, (ps.total / maxScore) * 100)}%`, background: ps.player.color }} />
          </div>
        </div>
        <div className="score-number">
          <strong>{animatedScore}</strong>
          <span>PTS</span>
        </div>
        {isActive ? (
          <div className="score-actions">
            <button
              data-testid={`button-decrement-${ps.player.id}`}
              onClick={() => onAddScore(ps.player.id, -amount)}
              disabled={isPending || ps.total === 0}
            >
              −
            </button>
            <button
              data-testid={`button-increment-${ps.player.id}`}
              className="add-point"
              onClick={() => onAddScore(ps.player.id, amount)}
              disabled={isPending}
            >
              +
            </button>
          </div>
        ) : (
          <div />
        )}
      </div>

      {isActive && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--line)]/50 justify-end">
          <span className="text-xs text-[var(--muted)] font-semibold">Amount:</span>
          <Input
            data-testid={`input-score-amount-${ps.player.id}`}
            type="number"
            min="1"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-16 text-center bg-white border-[var(--line)] text-[var(--ink)] h-8 rounded-lg"
          />
          <div className="flex gap-1">
            {[1, 5, 10].map((quick) => (
              <Button
                key={quick}
                data-testid={`button-quick-${quick}-${ps.player.id}`}
                size="sm"
                variant="secondary"
                onClick={() => onAddScore(ps.player.id, quick)}
                disabled={isPending}
                className="bg-[var(--theme-wash)] hover:bg-[color-mix(in_srgb,var(--theme-a)_15%,white)] text-[var(--theme-a)] border border-[color-mix(in_srgb,var(--theme-a)_10%,white)] h-8 font-bold"
              >
                +{quick}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
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
      // Also invalidate the games list so the dashboard reflects the new player
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
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
        <Button
          data-testid="button-add-player"
          variant="outline"
          size="sm"
          className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300"
        >
          <UserPlus className="w-3.5 h-3.5 mr-1.5" />
          Add Player
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Add Player</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">
              Player Name
            </label>
            <Input
              data-testid="input-player-name"
              placeholder="Enter player name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {PLAYER_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  data-testid={`button-color-${c}`}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
        <Button
          data-testid="button-share"
          variant="outline"
          size="sm"
          className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300"
        >
          <Share2 className="w-3.5 h-3.5 mr-1.5" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-slate-100 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Share View-Only Link
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <p className="text-sm text-slate-400">
            Anyone with this link can watch the score board in real-time without being able to edit it.
          </p>
          <div className="flex gap-2">
            <Input
              data-testid="input-share-url"
              value={shareUrl}
              readOnly
              className="text-xs font-mono bg-slate-800 border-slate-700 text-slate-300"
            />
            <Button
              data-testid="button-copy-link"
              onClick={handleCopy}
              variant="outline"
              size="icon"
              className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 flex-shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            data-testid="button-open-view"
            variant="secondary"
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
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

const themeOptions = [
  { id: "bubblegum", label: "Bubblegum", icon: "🍬", gradient: "linear-gradient(135deg, #ff75af, #fcb94d)" },
  { id: "midnight", label: "Midnight", icon: "🌙", gradient: "linear-gradient(135deg, #5b54cc, #203057)" },
  { id: "sunset", label: "Sunset", icon: "🌅", gradient: "linear-gradient(135deg, #ff7b64, #f5bd3f)" },
  { id: "arcade", label: "Arcade", icon: "👾", gradient: "linear-gradient(135deg, #b757e7, #40bdd1)" },
  { id: "garden", label: "Garden", icon: "🌿", gradient: "linear-gradient(135deg, #44b982, #a4d864)" },
];

export default function GamePage() {
  const params = useParams<{ id: string }>();
  const gameId = params.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const prevActiveRef = useRef<boolean | undefined>(undefined);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(`scorly-theme-${gameId}`) || "bubblegum";
  });

  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem(`scorly-theme-${gameId}`, newTheme);
  };

  const { data: game, isLoading, error } = useQuery<GameWithScores>({
    queryKey: ["/api/games", gameId],
    queryFn: async () => {
      const res = await fetch(`/api/games/${gameId}`);
      if (!res.ok) throw new Error("Game not found");
      return res.json();
    },
    refetchInterval: 2000,
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
      <main className="app-shell min-h-screen p-6" data-theme="bubblegum">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="max-w-3xl mx-auto content-wrap">
          <Skeleton className="h-8 w-48 mb-6 bg-white/20" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-xl bg-white/20" />)}
          </div>
        </div>
      </main>
    );
  }

  if (error || !game) {
    return (
      <main className="app-shell min-h-screen flex items-center justify-center" data-theme="bubblegum">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="text-center z-10">
          <p className="text-red-500 font-bold mb-3">Game not found</p>
          <Button
            onClick={() => setLocation("/dashboard")}
            className="bg-[#3F7D58] hover:bg-[#2e5e41] text-white border-0 font-extrabold shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </main>
    );
  }

  const usedColors = game.players.map((p) => p.color);
  const maxScore = Math.max(1, ...game.playerScores.map((ps) => ps.total));

  return (
    <main className="app-shell min-h-screen text-[var(--ink)]" data-theme={theme}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <Confetti active={showConfetti} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 relative z-10 content-wrap">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 flex-wrap bg-white/80 backdrop-blur-md border border-[var(--line)] rounded-2xl p-4 shadow-sm">
          <Button
            data-testid="button-back"
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/dashboard")}
            className="text-[var(--muted)] hover:text-[var(--theme-a)] hover:bg-[var(--theme-wash)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-extrabold text-[var(--ink)] truncate">{game.name}</h1>
              {game.isActive ? (
                <Badge
                  data-testid="badge-game-status"
                  className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 flex gap-1.5 items-center font-bold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </Badge>
              ) : (
                <Badge
                  data-testid="badge-game-status"
                  className="border-[var(--line)] text-[var(--muted)] bg-white font-bold"
                >
                  Ended
                </Badge>
              )}
            </div>
            <p className="text-xs text-[var(--muted)] mt-0.5">
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
                    className="border-[var(--line)] bg-white hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-[var(--muted)] font-semibold"
                  >
                    <StopCircle className="w-3.5 h-3.5 mr-1.5" />
                    End Game
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white border-[var(--line)] text-[var(--ink)]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[var(--ink)] font-extrabold">End "{game.name}"?</AlertDialogTitle>
                    <AlertDialogDescription className="text-[var(--muted)]">
                      The game will be moved to history. Scores are preserved and view-only links remain active.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white border-[var(--line)] text-[var(--ink)] hover:bg-slate-50">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      data-testid="button-confirm-end"
                      onClick={() => endMutation.mutate()}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold"
                    >
                      End Game
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Theme Picker */}
        <div className="bg-white/80 backdrop-blur-md border border-[var(--line)] rounded-2xl p-5 mb-6 flex items-center justify-between flex-wrap gap-4 shadow-sm">
          <div className="flex flex-col">
            <span className="text-xs font-extrabold text-[var(--muted)] uppercase tracking-wider">GAME VIBE</span>
            <span className="text-sm text-[var(--ink)] font-medium">Choose a theme to fit the mood</span>
          </div>
          <div className="theme-dots mt-0">
            {themeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSetTheme(opt.id)}
                title={opt.label}
                className={theme === opt.id ? "active" : ""}
                style={{ background: opt.gradient }}
              >
                {opt.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Scoreboard card */}
        <div className="bg-white/80 backdrop-blur-md border border-[var(--line)] rounded-2xl mb-6 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--theme-wash)]/40">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[var(--theme-wash)] rounded-lg text-[var(--theme-a)]">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-[var(--ink)] text-base">Scoreboard</span>
            </div>
            {game.isActive && (
              <AddPlayerDialog gameId={gameId} usedColors={usedColors} />
            )}
          </div>

          <div className="p-5">
            {game.players.length === 0 ? (
              <div className="text-center py-10">
                <UserPlus className="w-8 h-8 text-[var(--muted)] mx-auto mb-2" />
                <p className="text-[var(--muted)] text-sm font-semibold">Add players to get started</p>
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
                        maxScore={maxScore}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        {/* Score log */}
        {game.scoreEntries.length > 0 && (
          <div className="bg-white/80 backdrop-blur-md border border-[var(--line)] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[var(--line)] flex items-center gap-2.5 bg-[var(--theme-wash)]/40">
              <div className="p-1.5 bg-[var(--theme-wash)] rounded-lg text-[var(--theme-a)]">
                <Clock className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-[var(--ink)] text-base">Score Log</span>
            </div>
            <div className="p-5">
              <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
                {[...game.scoreEntries].reverse().map((entry) => {
                  const player = game.players.find((p) => p.id === entry.playerId);
                  if (!player) return null;
                  return (
                    <div
                      key={entry.id}
                      data-testid={`row-entry-${entry.id}`}
                      className="flex items-center justify-between text-sm py-2 border-b border-[var(--line)] last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: player.color }}
                        />
                        <span className="text-[var(--ink)] font-semibold">{player.name}</span>
                        <span className="text-xs text-[var(--muted)]">
                          {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <span
                        className={`font-bold tabular-nums ${
                          entry.delta >= 0 ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {entry.delta >= 0 ? "+" : ""}{entry.delta}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
