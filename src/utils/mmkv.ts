import { createMMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";
import { MMKV_ID } from "~/consts/config";

export const mmkv = createMMKV({ id: MMKV_ID });

export const mmkvStorage: StateStorage = {
  getItem: (name) => mmkv.getString(name) ?? null,
  setItem: (name, value) => mmkv.set(name, value),
  removeItem: (name) => mmkv.remove(name),
};
