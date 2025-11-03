import dotenv from "dotenv";

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000"),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key-change-this",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  database: {
    path: process.env.DATABASE_PATH || "./database/drive.db",
  },

  upload: {
    dir: process.env.UPLOAD_DIR || "./uploads",
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "104857600"),
    allowedTypes: process.env.ALLOWED_FILE_TYPES || "*",
  },

  storage: {
    defaultLimit: parseInt(
      process.env.DEFAULT_STORAGE_LIMIT || "2199023255552"
    ),
  },

  dummyUser: {
    email: process.env.DUMMY_USER_EMAIL || "demo@drive.com",
    password: process.env.DUMMY_USER_PASSWORD || "demo123",
    name: process.env.DUMMY_USER_NAME || "Demo User",
  },
};

export default config;
