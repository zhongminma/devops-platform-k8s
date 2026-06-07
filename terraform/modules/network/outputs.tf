output "name_prefix" {
  description = "Name prefix for network resources."
  value       = local.name_prefix
}

output "vpc_cidr" {
  description = "Configured VPC CIDR block."
  value       = var.vpc_cidr
}

output "availability_zones" {
  description = "Configured availability zones."
  value       = var.availability_zones
}

output "public_subnet_cidrs" {
  description = "Configured public subnet CIDR blocks."
  value       = var.public_subnet_cidrs
}

output "private_subnet_cidrs" {
  description = "Configured private subnet CIDR blocks."
  value       = var.private_subnet_cidrs
}
