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
      className="inline-flex items-center gap-1 text-sm font-bold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300 flex-shrink-0"
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
      className={`rounded-2xl border p-4 sm:p-5 backdrop-blur-sm ${
        isWinner || ps.rank === 1
          ? "border-yellow-300 bg-yellow-50/80"
          : "border-[var(--line)] bg-white/80"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <RankIcon rank={ps.rank} />
        <div
          className="w-3.5 h-3.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: ps.player.color }}
        />
        <span className="font-bold text-[var(--ink)] text-lg flex-1 min-w-0 truncate">
          {ps.player.name}
        </span>
        <AnimatePresence>
          {isWinner && <WinnerBadge />}
        </AnimatePresence>
        <span
          data-testid={`text-score-${ps.player.id}`}
          className="text-4xl font-extrabold tabular-nums flex-shrink-0"
          style={{ color: ps.player.color }}
        >
          {animatedScore}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-[var(--line)] overflow-hidden">
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
      <main className="app-shell min-h-screen flex items-center justify-center" data-theme="bubblegum">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="w-full max-w-lg mx-auto px-6 space-y-4 z-10">
          <Skeleton className="h-12 w-2/3 mx-auto bg-white/40" />
          <Skeleton className="h-24 rounded-2xl bg-white/40" />
          <Skeleton className="h-24 rounded-2xl bg-white/40" />
          <Skeleton className="h-24 rounded-2xl bg-white/40" />
        </div>
      </main>
    );
  }

  if (error || !game) {
    return (
      <main className="app-shell min-h-screen flex items-center justify-center" data-theme="bubblegum">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="text-center px-6 z-10">
          <Gamepad2 className="w-12 h-12 text-[var(--muted)] mx-auto mb-3" />
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-1">Game Not Found</h2>
          <p className="text-[var(--muted)] text-sm mb-4">
            This link may be invalid or the game has been deleted.
          </p>
          <Button
            onClick={() => setLocation("/dashboard")}
            className="bg-[#3F7D58] hover:bg-[#2e5e41] text-white border-0 font-extrabold shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </main>
    );
  }

  const maxScore = Math.max(1, ...game.playerScores.map((ps) => ps.total));
  const gameEnded = !game.isActive;

  return (
    <main className="app-shell min-h-screen text-[var(--ink)]" data-theme="bubblegum">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <Confetti active={showConfetti} />

      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 relative z-10 content-wrap">
        {/* Header */}
        <div className="text-center mb-8 bg-white/80 backdrop-blur-md border border-[var(--line)] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-center mb-4">
            <img
              src="https://res.cloudinary.com/dba2kof3v/image/upload/v1783945770/Black_2x_j4urn8.png"
              alt="Scorely"
              className="h-7 w-auto"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--ink)] mb-3">{game.name}</h1>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {game.isActive ? (
              <Badge
                data-testid="badge-game-status"
                className="bg-emerald-100 text-emerald-700 border-emerald-200 flex items-center gap-1.5 font-bold"
              >
                <Wifi className="w-3 h-3" />
                Live
              </Badge>
            ) : (
              <Badge
                data-testid="badge-game-status"
                className="border-[var(--line)] text-[var(--muted)] bg-white font-bold"
              >
                <Clock className="w-3 h-3 mr-1" />
                Ended
              </Badge>
            )}
            <span className="text-xs text-[var(--muted)] font-medium">
              {game.isActive
                ? `Started ${formatDistanceToNow(new Date(game.createdAt), { addSuffix: true })}`
                : game.endedAt
                ? `Ended ${formatDistanceToNow(new Date(game.endedAt), { addSuffix: true })}`
                : ""}
            </span>
          </div>
          {game.isActive && (
            <p className="text-xs text-[var(--muted)] mt-3 flex items-center justify-center gap-1.5 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Scores update in real-time
            </p>
          )}
        </div>

        {/* Scoreboard */}
        {game.players.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-[var(--line)] bg-white/60">
            <p className="text-[var(--muted)] font-semibold">No players have been added yet.</p>
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
            onClick={() => setLocation("/dashboard")}
            className="border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--theme-wash)] font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--muted)] mt-6 font-medium">
          View-only link — scores are managed by the game host
        </p>
      </div>
    </main>
  );
}
