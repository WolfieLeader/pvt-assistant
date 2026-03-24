import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useForm } from "@tanstack/react-form";
import { CalendarPlus, Bell } from "lucide-react-native";
import { forwardRef, useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { useCSSVariable } from "uniwind";
import { Button, Chip, DatePicker, Text, TextInput } from "~/components";
import { CategoryPicker, type CategoryPickerRef } from "~/components/category-picker";
import { hapticFeedback } from "~/consts/haptics";
import { PRIORITY, PRIORITY_LABEL, type Priority } from "~/consts/enums";
import { useCategories } from "~/hooks/use-categories";
import { useCreateTask, useUpdateTask } from "../use-tasks";

const SNAP_POINTS = ["90%"];

type Task = {
  id: string;
  title: string;
  note?: string | null;
  priority: number;
  categoryId?: number | null;
  dueDate?: string | null;
  reminderAt?: number | null;
};

type Props = {
  task: Task | null;
  onDismiss: () => void;
};

export const TaskFormSheet = forwardRef<BottomSheetModal, Props>(function TaskFormSheet({ task, onDismiss }, ref) {
  const [bg, handleColor, muted] = useCSSVariable(["--color-background", "--color-muted", "--color-muted"]) as string[];
  const categoryPickerRef = useRef<CategoryPickerRef>(null);
  const { data: categories } = useCategories();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const isEdit = !!task;

  const [showDueDate, setShowDueDate] = useState(!!task?.dueDate);
  const [showReminder, setShowReminder] = useState(!!task?.reminderAt);

  const form = useForm({
    defaultValues: {
      title: task?.title ?? "",
      priority: task?.priority ?? PRIORITY.MEDIUM,
      categoryId: task?.categoryId ?? undefined,
      dueDate: task?.dueDate ?? undefined,
      reminderAt: task?.reminderAt ?? undefined,
      note: task?.note ?? undefined,
    },
    onSubmit: async ({ value }) => {
      const data = {
        title: value.title,
        priority: value.priority,
        categoryId: value.categoryId ?? null,
        dueDate: showDueDate ? (value.dueDate ?? null) : null,
        reminderAt: showReminder ? (value.reminderAt ?? null) : null,
        note: value.note ?? null,
      };

      if (isEdit) {
        await updateTask.mutateAsync({ id: task.id, data });
      } else {
        await createTask.mutateAsync(data);
      }
      hapticFeedback("success");
      onDismiss();
    },
  });

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    [],
  );

  const findCategory = (id?: number) => {
    if (!id || !categories) return null;
    for (const parent of categories) {
      if (parent.id === id) return parent;
      const child = parent.children.find((c) => c.id === id);
      if (child) return child;
    }
    return null;
  };

  return (
    <>
      <BottomSheetModal
        ref={ref}
        snapPoints={SNAP_POINTS}
        enableDynamicSizing={false}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backgroundStyle={{ backgroundColor: bg }}
        handleIndicatorStyle={{ backgroundColor: handleColor }}
        backdropComponent={renderBackdrop}
        onDismiss={onDismiss}>
        <BottomSheetScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          <View className="px-lg gap-lg pb-xl">
            <Text variant="title" className="text-center">
              {isEdit ? "Edit Task" : "Add Task"}
            </Text>

            <form.Field name="title">
              {(field) => (
                <TextInput
                  label="Title"
                  placeholder="What needs to be done?"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  error={field.state.meta.errors[0]}
                />
              )}
            </form.Field>

            <form.Field name="priority">
              {(field) => (
                <View className="gap-xs">
                  <Text variant="caption" color="muted">
                    Priority
                  </Text>
                  <View className="flex-row gap-sm">
                    {(Object.entries(PRIORITY) as [string, Priority][]).map(([key, val]) => (
                      <Chip
                        key={key}
                        label={PRIORITY_LABEL[val]}
                        selected={field.state.value === val}
                        onPress={() => field.handleChange(val)}
                        variant={
                          field.state.value === val
                            ? val === PRIORITY.HIGH
                              ? "danger"
                              : val === PRIORITY.LOW
                                ? "default"
                                : "accent"
                            : "default"
                        }
                      />
                    ))}
                  </View>
                </View>
              )}
            </form.Field>

            <form.Field name="categoryId">
              {(field) => {
                const cat = findCategory(field.state.value);
                return (
                  <View className="gap-xs">
                    <Text variant="caption" color="muted">
                      Category
                    </Text>
                    <Chip
                      label={cat ? `${cat.icon} ${cat.name}` : "Select category"}
                      variant={cat ? "accent" : "default"}
                      onPress={() => categoryPickerRef.current?.present()}
                    />
                  </View>
                );
              }}
            </form.Field>

            {showDueDate ? (
              <form.Field name="dueDate">
                {(field) => (
                  <View className="gap-xs">
                    <Text variant="caption" color="muted">
                      Due date
                    </Text>
                    <DatePicker
                      value={field.state.value ? new Date(`${field.state.value}T12:00:00`) : new Date()}
                      onChange={(d) => field.handleChange(d.toISOString().split("T")[0]!)}
                    />
                  </View>
                )}
              </form.Field>
            ) : (
              <Chip
                label="Add due date"
                icon={<CalendarPlus size={16} color={muted} />}
                onPress={() => {
                  setShowDueDate(true);
                  form.setFieldValue("dueDate", new Date().toISOString().split("T")[0]!);
                }}
              />
            )}

            {showReminder ? (
              <form.Field name="reminderAt">
                {(field) => (
                  <View className="gap-xs">
                    <Text variant="caption" color="muted">
                      Reminder
                    </Text>
                    <DatePicker
                      value={field.state.value ? new Date(field.state.value) : new Date()}
                      onChange={(d) => field.handleChange(d.getTime())}
                      mode="datetime"
                    />
                  </View>
                )}
              </form.Field>
            ) : (
              <Chip
                label="Add reminder"
                icon={<Bell size={16} color={muted} />}
                onPress={() => setShowReminder(true)}
              />
            )}

            <form.Field name="note">
              {(field) => (
                <TextInput
                  label="Note"
                  placeholder="Optional note"
                  value={field.state.value ?? ""}
                  onChangeText={field.handleChange}
                  multiline
                  numberOfLines={3}
                />
              )}
            </form.Field>

            <form.Subscribe selector={(s) => [s.isSubmitting, s.canSubmit] as const}>
              {([isSubmitting, canSubmit]) => (
                <Button
                  label={isEdit ? "Save" : "Add Task"}
                  onPress={form.handleSubmit}
                  loading={isSubmitting}
                  disabled={!canSubmit}
                  size="lg"
                  className="w-full"
                />
              )}
            </form.Subscribe>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>

      <form.Field name="categoryId">
        {(field) => (
          <CategoryPicker ref={categoryPickerRef} selectedId={field.state.value} onSelect={field.handleChange} />
        )}
      </form.Field>
    </>
  );
});
