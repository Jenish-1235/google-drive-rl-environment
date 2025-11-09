import { db, initializeDatabase } from "../config/database";
import path from "path";
import fs from "fs";

/**
 * Seed script to reset and populate the database with test data
 * This ensures a consistent initial state for RL training
 */

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Initialize schema first if running from Docker (when SEED_ON_STARTUP is set)
    // This ensures tables exist before seeding
    if (process.env.SEED_ON_STARTUP === "true") {
      console.log("📋 Initializing database schema...");
      try {
        initializeDatabase();
      } catch (error) {
        // Schema might already be initialized, which is fine
        console.log("ℹ️  Schema initialization skipped (may already exist)");
      }
    }

    // Read the seed SQL file
    const seedPath = path.join(__dirname, "../../database/seed.sql");

    if (!fs.existsSync(seedPath)) {
      throw new Error(`Seed file not found at: ${seedPath}`);
    }

    const seedSQL = fs.readFileSync(seedPath, "utf-8");

    // Execute the seed SQL
    console.log("📝 Executing seed SQL...");
    db.exec(seedSQL);

    // Verify the data
    const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
    const fileCount = db.prepare("SELECT COUNT(*) as count FROM files").get() as { count: number };
    const shareCount = db.prepare("SELECT COUNT(*) as count FROM shares").get() as { count: number };
    const activityCount = db.prepare("SELECT COUNT(*) as count FROM activities").get() as { count: number };
    const commentCount = db.prepare("SELECT COUNT(*) as count FROM comments").get() as { count: number };

    console.log("\n✅ Database seeded successfully!");
    console.log("📊 Summary:");
    console.log(`   - Users: ${userCount.count}`);
    console.log(`   - Files & Folders: ${fileCount.count}`);
    console.log(`   - Shares: ${shareCount.count}`);
    console.log(`   - Activities: ${activityCount.count}`);
    console.log(`   - Comments: ${commentCount.count}`);

    // Show sample user credentials
    console.log("\n👤 Test User Credentials:");
    const users = db.prepare("SELECT email, name FROM users ORDER BY id").all() as Array<{ email: string; name: string }>;
    users.forEach((user) => {
      console.log(`   - ${user.name} (${user.email}) - password: password123`);
    });

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
  
  // Only close the database if running as a standalone script
  // If SEED_ON_STARTUP is set, we're running from Docker entrypoint and should keep DB open
  if (!process.env.SEED_ON_STARTUP) {
    db.close();
    console.log("\n✅ Database connection closed");
  } else {
    console.log("\n✅ Database seeded (connection kept open for server)");
  }
}

// Run the seeding
seedDatabase();
