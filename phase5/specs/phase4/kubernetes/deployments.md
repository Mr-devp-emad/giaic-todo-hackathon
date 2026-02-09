# Kubernetes Deployments Specification

## Purpose
Define the desired state for the frontend and backend pods.

## Requirements

### Frontend Deployment
- Name: todo-frontend
- Replicas: 2
- Selector: app: todo-frontend
- Container:
  - Name: frontend
  - Image: todo-frontend:latest
  - Ports: 3000
  - EnvFrom: ConfigMapRef (frontend-config)

### Backend Deployment
- Name: todo-backend
- Replicas: 2
- Selector: app: todo-backend
- Container:
  - Name: backend
  - Image: todo-backend:latest
  - Ports: 8000
  - EnvFrom: 
    - ConfigMapRef (backend-config)
    - SecretRef (backend-secrets)
