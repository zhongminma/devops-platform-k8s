output "name_prefix" {
  description = "Name prefix for network resources."
  value       = local.name_prefix
}

output "vpc_id" {
  description = "ID of the VPC created by the network module."
  value       = aws_vpc.this.id
}

output "internet_gateway_id" {
  description = "ID of the internet gateway created by the network module."
  value       = aws_internet_gateway.this.id
}

output "vpc_cidr" {
  description = "Configured VPC CIDR block."
  value       = aws_vpc.this.cidr_block
}

output "availability_zones" {
  description = "Configured availability zones."
  value       = var.availability_zones
}

output "public_route_table_id" {
  description = "ID of the public route table created by the network module."
  value       = aws_route_table.public.id
}

output "private_route_table_id" {
  description = "ID of the private route table created by the network module."
  value       = aws_route_table.private.id
}

output "nat_gateway_id" {
  description = "ID of the NAT gateway created by the network module, if enabled."
  value       = var.enable_nat_gateway ? aws_nat_gateway.this[0].id : null
}

output "nat_eip_public_ip" {
  description = "Public IP address of the NAT gateway EIP, if enabled."
  value       = var.enable_nat_gateway ? aws_eip.nat[0].public_ip : null
}

output "public_subnet_ids" {
  description = "IDs of public subnets created by the network module."
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of private subnets created by the network module."
  value       = aws_subnet.private[*].id
}

output "public_subnet_cidrs" {
  description = "Configured public subnet CIDR blocks."
  value       = var.public_subnet_cidrs
}

output "private_subnet_cidrs" {
  description = "Configured private subnet CIDR blocks."
  value       = var.private_subnet_cidrs
}
