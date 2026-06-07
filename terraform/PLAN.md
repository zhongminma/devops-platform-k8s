# Terraform Plan Guide

This guide explains how to review the AWS infrastructure plan for the dev environment.

## Prerequisites

Install and configure these tools before running Terraform locally:

- Terraform CLI
- AWS CLI
- AWS credentials with permission to manage VPC, IAM, and EKS resources

Check your AWS identity before planning:

```bash
aws sts get-caller-identity
```

## Commands

Run Terraform from the dev environment directory:

```bash
cd terraform/environments/dev
```

Initialize providers and modules:

```bash
terraform init
```

Format files:

```bash
terraform fmt -recursive ../..
```

Validate configuration:

```bash
terraform validate
```

Review the plan:

```bash
terraform plan
```

Use the example tfvars file as a reference if you want to override values:

```bash
terraform plan -var-file=../../examples/dev.tfvars.example
```

## What Terraform Will Create

The current dev configuration can create:

- VPC
- public and private subnets
- internet gateway
- public and private route tables
- EKS IAM roles and policy attachments
- EKS control plane
- EKS managed node group
- EKS add-ons

## Cost Notes

AWS EKS, EC2 worker nodes, NAT gateways, and data transfer can create real costs.

The NAT gateway code exists as a template, but the dev environment does not enable it by default.

Do not run `terraform apply` until you have reviewed the plan and confirmed the expected monthly cost.

## Destroy

When testing is complete, destroy the environment to avoid ongoing charges:

```bash
terraform destroy
```
