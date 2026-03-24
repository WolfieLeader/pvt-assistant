import { View } from "react-native";
import { Pencil, Trash2 } from "lucide-react-native";
import { Button, Chip, CenteredModal, Text } from "~/components";
import { PRIORITY, PRIORITY_LABEL, type Priority } from "~/consts/enums";
import { useDelete } from "~/hooks/use-delete";
import { useTaskForm } from "./task-form-context";

const priorityVariant = {
  [PRIORITY.HIGH]: "danger",
  [PRIORITY.MEDIUM]: "accent",
  [PRIORITY.LOW]: "default",
} as const;

type Props = {
  task: any | null;
  visible: boolean;
  onClose: () => void;
};

export function TaskDetailModal({ task, visible, onClose }: Props) {
  const { presentEdit } = useTaskForm();
  const { deleteTask } = useDelete();

  if (!task) return null;

  const handleEdit = () => {
    onClose();
    presentEdit(task);
  };

  const handleDelete = () => {
    deleteTask(task);
    onClose();
  };

  return (
    <CenteredModal visible={visible} onClose={onClose} title="Task Details">
      <View className="gap-md">
        <Text variant="subtitle" className={task.isDone ? "line-through text-muted" : ""}>
          {task.title}
        </Text>

        <Chip label={PRIORITY_LABEL[task.priority as Priority]} variant={priorityVariant[task.priority as Priority]} />

        {task.categoryName && (
          <View className="flex-row items-center gap-xs">
            <Text variant="caption">{task.categoryIcon}</Text>
            <Text variant="body" color="muted">
              {task.categoryName}
            </Text>
          </View>
        )}

        {task.dueDate && (
          <Text variant="body" color="muted">
            Due:{" "}
            {new Date(`${task.dueDate}T12:00:00`).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        )}

        {task.reminderAt != null && (
          <Text variant="body" color="muted">
            Reminder:{" "}
            {new Date(task.reminderAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </Text>
        )}

        {task.note ? (
          <Text variant="body" color="muted">
            {task.note}
          </Text>
        ) : null}

        <Text variant="body" color={task.isDone ? "accent" : "muted"}>
          {task.isDone ? "Completed" : "Pending"}
        </Text>

        <View className="flex-row gap-sm mt-sm">
          <Button icon={Pencil} label="Edit" onPress={handleEdit} className="flex-1" />
          <Button icon={Trash2} label="Delete" variant="danger" onPress={handleDelete} className="flex-1" />
        </View>
      </View>
    </CenteredModal>
  );
}
