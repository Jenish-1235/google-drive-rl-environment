-- ============================================
-- SEED DATA FOR RL TRAINING ENVIRONMENT
-- ============================================
-- This file creates consistent, reproducible test data
-- for reinforcement learning training
-- All passwords are: 'password123'
-- ============================================

-- Clear existing data (in reverse order of dependencies)
DELETE FROM comments;
DELETE FROM file_versions;
DELETE FROM activities;
DELETE FROM shares;
DELETE FROM files;
DELETE FROM users;

-- Reset autoincrement counters
DELETE FROM sqlite_sequence WHERE name IN ('users', 'shares', 'activities', 'file_versions', 'comments');

-- ============================================
-- USERS
-- ============================================
-- Create test users (password: 'password123' hashed with bcrypt)
-- Hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

INSERT INTO users (id, email, name, password_hash, avatar_url, storage_used, storage_limit, created_at) VALUES
(1, 'john@example.com', 'John Doe', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://i.pravatar.cc/150?img=1', 524288000, 2199023255552, datetime('now', '-90 days')),
(2, 'jane@example.com', 'Jane Smith', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://i.pravatar.cc/150?img=5', 314572800, 2199023255552, datetime('now', '-60 days')),
(3, 'bob@example.com', 'Bob Johnson', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://i.pravatar.cc/150?img=12', 104857600, 2199023255552, datetime('now', '-30 days')),
(4, 'alice@example.com', 'Alice Williams', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://i.pravatar.cc/150?img=9', 209715200, 2199023255552, datetime('now', '-45 days')),
(5, 'charlie@example.com', 'Charlie Brown', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://i.pravatar.cc/150?img=15', 52428800, 2199023255552, datetime('now', '-15 days'));

-- ============================================
-- FOLDER STRUCTURE (John's Drive)
-- ============================================
-- Root level folders
INSERT INTO files (id, name, type, mime_type, size, parent_id, owner_id, is_starred, is_trashed, created_at, updated_at) VALUES
('folder-documents', 'My Documents', 'folder', NULL, 0, NULL, 1, 0, 0, datetime('now', '-80 days'), datetime('now', '-10 days')),
('folder-projects', 'Projects', 'folder', NULL, 0, NULL, 1, 1, 0, datetime('now', '-75 days'), datetime('now', '-5 days')),
('folder-photos', 'Photos', 'folder', NULL, 0, NULL, 1, 0, 0, datetime('now', '-70 days'), datetime('now', '-20 days')),
('folder-videos', 'Videos', 'folder', NULL, 0, NULL, 1, 0, 0, datetime('now', '-65 days'), datetime('now', '-15 days')),
('folder-work', 'Work', 'folder', NULL, 0, NULL, 1, 1, 0, datetime('now', '-60 days'), datetime('now', '-3 days')),
('folder-archive', 'Archive', 'folder', NULL, 0, NULL, 1, 0, 0, datetime('now', '-55 days'), datetime('now', '-30 days'));

-- Documents subfolders
INSERT INTO files (id, name, type, mime_type, size, parent_id, owner_id, is_starred, is_trashed, created_at, updated_at) VALUES
('folder-reports', 'Reports', 'folder', NULL, 0, 'folder-documents', 1, 0, 0, datetime('now', '-70 days'), datetime('now', '-8 days')),
('folder-presentations', 'Presentations', 'folder', NULL, 0, 'folder-documents', 1, 0, 0, datetime('now', '-68 days'), datetime('now', '-12 days')),
('folder-spreadsheets', 'Spreadsheets', 'folder', NULL, 0, 'folder-documents', 1, 0, 0, datetime('now', '-65 days'), datetime('now', '-6 days'));

-- Projects subfolders
INSERT INTO files (id, name, type, mime_type, size, parent_id, owner_id, is_starred, is_trashed, created_at, updated_at) VALUES
('folder-proj-alpha', 'Project Alpha', 'folder', NULL, 0, 'folder-projects', 1, 1, 0, datetime('now', '-60 days'), datetime('now', '-2 days')),
('folder-proj-beta', 'Project Beta', 'folder', NULL, 0, 'folder-projects', 1, 0, 0, datetime('now', '-55 days'), datetime('now', '-4 days')),
('folder-proj-gamma', 'Project Gamma', 'folder', NULL, 0, 'folder-projects', 1, 0, 0, datetime('now', '-50 days'), datetime('now', '-7 days'));

-- Work subfolders
INSERT INTO files (id, name, type, mime_type, size, parent_id, owner_id, is_starred, is_trashed, created_at, updated_at) VALUES
('folder-meetings', 'Meeting Notes', 'folder', NULL, 0, 'folder-work', 1, 0, 0, datetime('now', '-55 days'), datetime('now', '-1 day')),
('folder-contracts', 'Contracts', 'folder', NULL, 0, 'folder-work', 1, 1, 0, datetime('now', '-50 days'), datetime('now', '-2 days')),
('folder-invoices', 'Invoices', 'folder', NULL, 0, 'folder-work', 1, 0, 0, datetime('now', '-45 days'), datetime('now', '-5 days'));

-- ============================================
-- FILES (Documents)
-- ============================================
INSERT INTO files (id, name, type, mime_type, size, parent_id, owner_id, is_starred, is_trashed, created_at, updated_at, last_opened_at) VALUES
-- Root level files
('file-readme', 'README.txt', 'file', 'text/plain', 2048, NULL, 1, 1, 0, datetime('now', '-75 days'), datetime('now', '-1 day'), datetime('now', '-1 day')),
('file-todo', 'TODO.md', 'file', 'text/markdown', 4096, NULL, 1, 0, 0, datetime('now', '-70 days'), datetime('now', '-2 days'), datetime('now', '-3 days')),
('file-notes', 'Quick Notes.txt', 'file', 'text/plain', 8192, NULL, 1, 1, 0, datetime('now', '-65 days'), datetime('now', '-1 day'), datetime('now', '-1 day')),

-- Reports
('file-report-q1', 'Q1 Report 2024.pdf', 'file', 'application/pdf', 5242880, 'folder-reports', 1, 1, 0, datetime('now', '-60 days'), datetime('now', '-10 days'), datetime('now', '-5 days')),
('file-report-q2', 'Q2 Report 2024.pdf', 'file', 'application/pdf', 4718592, 'folder-reports', 1, 0, 0, datetime('now', '-50 days'), datetime('now', '-8 days'), datetime('now', '-8 days')),
('file-report-annual', 'Annual Report 2023.pdf', 'file', 'application/pdf', 10485760, 'folder-reports', 1, 1, 0, datetime('now', '-90 days'), datetime('now', '-15 days'), datetime('now', '-20 days')),
('file-report-sales', 'Sales Analysis.docx', 'file', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 2621440, 'folder-reports', 1, 0, 0, datetime('now', '-45 days'), datetime('now', '-7 days'), datetime('now', '-12 days')),

-- Presentations
('file-pres-pitch', 'Product Pitch.pptx', 'file', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 15728640, 'folder-presentations', 1, 1, 0, datetime('now', '-55 days'), datetime('now', '-3 days'), datetime('now', '-3 days')),
('file-pres-roadmap', 'Roadmap Q3-Q4.pptx', 'file', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 12582912, 'folder-presentations', 1, 0, 0, datetime('now', '-40 days'), datetime('now', '-6 days'), datetime('now', '-10 days')),
('file-pres-training', 'Team Training.pptx', 'file', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 8388608, 'folder-presentations', 1, 0, 0, datetime('now', '-35 days'), datetime('now', '-9 days'), datetime('now', '-15 days')),

-- Spreadsheets
('file-sheet-budget', 'Budget 2024.xlsx', 'file', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 3145728, 'folder-spreadsheets', 1, 1, 0, datetime('now', '-58 days'), datetime('now', '-2 days'), datetime('now', '-2 days')),
('file-sheet-inventory', 'Inventory List.xlsx', 'file', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 2097152, 'folder-spreadsheets', 1, 0, 0, datetime('now', '-48 days'), datetime('now', '-5 days'), datetime('now', '-7 days')),
('file-sheet-expenses', 'Expenses Tracker.xlsx', 'file', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 1572864, 'folder-spreadsheets', 1, 1, 0, datetime('now', '-42 days'), datetime('now', '-1 day'), datetime('now', '-1 day')),
('file-sheet-contacts', 'Contact Database.xlsx', 'file', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 1048576, 'folder-spreadsheets', 1, 0, 0, datetime('now', '-38 days'), datetime('now', '-4 days'), datetime('now', '-6 days')),

-- Project files
('file-proj-alpha-spec', 'Project Specification.docx', 'file', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 2621440, 'folder-proj-alpha', 1, 1, 0, datetime('now', '-55 days'), datetime('now', '-2 days'), datetime('now', '-2 days')),
('file-proj-alpha-design', 'Design Mockups.pdf', 'file', 'application/pdf', 20971520, 'folder-proj-alpha', 1, 1, 0, datetime('now', '-52 days'), datetime('now', '-3 days'), datetime('now', '-4 days')),
('file-proj-beta-code', 'Source Code.zip', 'file', 'application/zip', 52428800, 'folder-proj-beta', 1, 0, 0, datetime('now', '-48 days'), datetime('now', '-5 days'), datetime('now', '-8 days')),
('file-proj-beta-docs', 'Documentation.pdf', 'file', 'application/pdf', 7340032, 'folder-proj-beta', 1, 0, 0, datetime('now', '-45 days'), datetime('now', '-6 days'), datetime('now', '-9 days')),

-- Work files
('file-meeting-jan', 'January Meetings.docx', 'file', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1048576, 'folder-meetings', 1, 0, 0, datetime('now', '-50 days'), datetime('now', '-20 days'), datetime('now', '-25 days')),
('file-meeting-feb', 'February Meetings.docx', 'file', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1310720, 'folder-meetings', 1, 0, 0, datetime('now', '-45 days'), datetime('now', '-15 days'), datetime('now', '-18 days')),
('file-contract-vendor', 'Vendor Contract.pdf', 'file', 'application/pdf', 3145728, 'folder-contracts', 1, 1, 0, datetime('now', '-40 days'), datetime('now', '-2 days'), datetime('now', '-3 days')),
('file-invoice-march', 'Invoice March.pdf', 'file', 'application/pdf', 524288, 'folder-invoices', 1, 0, 0, datetime('now', '-30 days'), datetime('now', '-10 days'), datetime('now', '-15 days')),

-- Images
('file-photo-1', 'Vacation Photo 1.jpg', 'file', 'image/jpeg', 4194304, 'folder-photos', 1, 1, 0, datetime('now', '-60 days'), datetime('now', '-30 days'), datetime('now', '-35 days')),
('file-photo-2', 'Vacation Photo 2.jpg', 'file', 'image/jpeg', 3932160, 'folder-photos', 1, 0, 0, datetime('now', '-60 days'), datetime('now', '-30 days'), datetime('now', '-35 days')),
('file-photo-3', 'Office Team.png', 'file', 'image/png', 5242880, 'folder-photos', 1, 1, 0, datetime('now', '-55 days'), datetime('now', '-25 days'), datetime('now', '-28 days')),
('file-photo-4', 'Product Screenshot.png', 'file', 'image/png', 2097152, 'folder-photos', 1, 0, 0, datetime('now', '-50 days'), datetime('now', '-20 days'), datetime('now', '-23 days')),

-- Videos
('file-video-1', 'Tutorial Video.mp4', 'file', 'video/mp4', 104857600, 'folder-videos', 1, 0, 0, datetime('now', '-55 days'), datetime('now', '-25 days'), datetime('now', '-30 days')),
('file-video-2', 'Demo Recording.mp4', 'file', 'video/mp4', 157286400, 'folder-videos', 1, 1, 0, datetime('now', '-48 days'), datetime('now', '-20 days'), datetime('now', '-24 days')),

-- Trashed files
('file-trash-1', 'Old Draft.docx', 'file', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1048576, NULL, 1, 0, 1, datetime('now', '-40 days'), datetime('now', '-5 days'), datetime('now', '-10 days')),
('file-trash-2', 'Unused Presentation.pptx', 'file', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 8388608, NULL, 1, 0, 1, datetime('now', '-35 days'), datetime('now', '-4 days'), datetime('now', '-8 days')),
('file-trash-3', 'Duplicate File.xlsx', 'file', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 2097152, NULL, 1, 0, 1, datetime('now', '-30 days'), datetime('now', '-3 days'), datetime('now', '-6 days'));

-- ============================================
-- SHARES
-- ============================================
-- John shares files with other users
INSERT INTO shares (file_id, shared_with_user_id, shared_by_user_id, permission, created_at) VALUES
-- Share with Jane
('file-report-q1', 2, 1, 'viewer', datetime('now', '-15 days')),
('file-pres-pitch', 2, 1, 'editor', datetime('now', '-20 days')),
('folder-projects', 2, 1, 'viewer', datetime('now', '-25 days')),

-- Share with Bob
('file-sheet-budget', 3, 1, 'editor', datetime('now', '-10 days')),
('folder-work', 3, 1, 'commenter', datetime('now', '-12 days')),

-- Share with Alice
('file-contract-vendor', 4, 1, 'viewer', datetime('now', '-8 days')),
('file-proj-alpha-spec', 4, 1, 'editor', datetime('now', '-18 days'));

-- ============================================
-- ACTIVITIES
-- ============================================
INSERT INTO activities (user_id, file_id, action, details, created_at) VALUES
-- Recent activities (last 7 days)
(1, 'file-readme', 'update', 'Updated file content', datetime('now', '-1 day')),
(1, 'file-notes', 'update', 'Updated file content', datetime('now', '-1 day')),
(1, 'file-sheet-expenses', 'open', 'Opened file', datetime('now', '-1 day')),
(1, 'file-contract-vendor', 'open', 'Opened file', datetime('now', '-2 days')),
(1, 'file-pres-pitch', 'update', 'Updated presentation', datetime('now', '-3 days')),
(1, 'file-sheet-budget', 'open', 'Opened file', datetime('now', '-2 days')),
(1, 'file-proj-alpha-spec', 'update', 'Updated specification', datetime('now', '-2 days')),

-- File operations
(1, 'folder-documents', 'create', 'Created folder', datetime('now', '-80 days')),
(1, 'folder-projects', 'create', 'Created folder', datetime('now', '-75 days')),
(1, 'folder-projects', 'star', 'Starred folder', datetime('now', '-70 days')),
(1, 'folder-work', 'create', 'Created folder', datetime('now', '-60 days')),
(1, 'folder-work', 'star', 'Starred folder', datetime('now', '-58 days')),
(1, 'file-report-q1', 'upload', 'Uploaded file', datetime('now', '-60 days')),
(1, 'file-report-q1', 'star', 'Starred file', datetime('now', '-55 days')),
(1, 'file-pres-pitch', 'upload', 'Uploaded file', datetime('now', '-55 days')),
(1, 'file-pres-pitch', 'star', 'Starred file', datetime('now', '-50 days')),

-- Trash operations
(1, 'file-trash-1', 'trash', 'Moved to trash', datetime('now', '-5 days')),
(1, 'file-trash-2', 'trash', 'Moved to trash', datetime('now', '-4 days')),
(1, 'file-trash-3', 'trash', 'Moved to trash', datetime('now', '-3 days')),

-- Share activities
(1, 'file-report-q1', 'share', 'Shared with jane@example.com', datetime('now', '-15 days')),
(1, 'file-pres-pitch', 'share', 'Shared with jane@example.com', datetime('now', '-20 days')),
(1, 'file-sheet-budget', 'share', 'Shared with bob@example.com', datetime('now', '-10 days'));

-- ============================================
-- COMMENTS
-- ============================================
INSERT INTO comments (file_id, user_id, comment_text, created_at, updated_at) VALUES
('file-pres-pitch', 2, 'Great presentation! Love the design on slide 5.', datetime('now', '-18 days'), datetime('now', '-18 days')),
('file-pres-pitch', 1, 'Thanks Jane! Working on improving slide 8 based on your feedback.', datetime('now', '-17 days'), datetime('now', '-17 days')),
('file-report-q1', 2, 'The Q1 numbers look good. Can you add more detail on the marketing section?', datetime('now', '-12 days'), datetime('now', '-12 days')),
('file-sheet-budget', 3, 'Updated the expense projections for Q3. Please review.', datetime('now', '-8 days'), datetime('now', '-8 days')),
('file-sheet-budget', 1, 'Looks good, approved!', datetime('now', '-7 days'), datetime('now', '-7 days')),
('file-proj-alpha-spec', 4, 'Question about the technical requirements in section 3.', datetime('now', '-15 days'), datetime('now', '-15 days')),
('file-contract-vendor', 4, 'Contract terms reviewed and approved.', datetime('now', '-6 days'), datetime('now', '-6 days'));
