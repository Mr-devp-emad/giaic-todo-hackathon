# Deployment Guide - Todo Application (Phase 4)

This guide provides instructions on how to containerize and deploy the Todo application to a Kubernetes cluster.

## Prerequisites

Before you begin, ensure you have the following installed and running:

1.  **Docker Desktop**: Required for building images. [Download here](https://www.docker.com/products/docker-desktop/).
    *   **Enable Kubernetes**: Open Docker Desktop settings -> Kubernetes -> Check "Enable Kubernetes" -> Click "Apply & Restart".
2.  **kubectl**: The Kubernetes command-line tool. (Usually bundled with Docker Desktop).
3.  **Helm** (Optional): A package manager for Kubernetes. If not installed, the script will fall back to `kubectl apply -k`.

## Local Setup

### 1. Verification
Check if your cluster is running:
```bash
kubectl cluster-info
```
If you get a "connection refused" error, ensure Docker Desktop is running and Kubernetes is enabled.

### 2. Configuration
The application uses environment variables for both the frontend and backend.
*   **Backend Secrets**: Update `kubernetes/base/secrets.yaml` or `helm/todo-app-chart/values.yaml` with your actual API keys (Google API Key, Database URL, etc.).
*   **Host configuration**: The default ingress host is `todo.local`. Add this to your `hosts` file if you want to access it via browser:
    ```text
    127.0.0.1 todo.local
    ```

## Step 1: Automated Deployment

Run the provided workflow script at the root of the project:

```bash
./deployment-workflow.sh
```

### What the script does:
1.  **Builds Images**: Creates `todo-frontend:latest` and `todo-backend:latest`.
2.  **Checks Environment**: Verifies `docker` and `kubectl` connectivity.
3.  **Namespace**: Creates the `todo-app` namespace.
4.  **Deploys**: Uses `helm` if available, otherwise falls back to `kubectl kustomize`.

## Step 2: Manual Deployment (Alternative)

If you prefer to deploy manually using Kustomize:

```bash
kubectl apply -k ./kubernetes/base
```

## Troubleshooting

### Connection Refused
If you see `dial tcp 127.0.0.1:8080: connectex: No connection could be made...`, it means `kubectl` cannot find your cluster.
*   **Solution**: Ensure your Kubernetes cluster (e.g., Docker Desktop, Minikube, or Kind) is started.

### Registry & Image Loading
*   **Minikube**: If you are using Minikube with the `docker` driver, the cluster cannot see images built by your host's Docker. The `deployment-workflow.sh` script handles this by running `minikube image load`, but you can also do it manually:
    ```bash
    minikube image load docker.io/library/todo-frontend:latest
    minikube image load docker.io/library/todo-backend:latest
    ```
*   **Docker Desktop**: Local images built with `docker build` are usually available to the local cluster immediately.

### Pods Not Starting
Check the status of your pods:
```bash
kubectl get pods -n todo-app
kubectl logs <pod-name> -n todo-app
```
