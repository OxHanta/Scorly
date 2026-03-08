import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useParams, useLocation } from "wouter";
import { useGameSocket } from "@/lib/useGameSocket";
import { useAnimatedNumber, useScoreGlow } from "@/lib/useAnimatedNumber";
import { motion, AnimatePresence } from "framer-motion";
import { Confetti } from "@/components/confetti";
import type { GameWithScores, PlayerScore } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Gamepad2, ArrowLeft, Wifi, Clock, Crown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-slate-400" />;
  if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
  return (
    <span className="w-6 h-6 flex items-center justify-center text-base font-bold text-muted-foreground">
      #{rank}
    </span>
  );
}

function WinnerBadge() {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0, y: -4 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.2 }}
      className="inline-flex items-center gap-1 text-sm font-semibold px-2.5 py-0.5 rounded-full
        bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400
        border border-yellow-300 dark:border-yellow-700 flex-shrink-0"
    >
      <Crown className="w-3.5 h-3.5" />
      Winner!
    </motion.span>
  );
}

function PlayerRow({
  ps,
  maxScore,
  gameEnded,
}: {
  ps: PlayerScore;
  maxScore: number;
  gameEnded: boolean;
}) {
  const barPct = maxScore <= 0 ? 0 : Math.max(0, Math.min(100, (ps.total / maxScore) * 100));
  const animatedScore = useAnimatedNumber(ps.total, 650);
  const isGlowing = useScoreGlow(ps.total);
  const isWinner = gameEnded && ps.rank === 1;

  return (
    <motion.div
      data-testid={`row-player-${ps.player.id}`}
      animate={{
        boxShadow: isGlowing
          ? `0 0 0 2px ${ps.player.color}55, 0 0 24px 6px ${ps.player.color}28`
          : "0 0 0 0px transparent, 0 0 0px 0px transparent",
      }}
      transition={{ duration: isGlowing ? 0.08 : 0.8, ease: "easeOut" }}
      className={`rounded-lg border p-4 sm:p-5 ${
        isWinner
          ? "border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/10"
          : ps.rank === 1
          ? "border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10"
          : "border-card-border bg-card"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <RankIcon rank={ps.rank} />
        <div
          className="w-3.5 h-3.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: ps.player.color }}
        />
        <span className="font-semibold text-foreground text-lg flex-1 min-w-0 truncate">
          {ps.player.name}
        </span>
        <AnimatePresence>
          {isWinner && <WinnerBadge />}
        </AnimatePresence>
        <span
          data-testid={`text-score-${ps.player.id}`}
          className="text-4xl font-bold tabular-nums flex-shrink-0"
          style={{ color: ps.player.color }}
        >
          {animatedScore}
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${barPct}%`,
            backgroundColor: ps.player.color,
            transition: "width 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function ViewPage() {
  const params = useParams<{ shareId: string }>();
  const shareId = params.shareId;
  const [, setLocation] = useLocation();
  const [showConfetti, setShowConfetti] = useState(false);
  const prevActiveRef = useRef<boolean | undefined>(undefined);

  const { data: game, isLoading, error } = useQuery<GameWithScores>({
    queryKey: ["/api/view", shareId],
    queryFn: async () => {
      const res = await fetch(`/api/view/${shareId}`);
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
      queryClient.setQueryData(["/api/view", shareId], updatedGame);
    },
    [shareId]
  );

  useGameSocket(undefined, shareId, onSocketUpdate);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto px-6 space-y-4">
          <Skeleton className="h-12 w-2/3 mx-auto" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h2 className="text-xl font-bold text-foreground mb-1">Game Not Found</h2>
          <p className="text-muted-foreground text-sm mb-4">
            This link may be invalid or the game has been deleted.
          </p>
          <Button onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const maxScore = Math.max(1, ...game.playerScores.map((ps) => ps.total));
  const gameEnded = !game.isActive;

  return (
    <div className="min-h-screen bg-background">
      <Confetti active={showConfetti} />

      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Game Night</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{game.name}</h1>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Badge
              variant={game.isActive ? "default" : "secondary"}
              data-testid="badge-game-status"
              className="flex items-center gap-1.5"
            >
              {game.isActive ? (
                <>
                  <Wifi className="w-3 h-3" />
                  Live
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  Ended
                </>
              )}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {game.isActive
                ? `Started ${formatDistanceToNow(new Date(game.createdAt), { addSuffix: true })}`
                : game.endedAt
                ? `Ended ${formatDistanceToNow(new Date(game.endedAt), { addSuffix: true })}`
                : ""}
            </span>
          </div>
          {game.isActive && (
            <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Scores update in real-time
            </p>
          )}
        </div>

        {/* Scoreboard */}
        {game.players.length === 0 ? (
          <div className="text-center py-12 rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground">No players have been added yet.</p>
          </div>
        ) : (
          <motion.div layout className="flex flex-col gap-3 mb-8">
            <AnimatePresence initial={false}>
              {game.playerScores.map((ps) => (
                <motion.div
                  key={ps.player.id}
                  layout
                  layoutId={`view-player-${ps.player.id}`}
                  transition={{ layout: { type: "spring", stiffness: 340, damping: 32 } }}
                >
                  <PlayerRow ps={ps} maxScore={maxScore} gameEnded={gameEnded} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Back to home */}
        <div className="text-center">
          <Button
            data-testid="button-back-home"
            variant="outline"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          View-only link — scores are managed by the game host
        </p>
      </div>
    </div>
  );
}
