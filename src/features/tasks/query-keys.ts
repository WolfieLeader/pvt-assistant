export const taskKeys = {
  all: ["tasks"] as const,
  list: (filter?: string) => ["tasks", "list", filter] as const,
  detail: (id: string) => ["tasks", "detail", id] as const,
  pendingCount: ["tasks", "pending-count"] as const,
  upcoming: ["tasks", "upcoming"] as const,
};
