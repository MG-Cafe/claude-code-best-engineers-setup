---
description: Review the current diff with a fresh reviewer, so reviews converge instead of looping
argument-hint: [round number, default 1]
---

Review round: $ARGUMENTS (treat an empty value as 1).

Use the reviewer subagent on the current change. Give it the task, the spec file if there is one, and the output of `git diff` (only the changes since the last review if this is round 2 or later).

Then:
- Fix only findings that affect correctness, security or the requirements. Do not fix style nits.
- If this is round 3 or later and real problems remain, stop fixing. Summarise what keeps failing and propose a different approach for me to decide on.
