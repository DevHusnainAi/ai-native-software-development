/**
 * AgenticInterfaceSelector - UI mode switcher for chat interfaces
 *
 * This component allows users to toggle between two chat UIs:
 * 1. ChatKit UI - Production-ready OpenAI ChatKit interface
 * 2. Custom UI - Your existing pedagogical interface with teaching metadata
 *
 * Features:
 * - Smooth mode switching with Tailwind animations
 * - Preserves session state across UI switches
 * - Accessible keyboard navigation
 * - Dark mode support
 * - Responsive design
 */

import React, { useState } from 'react';
import { AgenticInterface } from './AgenticInterface';
import { ChatKitInterface } from './ChatKitInterface';

interface AgenticInterfaceSelectorProps {
  /** Optional chapter ID for contextual learning */
  chapterId?: string;
  /** Optional close handler for modal/drawer implementations */
  onClose?: () => void;
  /** Default UI mode (defaults to 'chatkit') */
  defaultMode?: 'custom' | 'chatkit';
}

export function AgenticInterfaceSelector({
  chapterId,
  onClose,
  defaultMode = 'chatkit'
}: AgenticInterfaceSelectorProps) {
  const [mode, setMode] = useState<'custom' | 'chatkit'>(defaultMode);

  return (
    <div className="flex h-full w-full flex-col">

      {/* Mode Toggle Bar - Tailwind styled */}
      <div className="flex gap-2 border-b border-polar-night-gray/20 bg-white/80 p-3 backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/80">

        {/* ChatKit Mode Button */}
        <button
          onClick={() => setMode('chatkit')}
          className={`
            group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
            ${mode === 'chatkit'
              ? 'bg-polar-night-deep text-white shadow-lg shadow-polar-night-deep/25 scale-105'
              : 'bg-polar-night-gray/10 text-polar-night-charcoal hover:bg-polar-night-gray/20 hover:scale-105 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'
            }
          `}
          aria-pressed={mode === 'chatkit'}
          aria-label="Switch to ChatKit UI"
        >
          {/* Lightning icon for ChatKit (represents speed/modern) */}
          <svg
            className={`h-4 w-4 transition-transform ${mode === 'chatkit' ? 'scale-110' : 'group-hover:scale-110'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>ChatKit UI</span>

          {/* "New" badge */}
          {mode !== 'chatkit' && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              New
            </span>
          )}
        </button>

        {/* Custom Mode Button */}
        <button
          onClick={() => setMode('custom')}
          className={`
            group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
            ${mode === 'custom'
              ? 'bg-polar-night-deep text-white shadow-lg shadow-polar-night-deep/25 scale-105'
              : 'bg-polar-night-gray/10 text-polar-night-charcoal hover:bg-polar-night-gray/20 hover:scale-105 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'
            }
          `}
          aria-pressed={mode === 'custom'}
          aria-label="Switch to Custom UI"
        >
          {/* Adjustments icon for Custom (represents customization) */}
          <svg
            className={`h-4 w-4 transition-transform ${mode === 'custom' ? 'scale-110' : 'group-hover:scale-110'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <span>Custom UI</span>

          {/* "Teaching" badge */}
          {mode !== 'custom' && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              Teaching
            </span>
          )}
        </button>

        {/* Info tooltip */}
        <div className="ml-auto flex items-center">
          <div className="group relative">
            <button
              className="rounded-full p-1.5 text-polar-night-gray hover:bg-polar-night-gray/10 hover:text-polar-night-charcoal dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              aria-label="About UI modes"
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

            {/* Tooltip on hover */}
            <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 hidden w-64 rounded-lg border border-polar-night-gray/20 bg-white p-3 text-xs shadow-xl group-hover:block dark:border-neutral-700 dark:bg-neutral-800">
              <p className="mb-2 font-semibold text-polar-night-deep dark:text-white">
                UI Mode Switcher
              </p>
              <ul className="space-y-1 text-polar-night-charcoal dark:text-neutral-300">
                <li><strong>ChatKit:</strong> Modern, production-tested interface</li>
                <li><strong>Custom:</strong> Pedagogical features and teaching metadata</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Interface Container - Rendered based on selected mode */}
      <div className="flex-1 overflow-hidden">
        {mode === 'chatkit' ? (
          <ChatKitInterface
            chapterId={chapterId}
            onClose={onClose}
          />
        ) : (
          <AgenticInterface
            chapterId={chapterId}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
