# Terraform Remote State Skeleton

Production Terraform should use remote state instead of local `.tfstate` files.

This repository includes a disabled example backend file:

```text
terraform/environments/dev/backend.tf.example
```

It is intentionally named `.example` so Terraform will ignore it by default.

## Recommended AWS Backend

Use:

- S3 bucket for state storage
- DynamoDB table for state locking
- server-side encryption enabled
- restricted IAM permissions

## Activation Flow

1. Create the S3 bucket outside this Terraform configuration.
2. Create the DynamoDB lock table outside this Terraform configuration.
3. Update `backend.tf.example` with the real bucket and table names.
4. Rename `backend.tf.example` to `backend.tf`.
5. Run:

```bash
cd terraform/environments/dev
terraform init -migrate-state
```

## Safety Notes

Do not commit real backend values if they reveal private account details.
Do not commit `.tfstate` files.
