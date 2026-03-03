import { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { hapticFeedback } from "~/consts/haptics";
import { verifyPin } from "../crypto";
import { useSecurityStore } from "../store";
import { Text } from "~/components";
import { PasscodePad } from "./passcode-pad";
import { RecoveryFlow } from "./recovery-flow";

type State = "idle" | "verifying" | "locked_out" | "recovery" | "reset_pin";

export function LockScreen() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [countdown, setCountdown] = useState(0);

  const lockoutUntil = useSecurityStore((s) => s.lockoutUntil);
  const setIsLocked = useSecurityStore((s) => s.setIsLocked);
  const recordFailedAttempt = useSecurityStore((s) => s.recordFailedAttempt);
  const resetFailedAttempts = useSecurityStore((s) => s.resetFailedAttempts);

  useEffect(() => {
    if (!lockoutUntil) {
      if (state === "locked_out") setState("idle");
      return;
    }

    const tick = () => {
      const remaining = lockoutUntil - Date.now();
      if (remaining <= 0) {
        setCountdown(0);
        useSecurityStore.setState({ lockoutUntil: null });
        setState("idle");
      } else {
        setCountdown(Math.ceil(remaining / 1000));
        setState("locked_out");
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- state omitted: including it restarts the interval on every transition
  }, [lockoutUntil]);

  const handleComplete = useCallback(
    async (value: string) => {
      setState("verifying");
      const valid = await verifyPin(value);
      if (valid) {
        hapticFeedback("success");
        resetFailedAttempts();
        setIsLocked(false);
      } else {
        hapticFeedback("error");
        recordFailedAttempt();
        setError(true);
        setTimeout(() => {
          setPin("");
          setError(false);
          setState("idle");
        }, 300);
      }
    },
    [setIsLocked, recordFailedAttempt, resetFailedAttempts],
  );

  const handleRecovered = useCallback(() => {
    resetFailedAttempts();
    setIsLocked(false);
  }, [setIsLocked, resetFailedAttempts]);

  if (state === "recovery" || state === "reset_pin") {
    return (
      <View className="absolute inset-0 bg-background z-50">
        <RecoveryFlow onRecovered={handleRecovered} onCancel={() => setState("idle")} />
      </View>
    );
  }

  const isLockedOut = state === "locked_out";

  return (
    <View className="absolute inset-0 bg-background z-50 justify-center">
      <PasscodePad
        value={pin}
        onChange={setPin}
        onComplete={handleComplete}
        error={error}
        disabled={isLockedOut || state === "verifying"}
        title={isLockedOut ? "Try Again" : "Enter Passcode"}
        subtitle={isLockedOut ? `Locked for ${countdown}s` : undefined}
      />
      {!isLockedOut && (
        <View className="items-center pb-xl">
          <Pressable onPress={() => setState("recovery")}>
            <Text color="accent" variant="caption">
              Forgot Passcode?
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
