import { useState, useEffect, useRef } from "react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState<AgenticInterfaceState>({
    isActive: true,
    currentChapterId: chapterId,
    chatHistory: [],
    terminalReady: true,
  });

  // Shared session ID - initialize once and share between both chat instances
  const [sharedSessionId, setSharedSessionId] = useState<string | undefined>(undefined);

  // Update chapter_id when route changes
  useEffect(() => {
    if (routeChapterId) {
      setState((prev) => ({
        ...prev,
        currentChapterId: routeChapterId,
      }));
    }
  }, [routeChapterId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.chatHistory]);

  return (
    <>
      <div className="agentic-interface-side">
        {/* Chat Messages Area - Top (55% height) */}
        <div className="agentic-chat-messages-area">
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

        {/* Chat Input - Middle (fixed height) */}

        {/* Terminal Panel - Bottom (45% height, always visible)
      <div 
        className="agentic-terminal-area"
      >
        <TerminalPanel
          sessionId={sharedSessionId}
          onReady={() => {
            setState((prev) => ({ ...prev, terminalReady: true }));
          }}
        /> */}
        {/* </div> */}

        {/* Error Popup */}
        <ErrorPopup
          error={error}
          onClose={() => setError(null)}
          autoClose={false}
        />
      </div>
      <div className="agentic-chat-input-area">
        <AgenticChat
          chapterId={chapterId}
          sessionId={sharedSessionId}
          chatHistory={state.chatHistory}
          onMessage={(message) => {
            setState((prev) => ({
              ...prev,
              chatHistory: [...prev.chatHistory, message],
            }));
            // Update shared session ID if it comes from the message
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
    </>
  );
}

