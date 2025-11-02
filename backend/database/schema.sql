-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT DEFAULT 'https://i.pravatar.cc/150?img=1',
  storage_used INTEGER DEFAULT 0,
  storage_limit INTEGER DEFAULT 2199023255552,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- FILES TABLE (includes both files and folders)
-- ============================================
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('file', 'folder')),
  mime_type TEXT,
  size INTEGER DEFAULT 0,
  parent_id TEXT,
  owner_id INTEGER NOT NULL,
  file_path TEXT,
  thumbnail_path TEXT,
  is_starred INTEGER DEFAULT 0 CHECK(is_starred IN (0, 1)),
  is_trashed INTEGER DEFAULT 0 CHECK(is_trashed IN (0, 1)),
  trashed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_opened_at DATETIME,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES files(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_files_owner ON files(owner_id);
CREATE INDEX IF NOT EXISTS idx_files_parent ON files(parent_id);
CREATE INDEX IF NOT EXISTS idx_files_starred ON files(is_starred, owner_id);
CREATE INDEX IF NOT EXISTS idx_files_trashed ON files(is_trashed, owner_id);
CREATE INDEX IF NOT EXISTS idx_files_type ON files(type);
CREATE INDEX IF NOT EXISTS idx_files_name ON files(name);

-- ============================================
-- SHARES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS shares (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id TEXT NOT NULL,
  shared_with_user_id INTEGER,
  shared_by_user_id INTEGER NOT NULL,
  permission TEXT NOT NULL CHECK(permission IN ('viewer', 'commenter', 'editor')),
  share_link TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_by_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(file_id, shared_with_user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_shares_file ON shares(file_id);
CREATE INDEX IF NOT EXISTS idx_shares_user ON shares(shared_with_user_id);
CREATE INDEX IF NOT EXISTS idx_shares_link ON shares(share_link);

-- ============================================
-- ACTIVITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  file_id TEXT,
  action TEXT NOT NULL,
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL
);

-- Index for faster activity queries
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_file ON activities(file_id, created_at DESC);

-- ============================================
-- FILE_VERSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS file_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  size INTEGER NOT NULL,
  uploaded_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(file_id, version_number)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_versions_file ON file_versions(file_id, version_number DESC);

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  comment_text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index
CREATE INDEX IF NOT EXISTS idx_comments_file ON comments(file_id, created_at DESC);
