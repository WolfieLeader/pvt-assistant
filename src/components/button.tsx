import type { ComponentType, ReactNode } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Text as RNText } from "react-native";
import Animated from "react-native-reanimated";
import { useCSSVariable } from "uniwind";
import { hapticFeedback } from "~/consts/haptics";
import { usePressAnimation } from "~/hooks/use-press-animation";
import { cn } from "~/utils/cn";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ANDROID_RIPPLE = { color: "rgba(0,0,0,0.1)" } as const;
const TEXT_STYLE = { includeFontPadding: false } as const;

const variantStyles = {
  primary: "bg-accent",
  secondary: "bg-card border border-border",
  danger: "bg-danger",
  ghost: "",
} as const;

const variantText = {
  primary: "text-white font-sans-semibold",
  secondary: "text-text font-sans-medium",
  danger: "text-white font-sans-semibold",
  ghost: "text-accent font-sans-medium",
} as const;

const sizeStyles = {
  sm: "py-xs px-md rounded-button",
  md: "py-sm px-lg rounded-button",
  lg: "py-md px-xl rounded-button",
} as const;

const iconOnlySize = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
} as const;

const sizeText = {
  sm: "text-caption",
  md: "text-body",
  lg: "text-subtitle",
} as const;

const iconSizeMap = { sm: 16, md: 20, lg: 24 } as const;

type Props = Omit<PressableProps, "children" | "style"> & {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  icon?: ComponentType<{ size: number; color: string }>;
  label?: string;
  children?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  activeScale?: number;
  activeOpacity?: number;
  style?: StyleProp<ViewStyle>;
  haptic?: Parameters<typeof hapticFeedback>[0] | false;
};

export function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  label,
  children,
  disabled,
  loading,
  className,
  activeScale = 0.975,
  activeOpacity = 0.9,
  style,
  haptic = "tap",
  onPress,
  ...props
}: Props) {
  const isDisabled = disabled || loading;
  const isIconOnly = !!Icon && !label && !children;
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation({
    scale: activeScale,
    opacity: activeOpacity,
    disabled: isDisabled,
  });

  const [textColor, accentColor] = useCSSVariable(["--color-text", "--color-accent"]) as string[];

  const iconColor =
    variant === "primary" || variant === "danger" ? "#fff" : variant === "ghost" ? accentColor : textColor;

  const handlePress: PressableProps["onPress"] = (e) => {
    if (isDisabled) return;
    if (haptic !== false) hapticFeedback(haptic);
    onPress?.(e);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator size="small" color={variant === "secondary" || variant === "ghost" ? undefined : "#fff"} />
      );
    }

    if (children) return children;

    return (
      <>
        {Icon && <Icon size={iconSizeMap[size]} color={iconColor} />}
        {label && (
          <RNText className={cn(variantText[variant], sizeText[size])} style={TEXT_STYLE}>
            {label}
          </RNText>
        )}
      </>
    );
  };

  return (
    <AnimatedPressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={handlePress}
      disabled={isDisabled}
      android_ripple={Platform.OS === "android" && !isDisabled ? ANDROID_RIPPLE : undefined}
      className={cn(
        "items-center justify-center flex-row",
        variantStyles[variant],
        isIconOnly ? iconOnlySize[size] : sizeStyles[size],
        isIconOnly ? "rounded-full" : Icon && label && "gap-xs",
        isDisabled && "opacity-50",
        className,
      )}
      style={[animatedStyle, style]}
      {...props}>
      {renderContent()}
    </AnimatedPressable>
  );
}
