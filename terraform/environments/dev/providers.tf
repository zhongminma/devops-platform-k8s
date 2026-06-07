provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "devops-platform-k8s"
      Environment = "dev"
      ManagedBy   = "terraform"
    }
  }
}
