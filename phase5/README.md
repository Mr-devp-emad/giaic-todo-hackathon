# Phase 5 Implementation - README

## Overview

Phase 5 adds advanced features to the Todo application with an event-driven architecture:

- ✅ **Recurring Tasks** - Daily, weekly, monthly task repetition
- ✅ **Event-Driven Architecture** - Kafka + Dapr for scalable event processing
- ✅ **Event Processors** - Separate services for recurring tasks, notifications, and audit logs
- ✅ **Cloud-Ready** - Designed for Azure AKS deployment

## What's Been Implemented

### Backend
- Recurring task fields in database models
- Event publisher service using Dapr pub/sub
- Recurring task service with automatic instance creation
- Three event processor services (recurring, notification, audit)
- Updated task routes with event publishing

### Infrastructure
- Kafka cluster configuration (Strimzi)
- Dapr components (pub/sub, state store)
- Kubernetes deployments for all services
- Dapr sidecar integration

### Frontend
- RecurringTaskForm component
- TypeScript type definitions
- Ready for integration into task UI

## Quick Start

### Prerequisites
- Minikube
- kubectl
- Docker
- Dapr CLI (will be installed by script if missing)

### Automated Setup

```powershell
# Run the setup script
.\setup-phase5.ps1
```

This script will:
1. ✅ Check prerequisites
2. ✅ Start Minikube
3. ✅ Install Strimzi operator
4. ✅ Deploy Kafka cluster
5. ✅ Install Dapr
6. ✅ Create database secret
7. ✅ Deploy Dapr components
8. ✅ Build Docker images
9. ✅ Deploy all services

### Manual Setup

See [LOCAL-DEPLOYMENT-GUIDE.md](docs/LOCAL-DEPLOYMENT-GUIDE.md) for detailed step-by-step instructions.

## Testing Recurring Tasks

1. **Create a recurring task:**
   ```bash
   curl -X POST http://localhost:8000/api/tasks \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Daily standup",
       "is_recurring": true,
       "recurrence_pattern": "daily",
       "due_date": "2026-02-10T09:00:00Z"
     }'
   ```

2. **Mark it as complete:**
   ```bash
   curl -X PATCH http://localhost:8000/api/tasks/1 \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"completed": true}'
   ```

3. **Verify new instance was created:**
   ```bash
   curl http://localhost:8000/api/tasks \
     -H "Authorization: Bearer <token>"
   ```

## Monitoring Event Flow

### View Kafka Messages

```powershell
kubectl exec -it todo-kafka-kafka-0 -n kafka -- `
  bin/kafka-console-consumer.sh `
  --bootstrap-server localhost:9092 `
  --topic task-events `
  --from-beginning
```

### View Processor Logs

```powershell
# Recurring processor
kubectl logs -l app=recurring-processor -c recurring-processor --tail=50 -f

# Notification processor
kubectl logs -l app=notification-processor -c notification-processor --tail=50 -f

# Audit processor
kubectl logs -l app=audit-processor -c audit-processor --tail=50 -f
```

### View Audit Logs in Database

```sql
-- Connect to PostgreSQL
psql "postgresql://postgres:postgres@localhost:5432/todoapp"

-- Query audit logs
SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 10;
```

## Architecture

```
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐
│   Backend   │────▶│ Dapr Sidecar │
└─────────────┘     └──────┬───────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    Kafka    │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌──────────────┐  ┌─────────────┐
│  Recurring    │  │ Notification │  │    Audit    │
│  Processor    │  │  Processor   │  │  Processor  │
└───────────────┘  └──────────────┘  └─────────────┘
```

## Documentation

- [Implementation Plan](../../.gemini/antigravity/brain/15b54e05-90c5-45d8-8ab7-222646903fd4/implementation_plan.md)
- [Task Breakdown](../../.gemini/antigravity/brain/15b54e05-90c5-45d8-8ab7-222646903fd4/task.md)
- [Walkthrough](../../.gemini/antigravity/brain/15b54e05-90c5-45d8-8ab7-222646903fd4/walkthrough.md)
- [Local Deployment Guide](docs/LOCAL-DEPLOYMENT-GUIDE.md)
- [Azure Secrets Guide](docs/AZURE-SECRETS-GUIDE.md)

## Next Steps

### Immediate
- [ ] Integrate RecurringTaskForm into task creation UI
- [ ] Add browser notification support
- [ ] Implement search/filter/sort UI

### Azure Deployment
- [ ] Create Azure account and activate free credits
- [ ] Set up ACR and push images
- [ ] Create AKS cluster
- [ ] Deploy to Azure
- [ ] Set up CI/CD pipeline

### Enhancements
- [ ] WebSocket for real-time notifications
- [ ] Email reminders
- [ ] Advanced recurrence patterns
- [ ] Recurring task templates

## Troubleshooting

### Kafka not starting
```powershell
kubectl logs -n kafka -l name=strimzi-cluster-operator
kubectl logs -n kafka todo-kafka-kafka-0
```

### Dapr sidecar not injected
```powershell
kubectl get pods -n dapr-system
kubectl get deployment backend -o yaml | grep dapr.io
```

### Event publishing fails
```powershell
kubectl logs -l app=backend -c backend | grep -i dapr
kubectl logs -l app=backend -c daprd
```

## Cleanup

```powershell
# Delete all resources
kubectl delete -f kubernetes/processors/
kubectl delete -f kubernetes/base/
kubectl delete -f kubernetes/dapr/
kubectl delete -f kubernetes/kafka/kafka-cluster.yaml
dapr uninstall -k
kubectl delete -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka
kubectl delete namespace kafka
minikube stop
```

## Support

For issues or questions:
1. Check the [LOCAL-DEPLOYMENT-GUIDE.md](docs/LOCAL-DEPLOYMENT-GUIDE.md) troubleshooting section
2. Review processor logs for errors
3. Verify Kafka topics exist: `kubectl get kafkatopics -n kafka`
4. Check Dapr components: `kubectl get components`
