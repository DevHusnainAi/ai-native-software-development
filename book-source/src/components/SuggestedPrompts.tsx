import React from 'react';
import './SuggestedPrompts.css';

interface SuggestedPrompt {
  title: string;
  description: string;
  icon: string;
  prompt: string;
}

const DEFAULT_PROMPTS: SuggestedPrompt[] = [
  {
    title: 'Explain This Chapter',
    description: 'Get a detailed explanation of the current chapter concepts',
    icon: '📚',
    prompt: 'Can you explain the key concepts in this chapter?',
  },
  {
    title: 'Code Example',
    description: 'See a practical code example related to this topic',
    icon: '💻',
    prompt: 'Can you show me a code example for this chapter?',
  },
  {
    title: 'Practice Exercise',
    description: 'Try a hands-on exercise to reinforce your learning',
    icon: '🎯',
    prompt: 'Can you give me a practice exercise for this chapter?',
  },
];

interface SuggestedPromptsProps {
  chapterId?: string;
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ 
  chapterId, 
  onSelect 
}: SuggestedPromptsProps) {
  const handlePromptClick = (prompt: string) => {
    onSelect(prompt);
  };

  return (
    <div className="suggested-prompts-container">
      {DEFAULT_PROMPTS.map((prompt, idx) => (
        <button
          key={idx}
          className="suggested-prompt-card"
          onClick={() => handlePromptClick(prompt.prompt)}
          type="button"
        >
          <div className="prompt-card-icon">{prompt.icon}</div>
          <div className="prompt-card-content">
            <h4 className="prompt-card-title">{prompt.title}</h4>
            <p className="prompt-card-description">{prompt.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

