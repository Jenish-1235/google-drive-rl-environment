# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Accept build arguments
ARG VITE_API_BASE_URL
ARG VITE_DUMMY_USER_EMAIL
ARG VITE_DUMMY_USER_PASSWORD

# Set environment variables from build arguments
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_DUMMY_USER_EMAIL=$VITE_DUMMY_USER_EMAIL
ENV VITE_DUMMY_USER_PASSWORD=$VITE_DUMMY_USER_PASSWORD

# Build the application (skip TypeScript checks for Docker build)
RUN npm run build:docker

# Production stage
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
