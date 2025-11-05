// React hook for WebContainer management
import { useState, useEffect, useCallback } from 'react';
import {
  initializeWebContainer,
  getWebContainer,
  createTerminalSession,
  getWebContainerInstance,
} from '../services/webcontainer';
import type { WebContainer } from '@webcontainer/api';

export interface UseWebContainerReturn {
  webcontainer: WebContainer | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  initialize: () => Promise<void>;
  createSession: (onData: (data: string) => void) => Promise<{ process: any; cleanup: () => void }>;
}

export function useWebContainer(): UseWebContainerReturn {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initialize = useCallback(async () => {
    if (webcontainer) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const instance = await initializeWebContainer();
      setWebcontainer(instance);
      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize WebContainer'));
    } finally {
      setIsLoading(false);
    }
  }, [webcontainer]);

  const createSession = useCallback(
    async (onData: (data: string) => void) => {
      if (!webcontainer) {
        const instance = await getWebContainer();
        setWebcontainer(instance);
      }

      const currentContainer = webcontainer || getWebContainerInstance();
      if (!currentContainer) {
        throw new Error('WebContainer not initialized');
      }

      return createTerminalSession(currentContainer, onData);
    },
    [webcontainer]
  );

  useEffect(() => {
    // Auto-initialize on mount
    initialize();
  }, [initialize]);

  return {
    webcontainer,
    isInitialized,
    isLoading,
    error,
    initialize,
    createSession,
  };
}

