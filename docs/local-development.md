# Local Development

This document explains how the project will be developed and tested locally.

The local workflow will be built in small steps so each layer is easy to understand.

## Development Layers

```text
Layer 1: Run apps directly
  React frontend runs with Vite
  Node.js backend runs with npm

Layer 2: Run apps with Docker
  Frontend and backend each get a Dockerfile
  Docker Compose starts both services together

Layer 3: Run apps on Kubernetes
  Kubernetes manifests deploy the same containers
  Services expose the frontend and backend inside the cluster
```

## Planned Local Tools

| Tool | Purpose |
| --- | --- |
| Node.js | Run the backend API and frontend build tools |
| npm | Install dependencies and run project scripts |
| Docker | Build container images |
| Docker Compose | Run the frontend and backend together locally |
| kubectl | Apply Kubernetes manifests |
| kind or minikube | Run a local Kubernetes cluster |

## Planned Application Ports

| Service | Local Port | Purpose |
| --- | --- | --- |
| Frontend | `3000` | React user interface |
| Backend | `8080` | Node.js API |
| Metrics | `8080/metrics` | Prometheus scrape endpoint |

## Local Development Goal

The first working local milestone will be:

1. Start the Node.js backend.
2. Start the React frontend.
3. Confirm the frontend can call the backend.
4. Containerize both services.
5. Deploy both services to local Kubernetes.
