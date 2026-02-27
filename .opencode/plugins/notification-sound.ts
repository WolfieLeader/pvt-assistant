import type { Plugin } from "@opencode-ai/plugin";

export const NotificationSoundPlugin: Plugin = async ({ $ }) => {
  const play = async (file: string) => {
    try {
      await $`afplay ${file}`;
    } catch {}
  };

  return {
    "permission.ask": async (_input, _output) => {
      await play("/System/Library/Sounds/Blow.aiff");
    },
    event: async ({ event }) => {
      if (event.type === "session.status") {
        if (event.properties.status.type === "idle") {
          await play("/System/Library/Sounds/Submarine.aiff");
        }
      }

      if (event.type === "session.error") {
        await play("/System/Library/Sounds/Blow.aiff");
      }
    },
  };
};
