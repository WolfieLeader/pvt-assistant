import { useState } from "react";
import { Pressable, View } from "react-native";
import { Pencil, Trash2 } from "lucide-react-native";
import { ContextMenu, SwipeableCard, Text } from "~/components";
import { usePrivacy } from "~/features/security";
import { useDelete } from "~/hooks/use-delete";
import { useSettingsStore } from "~/stores/settings";
import { fromCents } from "~/utils/amount";
import { useExpenseForm } from "./expense-form-context";
import { ExpenseDetailModal } from "./expense-detail-modal";

function formatRelativeDate(dateStr: string): string {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

type Props = {
  expense: any;
};

export function ExpenseCard({ expense }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const { formatAmount, formatHours } = usePrivacy();
  const { deleteExpense } = useDelete();
  const { presentEdit } = useExpenseForm();
  const hourlyRate = useSettingsStore((s) => s.hourlyRate);

  const subtitle = [
    expense.category?.parent?.name ?? expense.category?.name,
    expense.category?.parent ? expense.category.name : null,
    expense.date ? formatRelativeDate(expense.date) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const hours = hourlyRate ? fromCents(expense.amount) / hourlyRate : null;

  return (
    <>
      <SwipeableCard onDelete={() => deleteExpense(expense)}>
        <ContextMenu
          actions={[
            { label: "Edit", icon: Pencil, onPress: () => presentEdit(expense) },
            {
              label: "Delete",
              icon: Trash2,
              variant: "danger",
              onPress: () => deleteExpense(expense),
            },
          ]}>
          <Pressable onPress={() => setModalVisible(true)} className="flex-row items-center px-md py-sm">
            {expense.category?.icon && (
              <Text variant="title" className="mr-sm">
                {expense.category.icon}
              </Text>
            )}

            <View className="flex-1">
              <Text variant="label" numberOfLines={1}>
                {expense.title}
              </Text>
              {subtitle ? (
                <Text variant="caption" color="muted" numberOfLines={1}>
                  {subtitle}
                </Text>
              ) : null}
            </View>

            <View className="items-end ml-sm">
              <Text variant="label">-{formatAmount(expense.amount)}</Text>
              {hours != null && (
                <Text variant="caption" color="muted">
                  ≈ {formatHours(Number.parseFloat(hours.toFixed(1)))}
                </Text>
              )}
            </View>
          </Pressable>
        </ContextMenu>
      </SwipeableCard>

      <ExpenseDetailModal expense={expense} visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}
