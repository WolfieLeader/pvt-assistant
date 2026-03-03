import { useEffect, useRef, type PropsWithChildren } from "react";
import { AppState } from "react-native";
import { LOCK_GRACE_MS } from "../consts";
import { useSecurityStore } from "../store";
import { LockScreen } from "./lock-screen";

export function AppLockGuard({ children }: PropsWithChildren) {
  const lockEnabled = useSecurityStore((s) => s.lockEnabled);
  const isLocked = useSecurityStore((s) => s.isLocked);
  const setIsLocked = useSecurityStore((s) => s.setIsLocked);
  const appState = useRef(AppState.currentState);
  const backgroundedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!lockEnabled) return;

    const sub = AppState.addEventListener("change", (next) => {
      if (appState.current !== "background" && next === "background") {
        backgroundedAt.current = Date.now();
      }

      if (appState.current === "background" && next === "active") {
        const awayMs = backgroundedAt.current ? Date.now() - backgroundedAt.current : 0;
        if (awayMs >= LOCK_GRACE_MS) {
          setIsLocked(true);
        }
        backgroundedAt.current = null;
      }
      appState.current = next;
    });

    return () => sub.remove();
  }, [lockEnabled, setIsLocked]);

  return (
    <>
      {children}
      {lockEnabled && isLocked && <LockScreen />}
    </>
  );
}
