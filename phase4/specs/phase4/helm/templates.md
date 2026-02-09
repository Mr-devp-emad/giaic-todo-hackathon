# Helm Templates Specification

## Purpose
Define the templates for the todo application Helm chart.

## Requirements
- Use standard Helm directory structure: `templates/`
- Templates should include:
  - `deployment-frontend.yaml`
  - `deployment-backend.yaml`
  - `service-frontend.yaml`
  - `service-backend.yaml`
  - `configmap.yaml`
  - `secrets.yaml`
  - `ingress.yaml`
  - `namespace.yaml`
- Parameterize values using `{{ .Values.* }}`:
  - Replica counts
  - Image names and tags
  - Environment variables
  - Ingress hostnames
