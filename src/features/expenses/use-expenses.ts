import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseKeys } from "./query-keys";
import * as expenseService from "./expense-service";

export function useExpenses(filters?: { startDate?: string; endDate?: string; search?: string; categoryId?: number }) {
  return useQuery({
    queryKey: expenseKeys.list(filters),
    queryFn: () => expenseService.listExpenses(filters ?? {}),
  });
}

export function useExpense(id: string) {
  return useQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: () => expenseService.getExpense(id),
    enabled: !!id,
  });
}

export function useTodayTotal() {
  return useQuery({
    queryKey: expenseKeys.todayTotal,
    queryFn: expenseService.getTodayTotal,
  });
}

export function useExpenseStats(period: "day" | "week" | "month") {
  return useQuery({
    queryKey: expenseKeys.stats(period),
    queryFn: () => expenseService.getExpenseStats(period),
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: expenseService.createExpense,
    onSuccess: () => qc.invalidateQueries({ queryKey: expenseKeys.all }),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof expenseService.updateExpense>[1] }) =>
      expenseService.updateExpense(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: expenseKeys.all }),
  });
}
