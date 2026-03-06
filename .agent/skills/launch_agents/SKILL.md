---
name: launch_agents
description: >
  Starts Gemini CLI agents in parallel within their respective isolated working trees 
  using tmux.
triggers:
  - "start agents for"
  - "launch factory for"
  - "begin parallel execution of"
parameters:
  features:
    type: string
    description: "Space-separated list of feature names (e.g., 'feature-cart feature-payment')"
    required: true
---

# Launch Agents Skill

This skill delegates the parallel execution of planned features to a dedicated bash script. It spins up background `tmux` sessions so multiple Gemini CLI agents can work simultaneously in their isolated worktrees.

## Steps for the Agent

1.  **Execute the Factory Script**: 
    Run the local bash script located in the `/scripts` directory, passing the requested features as arguments. 
    Execute exactly this command in the terminal:
    `.agent/skills/launch_agents/scripts/launch_factory.sh ${features}`

2.  **Verify Execution**: 
    Check the terminal output to ensure the tmux sessions were successfully created and no "not found" errors were thrown for the worktrees.

3.  **Report to User**: 
    Inform the user that the agents are running in the background. Explicitly remind them to use `tmux attach -t <feature_name>` to view the live progress of any specific working tree.