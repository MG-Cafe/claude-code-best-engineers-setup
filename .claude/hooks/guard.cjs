#!/usr/bin/env node
// PreToolUse guard for Bash commands (practice 3 in the video: hooks that fail closed).
// Exit 2 blocks the command and shows the message to Claude; exit 0 lets it run.
// settings.json sets "onFailure": "block", so if this script crashes, is missing or times out,
// the command is blocked too, instead of slipping through unchecked.
const { execSync } = require('child_process');

let raw = '';
process.stdin.on('data', (d) => (raw += d));
process.stdin.on('end', () => {
  const input = JSON.parse(raw);
  const cmd = (input.tool_input && input.tool_input.command) || '';

  // no direct pushes to main or master
  if (/\bgit\s+push\b/.test(cmd) && /\b(main|master)\b/.test(cmd)) {
    console.error('Blocked by guard.cjs: no direct pushes to main or master. Push a branch and open a pull request.');
    process.exit(2);
  }

  // no obvious secrets in a commit
  if (/\bgit\s+commit\b/.test(cmd)) {
    const staged = execSync('git diff --cached -U0', { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const secrets = [
      /AKIA[0-9A-Z]{16}/,                                  // AWS access key id
      /-----BEGIN [A-Z ]*PRIVATE KEY-----/,                // private keys
      /\bsk-ant-[A-Za-z0-9_-]{20,}/,                       // Anthropic API keys
      /\bgh[pousr]_[A-Za-z0-9]{36}\b/,                     // GitHub tokens
      /\bxox[abprs]-[A-Za-z0-9-]{10,}/,                    // Slack tokens
    ];
    if (secrets.some((p) => p.test(staged))) {
      console.error('Blocked by guard.cjs: the staged changes look like they contain a secret. Remove it, then commit again.');
      process.exit(2);
    }
  }
  process.exit(0);
});
