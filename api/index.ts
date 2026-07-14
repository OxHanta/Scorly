import express from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes asynchronously
(async () => {
  await registerRoutes(httpServer, app);
})();

export default app;
