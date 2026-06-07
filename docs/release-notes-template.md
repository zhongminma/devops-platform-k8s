# Release Notes Template

Use this template when preparing a release.

## Release

Version:
Date:
Owner:

## Summary

Short description of what changed.

## Changes

- Backend:
- Frontend:
- Kubernetes:
- Observability:
- CI/CD:

## Images

```text
ghcr.io/zhongminma/devops-platform-backend:<tag>
ghcr.io/zhongminma/devops-platform-frontend:<tag>
```

## Validation

- [ ] CI passed
- [ ] Docker Build passed
- [ ] Docker Publish passed
- [ ] Backend Pods are Running
- [ ] Frontend Pods are Running
- [ ] Prometheus target is UP
- [ ] Grafana dashboard shows data

## Deployment Commands

```bash
kubectl apply -f k8s/base/namespace.yaml
kubectl apply -f k8s/backend
kubectl apply -f k8s/frontend
kubectl apply -f k8s/monitoring
```

## Rollback Plan

Previous backend image:
Previous frontend image:
Rollback command:

```bash
kubectl rollout undo deployment/backend -n devops-platform
kubectl rollout undo deployment/frontend -n devops-platform
```

## Notes

Add operational notes, known issues, or follow-up tasks here.
