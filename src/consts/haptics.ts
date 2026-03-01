import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const haptics = {
  tap: { ios: Haptics.ImpactFeedbackStyle.Light, android: undefined },
  press: { ios: Haptics.ImpactFeedbackStyle.Medium, android: Haptics.AndroidHaptics.Confirm },
  delete: { ios: Haptics.ImpactFeedbackStyle.Heavy, android: Haptics.AndroidHaptics.Reject },
  success: { ios: Haptics.ImpactFeedbackStyle.Medium, android: Haptics.AndroidHaptics.Confirm },
  error: { ios: Haptics.ImpactFeedbackStyle.Heavy, android: Haptics.AndroidHaptics.Reject },
  tabPress: { ios: Haptics.ImpactFeedbackStyle.Light, android: undefined },
  toggle: { ios: Haptics.ImpactFeedbackStyle.Light, android: Haptics.AndroidHaptics.Toggle_On },
} satisfies Record<string, { ios: Haptics.ImpactFeedbackStyle; android: Haptics.AndroidHaptics | undefined }>;

export async function hapticFeedback(type: keyof typeof haptics) {
  try {
    const config = haptics[type];
    if (Platform.OS === "ios") {
      await Haptics.impactAsync(config.ios);
    } else if (Platform.OS === "android" && config.android) {
      await Haptics.performAndroidHapticsAsync(config.android);
    }
  } catch {}
}
