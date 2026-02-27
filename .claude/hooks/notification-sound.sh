#!/usr/bin/env bash
set -euo pipefail

json_input="$(cat)"
event="$(echo "$json_input" | jq -r '.hook_event_name // ""')"

case "$event" in
  Notification)
    afplay /System/Library/Sounds/Blow.aiff &>/dev/null &
    ;;
  Stop)
    msg="$(echo "$json_input" | jq -r '.last_assistant_message // ""')"
    if [[ "$msg" =~ ([Ee]rror|[Ff]ail(ed|ure)?|[Ee]xception|[Uu]nable) ]]; then
      afplay /System/Library/Sounds/Blow.aiff &>/dev/null &
    else
      afplay /System/Library/Sounds/Submarine.aiff &>/dev/null &
    fi
    ;;
esac
