---
description: Display kanban board status showing work package progress across lanes (planned/doing/for_review/done).
---
## Status Board

Show the current status of all work packages in the active feature. This displays:
- Kanban board with WPs organized by lane
- Progress bar showing completion percentage
- Parallelization opportunities (which WPs can run concurrently)
- Next steps recommendations

## When to Use

- Before starting work (see what's ready to implement)
- During implementation (track overall progress)
- After completing a WP (see what's next)
- When planning parallelization (identify independent WPs)

## Implementation

Run the CLI command to display the status board:

```bash
spec-kitty agent tasks status
```

To specify a feature explicitly:

```bash
spec-kitty agent tasks status --feature 012-documentation-mission
```

The command displays a rich kanban board with:
- Progress bar showing completion percentage
- Work packages organized by lane (planned/doing/for_review/done)
- Summary metrics

## Alternative: Python API

For programmatic access (e.g., in Jupyter notebooks or scripts), use the Python function:

```python
from specify_cli.agent_utils.status import show_kanban_status

# Auto-detect feature from current directory/branch
result = show_kanban_status()

# Or specify feature explicitly:
# result = show_kanban_status("012-documentation-mission")
```

Returns structured data:

```python
{
    'feature_slug': '012-documentation-mission',
    'progress_percentage': 80.0,
    'done_count': 8,
    'total_wps': 10,
    'by_lane': {
        'planned': ['WP09'],
        'doing': ['WP10'],
        'for_review': [],
        'done': ['WP01', 'WP02', ...]
    },
    'parallelization': {
        'ready_wps': [...],
        'can_parallelize': True/False,
        'parallel_groups': [...]
    }
}

## Output Example

```
в•­в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв•®
в"‚                    012-documentation-mission                        в"‚
в"‚                     Progress: 80% [в--€в--€в--€в--€в--€в--€в--€в--€в--'в--']                      в"‚
в• degreesв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв•Ї

в"Њв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"¬в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"¬в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"¬в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"ђ
в"‚   PLANNED   в"‚    DOING    в"‚ FOR_REVIEW  в"‚    DONE     в"‚
в"њв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"јв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"јв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"јв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"¤
в"‚ WP09        в"‚ WP10        в"‚             в"‚ WP01        в"‚
в"‚             в"‚             в"‚             в"‚ WP02        в"‚
в"‚             в"‚             в"‚             в"‚ WP03        в"‚
в"‚             в"‚             в"‚             в"‚ ...         в"‚
в""в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"ґв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"ґв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"ґв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"

рџ"Ђ Parallelization: WP09 can start (no dependencies)
```