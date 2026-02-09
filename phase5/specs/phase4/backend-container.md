# Backend Container Specification

## Purpose
Create a production-ready Docker container for the FastAPI backend application.

## Requirements

### Base Configuration
- Base image: python:3.11-slim
- Working directory: /app
- Exposed port: 8000

### Build Steps
1. Use python:3.11-slim as base
2. Install system dependencies if needed
3. Copy requirements.txt
4. Install dependencies using pip
5. Copy all source files
6. Run as non-root user

### Command
- uvicorn main:app --host 0.0.0.0 --port 8000

### Optimization Requirements
- Minimize image size by cleaning up pip cache
- Use .dockerignore to exclude unnecessary files

### Health Check
- Endpoint: /health
- Should return {"status": "ok"}

## Acceptance Criteria
- [ ] Image builds without errors
- [ ] Container starts and serves on port 8000
- [ ] Health endpoint returns 200
