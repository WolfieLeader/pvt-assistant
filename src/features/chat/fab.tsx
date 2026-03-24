import { MessageCircle } from "lucide-react-native";
import { Platform } from "react-native";
import { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components";
import { SPACING, TAB_BAR_HEIGHT } from "~/consts/spacing";
import { useScrollContext } from "~/contexts/scroll";
import { useChatSheet } from "./chat-sheet-context";

const HIDE_OFFSET = 56 + SPACING.lg + TAB_BAR_HEIGHT;

const shadowStyle = Platform.select({
  ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 },
  android: { elevation: 6 },
});

const ChatIcon = ({ size, color }: { size: number; color: string }) => (
  <MessageCircle size={size} color={color} fill={color} />
);

export function FAB() {
  const insets = useSafeAreaInsets();
  const { present } = useChatSheet();
  const { isScrollingDown } = useScrollContext();

  const scrollStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(isScrollingDown.value ? HIDE_OFFSET : 0, {
          damping: 15,
          stiffness: 120,
        }),
      },
    ],
  }));

  return (
    <Button
      icon={ChatIcon}
      size="lg"
      haptic="press"
      className="absolute right-4 w-14 h-14"
      style={[{ bottom: insets.bottom + TAB_BAR_HEIGHT + SPACING.lg }, shadowStyle, scrollStyle]}
      onPress={present}
    />
  );
}
