// TODO: replace with useDrizzleMigrations when schema is added (Phase 5+)
export const useMigrations = () => {
  return { migrationsSuccess: true as const, migrationsError: undefined };
};
