import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { createGameSchema, addPlayerSchema, addScoreSchema } from "@shared/schema";
const clients = new Map<string, Set<WebSocket>>();

function broadcast(gameId: string, data: unknown) {
  const room = clients.get(gameId);
  if (!room) return;
  const payload = JSON.stringify(data);
  room.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url || "", `http://localhost`);
    const gameId = url.searchParams.get("gameId");
    const shareId = url.searchParams.get("shareId");

    let resolvedGameId: string | null = gameId;

    const setup = async () => {
      if (!resolvedGameId && shareId) {
        const game = await storage.getGameByShareId(shareId);
        if (game) resolvedGameId = game.id;
      }

      if (!resolvedGameId) {
        ws.close();
        return;
      }

      if (!clients.has(resolvedGameId)) {
        clients.set(resolvedGameId, new Set());
      }
      clients.get(resolvedGameId)!.add(ws);

      ws.on("close", () => {
        clients.get(resolvedGameId!)?.delete(ws);
      });
    };

    setup();
  });

  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getGames();
      const withScores = games.map((g) => storage.computeGameWithScores(g));
      res.json(withScores);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.getGame(req.params.id);
      if (!game) return res.status(404).json({ message: "Game not found" });
      res.json(storage.computeGameWithScores(game));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/view/:shareId", async (req, res) => {
    try {
      const game = await storage.getGameByShareId(req.params.shareId);
      if (!game) return res.status(404).json({ message: "Game not found" });
      res.json(storage.computeGameWithScores(game));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/games", async (req, res) => {
    try {
      const data = createGameSchema.parse(req.body);
      const game = await storage.createGame(data);
      res.status(201).json(storage.computeGameWithScores(game));
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.post("/api/games/:id/players", async (req, res) => {
    try {
      const data = addPlayerSchema.parse(req.body);
      const game = await storage.addPlayer(req.params.id, data);
      const withScores = storage.computeGameWithScores(game);
      broadcast(game.id, { type: "update", game: withScores });
      res.status(201).json(withScores);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.post("/api/games/:id/scores", async (req, res) => {
    try {
      const data = addScoreSchema.parse(req.body);
      const game = await storage.addScore(req.params.id, data);
      const withScores = storage.computeGameWithScores(game);
      broadcast(game.id, { type: "update", game: withScores });
      res.status(201).json(withScores);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.post("/api/games/:id/end", async (req, res) => {
    try {
      const game = await storage.endGame(req.params.id);
      const withScores = storage.computeGameWithScores(game);
      broadcast(game.id, { type: "update", game: withScores });
      res.json(withScores);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete("/api/history", async (req, res) => {
    try {
      await storage.clearHistory();
      res.json({ message: "History cleared" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  return httpServer;
}
