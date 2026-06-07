# DevOps Platform K8s

This repository is a step-by-step DevOps platform project.

The goal is to build a production-style template that combines:

- Kubernetes for application deployment
- Terraform for infrastructure provisioning
- Ansible for server configuration
- Prometheus and Grafana for observability
- Node.js and React for a sample full-stack application

## Run Locally

Start the backend API:

```bash
cd apps/backend
npm install
npm run start
```

The backend runs on:

```text
http://localhost:8080
```

Useful backend endpoints:

```text
GET http://localhost:8080/health
GET http://localhost:8080/api/posts
GET http://localhost:8080/metrics
```

Start the React frontend in a second terminal:

```bash
cd apps/frontend
npm install
npm run start
```

The React app runs on:

```text
http://localhost:5173
```

Port summary:

| Service | URL | Purpose |
| --- | --- | --- |
| Frontend | `http://localhost:5173` | React UI |
| Backend | `http://localhost:8080` | Node.js API |
| Posts API | `http://localhost:8080/api/posts` | JSON data used by the React UI |

## Backend Metrics

The backend exposes Prometheus metrics at:

```text
http://localhost:8080/metrics
```

The metrics endpoint includes:

| Metric | Purpose |
| --- | --- |
| `process_*` | Default Node.js process metrics |
| `nodejs_*` | Default Node.js runtime metrics |
| `http_requests_total` | Count HTTP requests by method, route, and status code |
| `http_request_duration_seconds` | Measure HTTP request latency by method, route, and status code |

Example Prometheus queries for later Grafana dashboards:

```promql
rate(http_requests_total[5m])
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route))
nodejs_heap_size_used_bytes
```

The backend Kubernetes Service also includes Prometheus scrape annotations:

```yaml
prometheus.io/scrape: "true"
prometheus.io/path: "/metrics"
prometheus.io/port: "8080"
```

With a Prometheus configuration that reads these annotations, Prometheus can scrape:

```text
http://backend.devops-platform.svc.cluster.local:8080/metrics
```

## Prometheus Configuration

A Prometheus scrape configuration template is available at:

```text
observability/prometheus/prometheus.yml
```

It discovers Kubernetes Services and keeps only Services with:

```yaml
prometheus.io/scrape: "true"
```

The backend Service added in this project matches that rule and exposes:

```text
/metrics on port 8080
```

## Run With Docker

Build and start both containers:

```bash
docker compose up --build
```

Docker port summary:

| Service | URL | Purpose |
| --- | --- | --- |
| Frontend container | `http://localhost:3000` | React UI served by nginx |
| Backend container | `http://localhost:8080` | Node.js API |
| Posts API | `http://localhost:8080/api/posts` | JSON data used by the React UI |

Stop the containers:

```bash
docker compose down
```

## Kubernetes Images

Kubernetes deployments use images published to GitHub Container Registry:

```text
ghcr.io/zhongminma/devops-platform-backend:latest
ghcr.io/zhongminma/devops-platform-frontend:latest
```

The Docker Publish workflow builds and publishes these images on pushes to `main`.

For local Docker Desktop Kubernetes, make sure the images are published before applying deployments:

```bash
kubectl apply -f k8s/backend
kubectl apply -f k8s/frontend
```

## Kubernetes Namespace

Create the project namespace before applying application manifests:

```bash
kubectl apply -f k8s/base/namespace.yaml
```

This project deploys Kubernetes resources into:

```text
devops-platform
```

## Deploy Backend To Kubernetes

Apply the backend Kubernetes manifests:

```bash
kubectl apply -f k8s/base/namespace.yaml
kubectl apply -f k8s/backend
```

Backend Kubernetes files:

| File | Purpose |
| --- | --- |
| `k8s/backend/deployment.yaml` | Runs backend Pods from the backend container image |
| `k8s/backend/service.yaml` | Creates a stable internal network endpoint for the backend Pods |

The backend Service is internal to the cluster by default:

```text
backend:8080
```

## Deploy Frontend To Kubernetes

Apply the frontend Kubernetes manifests:

```bash
kubectl apply -f k8s/base/namespace.yaml
kubectl apply -f k8s/frontend
```

Frontend Kubernetes files:

| File | Purpose |
| --- | --- |
| `k8s/frontend/deployment.yaml` | Runs frontend Pods from the frontend container image |
| `k8s/frontend/service.yaml` | Creates a stable internal network endpoint for the frontend Pods |

The frontend Service is internal to the cluster by default:

```text
frontend:80
```

## Deploy Monitoring Stack

This project includes learning-focused Kubernetes manifests for Prometheus and Grafana.

Apply the monitoring manifests:

```bash
kubectl apply -f k8s/monitoring
```

Prometheus discovers Services with Prometheus scrape annotations and scrapes the backend metrics endpoint.

Access Prometheus locally:

```bash
kubectl port-forward -n monitoring svc/prometheus 9090:9090
```

Then open:

```text
http://localhost:9090
```

Access Grafana locally:

```bash
kubectl port-forward -n monitoring svc/grafana 3000:3000
```

Then open:

```text
http://localhost:3000
```

Default Grafana login:

```text
admin / admin
```

Note: this monitoring stack is designed for learning. Prometheus uses `emptyDir` storage, so metrics are not persisted if the Pod is deleted.

## Grafana Dashboard

Grafana is provisioned with a dashboard named:

```text
DevOps Platform Backend
```

The dashboard is loaded from:

```text
k8s/monitoring/grafana-dashboard-configmap.yaml
```

It includes panels for:

- HTTP request rate by route
- HTTP requests by status code
- P95 latency by route
- Node.js heap memory usage

After applying monitoring manifests, restart Grafana if it is already running:

```bash
kubectl rollout restart deployment/grafana -n monitoring
```

## Deploy Ingress

This project includes an nginx Ingress example for local or cluster environments with an ingress controller installed.

Apply the Ingress manifest:

```bash
kubectl apply -f k8s/ingress
```

Ingress routes:

| Path | Service |
| --- | --- |
| `/` | `frontend:80` |
| `/api/*` | `backend:8080` |
| `/health` | `backend:8080` |

Example host:

```text
devops-platform.local
```

## Continuous Integration

GitHub Actions runs CI on pushes and pull requests to `main`.

Workflow file:

```text
.github/workflows/ci.yml
```

CI checks:

- Backend dependency install
- Backend syntax check
- Backend npm audit
- Frontend dependency install
- Frontend production build
- Frontend npm audit
- Kubernetes and observability YAML parsing

## Docker Build CI

GitHub Actions also validates Docker image builds without pushing images.

Workflow file:

```text
.github/workflows/docker-build.yml
```

Docker build checks:

- Backend Docker image build
- Frontend Docker image build
- Frontend build argument `VITE_API_BASE_URL=/api`

This is still CI, not CD, because it does not publish images or deploy to Kubernetes.

## Docker Image Publishing

GitHub Actions can publish Docker images to GitHub Container Registry.

Workflow file:

```text
.github/workflows/docker-publish.yml
```

Published images:

```text
ghcr.io/zhongminma/devops-platform-backend:latest
ghcr.io/zhongminma/devops-platform-frontend:latest
```

Each image is also tagged with the Git commit SHA.

This is the first delivery step: it publishes deployable artifacts, but it does not deploy them to Kubernetes yet.

## Deployment Workflow

Deployment guidance is documented in:

```text
docs/deployment-workflow.md
```

Release notes can be prepared from:

```text
docs/release-notes-template.md
```

Local Docker Desktop Kubernetes deployment remains manual because GitHub Actions cannot directly reach a developer laptop cluster.

## Kustomize Deployment

Kustomize provides a single local deployment entrypoint for GitOps tools and manual deployment:

```text
k8s/overlays/local
```

Render all local Kubernetes manifests:

```bash
kubectl kustomize k8s/overlays/local
```

Apply all local Kubernetes manifests:

```bash
kubectl apply -k k8s/overlays/local
```

This path is the recommended future Argo CD application path.

## GitOps Direction

Kubernetes CD will use a GitOps approach in a future step.

Plan document:

```text
docs/gitops.md
```

Recommended controller:

```text
Argo CD
```

## Argo CD Application

Argo CD can deploy this project using:

```text
gitops/argocd/devops-platform-app.yaml
```

The Application watches:

```text
https://github.com/zhongminma/devops-platform-k8s.git
path: k8s/overlays/local
branch: main
```

Apply it after Argo CD is installed in the cluster:

```bash
kubectl apply -f gitops/argocd/devops-platform-app.yaml
```

## Operations Runbook

Common local operations and troubleshooting commands are documented in:

```text
docs/operations-runbook.md
```

The runbook covers:

- Argo CD sync and health checks
- Application Pod checks
- Prometheus target checks
- Grafana dashboard access
- ImagePullBackOff and CrashLoopBackOff troubleshooting
- Rollout and rollback commands

## CI/CD Status

The current CI/CD chain and production-hardening backlog are documented in:

```text
docs/cicd-status.md
```

Current status:

```text
CI complete
Docker image publishing complete
GitOps CD foundation complete
Production hardening backlog documented
```

## Terraform

Terraform infrastructure code will live under:

```text
terraform/
├── environments/
│   ├── dev/
│   └── prod/
├── modules/
│   ├── network/
│   └── eks/
├── examples/
└── scripts/
```

The first Terraform step only adds the directory structure. Provider and module code will be added in later small commits.

## Progress

- Step 1: Initialize the GitHub repository
- Step 2: Add project directory structure
- Step 3: Add architecture documentation
- Step 4: Add local development documentation
- Step 5: Add Node.js backend CRUD API
- Step 6: Add React frontend posts UI
- Step 7: Add Docker container support
- Step 8: Add backend Kubernetes manifests
- Step 9: Add frontend Kubernetes manifests
- Step 10: Add Kubernetes namespace
- Step 11: Add Kubernetes Ingress
- Step 12: Add backend Prometheus metrics endpoint
- Step 13: Add Prometheus scrape annotations
- Step 14: Add Prometheus scrape configuration
- Step 15: Add Prometheus and Grafana Kubernetes manifests
- Step 16: Add Grafana dashboard provisioning
- Step 17: Add GitHub Actions CI
- Step 18: Add Docker build CI
- Step 19: Add Docker image publishing to GHCR
- Step 20: Use GHCR images in Kubernetes manifests
- Step 21: Add deployment workflow and release notes docs
- Step 22: Add GitOps deployment plan
- Step 23: Add Kustomize structure
- Step 24: Add Argo CD Application manifest
- Step 25: Add operations runbook
- Step 26: Add CI/CD status and hardening checklist
- Step 27: Add Terraform directory structure
- Step 28: Add Terraform documentation
- Step 29: Add Terraform provider skeleton
- Step 30: Add Terraform variables and outputs skeleton
- Step 31: Add Terraform network module skeleton
- Step 32: Wire dev Terraform environment to network module
