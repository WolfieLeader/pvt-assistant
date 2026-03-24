import { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TAB_BAR_HEIGHT } from "~/consts/spacing";
import { useDeleteStack } from "~/stores/delete-stack";
import { Button } from "./button";
import { Text } from "./text";

type Props = {
  onViewAll: () => void;
};

const HIDE_Y = 120;

export function UndoToast({ onViewAll }: Props) {
  const pending = useDeleteStack((s) => s.pending);
  const undoDeletion = useDeleteStack((s) => s.undoDeletion);
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(HIDE_Y);

  const count = pending.length;
  const last = pending[pending.length - 1];

  useEffect(() => {
    if (count > 0) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
      translateY.value = withDelay(5000, withTiming(HIDE_Y, { duration: 300 }));
    } else {
      translateY.value = withTiming(HIDE_Y, { duration: 200 });
    }
  }, [count, translateY]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (count === 0) return null;

  return (
    <Animated.View
      className="absolute left-4 right-4 bg-card rounded-button flex-row items-center justify-between px-md py-sm"
      style={[{ bottom: insets.bottom + TAB_BAR_HEIGHT + 12, elevation: 6 }, style]}>
      <Text variant="body" className="font-sans-medium flex-1">
        {count === 1 ? "Item deleted" : `${count} items deleted`}
      </Text>
      <Button variant="ghost" size="sm" label="Undo" haptic="tap" onPress={() => last && undoDeletion(last.id)} />
      {count > 1 && <Button variant="ghost" size="sm" label="View all" haptic="tap" onPress={onViewAll} />}
    </Animated.View>
  );
}
