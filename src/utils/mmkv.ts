import { createMMKV } from "react-native-mmkv";
import { MMKV_ID } from "~/consts/config";

export const mmkv = createMMKV({ id: MMKV_ID });
