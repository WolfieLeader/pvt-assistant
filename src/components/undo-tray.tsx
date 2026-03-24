import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { useDeleteStack } from "~/stores/delete-stack";
import { Button } from "./button";
import { Chip } from "./chip";
import { Text } from "./text";

const SNAP_POINTS = ["50%", "80%"];

export const UndoTray = forwardRef<BottomSheetModal>(function UndoTray(_, ref) {
  const [bg, handleColor] = useCSSVariable(["--color-background", "--color-muted"]) as string[];
  const pending = useDeleteStack((s) => s.pending);
  const undoDeletion = useDeleteStack((s) => s.undoDeletion);
  const undoAll = useDeleteStack((s) => s.undoAll);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={SNAP_POINTS}
      enableDynamicSizing={false}
      backgroundStyle={{ backgroundColor: bg }}
      handleIndicatorStyle={{ backgroundColor: handleColor }}
      backdropComponent={renderBackdrop}>
      <BottomSheetScrollView className="flex-1 px-5">
        <View className="flex-row items-center justify-between mb-md">
          <Text variant="title">Pending Deletions</Text>
          {pending.length > 0 && <Button variant="ghost" size="sm" label="Undo All" onPress={undoAll} />}
        </View>

        {pending.length === 0 ? (
          <Text color="muted" className="text-center py-xl">
            No pending deletions
          </Text>
        ) : (
          pending.map((entry) => <TrayItem key={entry.id} entry={entry} onUndo={() => undoDeletion(entry.id)} />)
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

function TrayItem({ entry, onUndo }: { entry: any; onUndo: () => void }) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.ceil((entry.deletedAt + 60_000 - Date.now()) / 1000)),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev: number) => {
        const next = Math.max(0, Math.ceil((entry.deletedAt + 60_000 - Date.now()) / 1000));
        if (next <= 0) clearInterval(interval);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [entry.deletedAt]);

  return (
    <Pressable className="flex-row items-center bg-card rounded-button p-md mb-sm" onPress={onUndo}>
      <View className="flex-1 gap-xs">
        <Text variant="body" className="font-sans-medium">
          {entry.item?.title ?? "Untitled"}
        </Text>
        <View className="flex-row items-center gap-sm">
          <Chip label={entry.type} variant={entry.type === "expense" ? "accent" : "default"} />
          <Text variant="caption" color="muted">
            {remaining}s left
          </Text>
        </View>
      </View>
      <Button variant="ghost" size="sm" label="Undo" onPress={onUndo} />
    </Pressable>
  );
}
