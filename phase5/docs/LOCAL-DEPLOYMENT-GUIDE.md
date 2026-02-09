# Phase 5 Local Deployment Guide (Minikube)

This guide walks you through deploying Phase 5 locally on Minikube with Kafka and Dapr.

## Prerequisites

1. **Minikube** installed and running
   ```powershell
   minikube start --cpus=4 --memory=8192
   ```

2. **kubectl** configured for Minikube
   ```powershell
   kubectl config use-context minikube
   ```

3. **Dapr CLI** installed
   ```powershell
   # Install Dapr CLI
   powershell -Command "iwr -useb https://raw.githubusercontent.com/dapr/cli/master/install/install.ps1 | iex"
   ```

4. **Docker** running (for building images)

## Step 1: Install Strimzi Operator for Kafka

```powershell
# Create kafka namespace
kubectl create namespace kafka

# Install Strimzi operator
kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka

# Wait for operator to be ready
kubectl wait --for=condition=ready pod -l name=strimzi-cluster-operator -n kafka --timeout=300s
```

## Step 2: Deploy Kafka Cluster

```powershell
# Deploy Kafka cluster and topics
kubectl apply -f kubernetes/kafka/kafka-cluster.yaml

# Wait for Kafka to be ready (this takes 2-3 minutes)
kubectl wait kafka/todo-kafka --for=condition=Ready --timeout=300s -n kafka

# Verify Kafka is running
kubectl get pods -n kafka
# Should see: todo-kafka-kafka-0, todo-kafka-zookeeper-0, todo-kafka-entity-operator-*
```

## Step 3: Install Dapr on Kubernetes

```powershell
# Initialize Dapr on Kubernetes
dapr init -k

# Wait for Dapr to be ready
kubectl wait --for=condition=ready pod -l app=dapr-operator -n dapr-system --timeout=300s

# Verify Dapr installation
dapr status -k
# Should show: dapr-operator, dapr-sidecar-injector, dapr-sentry, dapr-placement-server
```

## Step 4: Create Database Secret

```powershell
# Create PostgreSQL connection string secret
kubectl create secret generic postgres-secret `
  --from-literal=connectionString="postgresql://postgres:postgres@host.minikube.internal:5432/todoapp"

# Note: Adjust the connection string to match your local PostgreSQL setup
# If running PostgreSQL in Docker: host.docker.internal
# If running on host machine: host.minikube.internal
```

## Step 5: Deploy Dapr Components

```powershell
# Deploy Dapr pub/sub component for Kafka
kubectl apply -f kubernetes/dapr/pubsub-kafka.yaml

# Deploy Dapr state store component for PostgreSQL
kubectl apply -f kubernetes/dapr/statestore-postgres.yaml

# Verify components
kubectl get components
```

## Step 6: Build and Load Docker Images

```powershell
# Set Minikube Docker environment
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Build backend image (includes processors)
cd backend
docker build -t backend:latest .

# Build frontend image
cd ../frontend
docker build -t frontend:latest .

cd ..
```

## Step 7: Deploy Application Services

```powershell
# Deploy backend with Dapr sidecar
kubectl apply -f kubernetes/base/deployments.yaml
kubectl apply -f kubernetes/base/services.yaml

# Deploy event processors
kubectl apply -f kubernetes/processors/recurring-processor.yaml
kubectl apply -f kubernetes/processors/notification-processor.yaml
kubectl apply -f kubernetes/processors/audit-processor.yaml

# Deploy frontend
# (frontend deployment should already be in base/deployments.yaml)

# Wait for all pods to be ready
kubectl wait --for=condition=ready pod --all --timeout=300s
```

## Step 8: Verify Deployment

```powershell
# Check all pods are running
kubectl get pods

# Expected pods:
# - backend-*
# - frontend-*
# - recurring-processor-*
# - notification-processor-*
# - audit-processor-*

# Check Dapr sidecars are injected
kubectl get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[*].name}{"\n"}{end}'
# Should see 'daprd' container alongside your app containers

# Check logs
kubectl logs -l app=backend -c backend
kubectl logs -l app=recurring-processor -c recurring-processor
```

## Step 9: Access the Application

```powershell
# Option 1: Port forward to frontend
kubectl port-forward svc/frontend 3000:3000

# Option 2: Use Minikube tunnel (requires admin)
minikube tunnel

# Option 3: Get Minikube IP and NodePort
minikube service frontend --url
```

Open browser to `http://localhost:3000`

## Step 10: Test Event Flow

### Test Recurring Tasks

1. Create a task with:
   - Title: "Daily standup"
   - Recurrence: "daily"
   - Due date: Tomorrow

2. Mark the task as complete

3. Check that a new instance is created:
   ```powershell
   kubectl logs -l app=recurring-processor -c recurring-processor --tail=50
   ```

### Test Kafka Messages

```powershell
# Exec into Kafka pod
kubectl exec -it todo-kafka-kafka-0 -n kafka -- /bin/bash

# Inside the pod, consume messages from task-events topic
bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic task-events \
  --from-beginning

# In another terminal, create/update tasks via the UI
# You should see events appearing in the consumer
```

### Test Audit Logs

```powershell
# Check audit processor logs
kubectl logs -l app=audit-processor -c audit-processor --tail=50

# Connect to database and check audit_logs table
# (requires psql or database client)
```

## Troubleshooting

### Kafka not starting

```powershell
# Check Strimzi operator logs
kubectl logs -n kafka -l name=strimzi-cluster-operator

# Check Kafka pod logs
kubectl logs -n kafka todo-kafka-kafka-0
```

### Dapr sidecar not injected

```powershell
# Check if Dapr sidecar injector is running
kubectl get pods -n dapr-system

# Verify deployment has Dapr annotations
kubectl get deployment backend -o yaml | grep dapr.io
```

### Event publishing fails

```powershell
# Check backend logs for Dapr connection errors
kubectl logs -l app=backend -c backend | grep -i dapr

# Check Dapr sidecar logs
kubectl logs -l app=backend -c daprd

# Verify Kafka component is loaded
kubectl logs -l app=backend -c daprd | grep kafka-pubsub
```

### Database connection issues

```powershell
# Verify secret exists
kubectl get secret postgres-secret

# Check connection string
kubectl get secret postgres-secret -o jsonpath='{.data.connectionString}' | base64 -d

# Test connection from a pod
kubectl run -it --rm debug --image=postgres:14 --restart=Never -- psql "postgresql://..."
```

## Cleanup

```powershell
# Delete all application resources
kubectl delete -f kubernetes/processors/
kubectl delete -f kubernetes/base/

# Delete Dapr components
kubectl delete -f kubernetes/dapr/

# Delete Kafka
kubectl delete -f kubernetes/kafka/kafka-cluster.yaml

# Uninstall Dapr
dapr uninstall -k

# Uninstall Strimzi
kubectl delete -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka
kubectl delete namespace kafka

# Stop Minikube
minikube stop
```

## Next Steps

Once everything is working locally:

1. ✅ Test all features thoroughly
2. ✅ Verify event flow end-to-end
3. ✅ Check performance and resource usage
4. ✅ Proceed to Azure deployment (see AZURE-DEPLOYMENT-GUIDE.md)
