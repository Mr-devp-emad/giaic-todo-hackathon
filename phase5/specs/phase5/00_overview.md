# Phase V: Advanced Cloud Deployment - Overview

## System Architecture

### High-Level Components

1. **Frontend (Next.js + ChatKit)**
   - User interface
   - Chat interactions
   - Real-time updates

2. **Backend (FastAPI + OpenAI Agents + MCP)**
   - AI agent coordination
   - MCP tools for task operations
   - Event publishing

3. **Event Bus (Kafka)**
   - Task events stream
   - Reminder notifications
   - Real-time synchronization

4. **Event Processors**
   - Recurring Task Service
   - Notification Service
   - Audit Log Service

5.  **Dapr Runtime**
    -   Pub/Sub abstraction
    -   State management
    -   Jobs API for scheduling
    -   Service-to-service communication

6.  **Database (Azure Database for PostgreSQL)**
    -   Task storage
    -   User data
    -   Event state
7.  **Image Registry (Azure Container Registry)**
    -   Container image hosting
    -   Secure distribution

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Cloud Platform | Azure (AKS) | Kubernetes hosting |
| Container Orchestration | Kubernetes 1.28+ | Pod management |
| Container Registry | Azure Container Registry (ACR) | Private image repository |
| Event Streaming | Kafka (Strimzi on K8s) | Event-driven messaging |
| Distributed Runtime | Dapr 1.12+ | Service integration |
| CI/CD | GitHub Actions | Automated deployment |
| Monitoring | Azure Monitor + Prometheus | Observability |
| Secrets | Azure Key Vault | Secure credential storage |

### Key Architectural Decisions

**Why Kafka?**
- Decoupled event-driven architecture
- Durable message storage
- Multiple consumers can process events
- Foundation for recurring tasks and reminders

**Why Dapr?**
- Abstracts infrastructure (Kafka, state stores)
- Simple HTTP/gRPC APIs
- Portable across clouds
- Built-in retry, circuit breaker

**Why Azure?**
- $200 free credit for 30 days
- Excellent Kubernetes integration (AKS)
- Strong enterprise tooling and ecosystem
- Comprehensive monitoring and security services

## Feature Additions

### Intermediate Features
1. Priorities (High/Medium/Low)
2. Tags/Categories (Work/Personal/etc)
3. Search by keyword
4. Filter by status, priority, category
5. Sort by date, priority, title

### Advanced Features
1. Recurring tasks (daily, weekly, monthly)
2. Due dates with date/time
3. Reminders via event system
4. Browser notifications

## Deployment Strategy

**Local → Cloud Pipeline:**

1.  Develop and test on Minikube
2.  Deploy Kafka + Dapr locally
3.  Validate event flows
4.  Build and push images to Azure Container Registry (ACR)
5.  Create AKS cluster on Azure
6.  Deploy with Helm + CI/CD
7.  Monitor and optimize

## Success Criteria

- [ ] All intermediate features working
- [ ] All advanced features working
- [ ] Kafka processing events
- [ ] Dapr components configured
- [ ] Deployed on Azure AKS
- [ ] CI/CD pipeline functional
- [ ] Application scalable and resilient