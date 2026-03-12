"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Navbar } from "@/components/navbar";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { MessageCircle, Send, History, Loader2, AlertCircle } from "lucide-react";
import {
  getChatHistory,
  saveConversation,
  saveConversationMessages,
  getConversationMessages,
  deleteConversation,
  type ChatConversation,
} from "@/lib/chat-storage";

const QUICK_QUESTIONS = [
  "什么是复利？",
  "基金和股票有什么区别？",
  "如何开始定投？",
  "年轻人应该如何理财？",
  "什么是年化收益率？",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<ChatConversation[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadHistory = () => {
    setHistory(getChatHistory());
  };

  const handleSend = async (text?: string) => {
    const query = (text ?? input).trim();
    if (!query || loading) return;

    setInput("");
    const userMsg: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    let fullAnswer = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          conversation_id: conversationId,
          user: "web-user",
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `请求失败 ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("无法读取响应流");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          try {
            const json = JSON.parse(line.slice(6));
            if (json.event === "message" || json.event === "agent_message") {
              if (json.answer) {
                fullAnswer += json.answer;
                setMessages((prev) => {
                  const next = [...prev];
                  const last = next[next.length - 1];
                  if (last?.role === "assistant") {
                    next[next.length - 1] = { ...last, content: fullAnswer };
                  } else {
                    next.push({ role: "assistant", content: fullAnswer });
                  }
                  return next;
                });
              }
            } else if (json.event === "message_end") {
              if (json.conversation_id) setConversationId(json.conversation_id);
            }
          } catch {
            // 忽略解析错误
          }
        }
      }

      const finalMessages = [...messages, userMsg, { role: "assistant", content: fullAnswer }];
      const convId = conversationId || `conv-${Date.now()}`;
      if (!conversationId) setConversationId(convId);

      saveConversation({
        id: convId,
        title: query.slice(0, 30) + (query.length > 30 ? "…" : ""),
        createdAt: Date.now(),
        messageCount: finalMessages.length,
      });
      saveConversationMessages(convId, finalMessages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "请求失败");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = (conv: ChatConversation) => {
    const msgs = getConversationMessages(conv.id);
    if (msgs.length) {
      setMessages(
        msgs.map((m) => ({ role: m.role as "user" | "assistant", content: m.content }))
      );
      setConversationId(conv.id);
    }
    setHistoryOpen(false);
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId("");
    setHistoryOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <RequireAuth>
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            智能理财助手
          </h1>
          <div className="flex items-center gap-2">
            <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" onClick={loadHistory}>
                  <History className="h-4 w-4" />
                  历史
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>对话历史</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={startNewChat}>
                    新建对话
                  </Button>
                  {history.map((conv) => (
                    <div
                      key={conv.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 cursor-pointer group"
                      onClick={() => loadConversation(conv)}
                    >
                      <span className="text-sm truncate flex-1">{conv.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                          loadHistory();
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  {history.length === 0 && (
                    <p className="text-sm text-muted-foreground py-4">暂无历史对话</p>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          本助手仅供参考，不构成投资建议。投资有风险，决策需谨慎。
        </p>

        <div className="flex-1 overflow-y-auto min-h-[300px] space-y-4 pb-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-6">有什么理财问题，尽管问我</p>
              <div className="flex flex-wrap justify-center gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleSend(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          {loading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-2 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">思考中…</span>
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-start">
              <div className="bg-destructive/10 text-destructive rounded-2xl px-4 py-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="border-t pt-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="输入你的理财问题…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
              disabled={loading}
            />
            <Button
              size="icon"
              className="h-11 w-11 shrink-0 rounded-full"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        </div>
      </RequireAuth>
    </div>
  );
}
