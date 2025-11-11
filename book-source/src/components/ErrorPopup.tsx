import React, { useEffect } from "react";

interface ErrorPopupProps {
  error: string | null;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function ErrorPopup({
  error,
  onClose,
  autoClose = false,
  autoCloseDelay = 5000,
}: ErrorPopupProps) {
  useEffect(() => {
    if (error && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [error, autoClose, autoCloseDelay, onClose]);

  if (!error) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 px-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-red-500/20 bg-white shadow-2xl shadow-red-500/10 transition dark:border-red-400/40 dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-red-500/10 bg-red-500/10 px-6 py-4 text-red-600 dark:border-red-400/20 dark:bg-red-500/20 dark:text-red-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 8v4M12 16h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Error</h3>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-polar-night-charcoal dark:text-neutral-200">
            {error}
          </p>
        </div>
        <div className="flex justify-end border-t border-red-500/10 bg-red-500/5 px-6 py-4 dark:border-red-400/20 dark:bg-red-500/10">
          <button
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 dark:focus:ring-offset-neutral-900"
            onClick={onClose}
            aria-label="Close error"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
