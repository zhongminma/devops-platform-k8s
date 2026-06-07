# GitOps Deployment Plan

GitOps is the recommended direction for Kubernetes CD in this project.

The core idea is:

```text
Git is the source of truth.
The cluster continuously reconciles itself to match Git.
```

## Why GitOps

GitHub Actions can build and publish Docker images, but it should not usually hold long-lived direct access to a production Kubernetes cluster.

With GitOps, the deployment flow becomes:

```text
Developer pushes to main
  -> GitHub Actions runs CI
  -> GitHub Actions builds and publishes images to GHCR
  -> Kubernetes manifests are updated in Git
  -> Argo CD or Flux detects the change
  -> Argo CD or Flux applies the change inside the cluster
```

This is safer because the deployment controller runs inside the cluster and pulls the desired state from GitHub.

## Recommended Tool

Use one of these GitOps controllers:

| Tool | Notes |
| --- | --- |
| Argo CD | Popular UI, strong application model, easy to demo |
| Flux | Lightweight, CNCF GitOps toolkit, very automation-friendly |

For this project, Argo CD is the recommended first GitOps implementation because it is easier to visualize and explain.

## Current Project State

The project already has:

- Node.js backend image published to GHCR
- React frontend image published to GHCR
- Kubernetes manifests for backend and frontend
- Prometheus and Grafana manifests
- GitHub Actions CI
- GitHub Actions Docker image publishing

The missing CD piece is:

```text
A GitOps controller that watches the repository and applies Kubernetes manifests automatically.
```

## Future Argo CD Flow

A future Argo CD application will point to this repository:

```text
https://github.com/zhongminma/devops-platform-k8s.git
```

It will watch a Kubernetes manifest path such as:

```text
k8s/overlays/local
```

When Git changes, Argo CD will sync the cluster.

## Recommended Repository Structure For GitOps

The current `k8s/` directory works for manual `kubectl apply`, but GitOps is cleaner with Kustomize overlays.

Recommended future structure:

```text
k8s/
├── base/
│   ├── namespace.yaml
│   ├── backend/
│   ├── frontend/
│   ├── monitoring/
│   ├── ingress/
│   └── kustomization.yaml
└── overlays/
    └── local/
        └── kustomization.yaml
```

Argo CD can then watch:

```text
k8s/overlays/local
```

## Argo CD Application Manifest

The Argo CD Application manifest lives at:

```text
gitops/argocd/devops-platform-app.yaml
```

It points Argo CD to:

```text
repoURL: https://github.com/zhongminma/devops-platform-k8s.git
targetRevision: main
path: k8s/overlays/local
```

It enables automated sync with prune and self-heal.

## Future Steps

1. Restructure Kubernetes manifests with Kustomize. Completed with `k8s/overlays/local`.
2. Add an Argo CD Application manifest. Completed with `gitops/argocd/devops-platform-app.yaml`.
3. Install Argo CD in the local Kubernetes cluster.
4. Point Argo CD at this GitHub repository.
5. Enable automated sync, prune, and self-heal.
6. Move image updates to an explicit release process.

## Important Local Note

Docker Desktop Kubernetes is local to the developer machine.

GitHub Actions cannot directly deploy to it, but Argo CD can run inside it and pull manifests from GitHub.

That makes GitOps a better fit for local learning and production-style deployment design.
