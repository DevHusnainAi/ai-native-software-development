import { useState, useEffect } from "react";
import { useChapterId } from "../utils/chapter";
import type { AgenticInterfaceState } from "../types/agentic";
import { AgenticChat } from "./AgenticChat";
// import { TerminalPanel } from "./TerminalPanel";
import { ErrorPopup } from "./ErrorPopup";

interface AgenticInterfaceProps {
  chapterId?: string;
  onClose?: () => void;
}

export function AgenticInterface({
  chapterId: propChapterId,
  onClose,
}: AgenticInterfaceProps) {
  // Extract chapter_id from route if not provided
  const routeChapterId = useChapterId();
  const chapterId = propChapterId || routeChapterId;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState<AgenticInterfaceState>({
    isActive: true,
    currentChapterId: chapterId,
    chatHistory: [],
    terminalReady: true,
  });

  // Shared session ID - initialize once and share between both chat instances
  const [sharedSessionId, setSharedSessionId] = useState<string | undefined>(
    undefined
  );

  // Update chapter_id when route changes
  useEffect(() => {
    if (routeChapterId) {
      setState((prev) => ({
        ...prev,
        currentChapterId: routeChapterId,
      }));
    }
  }, [routeChapterId]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-polar-night-gray/20 bg-white/80 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/80">
      <div className="flex-1 overflow-hidden">
        <AgenticChat
          chapterId={chapterId}
          sessionId={sharedSessionId}
          chatHistory={state.chatHistory}
          onMessage={(message) => {
            setState((prev) => ({
              ...prev,
              chatHistory: [...prev.chatHistory, message],
            }));
          }}
          onLoadingChange={setIsLoading}
          onError={(errorMessage) => {
            setError(errorMessage);
          }}
          onSessionIdChange={(sessionId) => {
            setSharedSessionId(sessionId);
          }}
          showInputOnly={false}
        />
      </div>

      <div className="shrink-0 border-t border-[var(--ifm-color-emphasis-200)] bg-[var(--ifm-background-surface-color)] px-0 py-0">
        <AgenticChat
          chapterId={chapterId}
          sessionId={sharedSessionId}
          chatHistory={state.chatHistory}
          onMessage={(message) => {
            setState((prev) => ({
              ...prev,
              chatHistory: [...prev.chatHistory, message],
            }));
            if (!sharedSessionId && message.sessionId) {
              setSharedSessionId(message.sessionId);
            }
          }}
          onLoadingChange={setIsLoading}
          onError={(errorMessage) => {
            setError(errorMessage);
          }}
          onSessionIdChange={(sessionId) => {
            setSharedSessionId(sessionId);
          }}
          showInputOnly={true}
        />
      </div>

      <ErrorPopup
        error={error}
        onClose={() => setError(null)}
        autoClose={false}
      />
    </div>
  );
}
