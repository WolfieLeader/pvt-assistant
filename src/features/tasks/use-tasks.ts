import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskKeys } from "./query-keys";
import * as taskService from "./task-service";

export function useTasks(filter: "all" | "today" | "upcoming" | "done" = "all") {
  return useQuery({
    queryKey: taskKeys.list(filter),
    queryFn: () => taskService.listTasks(filter),
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskService.getTask(id),
    enabled: !!id,
  });
}

export function usePendingCount() {
  return useQuery({
    queryKey: taskKeys.pendingCount,
    queryFn: taskService.getPendingCount,
  });
}

export function useUpcomingTasks(limit?: number) {
  return useQuery({
    queryKey: taskKeys.upcoming,
    queryFn: () => taskService.getUpcomingTasks(limit),
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof taskService.updateTask>[1] }) =>
      taskService.updateTask(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

export function useToggleTaskDone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskService.toggleTaskDone,
    onSuccess: () => qc.invalidateQueries({ queryKey: taskKeys.all }),
  });
}
