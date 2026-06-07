output "project_name" {
  description = "Project name used for resources."
  value       = var.project_name
}

output "environment" {
  description = "Environment name."
  value       = var.environment
}

output "aws_region" {
  description = "AWS region for this environment."
  value       = var.aws_region
}

output "cluster_name" {
  description = "Planned EKS cluster name."
  value       = var.cluster_name
}
