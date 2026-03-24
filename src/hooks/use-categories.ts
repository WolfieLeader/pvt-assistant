import { useQuery } from "@tanstack/react-query";
import { db } from "~/db/client";
import { categories } from "~/db/schema";

export type CategoryNode = {
  id: number;
  name: string;
  icon: string;
  color: string | null;
  children: CategoryNode[];
};

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<CategoryNode[]> => {
      const all = await db.select().from(categories);
      const parents = all.filter((c) => !c.parentId);
      return parents.map((p) => ({
        id: p.id,
        name: p.name,
        icon: p.icon,
        color: p.color,
        children: all
          .filter((c) => c.parentId === p.id)
          .map((c) => ({
            id: c.id,
            name: c.name,
            icon: c.icon,
            color: c.color ?? p.color,
            children: [],
          })),
      }));
    },
    staleTime: Infinity,
  });
}
