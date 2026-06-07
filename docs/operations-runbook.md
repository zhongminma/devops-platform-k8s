# Operations Runbook

This runbook collects common commands for operating the local Kubernetes deployment.

## Cluster Context

Check which Kubernetes cluster kubectl is using:

```bash
kubectl config current-context
kubectl get nodes
```

For Docker Desktop Kubernetes, the context is usually:

```text
docker-desktop
```

## Argo CD Health

Check Argo CD Pods:

```bash
kubectl get pods -n argocd
```

Open Argo CD locally:

```bash
kubectl port-forward svc/argocd-server -n argocd 8081:443
```

Then open:

```text
https://localhost:8081
```

Check the Argo CD Application:

```bash
kubectl get application devops-platform -n argocd
kubectl describe application devops-platform -n argocd
```

Expected sync state:

```text
Synced
```

Expected health state after rollout completes:

```text
Healthy
```

## Application Health

Check application workloads:

```bash
kubectl get all -n devops-platform
kubectl get pods -n devops-platform
kubectl get svc -n devops-platform
```

Check backend health through port-forward:

```bash
kubectl port-forward -n devops-platform svc/backend 8080:8080
```

Then open:

```text
http://localhost:8080/health
http://localhost:8080/api/posts
http://localhost:8080/metrics
```

Check frontend through port-forward:

```bash
kubectl port-forward -n devops-platform svc/frontend 8082:80
```

Then open:

```text
http://localhost:8082
```

## Monitoring Health

Check monitoring workloads:

```bash
kubectl get all -n monitoring
kubectl get pods -n monitoring
kubectl get svc -n monitoring
```

Open Prometheus locally:

```bash
kubectl port-forward -n monitoring svc/prometheus 9090:9090
```

Then open:

```text
http://localhost:9090
```

In Prometheus, check:

```text
Status -> Targets
```

Expected backend target:

```text
UP
```

Useful Prometheus queries:

```promql
http_requests_total
sum(rate(http_requests_total[5m])) by (route)
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route))
nodejs_heap_size_used_bytes
```

Open Grafana locally:

```bash
kubectl port-forward -n monitoring svc/grafana 3000:3000
```

Then open:

```text
http://localhost:3000
```

Default login:

```text
admin / admin
```

Dashboard path:

```text
Dashboards -> DevOps Platform -> DevOps Platform Backend
```

## Common Issues

### ImagePullBackOff

Symptom:

```text
ImagePullBackOff
ErrImagePull
```

Inspect the Pod:

```bash
kubectl describe pod -n devops-platform <pod-name>
```

Common causes:

- GHCR image does not exist yet.
- Docker Publish workflow failed.
- GHCR package is private and the cluster has no image pull secret.
- Kubernetes manifest references the wrong image tag.

Check images in manifests:

```bash
kubectl get deployment backend -n devops-platform -o jsonpath='{.spec.template.spec.containers[0].image}'
kubectl get deployment frontend -n devops-platform -o jsonpath='{.spec.template.spec.containers[0].image}'
```

### CrashLoopBackOff

Symptom:

```text
CrashLoopBackOff
```

Check logs:

```bash
kubectl logs -n devops-platform deployment/backend
kubectl logs -n devops-platform deployment/frontend
```

Check previous container logs:

```bash
kubectl logs -n devops-platform <pod-name> --previous
```

Common causes:

- Application startup error.
- Missing environment variable.
- Container command exits immediately.

### Pod Stuck Pending

Symptom:

```text
Pending
```

Inspect scheduling events:

```bash
kubectl describe pod -n devops-platform <pod-name>
```

Common causes:

- Not enough CPU or memory.
- Node is not Ready.
- Persistent volume is unavailable.

### Argo CD Progressing For Too Long

Check application details:

```bash
kubectl describe application devops-platform -n argocd
```

Check workloads:

```bash
kubectl get pods -n devops-platform
kubectl get pods -n monitoring
```

Common causes:

- Deployment rollout is not complete.
- Readiness probe is failing.
- Image pull is failing.
- A resource is missing or misconfigured.

### Prometheus Target Down

Check backend Service annotations:

```bash
kubectl get svc backend -n devops-platform -o yaml
```

Expected annotations:

```yaml
prometheus.io/scrape: "true"
prometheus.io/path: "/metrics"
prometheus.io/port: "8080"
```

Check backend metrics manually:

```bash
kubectl port-forward -n devops-platform svc/backend 8080:8080
curl http://localhost:8080/metrics
```

## Rollout And Rollback

Restart backend:

```bash
kubectl rollout restart deployment/backend -n devops-platform
kubectl rollout status deployment/backend -n devops-platform
```

Restart frontend:

```bash
kubectl rollout restart deployment/frontend -n devops-platform
kubectl rollout status deployment/frontend -n devops-platform
```

Rollback backend:

```bash
kubectl rollout undo deployment/backend -n devops-platform
```

Rollback frontend:

```bash
kubectl rollout undo deployment/frontend -n devops-platform
```

## Cleanup

Delete application resources:

```bash
kubectl delete -k k8s/overlays/local
```

Delete Argo CD Application only:

```bash
kubectl delete application devops-platform -n argocd
```
