module "network" {
  source = "../../modules/network"

  project_name = var.project_name
  environment  = var.environment

  availability_zones   = ["us-east-1a", "us-east-1b"]
  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs = ["10.0.101.0/24", "10.0.102.0/24"]
  enable_nat_gateway   = true
}

module "eks" {
  source = "../../modules/eks"

  project_name       = var.project_name
  environment        = var.environment
  cluster_name       = var.cluster_name
  private_subnet_ids = module.network.private_subnet_ids
}
