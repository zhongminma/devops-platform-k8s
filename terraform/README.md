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

## Dev Provider Skeleton

The development environment starts with a minimal AWS provider skeleton:

```text
terraform/environments/dev/versions.tf
terraform/environments/dev/providers.tf
```

It pins the AWS provider source and version range, then configures the provider for `us-east-1` with default tags.

This step does not create any cloud resources.

## Dev Variables And Outputs Skeleton

The development environment includes basic variables and outputs:

```text
terraform/environments/dev/variables.tf
terraform/environments/dev/outputs.tf
```

Current variables:

- `project_name`
- `environment`
- `aws_region`
- `cluster_name`

These values are placeholders for later module wiring and do not create resources by themselves.

## Network Module Skeleton

The network module skeleton lives at:

```text
terraform/modules/network
```

It creates the base AWS VPC and exposes VPC outputs. Subnet and internet gateway resources are included. Routing resources will be added in later steps.

## EKS Module Skeleton

The EKS module skeleton lives at:

```text
terraform/modules/eks
```

It currently defines module inputs and placeholder outputs. It does not create AWS resources yet.

## Next Steps

1. Add provider skeleton. Completed for `environments/dev`.
2. Add variables and outputs skeleton. Completed for `environments/dev`.
3. Add network module skeleton. Completed.
4. Wire the dev environment to the network module. Completed.
5. Add EKS module skeleton. Completed.
6. Wire the dev environment to the EKS module. Completed.
7. Add Terraform CI checks. Completed.
