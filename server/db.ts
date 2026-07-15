import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

let dbInstance: NodePgDatabase<typeof schema> | null = null;

export function getDb() {
  if (!dbInstance) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing. Please configure your Postgres database.");
    }
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production",
      max: parseInt(process.env.PG_POOL_MAX || "5", 10),
    });
    dbInstance = drizzle(pool, { schema });
  }
  return dbInstance;
}
