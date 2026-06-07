# EKS Module

This module will manage the Kubernetes control plane and worker node infrastructure for AWS EKS.

At this stage, it is only a skeleton. It defines inputs and outputs so the platform can wire environment configuration before creating real AWS resources.

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

## Notes

This module intentionally does not create resources yet. Real EKS resources will be added in smaller follow-up commits.
