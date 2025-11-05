// TypeScript type definitions for agentic interface

export interface UserSession {
  sessionId: string;
  userId?: string;
  chapterId?: string;
  createdAt: Date;
  lastActive: Date;
}

export interface TerminalSession {
  sessionId: string;
  webcontainerId: string;
  filesystemState: Record<string, any>;
  packageCache: string[];
  lastActive: Date;
}

export interface ChatConversation {
  sessionId: string;
  chapterId: string;
  messages: ChatMessage[];
  context?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  name: string;
  arguments: Record<string, any>;
  result?: any;
}

export interface CanvasDiagram {
  diagramId: string;
  sessionId: string;
  mermaidSyntax: string;
  renderedState?: {
    zoom: number;
    pan: { x: number; y: number };
  };
  createdAt: Date;
  associatedMessageId?: string;
}

export interface AgenticInterfaceState {
  isActive: boolean;
  currentChapterId?: string;
  sessionId?: string;
  chatHistory: ChatMessage[];
  activeDiagramId?: string;
  terminalReady: boolean;
}

