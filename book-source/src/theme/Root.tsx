/**
 * Docusaurus Root Component
 *
 * This component wraps the entire site with the AnalyticsTracker,
 * enabling automatic tracking of user interactions (page views, scroll depth, etc.)
 *
 * GA4 is configured via the GA4_MEASUREMENT_ID environment variable.
 * If not set, analytics will not load.
 */

import React, { useState, useEffect } from "react";
import { useLocation } from "@docusaurus/router";
import ReactDOM from "react-dom";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ChatKitInterface } from "@/components/ChatKitInterface";

export default function Root({ children }) {
  // Load ChatKit script on mount
  useEffect(() => {
    if (!document.querySelector('script[src*="chatkit.js"]')) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.platform.openai.com/deployments/chatkit/chatkit.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);
  const location = useLocation();
  const [showInterface, setShowInterface] = useState(false);
  const [containerElement, setContainerElement] = useState<HTMLElement | null>(
    null,
  );

  const isDocsPage = location.pathname.startsWith("/docs/");
  const isInterfaceActive = showInterface && isDocsPage;

  // Toggle body class based on state
  useEffect(() => {
    if (isInterfaceActive) {
      document.body.classList.add("agentic-interface-active");
      document.documentElement.classList.add("agentic-interface-active");
    } else {
      document.body.classList.remove("agentic-interface-active");
      document.documentElement.classList.remove("agentic-interface-active");
    }

    return () => {
      document.body.classList.remove("agentic-interface-active");
      document.documentElement.classList.remove("agentic-interface-active");
    };
  }, [isInterfaceActive]);

  // Find container element for portal injection
  useEffect(() => {
    if (!isInterfaceActive) {
      setContainerElement(null);
      return;
    }

    const findContainer = () => {
      const mainWrapper = document.querySelector(
        ".main-wrapper",
      ) as HTMLElement | null;

      if (mainWrapper) {
        setContainerElement(mainWrapper);
      } else {
        setTimeout(findContainer, 100);
      }
    };

    findContainer();
  }, [isInterfaceActive]);

  return (
    <AnalyticsTracker>
      {children}

      {/* Toggle button in navbar area */}
      {isDocsPage && (
        <div className="fixed right-[280px] top-3 z-[9999] flex items-center gap-2">
          <label className="relative inline-flex h-6 w-11 cursor-pointer items-center">
            <input
              type="checkbox"
              checked={showInterface}
              onChange={() => setShowInterface((prev) => !prev)}
              className="peer sr-only"
            />
            <span className="absolute inset-0 rounded-full bg-neutral-400 transition peer-checked:bg-[var(--ifm-color-primary)]">
              <span className="absolute bottom-[3px] left-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition peer-checked:translate-x-[20px]" />
            </span>
          </label>
        </div>
      )}

      {/* Chat Interface - injected via portal into container */}
      {isInterfaceActive &&
        containerElement &&
        ReactDOM.createPortal(
          <div className="relative flex min-h-full w-full flex-1 flex-col overflow-x-hidden overflow-y-auto border-l border-polar-night-gray/15 bg-white/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-950/70 p-6">
            <ChatKitInterface onClose={() => setShowInterface(false)} />
          </div>,
          containerElement,
        )}
    </AnalyticsTracker>
  );
}
