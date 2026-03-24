import { useEffect, useRef, type PropsWithChildren } from "react";
import { AppState } from "react-native";
import { deleteExpense } from "~/features/expenses/expense-service";
import { deleteTask } from "~/features/tasks/task-service";
import { useDeleteStack } from "~/stores/delete-stack";

export function DeleteStackProvider({ children }: PropsWithChildren) {
  const commitAll = useDeleteStack((s) => s.commitAll);
  const rehydrate = useDeleteStack((s) => s.rehydrateAndCleanup);
  const didRehydrate = useRef(false);

  useEffect(() => {
    if (!didRehydrate.current) {
      didRehydrate.current = true;
      rehydrate(async (id, type) => {
        if (type === "expense") await deleteExpense(id);
        else await deleteTask(id);
      });
    }
  }, [rehydrate]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "background" || state === "inactive") {
        commitAll();
      }
    });
    return () => sub.remove();
  }, [commitAll]);

  return <>{children}</>;
}
