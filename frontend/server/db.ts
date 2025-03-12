import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create a new SQLite database file
const sqlite = new Database('sqlite.db');

// Create the drizzle database instance
export const db = drizzle(sqlite, { schema });