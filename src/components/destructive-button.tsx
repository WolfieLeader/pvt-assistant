import { useCallback, useEffect, useRef, useState } from "react";
import { hapticFeedback } from "~/consts/haptics";
import { Button } from "./button";

type Props = {
  label: string;
  confirmLabel?: string;
  onConfirm: () => void;
  disabled?: boolean;
  className?: string;
};

const CONFIRM_TIMEOUT = 3000;

export function DestructiveButton({ label, confirmLabel = "Are you sure?", onConfirm, disabled, className }: Props) {
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handlePress = useCallback(() => {
    if (!confirming) {
      setConfirming(true);
      hapticFeedback("press");
      timerRef.current = setTimeout(() => setConfirming(false), CONFIRM_TIMEOUT);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setConfirming(false);
      hapticFeedback("delete");
      onConfirm();
    }
  }, [confirming, onConfirm]);

  return (
    <Button
      variant="danger"
      label={confirming ? confirmLabel : label}
      onPress={handlePress}
      disabled={disabled}
      haptic={false}
      className={className}
    />
  );
}
