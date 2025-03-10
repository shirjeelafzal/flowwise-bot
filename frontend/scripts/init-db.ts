import { db } from "../server/db";
import { sql } from "drizzle-orm";

// Initialize database tables
async function initDB() {
  console.log("Initializing database...");
  try {
    // Create tables one by one
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        avatar_url TEXT
      );`
    );

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS channels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        credentials TEXT NOT NULL,
        config TEXT NOT NULL,
        is_active INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`
    );

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS ai_configs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_type TEXT NOT NULL,
        temperature INTEGER NOT NULL,
        api_key TEXT NOT NULL,
        max_tokens INTEGER DEFAULT 2000,
        custom_instructions TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`
    );

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS training_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_name TEXT NOT NULL,
        file_type TEXT NOT NULL,
        training_mode TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        content TEXT NOT NULL,
        metadata TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`
    );

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channel_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        message_type TEXT NOT NULL,
        status TEXT NOT NULL,
        metadata TEXT,
        customer_name TEXT,
        customer_phone TEXT,
        customer_email TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`
    );

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS mcp_configs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        enabled INTEGER DEFAULT 0,
        endpoint TEXT,
        api_key TEXT,
        protocol TEXT NOT NULL DEFAULT 'standard',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`
    );

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS make_configs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        enabled INTEGER DEFAULT 0,
        api_key TEXT,
        organization_id TEXT,
        default_scenario_id TEXT,
        webhook_urls TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`
    );

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error; // Re-throw to ensure the process fails if initialization fails
  }
}

initDB();