import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage, initChatSession } from "../services/api";
import type { ChatMessage as ChatMessageType } from "../types/agentic";
import { AIPersonaWelcome } from "./AIPersonaWelcome";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { MessageFormatter } from "./MessageFormatter";
import "../css/agentic-chat-enhanced.css";

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
    propSessionId,
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
              "Failed to initialize chat session. Please refresh the page and try again.",
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
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
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
    if (e.key === 'Enter' && !e.shiftKey) {
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
        <form onSubmit={handleSubmit} className="chat-input-form">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Chat... (Press Enter to send, Shift+Enter for new line)"
            disabled={isLoading || !currentSessionId}
            className="chat-input"
            rows={1}
            style={{
              resize: 'none',
              overflow: 'hidden',
              minHeight: '44px',
              maxHeight: '200px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 200) + 'px';
            }}
          />
           <button
             type="submit"
             disabled={isLoading || !currentSessionId || !input.trim()}
             className={`send-button ${isLoading ? "loading" : ""}`}
           >
             {!isLoading && "Send"}
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
    <div className="agentic-chat">
      <div
        className={`chat-messages ${chatHistory.length === 0 ? "chat-messages-empty" : ""}`}
      >
        {chatHistory.length === 0 && <AIPersonaWelcome />}

         {chatHistory.map((message) => (
           <div key={message.id} className={`message ${message.role}`}>
             <div className="message-avatar">
               {message.role === "user" ? "U" : "AI"}
             </div>
             <div className="message-content-wrapper">
               <div className="message-content">
                 <MessageFormatter content={message.content} />
               </div>
               <div className="message-timestamp">
                 {message.timestamp.toLocaleTimeString()}
               </div>
             </div>
           </div>
         ))}

        {isLoading && (
          <div className="message assistant">
            <div className="message-avatar">AI</div>
            <div className="message-content-wrapper">
              <TypingIndicator />
            </div>
          </div>
        )}

        {chatHistory.length > 0 && <div ref={messagesEndRef} />}
      </div>
    </div>
  );
}
