import { useEffect, useRef } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { PIN_LENGTH } from "../consts";
import { Text, SoftKeyboard } from "~/components";
import { cn } from "~/utils/cn";

type Props = {
  value: string;
  onChange: (value: string | ((prev: string) => string)) => void;
  onComplete: (pin: string) => void;
  disabled?: boolean;
  error?: boolean;
  title: string;
  subtitle?: string;
};

function Dots({ filled, error }: { filled: number; error?: boolean }) {
  const shakeX = useSharedValue(0);
  const prevError = useRef(error);

  useEffect(() => {
    if (error && !prevError.current) {
      shakeX.value = withSequence(
        withTiming(12, { duration: 50 }),
        withTiming(-12, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
    prevError.current = error;
  }, [error, shakeX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  return (
    <Animated.View className="flex-row items-center justify-center gap-lg" style={animatedStyle}>
      {Array.from({ length: PIN_LENGTH }, (_, i) => (
        <View
          key={i}
          className={cn("w-4 h-4 rounded-full", i < filled ? (error ? "bg-danger" : "bg-accent") : "bg-border")}
        />
      ))}
    </Animated.View>
  );
}

export function PasscodePad({ value, onChange, onComplete, disabled, error, title, subtitle }: Props) {
  const completedRef = useRef(false);

  useEffect(() => {
    if (value.length === PIN_LENGTH && !completedRef.current) {
      completedRef.current = true;
      onComplete(value);
    }
    if (value.length < PIN_LENGTH) {
      completedRef.current = false;
    }
  }, [value, onComplete]);

  return (
    <View className="flex-1 items-center justify-center">
      <View className="items-center gap-lg mb-xl">
        <Text variant="title">{title}</Text>
        {subtitle && <Text color="muted">{subtitle}</Text>}
        <Dots filled={value.length} error={error} />
      </View>
      <SoftKeyboard onChange={onChange} variant="pin" disabled={disabled} maxLength={PIN_LENGTH} />
    </View>
  );
}
