# Deployment Workflow

This project separates CI, image publishing, and Kubernetes deployment into clear stages.

## Current Workflow

```text
Developer pushes to main
  -> GitHub Actions CI validates code and YAML
  -> GitHub Actions Docker Build validates Dockerfiles
  -> GitHub Actions Docker Publish pushes images to GHCR
  -> Operator applies Kubernetes manifests to a cluster
```

## Why Deployment Is Manual For Local Kubernetes

Docker Desktop Kubernetes runs on a developer laptop.

GitHub Actions cannot directly reach that local cluster, so local deployment is intentionally manual:

```bash
kubectl apply -f k8s/base/namespace.yaml
kubectl apply -f k8s/backend
kubectl apply -f k8s/frontend
kubectl apply -f k8s/monitoring
```

## Local Deployment Steps

1. Confirm GitHub Actions published images to GHCR.
2. Confirm Docker Desktop Kubernetes is running.
3. Apply application manifests:

```bash
kubectl apply -f k8s/base/namespace.yaml
kubectl apply -f k8s/backend
kubectl apply -f k8s/frontend
```

4. Apply monitoring manifests:

```bash
kubectl apply -f k8s/monitoring
```

5. Verify application Pods:

```bash
kubectl get pods -n devops-platform
kubectl get svc -n devops-platform
```

6. Verify monitoring Pods:

```bash
kubectl get pods -n monitoring
kubectl get svc -n monitoring
```

7. Access Grafana:

```bash
kubectl port-forward -n monitoring svc/grafana 3000:3000
```

Open:

```text
http://localhost:3000
```

8. Access Prometheus:

```bash
kubectl port-forward -n monitoring svc/prometheus 9090:9090
```

Open:

```text
http://localhost:9090
```

## Production Deployment Direction

For a production cluster, the recommended path is:

```text
GitHub Actions publishes images to GHCR or cloud registry
  -> Argo CD watches Kubernetes manifests or Helm values
  -> Cluster pulls new desired state from GitHub
  -> Kubernetes rolls out updated Deployments
```

This GitOps style avoids giving GitHub Actions direct long-lived access to the production cluster.

## Production Release Checklist

Before applying a production release:

- CI workflow is green.
- Docker Build workflow is green.
- Docker Publish workflow is green.
- New images exist in GHCR.
- Kubernetes manifests reference the intended image tags.
- Prometheus targets are healthy.
- Grafana dashboard shows backend traffic and latency.
- Rollback image tags are known.
