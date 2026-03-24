import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useForm } from "@tanstack/react-form";
import { forwardRef, useCallback, useRef } from "react";
import { Pressable, Switch, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { Button, Chip, DatePicker, SoftKeyboard, Text, TextInput } from "~/components";
import { CategoryPicker, type CategoryPickerRef } from "~/components/category-picker";
import { hapticFeedback } from "~/consts/haptics";
import { INTERVAL_LABEL, INTERVAL_UNIT, type IntervalUnit } from "~/consts/enums";
import { useCategories } from "~/hooks/use-categories";
import { toCents, formatAmount } from "~/utils/amount";
import { useCreateExpense, useUpdateExpense } from "../use-expenses";

const SNAP_POINTS = ["90%"];

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

type Props = {
  expense: Expense | null;
  onDismiss: () => void;
};

function today() {
  return new Date().toISOString().split("T")[0]!;
}

export const ExpenseFormSheet = forwardRef<BottomSheetModal, Props>(function ExpenseFormSheet(
  { expense, onDismiss },
  ref,
) {
  const [bg, handleColor, accent] = useCSSVariable([
    "--color-background",
    "--color-muted",
    "--color-accent",
  ]) as string[];
  const categoryPickerRef = useRef<CategoryPickerRef>(null);
  const { data: categories } = useCategories();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const isEdit = !!expense;

  const form = useForm({
    defaultValues: {
      amount: expense ? String(expense.amount / 100) : "",
      title: expense?.title ?? "",
      categoryId: expense?.categoryId ?? undefined,
      date: expense?.date ?? today(),
      note: expense?.note ?? undefined,
      isRecurring: !!(expense?.subIntervalUnit != null),
      subIntervalUnit: expense?.subIntervalUnit ?? undefined,
      subIntervalValue: expense?.subIntervalValue ?? undefined,
      subEndDate: expense?.subEndDate ?? undefined,
    },
    onSubmit: async ({ value }) => {
      const data = {
        title: value.title,
        amount: toCents(Number.parseFloat(value.amount)),
        categoryId: value.categoryId ?? null,
        date: value.date,
        note: value.note ?? null,
        subIntervalUnit: value.isRecurring ? (value.subIntervalUnit ?? null) : null,
        subIntervalValue: value.isRecurring ? (value.subIntervalValue ?? null) : null,
        subEndDate: value.isRecurring ? (value.subEndDate ?? null) : null,
      };

      if (isEdit) {
        await updateExpense.mutateAsync({ id: expense.id, data });
      } else {
        await createExpense.mutateAsync(data);
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
          <View className="px-lg gap-lg pb-md">
            <Text variant="title" className="text-center">
              {isEdit ? "Edit Expense" : "Add Expense"}
            </Text>

            <form.Field name="amount">
              {(field) => (
                <View className="items-center py-md">
                  <Text variant="display" className="text-accent">
                    {field.state.value ? formatAmount(toCents(Number.parseFloat(field.state.value) || 0)) : "$0.00"}
                  </Text>
                  {field.state.meta.errors.length > 0 && (
                    <Text variant="caption" color="danger" className="mt-xs">
                      {field.state.meta.errors[0]}
                    </Text>
                  )}
                </View>
              )}
            </form.Field>

            <form.Field name="title">
              {(field) => (
                <TextInput
                  label="Title"
                  placeholder="What did you spend on?"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  error={field.state.meta.errors[0]}
                />
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

            <form.Field name="date">
              {(field) => (
                <View className="gap-xs">
                  <Text variant="caption" color="muted">
                    Date
                  </Text>
                  <DatePicker
                    value={new Date(`${field.state.value}T12:00:00`)}
                    onChange={(d) => field.handleChange(d.toISOString().split("T")[0]!)}
                    maximumDate={new Date()}
                  />
                </View>
              )}
            </form.Field>

            <form.Field name="note">
              {(field) => (
                <TextInput
                  label="Note"
                  placeholder="Optional note"
                  value={field.state.value ?? ""}
                  onChangeText={field.handleChange}
                  multiline
                  numberOfLines={2}
                />
              )}
            </form.Field>

            <form.Field name="isRecurring">
              {(field) => (
                <Pressable
                  onPress={() => {
                    hapticFeedback("toggle");
                    field.handleChange(!field.state.value);
                  }}
                  className="flex-row items-center justify-between py-sm">
                  <Text variant="label">Recurring</Text>
                  <Switch value={field.state.value} onValueChange={field.handleChange} trackColor={{ true: accent }} />
                </Pressable>
              )}
            </form.Field>

            <form.Subscribe selector={(s) => s.values.isRecurring}>
              {(isRecurring) =>
                isRecurring ? (
                  <View className="gap-md">
                    <form.Field name="subIntervalUnit">
                      {(field) => (
                        <View className="flex-row gap-sm flex-wrap">
                          {(Object.entries(INTERVAL_UNIT) as [string, IntervalUnit][]).map(([key, val]) => (
                            <Chip
                              key={key}
                              label={INTERVAL_LABEL[val]}
                              selected={field.state.value === val}
                              onPress={() => field.handleChange(val)}
                            />
                          ))}
                        </View>
                      )}
                    </form.Field>
                    <form.Field name="subEndDate">
                      {(field) => (
                        <View className="gap-xs">
                          <Text variant="caption" color="muted">
                            End date (optional)
                          </Text>
                          <DatePicker
                            value={field.state.value ? new Date(`${field.state.value}T12:00:00`) : new Date()}
                            onChange={(d) => field.handleChange(d.toISOString().split("T")[0]!)}
                          />
                        </View>
                      )}
                    </form.Field>
                  </View>
                ) : null
              }
            </form.Subscribe>
          </View>

          <form.Field name="amount">
            {(field) => <SoftKeyboard variant="amount" onChange={field.handleChange} />}
          </form.Field>

          <View className="px-lg py-md">
            <form.Subscribe selector={(s) => [s.isSubmitting, s.canSubmit] as const}>
              {([isSubmitting, canSubmit]) => (
                <Button
                  label={isEdit ? "Save" : "Add Expense"}
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
