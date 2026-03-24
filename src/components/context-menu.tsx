import type { ComponentType } from "react";
import { useCallback, useState } from "react";
import { Dimensions, Modal, Pressable, View, type GestureResponderEvent } from "react-native";
import { hapticFeedback } from "~/consts/haptics";
import { cn } from "~/utils/cn";
import { Text } from "./text";

type Action = {
  label: string;
  icon?: ComponentType<{ size: number; color: string }>;
  variant?: "default" | "danger";
  onPress: () => void;
};

type Props = {
  actions: Action[];
  children: React.ReactNode;
};

const MENU_WIDTH = 180;
const SCREEN_PADDING = 12;

export function ContextMenu({ actions, children }: Props) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleLongPress = useCallback(
    (e: GestureResponderEvent) => {
      const { pageX, pageY } = e.nativeEvent;
      const { width, height } = Dimensions.get("window");

      const left = Math.min(pageX, width - MENU_WIDTH - SCREEN_PADDING);
      const top = Math.min(pageY, height - actions.length * 48 - SCREEN_PADDING);

      setPosition({ top, left: Math.max(SCREEN_PADDING, left) });
      setVisible(true);
      hapticFeedback("press");
    },
    [actions.length],
  );

  const handleAction = useCallback((action: Action) => {
    setVisible(false);
    action.onPress();
  }, []);

  return (
    <>
      <Pressable onLongPress={handleLongPress} delayLongPress={500}>
        {children}
      </Pressable>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable className="flex-1" onPress={() => setVisible(false)}>
          <View
            className="absolute bg-card rounded-button shadow-card overflow-hidden"
            style={{ top: position.top, left: position.left, width: MENU_WIDTH, elevation: 8 }}>
            {actions.map((action) => (
              <Pressable
                key={action.label}
                onPress={() => handleAction(action)}
                className="flex-row items-center gap-sm px-md py-sm"
                android_ripple={{ color: "rgba(0,0,0,0.06)" }}>
                {action.icon && <action.icon size={18} color={action.variant === "danger" ? "#dc2626" : "#71717a"} />}
                <Text variant="body" className={cn("font-sans-medium", action.variant === "danger" && "text-danger")}>
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
