// API client for backend communication
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.ai-native.panaversity.org'
  : 'http://localhost:8000';

export interface ChatMessage {
  message: string;
  chapter_id?: string;
  session_id?: string;
}

export interface ChatResponse {
  response: string;
  session_id: string;
}

export interface SessionInit {
  session_id: string;
  welcome_message: string;
}

export async function sendChatMessage(data: ChatMessage): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export async function initChatSession(chapterId?: string): Promise<SessionInit> {
  const url = chapterId 
    ? `${API_BASE_URL}/api/v1/chat/init?chapter_id=${encodeURIComponent(chapterId)}`
    : `${API_BASE_URL}/api/v1/chat/init`;
    
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getChapterContext(chapterId: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/v1/chapter/${chapterId}/context`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content || '';
}
