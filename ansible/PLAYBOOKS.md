# Ansible Playbooks

## Bootstrap

The bootstrap playbook wires together the current platform host roles:

```text
ansible/playbooks/bootstrap.yml
```

It currently runs:

- `common`
- `kubernetes_tools`

## Dry Run

Run check mode first:

```bash
ansible-playbook -i ansible/inventories/dev/hosts.yml ansible/playbooks/bootstrap.yml --check
```

## Apply

After reviewing check mode output, run:

```bash
ansible-playbook -i ansible/inventories/dev/hosts.yml ansible/playbooks/bootstrap.yml
```

## Notes

The dev inventory targets localhost by default. The common role can use privilege escalation for package installation tasks, so review prompts and check mode output before applying.
