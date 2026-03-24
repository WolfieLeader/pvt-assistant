import { useQueryClient } from "@tanstack/react-query";
import { hapticFeedback } from "~/consts/haptics";
import { deleteExpense } from "~/features/expenses/expense-service";
import { expenseKeys } from "~/features/expenses/query-keys";
import { deleteTask } from "~/features/tasks/task-service";
import { taskKeys } from "~/features/tasks/query-keys";
import { useDeleteStack } from "~/stores/delete-stack";

export function useDelete() {
  const qc = useQueryClient();
  const { addDeletion, undoDeletion, undoAll, pending, pendingIds } = useDeleteStack();

  return {
    deleteExpense: (expense: { id: string; [k: string]: any }) => {
      hapticFeedback("delete");
      addDeletion(expense.id, "expense", expense, async () => {
        await deleteExpense(expense.id);
        qc.invalidateQueries({ queryKey: expenseKeys.all });
      });
    },

    deleteTask: (task: { id: string; [k: string]: any }) => {
      hapticFeedback("delete");
      addDeletion(task.id, "task", task, async () => {
        await deleteTask(task.id);
        qc.invalidateQueries({ queryKey: taskKeys.all });
      });
    },

    undoLast: () => {
      const last = pending[pending.length - 1];
      if (last) undoDeletion(last.id);
    },

    undoAll,
    pendingCount: pending.length,
    pendingIds,
  } as const;
}
