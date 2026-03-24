import { Calendar } from "lucide-react-native";
import { Pressable } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useCSSVariable } from "uniwind";
import { hapticFeedback } from "~/consts/haptics";
import { useState } from "react";
import { Text } from "./text";

type Props = {
  value: Date;
  onChange: (date: Date) => void;
  mode?: "date" | "datetime";
  maximumDate?: Date;
  className?: string;
};

const formatDate = (date: Date, mode: "date" | "datetime") =>
  mode === "datetime"
    ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function DatePicker({ value, onChange, mode = "date", maximumDate, className }: Props) {
  const [visible, setVisible] = useState(false);
  const [muted] = useCSSVariable(["--color-muted"]) as string[];

  return (
    <>
      <Pressable
        onPress={() => {
          hapticFeedback("tap");
          setVisible(true);
        }}
        className={`flex-row items-center gap-sm py-sm ${className ?? ""}`}>
        <Calendar size={18} color={muted} />
        <Text variant="body">{formatDate(value, mode)}</Text>
      </Pressable>
      <DateTimePickerModal
        isVisible={visible}
        mode={mode}
        date={value}
        maximumDate={maximumDate}
        display="spinner"
        onConfirm={(date) => {
          setVisible(false);
          onChange(date);
        }}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}
