import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { Pressable, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { hapticFeedback } from "~/consts/haptics";
import { useCategories, type CategoryNode } from "~/hooks/use-categories";
import { cn } from "~/utils/cn";
import { Text } from "./text";

export type CategoryPickerRef = {
  present: () => void;
  dismiss: () => void;
};

type Props = {
  onSelect: (id: number) => void;
  selectedId?: number | null;
};

const SNAP_POINTS = ["70%"];

export const CategoryPicker = forwardRef<CategoryPickerRef, Props>(function CategoryPicker(
  { onSelect, selectedId },
  ref,
) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [bg, handleColor] = useCSSVariable(["--color-background", "--color-muted"]) as string[];
  const { data: categories } = useCategories();

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    [],
  );

  const handleSelect = (id: number) => {
    hapticFeedback("tap");
    onSelect(id);
    sheetRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={SNAP_POINTS}
      enableDynamicSizing={false}
      backgroundStyle={{ backgroundColor: bg }}
      handleIndicatorStyle={{ backgroundColor: handleColor }}
      backdropComponent={renderBackdrop}>
      <BottomSheetScrollView className="flex-1 px-lg">
        <Text variant="title" className="mb-md">
          Category
        </Text>
        {categories?.map((parent) => (
          <View key={parent.id} className="mb-md">
            <CategoryRow node={parent} selected={selectedId === parent.id} onPress={() => handleSelect(parent.id)} />
            {parent.children.map((child) => (
              <CategoryRow
                key={child.id}
                node={child}
                selected={selectedId === child.id}
                onPress={() => handleSelect(child.id)}
                indent
              />
            ))}
          </View>
        ))}
        <View className="h-xl" />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

function CategoryRow({
  node,
  selected,
  onPress,
  indent,
}: {
  node: CategoryNode;
  selected: boolean;
  onPress: () => void;
  indent?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex-row items-center gap-sm py-sm px-md rounded-lg",
        indent && "ml-lg",
        selected && "bg-primary-50 dark:bg-primary-950 border border-accent",
      )}>
      {node.color && <View className="w-3 h-3 rounded-full" style={{ backgroundColor: node.color }} />}
      <Text variant="body">{node.icon}</Text>
      <Text variant={indent ? "body" : "subtitle"}>{node.name}</Text>
    </Pressable>
  );
}
