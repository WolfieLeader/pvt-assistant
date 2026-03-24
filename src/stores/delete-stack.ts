import { create } from "zustand";
import { mmkv } from "~/utils/mmkv";

const MMKV_KEY = "delete-stack";
const HOLD_MS = 60_000;

type PendingDeletion = {
  id: string;
  type: "expense" | "task";
  item: any;
  deletedAt: number;
  timerId: ReturnType<typeof setTimeout>;
  onCommit: () => Promise<void>;
};

type DeleteStackState = {
  pending: PendingDeletion[];
  pendingIds: Set<string>;
  addDeletion: (id: string, type: "expense" | "task", item: any, onCommit: () => Promise<void>) => void;
  undoDeletion: (id: string) => void;
  undoAll: () => void;
  commitAll: () => Promise<void>;
  rehydrateAndCleanup: (commitFn: (id: string, type: "expense" | "task") => Promise<void>) => Promise<void>;
};

function persistToMmkv(pending: PendingDeletion[]) {
  const data = pending.map(({ id, type }) => ({ id, type }));
  mmkv.set(MMKV_KEY, JSON.stringify(data));
}

function clearMmkv() {
  mmkv.remove(MMKV_KEY);
}

function readMmkv(): { id: string; type: "expense" | "task" }[] {
  const raw = mmkv.getString(MMKV_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export const useDeleteStack = create<DeleteStackState>((set, get) => ({
  pending: [],
  pendingIds: new Set(),

  addDeletion: (id, type, item, onCommit) => {
    const timerId = setTimeout(async () => {
      try {
        await onCommit();
      } catch {}
      set((s) => {
        const next = s.pending.filter((p) => p.id !== id);
        const ids = new Set(next.map((p) => p.id));
        persistToMmkv(next);
        return { pending: next, pendingIds: ids };
      });
    }, HOLD_MS);

    set((s) => {
      const entry: PendingDeletion = { id, type, item, deletedAt: Date.now(), timerId, onCommit };
      const next = [...s.pending, entry];
      const ids = new Set(next.map((p) => p.id));
      persistToMmkv(next);
      return { pending: next, pendingIds: ids };
    });
  },

  undoDeletion: (id) => {
    set((s) => {
      const entry = s.pending.find((p) => p.id === id);
      if (entry) clearTimeout(entry.timerId);
      const next = s.pending.filter((p) => p.id !== id);
      const ids = new Set(next.map((p) => p.id));
      persistToMmkv(next);
      return { pending: next, pendingIds: ids };
    });
  },

  undoAll: () => {
    const { pending } = get();
    pending.forEach((p) => clearTimeout(p.timerId));
    clearMmkv();
    set({ pending: [], pendingIds: new Set() });
  },

  commitAll: async () => {
    const { pending } = get();
    for (const p of pending) {
      clearTimeout(p.timerId);
      try {
        await p.onCommit();
      } catch {}
    }
    clearMmkv();
    set({ pending: [], pendingIds: new Set() });
  },

  rehydrateAndCleanup: async (commitFn) => {
    const stale = readMmkv();
    if (!stale.length) return;
    for (const { id, type } of stale) {
      try {
        await commitFn(id, type);
      } catch {}
    }
    clearMmkv();
  },
}));
