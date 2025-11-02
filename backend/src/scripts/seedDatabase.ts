import { seedDatabase } from "../config/database";

console.log("Seeding database...");

try {
  seedDatabase();
  console.log("✅ Database seeding complete");
  process.exit(0);
} catch (error) {
  console.error("❌ Database seeding failed:", error);
  process.exit(1);
}
