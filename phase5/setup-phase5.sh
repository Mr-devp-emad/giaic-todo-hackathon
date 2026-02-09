#!/bin/bash
# Phase 5 Quick Start Script (Bash version)
# This script sets up the local development environment for Phase 5

set -e  # Exit on error

echo "=== Phase 5 Local Setup ==="

# Check prerequisites
echo ""
echo "Checking prerequisites..."

# Check Minikube
if ! command -v minikube &> /dev/null; then
    echo "❌ Minikube not found. Please install: https://minikube.sigs.k8s.io/docs/start/"
    exit 1
fi

# Check kubectl
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl not found. Please install: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker Desktop"
    exit 1
fi

echo "✅ All prerequisites found"

# Start Minikube
echo ""
echo "Starting Minikube..."
minikube start --cpus=4 --memory=7168

# Install Strimzi operator
echo ""
echo "Installing Strimzi operator for Kafka..."
kubectl create namespace kafka --dry-run=client -o yaml | kubectl apply -f -
kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka

echo "Waiting for Strimzi operator to be ready..."
kubectl wait --for=condition=ready pod -l name=strimzi-cluster-operator -n kafka --timeout=300s

# Deploy Kafka
echo ""
echo "Deploying Kafka cluster..."
kubectl apply -f kubernetes/kafka/kafka-cluster.yaml

echo "Waiting for Kafka to be ready (this takes 2-5 minutes)..."
kubectl wait kafka/todo-kafka --for=condition=Ready --timeout=600s -n kafka

# Install Dapr
echo ""
echo "Installing Dapr..."
if ! command -v dapr &> /dev/null; then
    echo "Installing Dapr CLI..."
    wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash
fi

dapr init -k

echo "Waiting for Dapr to be ready..."
kubectl wait --for=condition=ready pod -l app=dapr-operator -n dapr-system --timeout=300s

# Create database secret
echo ""
echo "Creating database secret..."
read -p "Enter PostgreSQL connection string (or press Enter for default): " dbUrl
if [ -z "$dbUrl" ]; then
    dbUrl="postgresql://postgres:postgres@host.minikube.internal:5432/todoapp"
fi

kubectl create secret generic postgres-secret --from-literal=connectionString="$dbUrl" --dry-run=client -o yaml | kubectl apply -f -

# Deploy Dapr components
echo ""
echo "Deploying Dapr components..."
kubectl apply -f kubernetes/dapr/

# Build Docker images
echo ""
echo "Building Docker images..."
eval $(minikube docker-env)

echo "Building backend image..."
cd backend
docker build -t backend:latest .

echo "Building frontend image..."
cd ../frontend
docker build -t frontend:latest .
cd ..

# Deploy application
echo ""
echo "Deploying application services..."
kubectl apply -f kubernetes/base/
kubectl apply -f kubernetes/processors/

echo "Waiting for all pods to be ready..."
kubectl wait --for=condition=ready pod --all --timeout=300s

# Show status
echo ""
echo "=== Deployment Complete ==="
echo ""
echo "Pod Status:"
kubectl get pods

echo ""
echo "Kafka Topics:"
kubectl get kafkatopics -n kafka

echo ""
echo "Dapr Components:"
kubectl get components

echo ""
echo "=== Access Application ==="
echo "Run: kubectl port-forward svc/frontend 3000:3000"
echo "Then open: http://localhost:3000"

echo ""
echo "=== Useful Commands ==="
echo "View backend logs: kubectl logs -l app=backend -c backend --tail=50"
echo "View recurring processor logs: kubectl logs -l app=recurring-processor -c recurring-processor --tail=50"
echo "View Kafka messages: kubectl exec -it todo-kafka-kafka-0 -n kafka -- bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic task-events --from-beginning"
