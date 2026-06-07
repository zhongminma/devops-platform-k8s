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

variable "node_instance_types" {
  description = "EC2 instance types used by the default EKS managed node group."
  type        = list(string)
  default     = ["t3.medium"]
}

variable "node_desired_size" {
  description = "Desired number of worker nodes in the default managed node group."
  type        = number
  default     = 2
}

variable "node_min_size" {
  description = "Minimum number of worker nodes in the default managed node group."
  type        = number
  default     = 1
}

variable "node_max_size" {
  description = "Maximum number of worker nodes in the default managed node group."
  type        = number
  default     = 3
}

variable "cluster_addons" {
  description = "EKS add-ons to install after the cluster is created."
  type        = list(string)
  default     = ["vpc-cni", "coredns", "kube-proxy"]
}
