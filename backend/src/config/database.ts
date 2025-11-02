import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = process.env.DATABASE_PATH || "./database/drive.db";

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database connection
export const db = new Database(DB_PATH, {
  verbose: process.env.NODE_ENV === "development" ? console.log : undefined,
});

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize database with schema
export function initializeDatabase() {
  const schemaPath = path.join(__dirname, "../../database/schema.sql");

  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, "utf-8");
    db.exec(schema);
    console.log("✅ Database schema initialized");
  } else {
    console.error("❌ Schema file not found");
    throw new Error("Database schema file not found");
  }
}

// Seed database with test data
export function seedDatabase() {
  const seedPath = path.join(__dirname, "../../database/seed.sql");

  if (fs.existsSync(seedPath)) {
    const seed = fs.readFileSync(seedPath, "utf-8");
    db.exec(seed);
    console.log("✅ Database seeded with test data");
  } else {
    console.warn("⚠️ Seed file not found");
  }
}

// Close database connection
export function closeDatabase() {
  db.close();
  console.log("Database connection closed");
}

// Graceful shutdown
process.on("SIGINT", () => {
  closeDatabase();
  process.exit(0);
});

export default db;
