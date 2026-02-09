# Kubernetes Services Specification

## Purpose
Expose the frontend and backend deployments within the cluster.

## Requirements

### Frontend Service
- Name: todo-frontend-service
- Type: ClusterIP
- Selector: app: todo-frontend
- Ports: 3000

### Backend Service
- Name: todo-backend-service
- Type: ClusterIP
- Selector: app: todo-backend
- Ports: 8000
