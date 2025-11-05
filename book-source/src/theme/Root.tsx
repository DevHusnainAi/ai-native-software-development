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
import { AgenticInterface } from "@/components/AgenticInterface";
// No CSS imports - all styling is inline or in components

export default function Root({ children }) {
  const location = useLocation();
  const [showInterface, setShowInterface] = useState(false);
  const [containerElement, setContainerElement] = useState<HTMLElement | null>(
    null
  );

  const isDocsPage = location.pathname.startsWith("/docs/");

  // No event listeners needed - toggle button is in Root component now

  // Add CSS class to body when interface is active
  useEffect(() => {
    if (showInterface && isDocsPage) {
      console.log("[Root.tsx] 🟢 ADDING agentic-interface-active class");
      document.body.classList.add("agentic-interface-active");
      document.documentElement.classList.add("agentic-interface-active");

      // Force reflow
      void document.body.offsetHeight;

      // Verify it was added
      setTimeout(() => {
        console.log("[Root.tsx] Body classes:", document.body.className);
        console.log(
          "[Root.tsx] HTML classes:",
          document.documentElement.className
        );
      }, 100);
    } else {
      console.log("[Root.tsx] 🔴 REMOVING agentic-interface-active class");
      document.body.classList.remove("agentic-interface-active");
      document.documentElement.classList.remove("agentic-interface-active");
      // Restore book container visibility when turning off interface
      const mainWrapper = document.querySelector(
        ".main-wrapper"
      ) as HTMLElement | null;
      const container = mainWrapper?.querySelector(
        ".container"
      ) as HTMLElement | null;
      if (container) {
        container.style.removeProperty("display");
      }
    }

    return () => {
      document.body.classList.remove("agentic-interface-active");
      document.documentElement.classList.remove("agentic-interface-active");
    };
  }, [showInterface, isDocsPage]);

  // Find and prepare the container element for portal injection
  useEffect(() => {
    if (!showInterface || !isDocsPage) {
      setContainerElement(null);
      return;
    }

    // Wait for DOM to be ready AND Docusaurus to finish rendering
    const findContainer = () => {
      // CRITICAL: Inject into .main-wrapper itself, NOT .container
      // .main-wrapper is the flex parent we need to modify
      const mainWrapper = document.querySelector(
        ".main-wrapper"
      ) as HTMLElement | null;

      if (mainWrapper) {
        console.log("[AgenticInterface] ✅ main-wrapper found:", mainWrapper);
        console.log(
          "[AgenticInterface] main-wrapper children:",
          Array.from(mainWrapper.children).map((c) => c.className)
        );

        // SIMPLER APPROACH: Just hide book content completely and inject chat at root level
        const container = mainWrapper.querySelector(".container");

        if (container instanceof HTMLElement) {
          // Hide the ENTIRE container (book content area)
          container.style.setProperty("display", "none", "important");
          console.log("[AgenticInterface] ✅ Container hidden completely");
        }

        // Use main-wrapper as injection target so chat becomes a sibling of container
        setContainerElement(mainWrapper);
        console.log(
          "[AgenticInterface] Portal will inject into main-wrapper as new child"
        );

        // Style main-wrapper to be flex row - SIDEBAR + CHAT LAYOUT
        mainWrapper.style.setProperty("display", "flex", "important");
        mainWrapper.style.setProperty("flex-direction", "row", "important");
        mainWrapper.style.setProperty("width", "100%", "important");
        mainWrapper.style.setProperty(
          "height",
          "calc(100vh - 60px)",
          "important"
        );
        mainWrapper.style.removeProperty("overflow");
        mainWrapper.style.setProperty("overflow-x", "hidden", "important");
        mainWrapper.style.setProperty("overflow-y", "auto", "important");
        mainWrapper.style.setProperty("align-items", "stretch", "important");
        mainWrapper.style.setProperty(
          "justify-content",
          "flex-start",
          "important"
        );

        // Show sidebar - keep it visible
        mainWrapper
          .querySelectorAll(
            'aside, [class*="sidebar"], [class*="DocSidebar"], .theme-doc-sidebar-container'
          )
          .forEach((sidebar) => {
            if (sidebar instanceof HTMLElement) {
              sidebar.style.removeProperty("display");
              sidebar.style.removeProperty("visibility");
              sidebar.style.removeProperty("opacity");
              sidebar.style.removeProperty("width");
              sidebar.style.removeProperty("max-width");
              sidebar.style.removeProperty("min-width");
              sidebar.style.removeProperty("flex");
              console.log(
                "[AgenticInterface] ✅ Sidebar kept visible:",
                sidebar.className
              );
            }
          });

        document.body.classList.add("agentic-interface-active");
        document.documentElement.classList.add("agentic-interface-active");
        console.log("[AgenticInterface] ✅ Layout: SIDEBAR + CHAT INTERFACE");
      } else {
        console.warn(
          "[AgenticInterface] ❌ main-wrapper not found, retrying..."
        );
        setTimeout(findContainer, 100);
      }
    };

    // Call once; avoid MutationObserver feedback loops on attribute changes
    findContainer();

    return () => {
      /* no-op */
    };
  }, [showInterface, isDocsPage]);

  return (
    <AnalyticsTracker>
      {children}

      {/* Toggle button in navbar area */}
      {isDocsPage && (
        <div
          style={{
            position: "fixed",
            top: "12px",
            right: "280px",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <label
            style={{
              position: "relative",
              display: "inline-block",
              width: "44px",
              height: "24px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={showInterface}
              onChange={() => setShowInterface((prev) => !prev)}
              style={{
                opacity: 0,
                width: 0,
                height: 0,
              }}
            />
            <span
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: showInterface
                  ? "var(--ifm-color-primary)"
                  : "#ccc",
                borderRadius: "24px",
                transition: "0.3s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  height: "18px",
                  width: "18px",
                  left: showInterface ? "23px" : "3px",
                  bottom: "3px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  transition: "0.3s",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              />
            </span>
          </label>
        </div>
      )}

      {/* Chat Interface - injected via portal into container */}
      {isDocsPage && showInterface && (
        <>
          {console.log(
            "[Root.tsx] Rendering with containerElement:",
            containerElement
          )}
          {containerElement ? (
            ReactDOM.createPortal(
              <div
                className="agentic-side-panel"
                style={{
                  flex: "1 1 100%",
                  width: "100%",
                  height: "100%",
                  minHeight: 0,
                  margin: 0,
                  padding: 0,
                  boxSizing: "border-box",
                  overflowY: "auto",
                  overflowX: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  zIndex: 100,
                }}
              >
                <AgenticInterface onClose={() => setShowInterface(false)} />
              </div>,
              containerElement
            )
          ) : (
            <div
              style={{
                position: "fixed",
                top: "100px",
                right: "20px",
                background: "red",
                color: "white",
                padding: "20px",
                zIndex: 99999,
                fontSize: "20px",
              }}
            >
              ❌ NO CONTAINER FOUND!
            </div>
          )}
        </>
      )}
    </AnalyticsTracker>
  );
}
