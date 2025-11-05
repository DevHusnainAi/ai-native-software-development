import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useWebContainer } from '../hooks/useWebContainer';
             
interface TerminalPanelProps {
  sessionId?: string;
  onReady?: () => void;
}

export function TerminalPanel({ sessionId, onReady }: TerminalPanelProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [terminalError, setTerminalError] = useState<string | null>(null);
  const { webcontainer, isInitialized, isLoading, error, initialize, createSession } = useWebContainer();

  // Initialize xterm.js terminal
  useEffect(() => {
    if (!terminalRef.current || terminalInstanceRef.current) return;

    try {
      console.log('[TerminalPanel] Initializing xterm.js...');

      const terminal = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: '"Courier New", Courier, monospace',
        theme: {
          background: '#111111', // Polar Night charcoal
          foreground: '#dddddd', // Polar Night light
          cursor: '#aaaaaa', // Polar Night gray
          // selection: '#001f3f', // Polar Night deep
        },
        rows: 20,
        cols: 80,
      });

      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);

      terminal.open(terminalRef.current);

      // Fit terminal to container after a short delay
      setTimeout(() => {
        try {
          fitAddon.fit();
          console.log('[TerminalPanel] Terminal fitted to container');
        } catch (err) {
          console.warn('[TerminalPanel] Fit error:', err);
        }
      }, 100);

      terminalInstanceRef.current = terminal;
      fitAddonRef.current = fitAddon;

      terminal.writeln('Welcome to the AI-Native Development Terminal!');
      terminal.writeln('Initializing WebContainer...');
      terminal.writeln('');

      console.log('[TerminalPanel] xterm.js initialized successfully');

      // Handle window resize
      const handleResize = () => {
        if (fitAddonRef.current && terminalInstanceRef.current) {
          try {
            fitAddonRef.current.fit();
          } catch (err) {
            console.warn('[TerminalPanel] Resize fit error:', err);
          }
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        console.log('[TerminalPanel] Cleaning up terminal...');
        window.removeEventListener('resize', handleResize);
        terminal.dispose();
        terminalInstanceRef.current = null;
        fitAddonRef.current = null;
      };
    } catch (err) {
      console.error('[TerminalPanel] Failed to initialize xterm:', err);
      setTerminalError(err instanceof Error ? err.message : 'Failed to initialize terminal');
    }
  }, []);

  // Setup WebContainer terminal session
  useEffect(() => {
    if (!isInitialized || !webcontainer || isReady || !terminalInstanceRef.current) return;

    const setupTerminal = async () => {
      try {
        const terminal = terminalInstanceRef.current;
        if (!terminal) {
          console.error('[TerminalPanel] Terminal instance not found');
          return;
        }

        console.log('[TerminalPanel] Setting up WebContainer session...');
        terminal.writeln('Starting shell...');

        const { process: shellProcess } = await createSession((data) => {
          terminal.write(data);
        });

        console.log('[TerminalPanel] Shell process created');

        // Send input to shell
        terminal.onData((data) => {
          try {
            shellProcess.input.write(data);
          } catch (err) {
            console.error('[TerminalPanel] Error writing to shell:', err);
          }
        });

        terminal.writeln('\r\nTerminal ready! Type commands below:\r\n');
        setIsReady(true);
        onReady?.();
        console.log('[TerminalPanel] Terminal fully initialized');
      } catch (err) {
        console.error('[TerminalPanel] Terminal setup error:', err);
        const terminal = terminalInstanceRef.current;
        if (terminal) {
          terminal.writeln('');
          terminal.writeln(`\x1b[31mError: ${err instanceof Error ? err.message : 'Unknown error'}\x1b[0m`);
          terminal.writeln('Please refresh the page to try again.');
        }
        setTerminalError(err instanceof Error ? err.message : 'Failed to setup terminal');
      }
    };

    setupTerminal();
  }, [isInitialized, webcontainer, isReady, createSession, onReady]);

  // Auto-initialize WebContainer
  useEffect(() => {
    if (!isInitialized && !isLoading && !error) {
      console.log('[TerminalPanel] Auto-initializing WebContainer...');
      initialize();
    }
  }, [isInitialized, isLoading, error, initialize]);

  // Show WebContainer error
  if (error) {
    return (
      <div className="terminal-panel">
        <div className="terminal-header">
          <h3>Terminal</h3>
          <span className="status" style={{ color: '#dc3545' }}>Error</span>
        </div>
        <div className="terminal-panel error">
          <p><strong>WebContainer Initialization Error:</strong></p>
          <p>{error.message}</p>
          <p style={{ fontSize: '0.875rem', marginTop: '1rem', opacity: 0.8 }}>
            WebContainers require a modern browser with SharedArrayBuffer support.
            Please ensure you're using Chrome, Edge, or another Chromium-based browser.
          </p>
        </div>
      </div>
    );
  }

  // Show terminal initialization error
  if (terminalError) {
    return (
      <div className="terminal-panel">
        <div className="terminal-header">
          <h3>Terminal</h3>
          <span className="status" style={{ color: '#dc3545' }}>Error</span>
        </div>
        <div className="terminal-panel error">
          <p><strong>Terminal Initialization Error:</strong></p>
          <p>{terminalError}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="terminal-panel"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div className="terminal-header">
        <h3>Terminal</h3>
        {isLoading && <span className="status">Booting WebContainer...</span>}
        {isInitialized && !isReady && <span className="status">Starting shell...</span>}
        {isReady && <span className="status" style={{ color: '#28a745' }}>Ready</span>}
      </div>
      <div 
        ref={terminalRef} 
        className="terminal-container"
        style={{
          flex: 1,
          width: '100%',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
        }}
      />
    </div>
  );
}

