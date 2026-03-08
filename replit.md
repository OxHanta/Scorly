# Game Night Score Board

A real-time game night score board web application with live sharing.

## Features

- Create and manage game sessions with custom names
- Add players with unique colors
- Update scores with quick buttons (+1, +5, +10) or custom amounts
- Real-time updates via WebSockets (all viewers see changes instantly)
- Share a view-only link for spectators
- Game history with timestamps
- Clear history (removes ended games only)
- Responsive design for mobile and desktop

## Architecture

- **Frontend**: React + TypeScript, Vite, Shadcn UI, TailwindCSS, TanStack Query, wouter
- **Backend**: Express.js + TypeScript, WebSocket (ws), in-memory storage
- **Real-time**: WebSocket connections per game room

## Pages

- `/` — Home: list of active games and history, create new games
- `/game/:id` — Game management: add players, update scores, share link, end game
- `/view/:shareId` — View-only: live scoreboard for spectators

## Data Model

See `shared/schema.ts` for all types:
- `Game`: id, name, shareId, players, scoreEntries, createdAt, isActive
- `Player`: id, name, color
- `ScoreEntry`: id, playerId, delta, createdAt

## Storage

In-memory storage via `MemStorage` in `server/storage.ts`. No database required — games persist for the server lifetime.

## WebSocket

WebSocket server at `/ws`. Clients join a game room by passing `?gameId=` or `?shareId=`. When scores or players change, all clients in the room receive an `{ type: "update", game }` message.
