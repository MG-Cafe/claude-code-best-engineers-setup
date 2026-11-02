# How the Best Engineers Use Claude Code: the setup

The setup from my YouTube video [How the Best Engineers Use Claude Code](https://youtu.be/DuPZopuZzL8): nine practices
from the team that builds Claude Code at Anthropic, ready to add to your own project. Not better prompts, a better setup
around Claude.

The full guide to every practice, with the sources, is free in my community:
[How the Best Engineers Use Claude Code, the lesson](https://mgai.school/mg-ai/about).

## Let Claude Code set it up for you

Open Claude Code in your project and paste this:

```
Set up the practices from https://github.com/MG-Cafe/claude-code-best-engineers-setup in this project.
Copy its .claude folder here. If I already have .claude/settings.json, merge its permissions, env and hooks
blocks into mine and keep my existing rules. Add its CLAUDE.md only if I don't have one.
Then run the two hook tests from its README and show me the exit codes.
```

## Or do it by hand

1. Download this repository (Code, then Download ZIP) or clone it.
2. Copy the `.claude` folder into your project. On a Mac, press Cmd+Shift+. in Finder to see folders that start
   with a dot.
3. Copy `CLAUDE.md` too if your project doesn't have one, and fill in its three lines.
4. Already have a `.claude/settings.json`? Merge the `permissions`, `env` and `hooks` blocks into yours.
5. Run `claude update`. You need a Claude Code version from Oct 31, 2026 or later (`onFailure` arrived in 2.1.295,
   `CLAUDE_CODE_SUBAGENT_EFFORT` in 2.1.316).

The hook runs with Node.js, so `node --version` has to work in your terminal. Because the hook fails closed, a
missing `node` blocks every Bash command. That is the point of failing closed: install Node, or remove the `hooks`
block if you don't want this check.

## What's inside

| Practice | Where | What it does |
|---|---|---|
| 1. A fresh reviewer, never a fork | `.claude/agents/reviewer.md` | A reviewer subagent that never saw the conversation, so it doesn't share its blind spots. For a quick review, run the built in `/code-review`. |
| 2. Ask before any push | `.claude/settings.json` | `ask` rules for `git push` and `gh pr create`, so auto mode stops and asks. `blockWritesOutsideWorkingDirectories` keeps every edit inside your project. |
| 3. Hooks that fail closed | `.claude/settings.json`, `.claude/hooks/guard.cjs` | Blocks pushes to main or master and commits that contain obvious secrets. `"onFailure": "block"` means a hook that crashes, has a wrong path or times out blocks the command instead of letting it through. |
| 4. Reviews that actually finish | `.claude/commands/converge-review.md` | `/converge-review 1`, `2`, `3`: skips style, reviews only the new diff from round 2 on, and after three rounds asks you to rethink the approach. In CI use `claude ultrareview <PR> --json --trust-workspace`, not `claude -p "/code-review ..."`. |
| 5. Low to build, high to verify | how you work | Implement with `/effort low` while you steer, then verify and test with `/effort high`. Type `ultrathink` while Claude is working to raise the effort for the rest of that turn only. |
| 6. Effort per subagent | `.claude/settings.json` (`env`) | `CLAUDE_CODE_SUBAGENT_EFFORT=low`: subagents stop inheriting your effort level. Open `/usage` and press F to apply its fixes. |
| 7. Compact before a break | how you work | Before you step away, run `/compact` with a focus, for example `/compact keep the open bugs and the test plan`. To drop a dead end, use `/rewind`, not `/compact`: it goes back to a part that's already cached. |
| 8. Delete old instructions | `CLAUDE.md` | A short starting file. After every model upgrade run `/doctor prompt-audit`, delete what the model no longer needs, and add back only what it misses. |
| 9. Explainers you can review | `.claude/commands/explain-change.md` | `/explain-change`: the alternative approaches and what rules each one out, what it couldn't confirm and where it looked, and one HTML page with a diagram. (Asking for "the approaches you considered and rejected" can trip Opus 5.5's reasoning safeguard; this wording does not.) |

## Test the hook

```
echo '{"tool_input":{"command":"git push origin main"}}' | node .claude/hooks/guard.cjs; echo "exit $?"   # exit 2 = blocked
echo '{"tool_input":{"command":"ls"}}' | node .claude/hooks/guard.cjs; echo "exit $?"                      # exit 0 = allowed
```

The hook is a `.cjs` file on purpose: in a repository whose `package.json` says `"type": "module"`, a `.js` hook
written with `require` crashes. Without `"onFailure": "block"`, that crash would let every command through.

## Sources

- Claude Code best practices: https://code.claude.com/docs/en/best-practices
- Auto mode configuration: https://code.claude.com/docs/en/auto-mode-config
- Hooks, block the action when a hook fails: https://code.claude.com/docs/en/hooks#block-the-action-when-a-hook-fails
- How the Claude Code team does code review (Oct 15): https://claude.dev/blog/solving-code-review-at-anthropic/
- Ultrareview: https://code.claude.com/docs/en/ultrareview
- Spending your effort (Sep 25): https://claude.dev/blog/spending-your-effort/
- Boris Cherny on subagent effort (Oct 28, Oct 29): https://x.com/bcherny/status/2115592371224346734, https://x.com/bcherny/status/2115859487068422226
- What a task costs on Opus 5.5 (Sep 25): https://claude.dev/blog/what-a-task-costs-on-opus-5-5/
- Prompt caching: https://code.claude.com/docs/en/prompt-caching
- Audit your instruction files: https://code.claude.com/docs/en/memory#audit-your-instruction-files
- Andrej Karpathy (Oct 2): https://x.com/karpathy/status/2105819303471976479
