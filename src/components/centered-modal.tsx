import { X } from "lucide-react-native";
import { Modal, Pressable, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { Text } from "./text";

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export function CenteredModal({ visible, onClose, title, children }: Props) {
  const [muted] = useCSSVariable(["--color-muted"]) as string[];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 items-center justify-center px-lg" onPress={onClose}>
        <Pressable className="bg-card rounded-card p-5 w-full max-w-sm" onPress={(e) => e.stopPropagation()}>
          <View className="flex-row items-center justify-between mb-md">
            {title ? <Text variant="title">{title}</Text> : <View />}
            <Pressable onPress={onClose} hitSlop={12}>
              <X size={20} color={muted} />
            </Pressable>
          </View>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
