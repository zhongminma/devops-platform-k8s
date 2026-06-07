variable "project_name" {
  description = "Project name used for naming and tagging resources."
  type        = string
  default     = "devops-platform-k8s"
}

variable "environment" {
  description = "Environment name."
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region for the environment."
  type        = string
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "EKS cluster name."
  type        = string
  default     = "devops-platform-dev"
}
