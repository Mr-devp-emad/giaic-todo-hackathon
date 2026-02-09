# Azure & Cloud Secrets Management Guide

## Overview

This guide explains how to obtain and manage secrets, API keys, and credentials for Azure and other cloud services needed for Phase 5 deployment.

---

## Table of Contents

1. [Azure Account Setup](#azure-account-setup)
2. [Azure Container Registry (ACR)](#azure-container-registry-acr)
3. [Azure Kubernetes Service (AKS)](#azure-kubernetes-service-aks)
4. [Azure Database for PostgreSQL](#azure-database-for-postgresql)
5. [Azure Key Vault](#azure-key-vault)
6. [GitHub Secrets for CI/CD](#github-secrets-for-cicd)
7. [OpenAI API Keys](#openai-api-keys)
8. [Other Third-Party Services](#other-third-party-services)

---

## Azure Account Setup

### Step 1: Create Azure Account

1. **Visit Azure Portal:**
   - Go to [https://azure.microsoft.com/free/](https://azure.microsoft.com/free/)
   - Click "Start free"

2. **Sign up:**
   - Use your Microsoft account or create a new one
   - Provide phone number for verification
   - Add credit card (required but won't be charged during free trial)

3. **Activate Free Credits:**
   - You'll receive **$200 USD credit** valid for **30 days**
   - Plus 12 months of free services
   - Plus always-free services

### Step 2: Install Azure CLI

**Windows (PowerShell):**
```powershell
# Download and run installer
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi
Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'
```

**Verify installation:**
```bash
az --version
```

### Step 3: Login to Azure

```bash
# Login via browser
az login

# Set your subscription (if you have multiple)
az account list --output table
az account set --subscription "<subscription-id>"
```

---

## Azure Container Registry (ACR)

Azure Container Registry stores your Docker images privately.

### Create ACR

```bash
# Set variables
RESOURCE_GROUP="todo-app-rg"
ACR_NAME="todoappcr"  # Must be globally unique, lowercase, alphanumeric only
LOCATION="eastus"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create ACR (Basic tier for development)
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true
```

### Get ACR Credentials

**Method 1: Admin Credentials (Simple, for development)**

```bash
# Get login server
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
echo "ACR Login Server: $ACR_LOGIN_SERVER"

# Get admin username
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username --output tsv)
echo "ACR Username: $ACR_USERNAME"

# Get admin password
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv)
echo "ACR Password: $ACR_PASSWORD"
```

**Save these values:**
- `ACR_LOGIN_SERVER`: e.g., `todoappcr.azurecr.io`
- `ACR_USERNAME`: e.g., `todoappcr`
- `ACR_PASSWORD`: Long alphanumeric string

**Method 2: Service Principal (Production, more secure)**

```bash
# Create service principal with ACR push/pull permissions
SP_NAME="acr-service-principal"
ACR_REGISTRY_ID=$(az acr show --name $ACR_NAME --query id --output tsv)

SP_CREDENTIALS=$(az ad sp create-for-rbac \
  --name $SP_NAME \
  --scopes $ACR_REGISTRY_ID \
  --role acrpull \
  --query "{clientId:appId, clientSecret:password}" \
  --output json)

echo $SP_CREDENTIALS
```

### Login to ACR

```bash
# Login using Azure CLI
az acr login --name $ACR_NAME

# Or login using Docker directly
docker login $ACR_LOGIN_SERVER -u $ACR_USERNAME -p $ACR_PASSWORD
```

### Push Images to ACR

```bash
# Tag your images
docker tag frontend:latest $ACR_LOGIN_SERVER/frontend:latest
docker tag backend:latest $ACR_LOGIN_SERVER/backend:latest

# Push to ACR
docker push $ACR_LOGIN_SERVER/frontend:latest
docker push $ACR_LOGIN_SERVER/backend:latest
```

---

## Azure Kubernetes Service (AKS)

### Create AKS Cluster

```bash
AKS_NAME="todo-app-aks"

# Create AKS cluster (this takes 5-10 minutes)
az aks create \
  --resource-group $RESOURCE_GROUP \
  --name $AKS_NAME \
  --node-count 2 \
  --node-vm-size Standard_B2s \
  --enable-managed-identity \
  --attach-acr $ACR_NAME \
  --generate-ssh-keys

# Get AKS credentials for kubectl
az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME
```

### Get AKS Credentials

**Kubeconfig (for kubectl):**

```bash
# This automatically updates ~/.kube/config
az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME

# Verify connection
kubectl get nodes
```

**Service Principal for CI/CD:**

```bash
# Create service principal for AKS deployment
AKS_ID=$(az aks show --resource-group $RESOURCE_GROUP --name $AKS_NAME --query id --output tsv)

AKS_SP=$(az ad sp create-for-rbac \
  --name "aks-deploy-sp" \
  --scopes $AKS_ID \
  --role "Azure Kubernetes Service Cluster User Role" \
  --query "{clientId:appId, clientSecret:password, tenantId:tenant}" \
  --output json)

echo $AKS_SP
```

**Save these values:**
- `clientId`: Application (client) ID
- `clientSecret`: Client secret value
- `tenantId`: Directory (tenant) ID
- `subscriptionId`: Get with `az account show --query id --output tsv`

---

## Azure Database for PostgreSQL

### Create PostgreSQL Database

```bash
DB_SERVER_NAME="todo-app-db"  # Must be globally unique
DB_ADMIN_USER="todoadmin"
DB_ADMIN_PASSWORD="YourSecurePassword123!"  # Change this!

# Create PostgreSQL server (Flexible Server)
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
```

### Get Database Connection String

```bash
# Get server FQDN
DB_HOST=$(az postgres flexible-server show \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER_NAME \
  --query fullyQualifiedDomainName \
  --output tsv)

echo "Database Host: $DB_HOST"

# Construct connection string
DATABASE_URL="postgresql://$DB_ADMIN_USER:$DB_ADMIN_PASSWORD@$DB_HOST:5432/todoapp?sslmode=require"
echo "Database URL: $DATABASE_URL"
```

**Save this value:**
- `DATABASE_URL`: Full PostgreSQL connection string

---

## Azure Key Vault

Azure Key Vault securely stores secrets, keys, and certificates.

### Create Key Vault

```bash
KEY_VAULT_NAME="todo-app-kv"  # Must be globally unique

# Create Key Vault
az keyvault create \
  --name $KEY_VAULT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Grant yourself access
USER_OBJECT_ID=$(az ad signed-in-user show --query id --output tsv)
az keyvault set-policy \
  --name $KEY_VAULT_NAME \
  --object-id $USER_OBJECT_ID \
  --secret-permissions get list set delete
```

### Store Secrets in Key Vault

```bash
# Store database URL
az keyvault secret set \
  --vault-name $KEY_VAULT_NAME \
  --name "database-url" \
  --value "$DATABASE_URL"

# Store ACR password
az keyvault secret set \
  --vault-name $KEY_VAULT_NAME \
  --name "acr-password" \
  --value "$ACR_PASSWORD"

# Store OpenAI API key (get from OpenAI dashboard)
az keyvault secret set \
  --vault-name $KEY_VAULT_NAME \
  --name "openai-api-key" \
  --value "sk-..."
```

### Retrieve Secrets from Key Vault

```bash
# Get a secret
az keyvault secret show \
  --vault-name $KEY_VAULT_NAME \
  --name "database-url" \
  --query value \
  --output tsv

# List all secrets
az keyvault secret list --vault-name $KEY_VAULT_NAME --output table
```

### Use Key Vault in AKS (CSI Driver)

```bash
# Enable Key Vault CSI driver on AKS
az aks enable-addons \
  --resource-group $RESOURCE_GROUP \
  --name $AKS_NAME \
  --addons azure-keyvault-secrets-provider

# Get AKS managed identity
AKS_IDENTITY=$(az aks show \
  --resource-group $RESOURCE_GROUP \
  --name $AKS_NAME \
  --query addonProfiles.azureKeyvaultSecretsProvider.identity.clientId \
  --output tsv)

# Grant AKS access to Key Vault
az keyvault set-policy \
  --name $KEY_VAULT_NAME \
  --object-id $AKS_IDENTITY \
  --secret-permissions get list
```

---

## GitHub Secrets for CI/CD

GitHub Secrets store sensitive values for GitHub Actions workflows.

### Required GitHub Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

**Azure Credentials:**

1. **`AZURE_CREDENTIALS`** (for Azure login)
   ```bash
   # Create service principal for GitHub Actions
   GITHUB_SP=$(az ad sp create-for-rbac \
     --name "github-actions-sp" \
     --role contributor \
     --scopes /subscriptions/$(az account show --query id --output tsv) \
     --sdk-auth)
   
   echo $GITHUB_SP
   ```
   Copy the entire JSON output and paste as secret value.

2. **`ACR_LOGIN_SERVER`**
   - Value: `todoappcr.azurecr.io` (your ACR login server)

3. **`ACR_USERNAME`**
   - Value: Your ACR username

4. **`ACR_PASSWORD`**
   - Value: Your ACR password

5. **`AKS_RESOURCE_GROUP`**
   - Value: `todo-app-rg`

6. **`AKS_CLUSTER_NAME`**
   - Value: `todo-app-aks`

**Application Secrets:**

7. **`DATABASE_URL`**
   - Value: Your PostgreSQL connection string

8. **`OPENAI_API_KEY`**
   - Value: Your OpenAI API key (see below)

9. **`JWT_SECRET_KEY`**
   - Generate a random secret:
   ```bash
   openssl rand -hex 32
   ```

### Add Secrets to GitHub

**Via GitHub UI:**
1. Go to repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Enter name and value
4. Click "Add secret"

**Via GitHub CLI:**
```bash
# Install GitHub CLI: https://cli.github.com/

# Login
gh auth login

# Add secrets
gh secret set AZURE_CREDENTIALS < azure-credentials.json
gh secret set ACR_LOGIN_SERVER --body "todoappcr.azurecr.io"
gh secret set ACR_USERNAME --body "$ACR_USERNAME"
gh secret set ACR_PASSWORD --body "$ACR_PASSWORD"
```

---

## OpenAI API Keys

### Get OpenAI API Key

1. **Create OpenAI Account:**
   - Go to [https://platform.openai.com/signup](https://platform.openai.com/signup)
   - Sign up with email or Google/Microsoft account

2. **Add Payment Method:**
   - Go to Settings → Billing
   - Add credit card (required for API access)
   - Add credits (minimum $5)

3. **Create API Key:**
   - Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Give it a name (e.g., "Todo App Production")
   - Copy the key (starts with `sk-...`)
   - **Save it immediately** - you won't be able to see it again!

4. **Set Usage Limits (Recommended):**
   - Go to Settings → Limits
   - Set monthly budget limit (e.g., $10)
   - Set email alerts

### Store OpenAI Key

**In Azure Key Vault:**
```bash
az keyvault secret set \
  --vault-name $KEY_VAULT_NAME \
  --name "openai-api-key" \
  --value "sk-..."
```

**In GitHub Secrets:**
```bash
gh secret set OPENAI_API_KEY --body "sk-..."
```

**In Local .env File:**
```bash
# backend/.env
OPENAI_API_KEY=sk-...
```

---

## Other Third-Party Services

### Better Auth (OAuth Providers)

If using social login (Google, GitHub, etc.):

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret

**Store in environment:**
```bash
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

#### GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Set Authorization callback URL:
   - `http://localhost:3000/api/auth/callback/github` (local)
   - `https://yourdomain.com/api/auth/callback/github` (production)
4. Copy Client ID and generate Client Secret

**Store in environment:**
```bash
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

---

## Environment Variables Summary

### Backend (.env)

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Authentication
JWT_SECRET_KEY=your-random-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI
OPENAI_API_KEY=sk-...

# OAuth (if using)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Dapr
DAPR_HTTP_PORT=3500
DAPR_GRPC_PORT=50001
```

### Frontend (.env.local)

```bash
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth
BETTER_AUTH_SECRET=your-random-secret
BETTER_AUTH_URL=http://localhost:3000

# OAuth (if using)
GOOGLE_CLIENT_ID=...
GITHUB_CLIENT_ID=...
```

---

## Security Best Practices

### ✅ DO:

1. **Use Azure Key Vault** for production secrets
2. **Rotate secrets regularly** (every 90 days)
3. **Use service principals** instead of admin credentials
4. **Enable Azure RBAC** for fine-grained access control
5. **Use managed identities** for AKS to access other Azure services
6. **Set up monitoring** for secret access (Azure Monitor)
7. **Use different secrets** for dev/staging/production

### ❌ DON'T:

1. **Never commit secrets** to Git (use .gitignore)
2. **Never hardcode secrets** in source code
3. **Never share secrets** via email or chat
4. **Never use admin credentials** in production
5. **Never store secrets** in container images
6. **Never log secrets** (even in debug mode)

---

## Quick Reference Commands

### Get All Azure Credentials at Once

```bash
#!/bin/bash
# save as get-azure-secrets.sh

RESOURCE_GROUP="todo-app-rg"
ACR_NAME="todoappcr"
AKS_NAME="todo-app-aks"
DB_SERVER_NAME="todo-app-db"
KEY_VAULT_NAME="todo-app-kv"

echo "=== Azure Container Registry ==="
az acr credential show --name $ACR_NAME --output table

echo -e "\n=== AKS Kubeconfig ==="
az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME

echo -e "\n=== Database Connection ==="
az postgres flexible-server show --resource-group $RESOURCE_GROUP --name $DB_SERVER_NAME --query fullyQualifiedDomainName

echo -e "\n=== Key Vault Secrets ==="
az keyvault secret list --vault-name $KEY_VAULT_NAME --output table

echo -e "\n=== Subscription ID ==="
az account show --query id --output tsv
```

### Verify All Services

```bash
# Check ACR
az acr repository list --name $ACR_NAME --output table

# Check AKS
kubectl get nodes

# Check Database
psql $DATABASE_URL -c "SELECT version();"

# Check Key Vault
az keyvault secret list --vault-name $KEY_VAULT_NAME --output table
```

---

## Troubleshooting

### Issue: "az: command not found"
**Solution:** Install Azure CLI (see [Azure Account Setup](#step-2-install-azure-cli))

### Issue: "ACR name already exists"
**Solution:** ACR names must be globally unique. Try a different name with your initials or random numbers.

### Issue: "Insufficient quota"
**Solution:** Azure free tier has limits. Check your quota:
```bash
az vm list-usage --location eastus --output table
```

### Issue: "Cannot connect to database"
**Solution:** Check firewall rules:
```bash
az postgres flexible-server firewall-rule list \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER_NAME
```

### Issue: "Key Vault access denied"
**Solution:** Grant yourself permissions:
```bash
az keyvault set-policy \
  --name $KEY_VAULT_NAME \
  --object-id $(az ad signed-in-user show --query id --output tsv) \
  --secret-permissions get list set delete
```

---

## Cost Monitoring

### Check Current Spending

```bash
# View cost analysis
az consumption usage list --output table

# Set up budget alerts
az consumption budget create \
  --budget-name "monthly-budget" \
  --amount 50 \
  --time-grain Monthly \
  --start-date 2026-02-01 \
  --end-date 2026-12-31
```

### Free Tier Limits

- **AKS:** First cluster free (pay for VMs)
- **ACR:** Basic tier ~$5/month
- **PostgreSQL:** Burstable tier ~$12/month
- **Key Vault:** First 10,000 operations free

**Total estimated cost:** ~$20-30/month after free credits expire

---

## Next Steps

1. ✅ Create Azure account and activate free credits
2. ✅ Install Azure CLI and login
3. ✅ Create ACR and get credentials
4. ✅ Create AKS cluster
5. ✅ Create PostgreSQL database
6. ✅ Create Key Vault and store secrets
7. ✅ Add secrets to GitHub repository
8. ✅ Get OpenAI API key
9. ✅ Configure OAuth providers (if needed)
10. ✅ Test connection to all services

**You're now ready to deploy Phase 5 to Azure! 🚀**
