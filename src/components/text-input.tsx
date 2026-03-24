import { useState } from "react";
import { TextInput as RNTextInput, View, type TextInputProps } from "react-native";
import { useCSSVariable } from "uniwind";
import { cn } from "~/utils/cn";
import { Text } from "./text";

type Props = TextInputProps & {
  label?: string;
  error?: string;
  className?: string;
};

export function TextInput({ label, error, className, onFocus, onBlur, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  const [text, muted, accent, danger] = useCSSVariable([
    "--color-text",
    "--color-muted",
    "--color-accent",
    "--color-danger",
  ]) as string[];

  const borderColor = error ? danger : focused ? accent : muted;

  return (
    <View className={cn("gap-xs", className)}>
      {label && (
        <Text variant="caption" color="muted">
          {label}
        </Text>
      )}
      <RNTextInput
        className="text-text font-sans text-body py-sm"
        style={{
          minHeight: 44,
          borderBottomWidth: 1.5,
          borderBottomColor: borderColor,
          color: text,
          includeFontPadding: false,
        }}
        placeholderTextColor={muted}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {error && (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      )}
    </View>
  );
}
