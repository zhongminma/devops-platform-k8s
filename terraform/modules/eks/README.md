# EKS Module

This module will manage the Kubernetes control plane and worker node infrastructure for AWS EKS.

At this stage, it creates IAM roles and policy attachments required by future EKS cluster and managed node group resources.

## Planned Responsibilities

- EKS control plane
- EKS cluster IAM role
- managed node group IAM role
- managed node groups
- cluster security group rules
- Kubernetes access outputs
- optional EKS add-ons

## Inputs

| Name | Purpose |
| --- | --- |
| `project_name` | Project name used for naming resources |
| `environment` | Environment name |
| `cluster_name` | Short cluster name |
| `kubernetes_version` | EKS Kubernetes control plane version |
| `private_subnet_ids` | Private subnet IDs for worker nodes |
| `endpoint_private_access` | Enables private API endpoint access |
| `endpoint_public_access` | Enables public API endpoint access |

## Outputs

| Name | Purpose |
| --- | --- |
| `cluster_full_name` | Generated full cluster name |
| `kubernetes_version` | Configured Kubernetes version |
| `private_subnet_ids` | Private subnet IDs passed into the module |
| `endpoint_private_access` | Private API endpoint setting |
| `endpoint_public_access` | Public API endpoint setting |
| `cluster_role_arn` | IAM role ARN for the EKS control plane |
| `node_group_role_arn` | IAM role ARN for managed node groups |

## Notes

This module now creates IAM roles and policy attachments only. EKS cluster and managed node group resources will be added in follow-up commits.
