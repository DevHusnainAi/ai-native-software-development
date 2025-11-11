import React from "react";

interface SuggestedPrompt {
  title: string;
  description: string;
  icon: string;
  prompt: string;
}

const DEFAULT_PROMPTS: SuggestedPrompt[] = [
  {
    title: "Explain This Chapter",
    description: "Get a detailed explanation of the current chapter concepts",
    icon: "📚",
    prompt: "Can you explain the key concepts in this chapter?",
  },
  {
    title: "Code Example",
    description: "See a practical code example related to this topic",
    icon: "💻",
    prompt: "Can you show me a code example for this chapter?",
  },
  {
    title: "Practice Exercise",
    description: "Try a hands-on exercise to reinforce your learning",
    icon: "🎯",
    prompt: "Can you give me a practice exercise for this chapter?",
  },
];

interface SuggestedPromptsProps {
  chapterId?: string;
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({
  chapterId,
  onSelect,
}: SuggestedPromptsProps) {
  const handlePromptClick = (prompt: string) => {
    onSelect(prompt);
  };

  return (
    <div className="mt-4 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {DEFAULT_PROMPTS.map((prompt, idx) => (
        <button
          key={idx}
          className="flex items-start gap-3 rounded-2xl border border-polar-night-gray/15 bg-white/80 p-4 text-left shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-polar-night-deep/40 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-900/70 dark:focus-visible:ring-offset-neutral-900"
          onClick={() => handlePromptClick(prompt.prompt)}
          type="button"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-polar-night-deep/10 text-2xl">
            {prompt.icon}
          </div>
          <div className="flex flex-col">
            <h4 className="text-base font-semibold text-polar-night-deep dark:text-neutral-100">
              {prompt.title}
            </h4>
            <p className="mt-1 text-sm leading-5 text-polar-night-gray dark:text-neutral-400">
              {prompt.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
