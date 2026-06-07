# Terraform

This directory will contain Infrastructure as Code for the platform.

Terraform is responsible for creating cloud infrastructure before Kubernetes applications are deployed.

## Goals

The Terraform layer will eventually manage:

- network infrastructure
- Kubernetes cluster infrastructure
- cloud IAM resources
- environment-specific configuration
- outputs required by deployment tooling

## Directory Layout

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

## Directory Responsibilities

| Directory | Purpose |
| --- | --- |
| `environments/dev/` | Development environment configuration |
| `environments/prod/` | Production environment configuration |
| `modules/network/` | Reusable network module skeleton |
| `modules/eks/` | Reusable EKS module skeleton |
| `examples/` | Example variable files and usage snippets |
| `scripts/` | Helper scripts for Terraform workflows |

## Planned AWS/EKS Flow

The first production-style target will be AWS EKS.

Expected flow:

```text
Terraform network module
  -> VPC
  -> public/private subnets
  -> route tables
  -> NAT gateway or egress path

Terraform EKS module
  -> EKS cluster
  -> managed node group
  -> IAM roles
  -> cluster access outputs

Kubernetes layer
  -> Argo CD
  -> app manifests
  -> monitoring stack
```

## Typical Commands

Run commands from an environment directory, such as:

```bash
cd terraform/environments/dev
```

Initialize Terraform:

```bash
terraform init
```

Format Terraform files:

```bash
terraform fmt -recursive
```

Validate configuration:

```bash
terraform validate
```

Create a plan:

```bash
terraform plan
```

Apply infrastructure:

```bash
terraform apply
```

Destroy infrastructure:

```bash
terraform destroy
```

## State Management

Terraform state should not be committed to Git.

Local state is useful for learning, but production should use a remote backend such as:

- AWS S3 + DynamoDB lock table
- Terraform Cloud
- another secure remote backend

The repository `.gitignore` excludes local state files.

## Safety Notes

- Review every Terraform plan before applying.
- Do not commit cloud credentials.
- Do not commit `.tfstate` files.
- Keep environment-specific values separate from reusable modules.
- Prefer small reusable modules over large environment-only files.

## Next Steps

1. Add provider skeleton.
2. Add variables and outputs skeleton.
3. Add network module skeleton.
4. Add EKS module skeleton.
5. Wire the dev environment.
6. Add Terraform CI checks.
