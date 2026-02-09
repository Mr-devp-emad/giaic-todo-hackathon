#!/bin/bash

# Configuration
FRONTEND_IMAGE="todo-frontend"
BACKEND_IMAGE="todo-backend"
CHART_PATH="./helm/todo-app-chart"
KUSTOMIZE_PATH="./kubernetes/base"
NAMESPACE="todo-app"

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

echo "--- Environment Check ---"
if ! command_exists docker; then
  echo "Error: docker is not installed."
  exit 1
fi

if ! command_exists kubectl; then
  echo "Error: kubectl is not installed."
  exit 1
fi

if ! kubectl cluster-info >/dev/null 2>&1; then
  echo "Error: Kubernetes cluster is not reachable. Ensure minikube is started."
  exit 1
fi

echo "Step 1: Building Frontend Image..."
docker build -t $FRONTEND_IMAGE:latest ./frontend
if command_exists minikube; then
  echo "Loading Frontend image into minikube..."
  minikube image load $FRONTEND_IMAGE:latest
fi

echo "Step 2: Building Backend Image..."
docker build -t $BACKEND_IMAGE:latest ./backend
if command_exists minikube; then
  echo "Loading Backend image into minikube..."
  minikube image load $BACKEND_IMAGE:latest
fi

echo "Step 3: Creating Namespace..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

echo "Step 4: Deploying..."
if command_exists helm; then
  helm upgrade --install todo-app $CHART_PATH --namespace $NAMESPACE
else
  kubectl apply -k $KUSTOMIZE_PATH --namespace $NAMESPACE --validate=false
fi

echo "Deployment completed!"
