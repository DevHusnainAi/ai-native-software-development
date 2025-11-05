import React from 'react';
import './AIPersonaWelcome.css';

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export function AIPersonaWelcome() {
  const greeting = getTimeBasedGreeting();

  return (
    <div className="ai-persona-welcome">
      <div className="ai-persona-container">
        <div className="ai-persona-orb">
          <div className="ai-persona-glow" />
          <div className="ai-persona-core" />
          <img
            src="/favicon.ico"
            alt="AI Assistant Logo"
            className="ai-persona-logo"
          />
        </div>
      </div>
      <div className="ai-persona-greeting">
        <h2 className="ai-greeting-time">{greeting}</h2>
        <p className="ai-greeting-text">
          I'm your AI learning assistant. How can I help you today?
        </p>
      </div>
    </div>
  );
}

