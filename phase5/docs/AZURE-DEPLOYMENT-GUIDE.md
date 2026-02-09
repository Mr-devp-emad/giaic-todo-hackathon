# Azure Deployment Guide - Phase 5

Complete guide to deploy the Phase 5 Todo application to Azure Kubernetes Service (AKS).

## Prerequisites

- Azure account with free credits ($200 for 30 days)
- Azure CLI installed
- Docker Desktop
- kubectl configured
- Git Bash or PowerShell

## Overview

We'll deploy:
- **AKS Cluster** - Kubernetes hosting
- **Azure Container Registry (ACR)** - Docker images
- **Azure Database for PostgreSQL** - Database
- **Azure Key Vault** - Secrets management
- **Kafka on AKS** - Event streaming
- **Dapr on AKS** - Service integration

---

## Step 1: Azure Account Setup

### Create Azure Account

1. Go to https://azure.microsoft.com/free/
2. Click "Start free"
3. Sign up with Microsoft account
4. Add credit card (required but won't be charged)
5. Activate **$200 free credits** (valid 30 days)

### Install Azure CLI

**Windows (PowerShell):**
```powershell
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi
Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'
```

**Verify:**
```bash
az --version
```

### Login to Azure

```bash
az login
# Browser will open for authentication

# List subscriptions
az account list --output table

# Set subscription (if you have multiple)
az account set --subscription "<subscription-id>"
```

---

## Step 2: Create Azure Resources

### Set Variables

```bash
# Resource names (customize these)
RESOURCE_GROUP="todo-app-rg"
LOCATION="eastus"
ACR_NAME="todoappcr$(date +%s)"  # Must be globally unique
AKS_NAME="todo-app-aks"
DB_SERVER_NAME="todo-app-db-$(date +%s)"  # Must be globally unique
KEY_VAULT_NAME="todo-app-kv-$(date +%s)"  # Must be globally unique
DB_ADMIN_USER="todoadmin"
DB_ADMIN_PASSWORD="YourSecurePassword123!"  # Change this!
```

### Create Resource Group

```bash
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

---

## Step 3: Create Azure Container Registry (ACR)

```bash
# Create ACR
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true

# Get ACR credentials
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv)

echo "ACR Login Server: $ACR_LOGIN_SERVER"
echo "ACR Username: $ACR_USERNAME"
echo "ACR Password: $ACR_PASSWORD"

# Login to ACR
az acr login --name $ACR_NAME
```

---

## Step 4: Build and Push Docker Images

```bash
# Navigate to project root
cd e:/cloud_and_learning/giaic-hackathon-todo/phase5

# Build and push backend image
cd backend
docker build -t $ACR_LOGIN_SERVER/backend:latest .
docker push $ACR_LOGIN_SERVER/backend:latest

# Build and push frontend image
cd ../frontend
docker build -t $ACR_LOGIN_SERVER/frontend:latest .
docker push $ACR_LOGIN_SERVER/frontend:latest

cd ..

# Verify images
az acr repository list --name $ACR_NAME --output table
```

---

## Step 5: Create Azure Database for PostgreSQL

```bash
# Create PostgreSQL server
az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER_NAME \
  --location $LOCATION \
  --admin-user $DB_ADMIN_USER \
  --admin-password $DB_ADMIN_PASSWORD \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 14

# Create database
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $DB_SERVER_NAME \
  --database-name todoapp

# Allow Azure services to access
az postgres flexible-server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER_NAME \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Get connection string
DB_HOST=$(az postgres flexible-server show \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER_NAME \
  --query fullyQualifiedDomainName \
  --output tsv)

DATABASE_URL="postgresql://$DB_ADMIN_USER:$DB_ADMIN_PASSWORD@$DB_HOST:5432/todoapp?sslmode=require"
echo "Database URL: $DATABASE_URL"
```

---

## Step 6: Create Azure Key Vault

```bash
# Create Key Vault
az keyvault create \
  --name $KEY_VAULT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Store secrets
az keyvault secret set \
  --vault-name $KEY_VAULT_NAME \
  --name "database-url" \
  --value "$DATABASE_URL"

az keyvault secret set \
  --vault-name $KEY_VAULT_NAME \
  --name "acr-password" \
  --value "$ACR_PASSWORD"

# Store your OpenAI API key (get from https://platform.openai.com/api-keys)
read -p "Enter your OpenAI API key: " OPENAI_KEY
az keyvault secret set \
  --vault-name $KEY_VAULT_NAME \
  --name "openai-api-key" \
  --value "$OPENAI_KEY"

# Generate JWT secret
JWT_SECRET=$(openssl rand -hex 32)
az keyvault secret set \
  --vault-name $KEY_VAULT_NAME \
  --name "jwt-secret" \
  --value "$JWT_SECRET"
```

---

## Step 7: Create AKS Cluster

```bash
# Create AKS cluster (takes 5-10 minutes)
az aks create \
  --resource-group $RESOURCE_GROUP \
  --name $AKS_NAME \
  --node-count 2 \
  --node-vm-size Standard_B2s \
  --enable-managed-identity \
  --attach-acr $ACR_NAME \
  --generate-ssh-keys

# Get AKS credentials
az aks get-credentials \
  --resource-group $RESOURCE_GROUP \
  --name $AKS_NAME

# Verify connection
kubectl get nodes
```

---

## Step 8: Install Strimzi Operator (Kafka)

```bash
# Create kafka namespace
kubectl create namespace kafka

# Install Strimzi operator
kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka

# Wait for operator to be ready
kubectl wait --for=condition=ready pod -l name=strimzi-cluster-operator -n kafka --timeout=300s

# Deploy Kafka cluster
kubectl apply -f kubernetes/kafka/kafka-cluster.yaml

# Wait for Kafka (takes 3-5 minutes)
kubectl wait kafka/todo-kafka --for=condition=Ready --timeout=600s -n kafka

# Verify Kafka
kubectl get pods -n kafka
kubectl get kafkatopics -n kafka
```

---

## Step 9: Install Dapr on AKS

```bash
# Install Dapr CLI (if not already installed)
wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash

# Initialize Dapr on AKS
dapr init -k

# Wait for Dapr to be ready
kubectl wait --for=condition=ready pod -l app=dapr-operator -n dapr-system --timeout=300s

# Verify Dapr
dapr status -k
```

---

## Step 10: Create Kubernetes Secrets

```bash
# Create database secret
kubectl create secret generic postgres-secret \
  --from-literal=connectionString="$DATABASE_URL"

# Create ACR secret (for pulling images)
kubectl create secret docker-registry acr-secret \
  --docker-server=$ACR_LOGIN_SERVER \
  --docker-username=$ACR_USERNAME \
  --docker-password=$ACR_PASSWORD

# Create app secrets
kubectl create secret generic app-secrets \
  --from-literal=OPENAI_API_KEY="$OPENAI_KEY" \
  --from-literal=JWT_SECRET_KEY="$JWT_SECRET"
```

---

## Step 11: Update Kubernetes Manifests for Azure

Create `kubernetes/azure/kustomization.yaml`:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: default

resources:
- ../base
- ../processors

images:
- name: backend:latest
  newName: <ACR_LOGIN_SERVER>/backend
  newTag: latest
- name: frontend:latest
  newName: <ACR_LOGIN_SERVER>/frontend
  newTag: latest

patches:
- patch: |-
    - op: add
      path: /spec/template/spec/imagePullSecrets
      value:
      - name: acr-secret
  target:
    kind: Deployment
```

**Replace `<ACR_LOGIN_SERVER>` with your actual ACR login server.**

---

## Step 12: Deploy Dapr Components

```bash
# Deploy Dapr pub/sub component
kubectl apply -f kubernetes/dapr/pubsub-kafka.yaml

# Deploy Dapr state store component
kubectl apply -f kubernetes/dapr/statestore-postgres.yaml

# Verify components
kubectl get components
```

---

## Step 13: Deploy Application

```bash
# Deploy using kustomize
kubectl apply -k kubernetes/azure/

# Wait for all pods to be ready
kubectl wait --for=condition=ready pod --all --timeout=300s

# Check deployment status
kubectl get pods
kubectl get services
kubectl get deployments
```

---

## Step 14: Expose Application (Ingress)

### Option 1: LoadBalancer (Simple)

```bash
# Change frontend service to LoadBalancer
kubectl patch svc frontend -p '{"spec": {"type": "LoadBalancer"}}'

# Get external IP (takes 1-2 minutes)
kubectl get svc frontend --watch

# Access app at: http://<EXTERNAL-IP>:3000
```

### Option 2: Ingress Controller (Production)

```bash
# Install NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Wait for ingress controller
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

# Apply ingress
kubectl apply -f kubernetes/base/ingress.yaml

# Get ingress IP
kubectl get ingress
```

---

## Step 15: Verify Deployment

```bash
# Check all pods are running
kubectl get pods --all-namespaces

# Check Kafka
kubectl get pods -n kafka
kubectl get kafkatopics -n kafka

# Check Dapr
dapr status -k

# Check logs
kubectl logs -l app=backend -c backend --tail=50
kubectl logs -l app=recurring-processor -c recurring-processor --tail=50

# Test Kafka event flow
kubectl exec -it todo-kafka-kafka-0 -n kafka -- \
  bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic task-events \
  --from-beginning
```

---

## Step 16: Enable Azure Monitor (Optional)

```bash
# Enable Container Insights
az aks enable-addons \
  --resource-group $RESOURCE_GROUP \
  --name $AKS_NAME \
  --addons monitoring

# View in Azure Portal
# Navigate to: AKS Cluster → Insights
```

---

## Cost Monitoring

### Check Current Spending

```bash
# View cost analysis
az consumption usage list --output table

# Set up budget alert
az consumption budget create \
  --budget-name "monthly-budget" \
  --amount 50 \
  --time-grain Monthly \
  --start-date 2026-02-01 \
  --end-date 2026-12-31
```

### Estimated Monthly Costs

- **AKS**: ~$70/month (2 B2s nodes)
- **ACR**: ~$5/month (Basic tier)
- **PostgreSQL**: ~$12/month (Burstable B1ms)
- **Key Vault**: First 10,000 operations free
- **Total**: ~$87/month (after free credits)

---

## Cleanup (Delete All Resources)

```bash
# Delete resource group (deletes everything)
az group delete --name $RESOURCE_GROUP --yes --no-wait

# Or delete individually
az aks delete --resource-group $RESOURCE_GROUP --name $AKS_NAME --yes --no-wait
az acr delete --resource-group $RESOURCE_GROUP --name $ACR_NAME --yes
az postgres flexible-server delete --resource-group $RESOURCE_GROUP --name $DB_SERVER_NAME --yes
az keyvault delete --resource-group $RESOURCE_GROUP --name $KEY_VAULT_NAME
```

---

## Troubleshooting

### Pods not starting

```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### ACR authentication issues

```bash
# Verify ACR attachment
az aks check-acr --resource-group $RESOURCE_GROUP --name $AKS_NAME --acr $ACR_NAME
```

### Kafka not ready

```bash
kubectl logs -n kafka -l name=strimzi-cluster-operator
kubectl logs -n kafka todo-kafka-kafka-0
```

### Database connection issues

```bash
# Test connection from a pod
kubectl run -it --rm debug --image=postgres:14 --restart=Never -- \
  psql "$DATABASE_URL" -c "SELECT version();"
```

---

## Next Steps

1. ✅ Set up CI/CD pipeline (GitHub Actions)
2. ✅ Configure custom domain
3. ✅ Enable HTTPS with Let's Encrypt
4. ✅ Set up monitoring and alerts
5. ✅ Configure auto-scaling
6. ✅ Implement backup strategy

---

## Additional Resources

- [Azure AKS Documentation](https://docs.microsoft.com/en-us/azure/aks/)
- [Strimzi Kafka Documentation](https://strimzi.io/docs/)
- [Dapr on Kubernetes](https://docs.dapr.io/operations/hosting/kubernetes/)
- [Azure Secrets Guide](AZURE-SECRETS-GUIDE.md)
