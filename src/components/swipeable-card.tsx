import { Trash2 } from "lucide-react-native";
import { useRef } from "react";
import { Pressable, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { hapticFeedback } from "~/consts/haptics";

type Props = {
  onDelete: () => void;
  children: React.ReactNode;
};

export function SwipeableCard({ onDelete, children }: Props) {
  const ref = useRef<Swipeable>(null);

  const handleDelete = () => {
    ref.current?.close();
    hapticFeedback("delete");
    onDelete();
  };

  return (
    <Swipeable
      ref={ref}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      renderRightActions={() => (
        <Pressable onPress={handleDelete} className="bg-danger w-18 items-center justify-center">
          <Trash2 size={22} color="#fff" />
        </Pressable>
      )}>
      <View className="bg-card">{children}</View>
    </Swipeable>
  );
}
