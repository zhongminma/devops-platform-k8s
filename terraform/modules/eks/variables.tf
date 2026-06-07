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
