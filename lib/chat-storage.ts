const STORAGE_KEY = "finance-chat-history";
const MAX_HISTORY = 50;

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: number;
  messageCount: number;
}

export function getChatHistory(): ChatConversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as ChatConversation[];
    return Array.isArray(list) ? list.slice(0, MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

export function saveConversation(conv: ChatConversation) {
  const list = getChatHistory();
  const filtered = list.filter((c) => c.id !== conv.id);
  const updated = [conv, ...filtered].slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteConversation(id: string) {
  const list = getChatHistory().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getConversationMessages(conversationId: string): { role: string; content: string }[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}-${conversationId}`);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveConversationMessages(conversationId: string, messages: { role: string; content: string }[]) {
  localStorage.setItem(`${STORAGE_KEY}-${conversationId}`, JSON.stringify(messages));
}
