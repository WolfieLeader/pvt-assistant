import type { Plugin } from "@opencode-ai/plugin";

export const NotificationSoundPlugin: Plugin = async ({ $ }) => {
  const play = async (file: string) => {
    try {
      await $`afplay ${file}`;
    } catch {}
  };

  return {
    event: async ({ event }) => {
      if (event.type === "permission.updated" || event.type === "session.error") {
        await play("/System/Library/Sounds/Blow.aiff");
      }

      if (event.type === "session.idle") {
        await play("/System/Library/Sounds/Submarine.aiff");
      }
    },
  };
};
