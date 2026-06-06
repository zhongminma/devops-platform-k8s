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
