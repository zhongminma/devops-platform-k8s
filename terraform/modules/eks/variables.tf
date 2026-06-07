variable "project_name" {
  description = "Project name used for naming and tagging EKS resources."
  type        = string
}

variable "environment" {
  description = "Environment name, such as dev, staging, or prod."
  type        = string
}

variable "cluster_name" {
  description = "Short EKS cluster name."
  type        = string
}

variable "kubernetes_version" {
  description = "Kubernetes version for the EKS control plane."
  type        = string
  default     = "1.30"
}

variable "private_subnet_ids" {
  description = "Private subnet IDs where EKS worker nodes will run."
  type        = list(string)
  default     = []
}

variable "endpoint_private_access" {
  description = "Whether the EKS API endpoint is reachable from inside the VPC."
  type        = bool
  default     = true
}

variable "endpoint_public_access" {
  description = "Whether the EKS API endpoint is reachable from the public internet."
  type        = bool
  default     = true
}
