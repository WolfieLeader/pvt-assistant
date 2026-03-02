import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { DB_NAME } from "~/consts/config";
import * as schema from "./schema";

const expoDb = openDatabaseSync(DB_NAME);
expoDb.execSync("PRAGMA foreign_keys = ON");
export const db = drizzle(expoDb, { schema });
