#!/bin/sh
set -e

echo "🚀 Starting Google Drive Backend..."

# Check if SEED_ON_STARTUP is enabled (default: true for RL environment)
SEED_ON_STARTUP=${SEED_ON_STARTUP:-true}

if [ "$SEED_ON_STARTUP" = "true" ]; then
  echo "🌱 Seeding database with initial data..."
  node dist/scripts/seedDatabase.js || echo "⚠️  Seeding skipped (database might already be seeded)"
  echo "✅ Database ready"
fi

# Start the application
echo "🎯 Starting server..."
exec node dist/server.js
