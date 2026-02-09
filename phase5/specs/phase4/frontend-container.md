# Frontend Container Specification

## Purpose
Create a production-ready Docker container for the Next.js frontend application.

## Requirements

### Base Configuration
- Base image: node:20-alpine
- Build type: Multi-stage (builder + runner)
- Working directory: /app
- Exposed port: 3000

### Builder Stage
1. Use node:20-alpine as base
2. Copy package.json and package-lock.json
3. Run npm ci (clean install)
4. Copy all source files
5. Build Next.js app with standalone output mode
6. Build command: npm run build

### Runner Stage  
1. Use node:20-alpine as base
2. Set NODE_ENV=production
3. Copy built files from builder:
   - public/ folder
   - .next/standalone/
   - .next/static/
4. Run as non-root user (create user 'nextjs' with UID 1001)
5. Command: node server.js

### Optimization Requirements
- Final image size: < 150MB
- No development dependencies in final image
- Use .dockerignore to exclude node_modules, .git, etc.

### Health Check
- Endpoint: /api/health
- Should return 200 OK when healthy

## Acceptance Criteria
- [ ] Image builds without errors
- [ ] Image size is under 150MB
- [ ] Container starts and serves on port 3000
- [ ] Health endpoint returns 200
