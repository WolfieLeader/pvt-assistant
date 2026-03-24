import { useState } from "react";
import { Pressable, View } from "react-native";
import { Check, Pencil, Trash2 } from "lucide-react-native";
import { ContextMenu, SwipeableCard, Text } from "~/components";
import { hapticFeedback } from "~/consts/haptics";
import { PRIORITY } from "~/consts/enums";
import { useDelete } from "~/hooks/use-delete";
import { cn } from "~/utils/cn";
import { useToggleTaskDone } from "../use-tasks";
import { useTaskForm } from "./task-form-context";
import { TaskDetailModal } from "./task-detail-modal";

const priorityColor = {
  [PRIORITY.HIGH]: "bg-danger",
  [PRIORITY.MEDIUM]: "bg-accent",
  [PRIORITY.LOW]: "bg-muted",
} as const;

function formatDueDate(dateStr?: string | null): string | null {
  if (!dateStr) return null;
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  if (dateStr === today) return "Due today";
  if (dateStr === tomorrow) return "Due tomorrow";
  if (dateStr < today!) return "Overdue";
  return `Due ${new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

function Checkbox({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <Pressable
      onPress={onToggle}
      className={cn(
        "w-6 h-6 rounded-full border-2 items-center justify-center",
        checked ? "bg-success border-success" : "border-muted",
      )}
      hitSlop={8}>
      {checked && <Check size={14} color="#fff" />}
    </Pressable>
  );
}

type Props = {
  task: any;
};

export function TaskCard({ task }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const { mutate: toggleDone } = useToggleTaskDone();
  const { presentEdit } = useTaskForm();
  const { deleteTask } = useDelete();

  const handleToggle = () => {
    hapticFeedback("success");
    toggleDone(task.id);
  };

  const dueLabel = formatDueDate(task.dueDate);

  const subtitle = [
    task.categoryIcon && task.categoryName ? `${task.categoryIcon} ${task.categoryName}` : null,
    dueLabel,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <ContextMenu
        actions={[
          { label: "Edit", icon: Pencil, onPress: () => presentEdit(task) },
          { label: "Delete", icon: Trash2, variant: "danger", onPress: () => deleteTask(task) },
        ]}>
        <SwipeableCard onDelete={() => deleteTask(task)}>
          <Pressable onPress={() => setModalVisible(true)} className="flex-row items-center px-md py-sm gap-sm">
            <Checkbox checked={!!task.isDone} onToggle={handleToggle} />

            <View className="flex-1">
              <Text variant="body" className={cn("font-sans-medium", task.isDone && "line-through text-muted")}>
                {task.title}
              </Text>
              {subtitle ? (
                <Text variant="caption" color="muted">
                  {subtitle}
                </Text>
              ) : null}
            </View>

            <View
              className={cn(
                "w-2.5 h-2.5 rounded-full",
                priorityColor[task.priority as keyof typeof priorityColor] ?? "bg-muted",
              )}
            />
          </Pressable>
        </SwipeableCard>
      </ContextMenu>

      <TaskDetailModal task={task} visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}
