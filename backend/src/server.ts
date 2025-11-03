import app from "./app";
import { config } from "./config/env";
import { initializeDatabase } from "./config/database";
import { userModel } from "./models/userModel";
import { hashPassword } from "./utils/password";

// Initialize database
try {
  initializeDatabase();
  console.log("✅ Database initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize database:", error);
  process.exit(1);
}

// Create dummy user for auth bypass
async function initializeDummyUser() {
  try {
    const existingUser = userModel.findByEmail(config.dummyUser.email);

    if (!existingUser) {
      const passwordHash = await hashPassword(config.dummyUser.password);
      const user = userModel.create(
        config.dummyUser.email,
        config.dummyUser.name,
        passwordHash
      );
      console.log("✅ Dummy user created successfully");
      console.log(`   Email: ${config.dummyUser.email}`);
      console.log(`   Password: ${config.dummyUser.password}`);
    } else {
      console.log("✅ Dummy user already exists");
      console.log(`   Email: ${config.dummyUser.email}`);
      console.log(`   Password: ${config.dummyUser.password}`);
    }
  } catch (error) {
    console.error("❌ Failed to create dummy user:", error);
  }
}

// Initialize dummy user
initializeDummyUser();

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🌐 Frontend URL: ${config.frontendUrl}`);
});
