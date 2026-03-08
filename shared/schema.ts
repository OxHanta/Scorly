import { z } from "zod";

export const PLAYER_COLORS = [
  "#3498db",
  "#e74c3c",
  "#2ecc71",
  "#f1c40f",
  "#9b59b6",
  "#e67e22",
  "#1abc9c",
  "#e91e63",
] as const;

export const playerSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  color: z.string(),
});

export const scoreEntrySchema = z.object({
  id: z.string(),
  playerId: z.string(),
  delta: z.number(),
  note: z.string().optional(),
  createdAt: z.string(),
});

export const gameSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  shareId: z.string(),
  players: z.array(playerSchema),
  scoreEntries: z.array(scoreEntrySchema),
  createdAt: z.string(),
  endedAt: z.string().optional(),
  isActive: z.boolean(),
});

export const createGameSchema = z.object({
  name: z.string().min(1, "Game name is required"),
});

export const addPlayerSchema = z.object({
  name: z.string().min(1, "Player name is required"),
  color: z.string(),
});

export const addScoreSchema = z.object({
  playerId: z.string(),
  delta: z.number(),
  note: z.string().optional(),
});

export type Player = z.infer<typeof playerSchema>;
export type ScoreEntry = z.infer<typeof scoreEntrySchema>;
export type Game = z.infer<typeof gameSchema>;
export type CreateGame = z.infer<typeof createGameSchema>;
export type AddPlayer = z.infer<typeof addPlayerSchema>;
export type AddScore = z.infer<typeof addScoreSchema>;

export type PlayerScore = {
  player: Player;
  total: number;
  rank: number;
};

export type GameWithScores = Game & {
  playerScores: PlayerScore[];
};
