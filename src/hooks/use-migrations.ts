import { useMigrations as useDrizzleMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useEffect } from "react";
import { db } from "~/db/client";
import { seedCategories } from "~/db/seed";
import migrations from "../../drizzle/migrations";

export const useMigrations = () => {
  const { success, error } = useDrizzleMigrations(db, migrations);

  useEffect(() => {
    if (success) seedCategories();
  }, [success]);

  return { success, error } as const;
};
