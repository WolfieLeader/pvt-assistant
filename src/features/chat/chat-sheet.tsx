import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";
import { Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

const SNAP_POINTS = ["90%"];

export const ChatSheet = forwardRef<BottomSheetModal>(function ChatSheet(_, ref) {
  const [bg, handleColor] = useCSSVariable(["--color-background", "--color-muted"]) as string[];

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={SNAP_POINTS}
      enableDynamicSizing={false}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{ backgroundColor: bg }}
      handleIndicatorStyle={{ backgroundColor: handleColor }}
      backdropComponent={renderBackdrop}>
      <BottomSheetView className="flex-1">
        <View className="flex-1 items-center justify-center">
          <Text className="text-text font-sans-semibold text-subtitle">Chat</Text>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
