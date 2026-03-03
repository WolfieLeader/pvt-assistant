import { useEffect, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { RECOVERY_QUESTIONS } from "../consts";
import { hapticFeedback } from "~/consts/haptics";
import { getRecoveryQuestionIds, verifyRecoveryAnswers } from "../crypto";
import { useSecurityStore } from "../store";
import { Button, Text } from "~/components";
import { PasscodeSetup } from "./passcode-setup";

type Props = {
  onRecovered: () => void;
  onCancel: () => void;
};

export function RecoveryFlow({ onRecovered, onCancel }: Props) {
  const [questionIds, setQuestionIds] = useState<[number, number] | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [error, setError] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const recoveryLockoutUntil = useSecurityStore((s) => s.recoveryLockoutUntil);
  const recordFailedRecoveryAttempt = useSecurityStore((s) => s.recordFailedRecoveryAttempt);
  const resetRecoveryAttempts = useSecurityStore((s) => s.resetRecoveryAttempts);

  useEffect(() => {
    getRecoveryQuestionIds().then((ids) => {
      setQuestionIds(ids);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!recoveryLockoutUntil) {
      setCountdown(0);
      return;
    }

    const tick = () => {
      const remaining = recoveryLockoutUntil - Date.now();
      if (remaining <= 0) {
        setCountdown(0);
        useSecurityStore.setState({ recoveryLockoutUntil: null });
      } else {
        setCountdown(Math.ceil(remaining / 1000));
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [recoveryLockoutUntil]);

  if (!loaded) return null;

  if (!questionIds) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-lg gap-lg">
        <Text variant="title">No Recovery Setup</Text>
        <Text color="muted" className="text-center">
          No recovery questions were configured. You cannot reset your passcode.
        </Text>
        <Button variant="secondary" label="Go Back" onPress={onCancel} />
      </View>
    );
  }

  if (verified) {
    return <PasscodeSetup mode="create" onComplete={onRecovered} />;
  }

  const q1 = RECOVERY_QUESTIONS.find((q) => q.id === questionIds[0]);
  const q2 = RECOVERY_QUESTIONS.find((q) => q.id === questionIds[1]);

  const isRecoveryLockedOut = countdown > 0;

  const handleVerify = async () => {
    if (verifying || isRecoveryLockedOut) return;
    setVerifying(true);
    setError(false);
    const valid = await verifyRecoveryAnswers(a1, a2);
    if (valid) {
      hapticFeedback("success");
      resetRecoveryAttempts();
      setVerified(true);
    } else {
      hapticFeedback("error");
      recordFailedRecoveryAttempt();
      setError(true);
    }
    setVerifying(false);
  };

  const canSubmit = a1.trim().length > 0 && a2.trim().length > 0 && !isRecoveryLockedOut;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-lg gap-lg"
      keyboardShouldPersistTaps="handled">
      <View className="gap-xs">
        <Text variant="title">Reset Passcode</Text>
        <Text color="muted">Answer your recovery questions to set a new passcode.</Text>
      </View>

      <View className="gap-md">
        <View className="gap-xs">
          <Text variant="label">{q1?.label}</Text>
          <TextInput
            className="font-sans text-body text-text border-b border-border pb-xs"
            style={{ includeFontPadding: false }}
            placeholder="Your answer"
            placeholderTextColor="#999"
            value={a1}
            onChangeText={setA1}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View className="gap-xs">
          <Text variant="label">{q2?.label}</Text>
          <TextInput
            className="font-sans text-body text-text border-b border-border pb-xs"
            style={{ includeFontPadding: false }}
            placeholder="Your answer"
            placeholderTextColor="#999"
            value={a2}
            onChangeText={setA2}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {isRecoveryLockedOut && (
        <Text color="danger" variant="caption">
          Too many attempts. Try again in {countdown}s.
        </Text>
      )}

      {error && !isRecoveryLockedOut && (
        <Text color="danger" variant="caption">
          Incorrect answers. Please try again.
        </Text>
      )}

      <View className="gap-sm">
        <Button label="Verify" onPress={handleVerify} disabled={!canSubmit} loading={verifying} />
        <Button variant="ghost" label="Cancel" onPress={onCancel} />
      </View>
    </ScrollView>
  );
}
