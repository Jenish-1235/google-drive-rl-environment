# Google Drive Clone - RL Training Environment

This Google Drive clone is configured as a **Reinforcement Learning (RL) training environment** with reproducible, consistent initial states.

## Quick Start

```bash
# Start the environment
docker-compose up -d

# Check seeding logs
docker-compose logs backend | grep "Database seeded"

# Stop and reset
docker-compose down -v

# Restart with fresh seed data
docker-compose up -d
```

## Environment Configuration

### Automatic Database Seeding

Every time the backend container starts, it automatically seeds the database with consistent test data:

- **5 Users** with known credentials
- **46 Files & Folders** in a realistic structure
- **7 File Shares** between users
- **22 Activity Records** for history
- **7 Comments** for collaboration testing

### Environment Variables

Control seeding behavior in `docker-compose.yml`:

```yaml
environment:
  - SEED_ON_STARTUP=true   # Enable automatic seeding (default)
  # - SEED_ON_STARTUP=false  # Disable if you want to preserve data
```

## Test Accounts

All users have password: `password123`

| Name | Email | Role |
|------|-------|------|
| John Doe | john@example.com | Primary user (main test account) |
| Jane Smith | jane@example.com | Collaborator |
| Bob Johnson | bob@example.com | Collaborator |
| Alice Williams | alice@example.com | Collaborator |
| Charlie Brown | charlie@example.com | Limited user |

**Demo Account** (for quick access):
- Email: `demo@drive.com`
- Password: `demo123`

## File Structure (John's Drive)

```
My Drive/
├── README.txt ⭐
├── TODO.md
├── Quick Notes.txt ⭐
├── My Documents/
│   ├── Reports/
│   │   ├── Q1 Report 2024.pdf ⭐
│   │   ├── Q2 Report 2024.pdf
│   │   ├── Annual Report 2023.pdf ⭐
│   │   └── Sales Analysis.docx
│   ├── Presentations/
│   │   ├── Product Pitch.pptx ⭐ (shared with Jane)
│   │   ├── Roadmap Q3-Q4.pptx
│   │   └── Team Training.pptx
│   └── Spreadsheets/
│       ├── Budget 2024.xlsx ⭐ (shared with Bob)
│       ├── Inventory List.xlsx
│       ├── Expenses Tracker.xlsx ⭐
│       └── Contact Database.xlsx
├── Projects/ ⭐ (shared with Jane)
│   ├── Project Alpha/ ⭐
│   │   ├── Project Specification.docx ⭐ (shared with Alice)
│   │   └── Design Mockups.pdf ⭐
│   ├── Project Beta/
│   │   ├── Source Code.zip
│   │   └── Documentation.pdf
│   └── Project Gamma/
├── Photos/
│   ├── Vacation Photo 1.jpg ⭐
│   ├── Vacation Photo 2.jpg
│   ├── Office Team.png ⭐
│   └── Product Screenshot.png
├── Videos/
│   ├── Tutorial Video.mp4
│   └── Demo Recording.mp4 ⭐
├── Work/ ⭐ (shared with Bob)
│   ├── Meeting Notes/
│   │   ├── January Meetings.docx
│   │   └── February Meetings.docx
│   ├── Contracts/ ⭐
│   │   └── Vendor Contract.pdf ⭐ (shared with Alice)
│   └── Invoices/
│       └── Invoice March.pdf
└── Archive/

Trash/
├── Old Draft.docx
├── Unused Presentation.pptx
└── Duplicate File.xlsx
```

⭐ = Starred items

## RL Training Use Cases

### 1. File Organization Tasks
- Move files between folders
- Create nested folder structures
- Rename files and folders
- Star/unstar important items

### 2. Collaboration Tasks
- Share files with specific users
- Change sharing permissions
- Add comments to files
- Respond to comments

### 3. File Management Tasks
- Delete files (move to trash)
- Restore files from trash
- Permanently delete files
- Search for specific files

### 4. Storage Management
- Monitor storage usage
- Identify large files
- Clean up duplicate files
- Archive old files

## API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Files
```bash
# List files
curl http://localhost:5000/api/files

# Get file details
curl http://localhost:5000/api/files/{fileId}

# Create folder
curl -X POST http://localhost:5000/api/files/folders \
  -H "Content-Type: application/json" \
  -d '{"name":"New Folder","parentId":null}'

# Move file
curl -X PUT http://localhost:5000/api/files/{fileId}/move \
  -H "Content-Type: application/json" \
  -d '{"newParentId":"folder-documents"}'

# Star/Unstar file
curl -X PATCH http://localhost:5000/api/files/{fileId}/star \
  -H "Content-Type: application/json" \
  -d '{"isStarred":true}'

# Delete file (move to trash)
curl -X DELETE http://localhost:5000/api/files/{fileId}
```

### Shares
```bash
# Share file
curl -X POST http://localhost:5000/api/shares \
  -H "Content-Type: application/json" \
  -d '{"fileId":"file-report-q1","sharedWithUserId":2,"permission":"viewer"}'

# List shared files
curl http://localhost:5000/api/files/shared
```

## Resetting the Environment

To reset to initial state:

```bash
# Stop and remove all data
docker-compose down -v

# Start fresh (will auto-seed)
docker-compose up -d

# Verify seeding
docker-compose logs backend | grep "✅ Database seeded"
```

## Manual Seeding

If you need to reseed while the container is running:

```bash
# Enter backend container
docker-compose exec backend sh

# Run seed script
node dist/scripts/seedDatabase.js

# Exit
exit
```

## Database Access

```bash
# Access SQLite database directly
docker-compose exec backend sh
cd data
sqlite3 drive.db

# Example queries
sqlite> SELECT COUNT(*) FROM files;
sqlite> SELECT name, type FROM files WHERE owner_id = 1 LIMIT 10;
sqlite> .exit
```

## Monitoring

```bash
# Watch logs
docker-compose logs -f backend

# Check container status
docker-compose ps

# View resource usage
docker stats google-drive-backend
```

## Troubleshooting

### Seeding doesn't run
Check if `SEED_ON_STARTUP=true` in docker-compose.yml

### Port conflicts
Change ports in docker-compose.yml if 5000 or 80 are in use

### Database locked
Stop all containers: `docker-compose down`

### Reset everything
```bash
docker-compose down -v  # Remove volumes
docker system prune -a  # Clean Docker cache
docker-compose build --no-cache
docker-compose up -d
```

## Documentation

- [Database Seeding Details](backend/DATABASE_SEEDING.md)
- [API Documentation](backend/API_DOCS.md)
- [Database Schema](backend/database/schema.sql)
- [Seed Data](backend/database/seed.sql)

## Notes for RL Training

1. **Consistent State**: Every restart gives you the same initial state
2. **Realistic Data**: File names, sizes, and timestamps are realistic
3. **Rich Relationships**: Files are shared, commented on, and starred
4. **Activity History**: Recent actions are logged for context
5. **Multiple Users**: Test multi-user scenarios

## Performance

- Initial seed time: ~200ms
- Container startup: ~3-5 seconds
- Database size: ~130KB (metadata only)
- No actual file uploads in seed (saves space)
