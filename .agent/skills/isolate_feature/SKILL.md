---
name: isolate_feature
description: >
  Hands off a complete feature plan to the factory floor. Uses Spec Kitty to create an 
  isolated working tree for the entire feature to ensure safe parallel execution.
triggers:
  - "isolate feature"
  - "create worktree for"
  - "prepare environment for"
parameters:
  feature_name:
    type: string
    description: "The name of the feature or plan (e.g., feature-cart, payment-gateway)"
    required: true
---

# isolate_feature Skill

Creates an isolated working tree for a complete feature using Spec Kitty.

## Steps

1.  **Create Working Tree**: Execute `spec-kitty start ${feature_name}`.
2.  **Verify Isolation**: Confirm by running `ls -la .worktrees/${feature_name}`.
3.  **Report**: Respond to the user that the environment is ready for the CLI agent.