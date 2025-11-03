# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Copy database schema files
COPY database ./database

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy database schema files
COPY --from=builder /app/database ./database

# Create directories for uploads and database
RUN mkdir -p uploads data

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "dist/server.js"]
