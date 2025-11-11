import React from "react";

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export function AIPersonaWelcome() {
  const greeting = getTimeBasedGreeting();

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-6 rounded-[32px] border border-polar-night-gray/20 bg-white/80 px-10 py-12 text-center shadow-2xl backdrop-blur-lg supports-[backdrop-filter]:bg-white/65 dark:border-neutral-700 dark:bg-neutral-900/70">
      <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-[rgba(40,40,40,0.95)] shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_80px_rgba(0,0,0,0.5),0_0_120px_rgba(0,0,0,0.3),inset_0_0_40px_rgba(150,150,150,0.15),inset_0_0_80px_rgba(150,150,150,0.05)]">
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-polar-night-charcoal/40 via-polar-night-deep/60 to-black/90" />
        <img
          src="/favicon.ico"
          alt="AI Assistant Logo"
          className="relative h-16 w-16 select-none"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-semibold tracking-tight text-polar-night-deep dark:text-polar-night-light">
          {greeting}
        </h2>
        <p className="max-w-md text-sm leading-6 text-polar-night-gray dark:text-neutral-300">
          I’m your AI learning assistant. How can I help you today?
        </p>
      </div>
    </div>
  );
}
