import { View } from "react-native";
import { Pencil, Trash2 } from "lucide-react-native";
import { Button, CenteredModal, Text } from "~/components";
import { usePrivacy } from "~/features/security";
import { useDelete } from "~/hooks/use-delete";
import { useExpenseForm } from "./expense-form-context";
import { INTERVAL_LABEL } from "~/consts/enums";
import type { IntervalUnit } from "~/consts/enums";

type Props = {
  expense: any | null;
  visible: boolean;
  onClose: () => void;
};

export function ExpenseDetailModal({ expense, visible, onClose }: Props) {
  const { formatAmount } = usePrivacy();
  const { deleteExpense } = useDelete();
  const { presentEdit } = useExpenseForm();

  if (!expense) return null;

  const handleEdit = () => {
    onClose();
    presentEdit(expense);
  };

  const handleDelete = () => {
    deleteExpense(expense);
    onClose();
  };

  return (
    <CenteredModal visible={visible} onClose={onClose} title="Expense Details">
      {expense.category && (
        <View className="flex-row items-center gap-xs mb-sm">
          {expense.category.icon && <Text variant="title">{expense.category.icon}</Text>}
          <Text variant="label" color="muted">
            {expense.category.name}
          </Text>
        </View>
      )}

      <Text variant="display" className="mb-md">
        {formatAmount(expense.amount)}
      </Text>

      <Text variant="subtitle" className="mb-xs">
        {expense.title}
      </Text>

      <Text variant="body" color="muted" className="mb-sm">
        {new Date(`${expense.date}T12:00:00`).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </Text>

      {expense.note ? (
        <Text variant="body" color="muted" className="mb-sm">
          {expense.note}
        </Text>
      ) : null}

      {expense.subIntervalUnit != null && (
        <Text variant="caption" color="muted" className="mb-md">
          Recurring {INTERVAL_LABEL[expense.subIntervalUnit as IntervalUnit]}
          {expense.subEndDate && ` until ${expense.subEndDate}`}
        </Text>
      )}

      <View className="flex-row gap-sm mt-md">
        <Button icon={Pencil} label="Edit" variant="primary" size="md" onPress={handleEdit} className="flex-1" />
        <Button icon={Trash2} label="Delete" variant="danger" size="md" onPress={handleDelete} className="flex-1" />
      </View>
    </CenteredModal>
  );
}
