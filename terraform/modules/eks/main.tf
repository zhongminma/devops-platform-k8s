locals {
  cluster_full_name = "${var.project_name}-${var.environment}-${var.cluster_name}"
}

# Resource definitions will be added in a later step.
# Planned resources include EKS cluster, managed node groups, IAM roles, and add-ons.
