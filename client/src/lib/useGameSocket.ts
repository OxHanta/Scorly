import { useEffect, useRef, useCallback } from "react";
import type { GameWithScores } from "@shared/schema";

type SocketMessage = {
  type: "update";
  game: GameWithScores;
};

export function useGameSocket(
  gameId: string | undefined,
  shareId: string | undefined,
  onUpdate: (game: GameWithScores) => void
) {
  const wsRef = useRef<WebSocket | null>(null);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const connect = useCallback(() => {
    if (!gameId && !shareId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const params = new URLSearchParams();
    if (gameId) params.set("gameId", gameId);
    if (shareId) params.set("shareId", shareId);

    const url = `${protocol}//${window.location.host}/ws?${params.toString()}`;
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      try {
        const msg: SocketMessage = JSON.parse(event.data);
        if (msg.type === "update") {
          onUpdateRef.current(msg.game);
        }
      } catch {
      }
    };

    ws.onclose = () => {
      setTimeout(() => connect(), 2000);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [gameId, shareId]);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      cleanup?.();
      wsRef.current?.close();
    };
  }, [connect]);
}
