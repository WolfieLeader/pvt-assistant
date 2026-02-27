#!/usr/bin/env bash
COMMAND=$(jq -r '.tool_input.command' < /dev/stdin)
if [[ "$COMMAND" =~ (^|[[:space:]]|&&|\||;)git[[:space:]]+commit ]]; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Git commit is blocked. User reviews and commits manually."
    }
  }'
fi
