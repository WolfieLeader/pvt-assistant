import { useMemo } from "react";
import { useDeleteStack } from "~/stores/delete-stack";

export function useFilteredData<T extends { id: string }>(data: T[] | undefined): T[] {
  const pendingIds = useDeleteStack((s) => s.pendingIds);
  return useMemo(() => (data ?? []).filter((item) => !pendingIds.has(item.id)), [data, pendingIds]);
}
