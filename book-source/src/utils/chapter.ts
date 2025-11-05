// Utility to extract chapter_id from Docusaurus route
import { useLocation } from '@docusaurus/router';

/**
 * Extract chapter identifier from current route pathname.
 * 
 * Examples:
 * - "/docs/01-Introducing-AI-Driven-Development/01-ai-development-revolution/" 
 *   -> "01-ai-development-revolution"
 * - "/docs/02-AI-Tool-Landscape/05-claude-code-features-and-workflows/"
 *   -> "05-claude-code-features-and-workflows"
 * 
 * @returns Chapter ID or undefined if not a docs page
 */
export function extractChapterIdFromRoute(pathname: string): string | undefined {
  // Match docs routes: /docs/.../chapter-name/
  const docsMatch = pathname.match(/\/docs\/([^/]+\/)*([^/]+)\/?$/);
  
  if (docsMatch && docsMatch[2]) {
    return docsMatch[2];
  }
  
  // If no match, return undefined
  return undefined;
}

/**
 * React hook to get current chapter ID from route.
 */
export function useChapterId(): string | undefined {
  const location = useLocation();
  return extractChapterIdFromRoute(location.pathname);
}

