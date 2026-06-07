# CI/CD Status And Hardening Checklist

This document summarizes the current CI/CD state and the next production-hardening items.

## Current CI/CD Chain

```text
Push to main
  -> CI workflow validates backend, frontend, and YAML
  -> Docker Build workflow validates container builds
  -> Docker Publish workflow publishes images to GHCR
  -> Argo CD watches GitHub and syncs Kubernetes manifests
  -> Kubernetes runs the application and monitoring stack
```

## Completed CI

| Area | Status | Details |
| --- | --- | --- |
| Backend install | Complete | `npm ci` |
| Backend syntax | Complete | `node --check src/server.js` |
| Backend audit | Complete | `npm audit --audit-level=moderate` |
| Frontend install | Complete | `npm ci` |
| Frontend build | Complete | `npm run build` |
| Frontend audit | Complete | `npm audit --audit-level=moderate` |
| YAML validation | Complete | Parses Kubernetes and observability YAML |
| Docker build check | Complete | Builds backend and frontend images without pushing |

## Completed Delivery

| Area | Status | Details |
| --- | --- | --- |
| Backend image publish | Complete | Published to GHCR |
| Frontend image publish | Complete | Published to GHCR |
| Latest tag | Complete | `:latest` |
| Commit SHA tag | Complete | `:${{ github.sha }}` |
| Kubernetes manifests use GHCR | Complete | Deployments reference GHCR images |

## Completed GitOps CD

| Area | Status | Details |
| --- | --- | --- |
| Kustomize local overlay | Complete | `k8s/overlays/local` |
| Argo CD Application | Complete | `gitops/argocd/devops-platform-app.yaml` |
| Argo CD sync path | Complete | Watches `k8s/overlays/local` |
| Operations runbook | Complete | `docs/operations-runbook.md` |

## Not Yet Production-Hardened

These items are intentionally left for future improvements.

### Immutable Image Tags

Current Kubernetes manifests use:

```text
:latest
```

Production should prefer immutable tags:

```text
:<commit-sha>
```

This makes rollbacks and audits clearer.

### Image Update Automation

Future options:

- Argo CD Image Updater
- GitHub Actions updating Kustomize image tags
- Release PRs that update image tags explicitly

### Branch Protection

Configure this in GitHub repository settings:

- Require pull request before merging
- Require CI workflow to pass
- Require Docker Build workflow to pass
- Optionally require code owner review

### Environment Promotion

Future overlays:

```text
k8s/overlays/dev
k8s/overlays/staging
k8s/overlays/prod
```

Promotion path:

```text
dev -> staging -> prod
```

### Container Security Scanning

Recommended future workflow:

- Trivy filesystem scan
- Trivy image scan
- SARIF upload to GitHub code scanning

### Secret Management

Current project avoids real secrets.

Production should use one of:

- External Secrets Operator
- Sealed Secrets
- cloud secret manager integration
- SOPS with age or KMS

### Production Monitoring Stack

The current monitoring stack is learning-focused.

Production should consider:

- kube-prometheus-stack Helm chart
- persistent Prometheus storage
- Alertmanager routes
- Grafana persistence or external dashboards as code
- ServiceMonitor instead of scrape annotations

## Recommended Next Steps

1. Add Terraform skeleton.
2. Add Ansible skeleton.
3. Add environment overlays.
4. Add immutable image tag release process.
5. Add security scanning.
