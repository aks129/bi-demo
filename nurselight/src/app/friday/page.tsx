"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function FridayPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [started, setStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!streaming) inputRef.current?.focus();
  }, [streaming]);

  async function startConversation() {
    setStarted(true);
    setStreaming(true);
    setMessages([{ role: "assistant", content: "" }]);

    const res = await fetch("/api/friday", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [] }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      full += decoder.decode(value, { stream: true });
      setMessages([{ role: "assistant", content: full }]);
    }
    setStreaming(false);
  }

  async function sendMessage() {
    if (!input.trim() || streaming) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages([...updated, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    const res = await fetch("/api/friday", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updated }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      full += decoder.decode(value, { stream: true });
      setMessages([...updated, { role: "assistant", content: full }]);
    }
    setStreaming(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  if (!started) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-lg mx-auto animate-fade-in-up">
          {/* Friday's presence indicator */}
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-spirit-400/20 to-ocean-400/20 animate-breathe" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-spirit-500/10 to-ocean-500/10 animate-breathe-ring" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">☽</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-3">
            <span className="text-gradient">Friday</span>
          </h1>
          <p className="text-white/40 font-serif italic mb-2">
            Your late-night companion
          </p>
          <p className="text-white/25 text-sm mb-10 max-w-sm mx-auto leading-relaxed">
            A gentle space to talk through what weighs on you.
            No judgment. No rush. Just presence.
          </p>

          <button
            onClick={startConversation}
            className="glass-warm rounded-full px-8 py-3.5 text-spirit-200 font-serif text-sm tracking-wide hover:bg-spirit-500/20 transition-all duration-500 hover:scale-[1.03] hover:border-spirit-400/30 border border-spirit-400/20"
          >
            Begin a conversation
          </button>

          <p className="text-white/15 text-[11px] mt-8 max-w-xs mx-auto leading-relaxed">
            Friday draws on research in mindfulness, cognitive therapy,
            and grief counseling — but speaks like a friend, not a textbook.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center gap-3 py-4 border-b border-white/5">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-spirit-400/30 to-ocean-400/20 flex items-center justify-center">
            <span className="text-lg">☽</span>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-sage-400/80 border-2 border-[#1a1025]" />
        </div>
        <div>
          <h2 className="text-white/80 font-serif text-sm">Friday</h2>
          <p className="text-white/25 text-[11px]">here with you</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] ${
                msg.role === "user"
                  ? "bg-spirit-500/15 border border-spirit-400/20 rounded-2xl rounded-br-md px-5 py-3.5"
                  : "px-1"
              }`}
            >
              <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "text-white/80"
                  : "text-white/60 font-serif"
              }`}>
                {msg.content}
                {streaming && i === messages.length - 1 && msg.role === "assistant" && (
                  <span className="inline-block w-1.5 h-4 bg-spirit-300/50 ml-0.5 animate-pulse" />
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="py-4 border-t border-white/5">
        <div className="glass rounded-2xl flex items-end gap-2 p-2 focus-within:border-spirit-400/20 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your mind..."
            disabled={streaming}
            rows={1}
            className="flex-1 bg-transparent text-white/80 text-sm placeholder:text-white/20 resize-none px-3 py-2.5 max-h-32 font-serif focus:outline-none disabled:opacity-40"
            style={{ minHeight: "44px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || streaming}
            className="shrink-0 w-10 h-10 rounded-xl bg-spirit-500/20 text-spirit-300 flex items-center justify-center hover:bg-spirit-500/30 transition-all disabled:opacity-20 disabled:hover:bg-spirit-500/20"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-white/10 text-[10px] mt-2 font-serif">
          Friday is an AI companion, not a licensed therapist. If you&apos;re in crisis, please call 988.
        </p>
      </div>
    </div>
  );
}
