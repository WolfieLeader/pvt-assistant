import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { createContext, useCallback, useContext, useRef, useState, type PropsWithChildren } from "react";
import { ExpenseFormSheet } from "./expense-form-sheet";

type Expense = {
  id: string;
  title: string;
  note?: string | null;
  amount: number;
  categoryId?: number | null;
  date?: string | null;
  subIntervalUnit?: number | null;
  subIntervalValue?: number | null;
  subEndDate?: string | null;
};

interface ExpenseFormContextValue {
  presentAdd: () => void;
  presentEdit: (expense: Expense) => void;
  dismiss: () => void;
}

const ExpenseFormContext = createContext<ExpenseFormContextValue | null>(null);

export function ExpenseFormProvider({ children }: PropsWithChildren) {
  const ref = useRef<BottomSheetModal>(null);
  const [editing, setEditing] = useState<Expense | null>(null);

  const presentAdd = useCallback(() => {
    setEditing(null);
    ref.current?.present();
  }, []);

  const presentEdit = useCallback((expense: Expense) => {
    setEditing(expense);
    ref.current?.present();
  }, []);

  const dismiss = useCallback(() => {
    ref.current?.dismiss();
  }, []);

  return (
    <ExpenseFormContext.Provider value={{ presentAdd, presentEdit, dismiss }}>
      {children}
      <ExpenseFormSheet ref={ref} expense={editing} onDismiss={() => setEditing(null)} />
    </ExpenseFormContext.Provider>
  );
}

export function useExpenseForm() {
  const ctx = useContext(ExpenseFormContext);
  if (!ctx) throw new Error("useExpenseForm must be inside ExpenseFormProvider");
  return ctx;
}
