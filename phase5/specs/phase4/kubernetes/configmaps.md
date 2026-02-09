# Kubernetes ConfigMaps Specification

## Purpose
Manage non-sensitive configuration for the frontend and backend.

## Requirements

### Frontend ConfigMap
- Name: frontend-config
- Data:
  - NEXT_PUBLIC_BACKEND_URL: http://todo-backend-service:8000
  - NEXT_PUBLIC_APP_URL: http://todo.local

### Backend ConfigMap
- Name: backend-config
- Data:
  - NEXT_PUBLIC_APP_URL: http://todo.local
