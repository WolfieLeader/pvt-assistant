import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { DB_NAME } from "~/consts/config";

const expoDb = openDatabaseSync(DB_NAME);
export const db = drizzle(expoDb);
