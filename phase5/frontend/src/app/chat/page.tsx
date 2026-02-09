"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Plus, 
  ArrowLeft,
  Sparkles,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your TaskFlow AI assistant. How can I help you manage your tasks today? You can say things like 'Add a task to record a demo' or 'What are my pending tasks?'",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await api.post("/chat", {
        message: userMessage,
        conversation_id: conversationId,
      });

      const data = res.data;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
      setConversationId(data.conversation_id);
    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error("Failed to get response from AI assistant");
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "I'm sorry, I encountered an error processing your request. Please check if the backend is running and you are logged in." 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-border bg-card/50 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">AI Assistant</h1>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="hidden gap-2 sm:flex">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </header>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-3xl space-y-8 pb-10">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[85%] gap-4 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-sm ${
                    message.role === "user" ? "text-accent" : "text-primary"
                  }`}>
                    {message.role === "user" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-5 py-3.5 shadow-sm transition-all duration-300 ${
                      message.role === "user"
                        ? "bg-accent text-accent-foreground rounded-tr-none"
                        : "bg-card border border-border/50 text-foreground rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-4">
                <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-card border border-border/50 px-5 py-3.5">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-card/30 p-6 backdrop-blur-lg">
        <div className="mx-auto max-w-3xl">
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
            <div className="relative flex items-center gap-3 rounded-2xl border border-border bg-background p-2 pr-3 shadow-2xl transition-all duration-300 focus-within:border-primary/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask AI to manage your tasks..."
                className="h-12 border-none bg-transparent text-base focus-visible:ring-0 placeholder:text-muted-foreground/60 px-0"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className={`h-10 w-10 rounded-xl transition-all duration-300 ${
                  input.trim() && !isLoading 
                    ? "bg-primary text-primary-foreground shadow-lg scale-100" 
                    : "bg-secondary text-muted-foreground scale-95"
                }`}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground/60">
            Powered by Gemini AI • Connected to your Workspace
          </p>
        </div>
      </div>
    </div>
  );
}
