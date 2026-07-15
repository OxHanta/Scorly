import { randomUUID, randomBytes } from "crypto";
import type { Game, Player, ScoreEntry, CreateGame, AddPlayer, AddScore, GameWithScores, PlayerScore } from "@shared/schema";

export interface IStorage {
  getGames(): Promise<Game[]>;
  getGame(id: string): Promise<Game | undefined>;
  getGameByShareId(shareId: string): Promise<Game | undefined>;
  createGame(data: CreateGame): Promise<Game>;
  addPlayer(gameId: string, data: AddPlayer): Promise<Game>;
  addScore(gameId: string, data: AddScore): Promise<Game>;
  endGame(gameId: string): Promise<Game>;
  clearHistory(): Promise<void>;
  computeGameWithScores(game: Game): GameWithScores;
}

export class MemStorage implements IStorage {
  private games: Map<string, Game>;

  constructor() {
    this.games = new Map();
  }

  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getGame(id: string): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getGameByShareId(shareId: string): Promise<Game | undefined> {
    return Array.from(this.games.values()).find((g) => g.shareId === shareId);
  }

  async createGame(data: CreateGame): Promise<Game> {
    const id = randomUUID();
    const shareId = randomBytes(6).toString("hex");
    const game: Game = {
      id,
      name: data.name,
      shareId,
      players: [],
      scoreEntries: [],
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    this.games.set(id, game);
    return game;
  }

  async addPlayer(gameId: string, data: AddPlayer): Promise<Game> {
    const game = this.games.get(gameId);
    if (!game) throw new Error("Game not found");
    const player: Player = {
      id: randomUUID(),
      name: data.name,
      color: data.color,
    };
    game.players = [...game.players, player];
    this.games.set(gameId, game);
    return game;
  }

  async addScore(gameId: string, data: AddScore): Promise<Game> {
    const game = this.games.get(gameId);
    if (!game) throw new Error("Game not found");
    const entry: ScoreEntry = {
      id: randomUUID(),
      playerId: data.playerId,
      delta: data.delta,
      note: data.note,
      createdAt: new Date().toISOString(),
    };
    game.scoreEntries = [...game.scoreEntries, entry];
    this.games.set(gameId, game);
    return game;
  }

  async endGame(gameId: string): Promise<Game> {
    const game = this.games.get(gameId);
    if (!game) throw new Error("Game not found");
    game.isActive = false;
    game.endedAt = new Date().toISOString();
    this.games.set(gameId, game);
    return game;
  }

  async clearHistory(): Promise<void> {
    const toDelete: string[] = [];
    this.games.forEach((game, id) => {
      if (!game.isActive) toDelete.push(id);
    });
    toDelete.forEach((id) => this.games.delete(id));
  }

  computeGameWithScores(game: Game): GameWithScores {
    const totals = new Map<string, number>();
    game.players.forEach((p) => totals.set(p.id, 0));
    game.scoreEntries.forEach((entry) => {
      totals.set(entry.playerId, (totals.get(entry.playerId) ?? 0) + entry.delta);
    });

    const playerScores: PlayerScore[] = game.players.map((player) => ({
      player,
      total: totals.get(player.id) ?? 0,
      rank: 0,
    }));

    playerScores.sort((a, b) => b.total - a.total);
    playerScores.forEach((ps, i) => {
      ps.rank = i + 1;
    });

    return { ...game, playerScores };
  }
}

import { getDb } from "./db";
import { games } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getGames(): Promise<Game[]> {
    const db = getDb();
    const allGames = await db.select().from(games).orderBy(desc(games.createdAt));
    return allGames as Game[];
  }

  async getGame(id: string): Promise<Game | undefined> {
    const db = getDb();
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game as Game | undefined;
  }

  async getGameByShareId(shareId: string): Promise<Game | undefined> {
    const db = getDb();
    const [game] = await db.select().from(games).where(eq(games.shareId, shareId));
    return game as Game | undefined;
  }

  async createGame(data: CreateGame): Promise<Game> {
    const db = getDb();
    const id = randomUUID();
    const shareId = randomBytes(6).toString("hex");
    const newGame: Game = {
      id,
      name: data.name,
      shareId,
      players: [],
      scoreEntries: [],
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    await db.insert(games).values(newGame);
    return newGame;
  }

  async addPlayer(gameId: string, data: AddPlayer): Promise<Game> {
    const db = getDb();
    const game = await this.getGame(gameId);
    if (!game) throw new Error("Game not found");

    const player: Player = {
      id: randomUUID(),
      name: data.name,
      color: data.color,
    };

    game.players.push(player);
    await db.update(games).set({ players: game.players }).where(eq(games.id, gameId));
    return game;
  }

  async addScore(gameId: string, data: AddScore): Promise<Game> {
    const db = getDb();
    const game = await this.getGame(gameId);
    if (!game) throw new Error("Game not found");

    const entry: ScoreEntry = {
      id: randomUUID(),
      playerId: data.playerId,
      delta: data.delta,
      note: data.note,
      createdAt: new Date().toISOString(),
    };

    game.scoreEntries.push(entry);
    await db.update(games).set({ scoreEntries: game.scoreEntries }).where(eq(games.id, gameId));
    return game;
  }

  async endGame(gameId: string): Promise<Game> {
    const db = getDb();
    const game = await this.getGame(gameId);
    if (!game) throw new Error("Game not found");

    game.isActive = false;
    game.endedAt = new Date().toISOString();
    await db.update(games).set({ isActive: game.isActive, endedAt: game.endedAt }).where(eq(games.id, gameId));
    return game;
  }

  async clearHistory(): Promise<void> {
    const db = getDb();
    await db.delete(games).where(eq(games.isActive, false));
  }

  computeGameWithScores(game: Game): GameWithScores {
    const totals = new Map<string, number>();
    game.players.forEach((p) => totals.set(p.id, 0));
    game.scoreEntries.forEach((entry) => {
      totals.set(entry.playerId, (totals.get(entry.playerId) ?? 0) + entry.delta);
    });

    const playerScores: PlayerScore[] = game.players.map((player) => ({
      player,
      total: totals.get(player.id) ?? 0,
      rank: 0,
    }));

    playerScores.sort((a, b) => b.total - a.total);
    playerScores.forEach((ps, i) => {
      ps.rank = i + 1;
    });

    return { ...game, playerScores };
  }
}

function createStorage(): IStorage {
  if (process.env.DATABASE_URL) {
    return new DatabaseStorage();
  }
  console.warn("DATABASE_URL not set, falling back to in-memory storage. Data will not persist between server restarts.");
  return new MemStorage();
}

export const storage = createStorage();
