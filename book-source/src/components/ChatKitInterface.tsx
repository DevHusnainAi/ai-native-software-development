/**
 * ChatKitInterface - OpenAI ChatKit integration with React + Tailwind CSS
 *
 * This component provides a production-ready chat interface using OpenAI's ChatKit framework
 * while maintaining integration with your existing backend (Gemini + pedagogical intelligence).
 *
 * Features:
 * - Session management with JWT authentication
 * - Streaming responses (built into ChatKit)
 * - Rich widgets and markdown rendering
 * - Chapter context integration
 * - Error handling with Tailwind-styled UI
 * - Dark mode support
 */

import React, { useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";

interface ChatKitInterfaceProps {
  /** Optional chapter ID for contextual learning */
  chapterId?: string;
  /** Optional close handler for modal/drawer implementations */
  onClose?: () => void;
}

export function ChatKitInterface({
  chapterId,
  onClose,
}: ChatKitInterfaceProps) {
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const { control } = useChatKit({
    api: {
      /**
       * Generate client secret from your backend
       * This is called automatically by ChatKit when:
       * 1. First initializing the chat
       * 2. When the existing secret expires
       */
      async getClientSecret(existingSecret) {
        try {
          setIsInitializing(true);
          setError(null);

          // Reuse existing secret if still valid
          if (existingSecret) {
            setIsInitializing(false);
            return existingSecret;
          }

          // Fetch new session from your backend
          const response = await fetch("/api/v1/chatkit/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chapter_id: chapterId }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `Session creation failed (${response.status}): ${errorText}`,
            );
          }

          const data = await response.json();
          setIsInitializing(false);

          // Clear any previous errors on successful session creation
          setError(null);

          return data.client_secret;
        } catch (err) {
          setIsInitializing(false);
          const message =
            err instanceof Error ? err.message : "Unknown error occurred";
          setError(`Failed to initialize chat: ${message}`);
          console.error("ChatKit session error:", err);
          throw err;
        }
      },
    },
  });

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-polar-night-gray/20 bg-white/80 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/80">
      {/* Header - Tailwind styled with gradient */}
      <div className="flex items-center justify-between border-b border-polar-night-gray/20 bg-gradient-to-r from-polar-night-deep to-polar-night-deep/90 px-6 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          {/* AI Icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>

          {/* Title and subtitle */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              AI Learning Assistant
            </h3>
            <p className="text-xs text-white/70">Powered by ChatKit</p>
          </div>
        </div>

        {/* Close button (if onClose provided) */}
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close chat"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Initialization loading indicator */}
      {isInitializing && (
        <div className="border-b border-polar-night-gray/20 bg-blue-50 px-6 py-3 dark:bg-blue-900/20">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-400"></div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Initializing chat session...
            </p>
          </div>
        </div>
      )}

      {/* Error banner - Tailwind styled */}
      {error && (
        <div className="border-b border-red-200 bg-red-50 px-6 py-3 dark:border-red-900/50 dark:bg-red-900/20">
          <div className="flex items-start gap-2">
            {/* Error icon */}
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            {/* Error message */}
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {error}
              </p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 focus:outline-none dark:text-red-400 dark:hover:text-red-200"
              aria-label="Dismiss error"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ChatKit Component - Main chat interface */}
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-white/50 to-white/80 dark:from-neutral-900/50 dark:to-neutral-900/80">
        <ChatKit control={control} className="h-full w-full" />
      </div>

      {/* Footer - Chapter context indicator */}
      {chapterId && (
        <div className="border-t border-polar-night-gray/20 bg-white/60 px-6 py-2 backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-polar-night-gray dark:text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-xs font-medium text-polar-night-gray dark:text-neutral-400">
              Context: Chapter {chapterId}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
