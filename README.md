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

## Deploy Backend To Kubernetes

Apply the backend Kubernetes manifests:

```bash
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

## Progress

- Step 1: Initialize the GitHub repository
- Step 2: Add project directory structure
- Step 3: Add architecture documentation
- Step 4: Add local development documentation
- Step 5: Add Node.js backend CRUD API
- Step 6: Add React frontend posts UI
- Step 7: Add Docker container support
- Step 8: Add backend Kubernetes manifests
