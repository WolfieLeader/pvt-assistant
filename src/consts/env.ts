import Constants from "expo-constants";
import { z } from "zod";

const zStr = z.string().min(1);

const zAppConfig = z.object({
  name: zStr,
  slug: zStr,
  version: zStr,
});

const raw = Constants.expoConfig;
if (!raw) throw new Error("Missing expoConfig");
export const APP_CONFIG = zAppConfig.parse(raw);

if (__DEV__) console.log("[env] APP_CONFIG", APP_CONFIG);
