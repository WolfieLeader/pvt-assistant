export const expenseKeys = {
  all: ["expenses"] as const,
  list: (filters?: Record<string, unknown>) => ["expenses", "list", filters] as const,
  detail: (id: string) => ["expenses", "detail", id] as const,
  todayTotal: ["expenses", "today-total"] as const,
  stats: (period: string) => ["expenses", "stats", period] as const,
};
