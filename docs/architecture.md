# Architecture

This project is organized as a small DevOps platform template.

The core idea is to separate infrastructure, configuration, deployment, and observability into clear layers.

## Layers

```text
Application
  React frontend + Node.js backend

Kubernetes
  Deployments, Services, Ingress, ConfigMaps, Secrets

Observability
  Prometheus metrics collection + Grafana dashboards

Configuration
  Ansible playbooks and roles for server setup

Infrastructure
  Terraform modules and environments
```

## Tool Responsibilities

| Tool | Responsibility |
| --- | --- |
| Terraform | Creates infrastructure such as networks, virtual machines, and Kubernetes clusters |
| Ansible | Configures servers after they exist |
| Kubernetes | Runs containerized applications |
| Prometheus | Collects metrics from apps and cluster components |
| Grafana | Visualizes metrics through dashboards |
| Node.js | Provides the sample backend API |
| React | Provides the sample frontend UI |
| GitHub Actions | Automates tests, builds, and deployments |

## Expected Workflow

1. Terraform creates the infrastructure.
2. Ansible configures the servers when needed.
3. Kubernetes deploys the application and platform services.
4. Prometheus collects metrics from the cluster and application.
5. Grafana displays dashboards for operators.
6. GitHub Actions automates checks and delivery.

## Repository Directories

| Directory | Purpose |
| --- | --- |
| `apps/` | Sample frontend and backend application code |
| `terraform/` | Infrastructure as Code |
| `ansible/` | Server configuration and automation |
| `k8s/` | Kubernetes manifests |
| `observability/` | Prometheus, Grafana, and alerting configs |
| `docs/` | Project documentation |
