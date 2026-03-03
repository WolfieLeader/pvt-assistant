import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { createContext, useContext, useRef, type PropsWithChildren } from "react";
import { ChatSheet } from "./chat-sheet";

interface ChatSheetContextValue {
  present: () => void;
  dismiss: () => void;
}

const ChatSheetContext = createContext<ChatSheetContextValue | null>(null);

export function ChatSheetProvider({ children }: PropsWithChildren) {
  const ref = useRef<BottomSheetModal>(null);

  const present = () => ref.current?.present();
  const dismiss = () => ref.current?.dismiss();

  return (
    <ChatSheetContext.Provider value={{ present, dismiss }}>
      {children}
      <ChatSheet ref={ref} />
    </ChatSheetContext.Provider>
  );
}

export function useChatSheet() {
  const ctx = useContext(ChatSheetContext);
  if (!ctx) throw new Error("useChatSheet must be inside ChatSheetProvider");
  return ctx;
}
