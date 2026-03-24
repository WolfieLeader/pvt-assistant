import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { createContext, useCallback, useContext, useRef, useState, type PropsWithChildren } from "react";
import { TaskFormSheet } from "./task-form-sheet";

type Task = {
  id: string;
  title: string;
  note?: string | null;
  priority: number;
  categoryId?: number | null;
  dueDate?: string | null;
  reminderAt?: number | null;
};

interface TaskFormContextValue {
  presentAdd: () => void;
  presentEdit: (task: Task) => void;
  dismiss: () => void;
}

const TaskFormContext = createContext<TaskFormContextValue | null>(null);

export function TaskFormProvider({ children }: PropsWithChildren) {
  const ref = useRef<BottomSheetModal>(null);
  const [editing, setEditing] = useState<Task | null>(null);

  const presentAdd = useCallback(() => {
    setEditing(null);
    ref.current?.present();
  }, []);

  const presentEdit = useCallback((task: Task) => {
    setEditing(task);
    ref.current?.present();
  }, []);

  const dismiss = useCallback(() => {
    ref.current?.dismiss();
  }, []);

  return (
    <TaskFormContext.Provider value={{ presentAdd, presentEdit, dismiss }}>
      {children}
      <TaskFormSheet ref={ref} task={editing} onDismiss={() => setEditing(null)} />
    </TaskFormContext.Provider>
  );
}

export function useTaskForm() {
  const ctx = useContext(TaskFormContext);
  if (!ctx) throw new Error("useTaskForm must be inside TaskFormProvider");
  return ctx;
}
