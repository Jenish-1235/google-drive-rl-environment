# Database Seeding for RL Environment

This document explains the database seeding system designed for the Google Drive RL training environment.

## Overview

The database seeding system ensures that every time the application starts, it has a consistent, reproducible initial state. This is crucial for reinforcement learning training where you need deterministic starting conditions.

## Features

- **Automatic Seeding**: Seeds database on Docker container startup
- **Reproducible Data**: Creates consistent test data every time
- **Rich Dataset**: Includes users, files, folders, shares, activities, and comments
- **Environment Variable Control**: Can be enabled/disabled via `SEED_ON_STARTUP`

## Seed Data

### Users (5 users)
All users have the password: `password123`

- John Doe (john@example.com) - Primary user with extensive file structure
- Jane Smith (jane@example.com)
- Bob Johnson (bob@example.com)
- Alice Williams (alice@example.com)
- Charlie Brown (charlie@example.com)

### File Structure (46 files and folders)

John's Drive includes:
- **6 root folders**: Documents, Projects, Photos, Videos, Work, Archive
- **9 subfolders**: Various organizational folders
- **31 files**: Documents, presentations, spreadsheets, PDFs, images, videos
- **3 trashed files**: For testing trash/restore functionality

### Relationships
- **7 shares**: Files and folders shared between users
- **22 activities**: Recent file operations and history
- **7 comments**: Collaboration comments on files

## Usage

### Manual Seeding

Run the seed script manually:

```bash
npm run db:seed
```

### Docker Environment

The seeding happens automatically on container startup. Control it with the `SEED_ON_STARTUP` environment variable:

```yaml
# docker-compose.yml
environment:
  - SEED_ON_STARTUP=true  # Enable (default)
  # or
  - SEED_ON_STARTUP=false # Disable
```

### Disabling Seeding

To disable automatic seeding:

```bash
# In docker-compose.yml or .env
SEED_ON_STARTUP=false
```

## For RL Training

The seeded data provides:

1. **Consistent Initial State**: Same data structure every time
2. **Rich Action Space**: Multiple folders, files, and operations to explore
3. **Realistic Scenarios**: Shared files, starred items, recent activity
4. **Test Users**: Multiple users to test collaboration features

## Data Schema

See `backend/database/schema.sql` for the full database schema.

## Customizing Seed Data

To modify the seed data, edit:
- `backend/database/seed.sql` - Main seed file with all data
- `backend/src/scripts/seedDatabase.ts` - Seeding logic

## Files

- `backend/database/seed.sql` - SQL seed data
- `backend/src/scripts/seedDatabase.ts` - Seeding script
- `backend/docker-entrypoint.sh` - Docker startup script
- `backend/src/config/database.ts` - Database configuration

## Notes

- The seed script clears all existing data before inserting new data
- All timestamps use relative dates (e.g., "90 days ago") for consistency
- File paths reference metadata only - actual file uploads are not included in seed
