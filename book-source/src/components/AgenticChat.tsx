import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage, initChatSession } from "../services/api";
import type { ChatMessage as ChatMessageType } from "../types/agentic";
import { AIPersonaWelcome } from "./AIPersonaWelcome";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { MessageFormatter } from "./MessageFormatter";

interface AgenticChatProps {
  chapterId?: string;
  sessionId?: string;
  chatHistory: ChatMessageType[];
  onMessage: (message: ChatMessageType) => void;
  showInputOnly?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  onError?: (error: string) => void;
  onSessionIdChange?: (sessionId: string) => void;
}

export function AgenticChat({
  chapterId,
  sessionId: propSessionId,
  chatHistory,
  onMessage,
  showInputOnly,
  onLoadingChange,
  onError,
  onSessionIdChange,
}: AgenticChatProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(
    propSessionId
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initializationAttemptedRef = useRef(false);
  const hasShownErrorRef = useRef(false);

  // Update currentSessionId when propSessionId changes
  useEffect(() => {
    if (propSessionId && propSessionId !== currentSessionId) {
      setCurrentSessionId(propSessionId);
      initializationAttemptedRef.current = true; // Mark as initialized if session ID is provided
    }
  }, [propSessionId]);

  useEffect(() => {
    // Initialize session if not provided - only run once per chapterId
    // Skip initialization if showInputOnly is true (let the messages instance handle it)
    if (
      !currentSessionId &&
      !initializationAttemptedRef.current &&
      !propSessionId &&
      !showInputOnly
    ) {
      initializationAttemptedRef.current = true;
      const initializeSession = async () => {
        try {
          const session = await initChatSession(chapterId);
          setCurrentSessionId(session.session_id);
          hasShownErrorRef.current = false;
          onSessionIdChange?.(session.session_id);
        } catch (error) {
          console.error("Session initialization error:", error);
          // Only show error once
          if (!hasShownErrorRef.current) {
            hasShownErrorRef.current = true;
            onError?.(
              "Failed to initialize chat session. Please refresh the page and try again."
            );
          }
        }
      };
      initializeSession();
    }

    // Reset initialization flag when chapterId changes
    if (chapterId && initializationAttemptedRef.current && !currentSessionId) {
      initializationAttemptedRef.current = false;
      hasShownErrorRef.current = false;
    }
  }, [chapterId, propSessionId, showInputOnly]); // Only depend on props that should trigger re-init

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (!showInputOnly) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    }
  }, [chatHistory, isLoading, showInputOnly]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !currentSessionId) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      sessionId: currentSessionId,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    onMessage(userMessage);
    setInput("");
    setIsLoading(true);
    onLoadingChange?.(true);

    // Focus back on input after sending
    setTimeout(() => inputRef.current?.focus(), 100);

    try {
      const response = await sendChatMessage({
        message: input,
        chapter_id: chapterId,
        session_id: currentSessionId,
      });

      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        sessionId: currentSessionId,
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
      };

      onMessage(assistantMessage);
      // Update session ID if it changed
      if (response.session_id && response.session_id !== currentSessionId) {
        setCurrentSessionId(response.session_id);
        onSessionIdChange?.(response.session_id);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send message. Please check your connection and try again.";
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  // Auto-focus input on mount
  useEffect(() => {
    if (showInputOnly && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInputOnly]);

  // If only showing input, return just the form
  if (showInputOnly) {
    return (
      <>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-3 border-t border-polar-night-gray/20 bg-white/80 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-700 dark:bg-neutral-900/80"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Chat... (Press Enter to send, Shift+Enter for new line)"
            disabled={isLoading || !currentSessionId}
            className="w-full resize-none overflow-hidden rounded-2xl border border-polar-night-gray/20 bg-white/60 px-4 py-3 text-sm leading-6 text-polar-night-charcoal shadow-sm outline-none transition focus:border-polar-night-deep focus:ring-2 focus:ring-polar-night-deep/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-50"
            rows={1}
            style={{
              resize: "none",
              overflow: "hidden",
              minHeight: "44px",
              maxHeight: "200px",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 200) + "px";
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !currentSessionId || !input.trim()}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-polar-night-deep text-sm font-semibold text-white shadow-lg shadow-polar-night-deep/25 transition hover:bg-polar-night-deep/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-polar-night-deep disabled:cursor-not-allowed disabled:bg-polar-night-gray/50 disabled:text-polar-night-white/60 dark:focus:ring-offset-neutral-900"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center">
                  <span className="block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                </span>
                Sending
              </span>
            ) : (
              "Send"
            )}
          </button>
        </form>
        {chatHistory.length === 0 && (
          <SuggestedPrompts
            chapterId={chapterId}
            onSelect={handlePromptSelect}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div
        className={`flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6 transition-all ${
          chatHistory.length === 0
            ? "items-center justify-center text-center"
            : "justify-start"
        }`}
      >
        {chatHistory.length === 0 && <AIPersonaWelcome />}

        {chatHistory.map((message) => (
          <div
            key={message.id}
            className={`flex w-full gap-3 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                message.role === "user"
                  ? "bg-polar-night-deep text-white"
                  : "bg-polar-night-gray/20 text-polar-night-deep"
              }`}
            >
              {message.role === "user" ? "U" : "AI"}
            </div>
            <div
              className={`flex max-w-3xl flex-col gap-2 ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm backdrop-blur ${
                  message.role === "user"
                    ? "rounded-br-md bg-polar-night-deep text-white"
                    : "rounded-bl-md border border-polar-night-gray/20 bg-white/90 text-polar-night-charcoal dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-100"
                }`}
              >
                <MessageFormatter content={message.content} />
              </div>
              <div className="px-1 text-xs font-medium uppercase tracking-wide text-polar-night-gray/80 dark:text-neutral-400">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex w-full gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-polar-night-gray/20 text-sm font-semibold text-polar-night-deep">
              AI
            </div>
            <div className="flex flex-col items-start gap-2">
              <div className="rounded-2xl rounded-bl-md border border-polar-night-gray/20 bg-white/90 px-4 py-3 text-sm leading-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/90">
                <TypingIndicator />
              </div>
            </div>
          </div>
        )}

        {chatHistory.length > 0 && <div ref={messagesEndRef} />}
      </div>
    </div>
  );
}
