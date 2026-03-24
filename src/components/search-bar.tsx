import { Search, X } from "lucide-react-native";
import { Pressable, TextInput, View } from "react-native";
import { useCSSVariable } from "uniwind";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchBar({ value, onChangeText, placeholder = "Search...", className }: Props) {
  const [text, muted] = useCSSVariable(["--color-text", "--color-muted"]) as string[];

  return (
    <View className={`flex-row items-center bg-card rounded-input px-sm gap-sm ${className ?? ""}`}>
      <Search size={18} color={muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={muted}
        className="flex-1 text-text font-sans text-body py-sm"
        style={{ minHeight: 40, color: text, includeFontPadding: false }}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={8}>
          <X size={18} color={muted} />
        </Pressable>
      )}
    </View>
  );
}
