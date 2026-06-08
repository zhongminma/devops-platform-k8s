# Production Kubernetes Platform with GitOps & Observability

A production-style cloud-native platform that demonstrates modern DevOps, Platform Engineering, and Site Reliability Engineering (SRE) practices.

This project combines Infrastructure as Code (Terraform), Configuration Management (Ansible), GitOps Delivery (ArgoCD), Container Orchestration (Kubernetes), and Observability (Prometheus & Grafana) into a single end-to-end platform.

## Architecture
```mermaid
graph TD

A[GitHub] --> B[ArgoCD]
B --> C[Kubernetes]

C --> D[React Frontend]
C --> E[Node Backend]

E --> F[MongoDB]

C --> G[Prometheus]
G --> H[Grafana]

I[Terraform] --> C
J[Ansible] --> C
```
## Screenshots
### Grafana Dashboard
<img width="1519" height="748" alt="Screenshot 2026-06-07 at 15 49 28" src="https://github.com/user-attachments/assets/37ec5805-3a20-45ed-9d18-7a556da8c669" />


### ArgoCD Application Status
<img width="1506" height="512" alt="Screenshot 2026-06-07 at 16 48 11" src="https://github.com/user-attachments/assets/909ce83d-f279-47a0-9bf8-6d8a85bf1258" />


### Kubernetes Workloads
<img width="1621" height="867" alt="Screenshot 2026-06-07 at 21 12 55" src="https://github.com/user-attachments/assets/c797fd5e-ab3a-49a3-9697-096225ba943c" />


## Reliability & Observability

This platform includes:

- Prometheus metrics collection
- Grafana dashboards and visualization
- Kubernetes health monitoring
- Service-level observability
- Alerting workflows
- Production-style troubleshooting practices

## Key Capabilities

- Infrastructure as Code (Terraform)
- Configuration Management (Ansible)
- GitOps Continuous Delivery (ArgoCD)
- Kubernetes Workload Orchestration
- Monitoring & Observability (Prometheus + Grafana)
- Dockerized Application Deployment
- Full-Stack Application Validation (Node.js + React + MongoDB)

## Technology Stack
Terraform | Ansible | Kubernetes | Docker | ArgoCD | Prometheus | Grafana | Node.js | React | MongoDB


## Project Guide

Detailed implementation and operation notes have moved to:

```text
docs/project_guide.md
```

The guide includes local run instructions, backend metrics, Prometheus/Grafana, Kubernetes deployment, Ingress, CI/CD, Docker publishing, Kustomize, Argo CD, runbook notes, Terraform, and project progress.
