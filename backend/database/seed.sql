-- ============================================
-- SEED DATA FOR TESTING
-- ============================================

-- Create test users (passwords are all 'password123' hashed with bcrypt)
-- Hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

INSERT INTO users (id, email, name, password_hash, avatar_url, storage_used, storage_limit) VALUES
(1, 'john@example.com', 'John Doe', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://i.pravatar.cc/150?img=1', 0, 2199023255552),
(2, 'jane@example.com', 'Jane Smith', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://i.pravatar.cc/150?img=5', 0, 2199023255552),
(3, 'bob@example.com', 'Bob Johnson', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://i.pravatar.cc/150?img=12', 0, 2199023255552),
(4, 'alice@example.com', 'Alice Williams', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://i.pravatar.cc/150?img=9', 0, 2199023255552),
(5, 'charlie@example.com', 'Charlie Brown', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://i.pravatar.cc/150?img=15', 0, 2199023255552);

-- Create sample folder structure for John (user 1)
INSERT INTO files (id, name, type, mime_type, size, parent_id, owner_id, is_starred, is_trashed) VALUES
('folder-1', 'My Documents', 'folder', NULL, 0, NULL, 1, 0, 0),
('folder-2', 'Projects', 'folder', NULL, 0, NULL, 1, 1, 0),
('folder-3', 'Photos', 'folder', NULL, 0, NULL, 1, 0, 0),
('folder-4', 'Work', 'folder', NULL, 0, 'folder-1', 1, 0, 0),
('folder-5', 'Personal', 'folder', NULL, 0, 'folder-1', 1, 0, 0);

-- Sample activities
INSERT INTO activities (user_id, file_id, action, details) VALUES
(1, 'folder-1', 'create', 'Created folder "My Documents"'),
(1, 'folder-2', 'create', 'Created folder "Projects"'),
(1, 'folder-2', 'star', 'Starred folder "Projects"'),
(1, 'folder-3', 'create', 'Created folder "Photos"');

-- Note: Actual files will be created through API uploads
-- This seed data provides a basic structure to start with
