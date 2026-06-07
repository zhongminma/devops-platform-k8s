# Ansible

This directory contains Ansible automation for bootstrapping platform hosts and local admin tooling.

Terraform is responsible for cloud infrastructure. Kubernetes manifests and GitOps are responsible for cluster workloads. Ansible fills the operational gap around host setup, CLI tooling, and repeatable bootstrap tasks.

## Goals

The Ansible layer will eventually manage:

- local or remote admin host bootstrap
- common operating system packages
- Kubernetes tooling such as kubectl and Helm
- Argo CD CLI setup
- AWS CLI setup helpers
- platform bootstrap playbooks

## Directory Layout

```text
ansible/
├── inventories/
│   └── dev/
├── group_vars/
├── playbooks/
└── roles/
```

## Safety Notes

- Prefer `--check` before making changes.
- Keep secrets out of inventory files.
- Use Ansible Vault or an external secret manager for sensitive values.
- Keep host-specific configuration in inventory or group vars, not role logic.

## Dev Inventory

The dev inventory targets localhost by default:

```bash
ansible-inventory -i ansible/inventories/dev/hosts.yml --list
```

Dev group variables live in:

```text
ansible/group_vars/dev.yml
```

## Common Role

The `common` role defines baseline packages and host bootstrap tasks.

Run with check mode before applying changes:

```bash
ansible-playbook -i ansible/inventories/dev/hosts.yml ansible/playbooks/bootstrap.yml --check
```

## Kubernetes Tooling Role

The `kubernetes_tools` role checks for CLI tools used by this platform:

- kubectl
- Helm
- Argo CD CLI
- AWS CLI

It currently reports tool availability and does not install binaries by default.
