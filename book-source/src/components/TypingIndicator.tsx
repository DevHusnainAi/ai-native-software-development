import React from "react";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-polar-night-deep/80 animate-typing-dot" />
        <span className="h-2 w-2 rounded-full bg-polar-night-deep/80 animate-typing-dot [animation-delay:0.15s]" />
        <span className="h-2 w-2 rounded-full bg-polar-night-deep/80 animate-typing-dot [animation-delay:0.3s]" />
      </div>
      <span className="text-xs font-medium uppercase tracking-wide text-polar-night-deep/70">
        AI is thinking
      </span>
    </div>
  );
}
