import { useCallback, useState } from "react";
import { View } from "react-native";
import { hapticFeedback } from "~/consts/haptics";
import { verifyPin, storePin } from "../crypto";
import { PasscodePad } from "./passcode-pad";
import { RecoverySetup } from "./recovery-setup";

type Props = {
  onComplete: () => void;
  onCancel?: () => void;
  mode: "create" | "change";
};

type Step = "verify_current" | "enter_new" | "confirm" | "recovery";

export function PasscodeSetup({ onComplete, mode }: Props) {
  const [step, setStep] = useState<Step>(mode === "change" ? "verify_current" : "enter_new");
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [error, setError] = useState(false);

  const reset = useCallback(() => {
    setPin("");
    setError(false);
  }, []);

  const handleVerifyCurrent = useCallback(
    async (value: string) => {
      const valid = await verifyPin(value);
      if (valid) {
        hapticFeedback("success");
        setStep("enter_new");
        reset();
      } else {
        hapticFeedback("error");
        setError(true);
        setTimeout(reset, 300);
      }
    },
    [reset],
  );

  const handleEnterNew = useCallback(
    (value: string) => {
      setNewPin(value);
      setStep("confirm");
      reset();
    },
    [reset],
  );

  const handleConfirm = useCallback(
    async (value: string) => {
      if (value === newPin) {
        hapticFeedback("success");
        await storePin(value);
        setStep("recovery");
      } else {
        hapticFeedback("error");
        setError(true);
        setTimeout(() => {
          reset();
          setStep("enter_new");
          setNewPin("");
        }, 300);
      }
    },
    [newPin, reset],
  );

  if (step === "recovery") {
    return <RecoverySetup onComplete={onComplete} />;
  }

  const config = {
    verify_current: { title: "Enter Current Passcode", subtitle: undefined, onComplete: handleVerifyCurrent },
    enter_new: {
      title: "Enter New Passcode",
      subtitle: "Choose a 6-digit passcode" as string | undefined,
      onComplete: handleEnterNew,
    },
    confirm: {
      title: "Confirm Passcode",
      subtitle: "Re-enter your passcode" as string | undefined,
      onComplete: handleConfirm,
    },
  };

  const { title, subtitle, onComplete: handleComplete } = config[step as keyof typeof config];

  return (
    <View className="flex-1 bg-background">
      <PasscodePad
        value={pin}
        onChange={setPin}
        onComplete={handleComplete}
        error={error}
        title={title}
        subtitle={subtitle}
      />
    </View>
  );
}
