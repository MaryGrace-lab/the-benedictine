//components/ui/ChatAssistant.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, BotMessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  "How do I apply for admission?",
  "What are the school fees?",
  "How do I check my result?",
  "What subjects do you offer?",
];

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("school-chat-history");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("school-chat-history", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "👋 Hello! I'm Benedicta, the school's AI assistant. I can help with admissions, fees, results, subjects, and general school information.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSend = async (customMessage?: string) => {
    const messageText = customMessage || input.trim();
    if (!messageText || loading) return;

    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "Sorry, I couldn't answer that. Please contact the school directly.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Network error. Please check your connection and try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Floating Button – school branded */}
      <div className="fixed bottom-6 right-6 z-30">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="group flex items-center gap-2.5 px-5 py-3.5 bg-[#1B3A5C] text-white rounded-full shadow-xl shadow-[#1B3A5C]/30 hover:bg-[#162e49] transition-all duration-300 border border-[#F59E0B]/30"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <>
              <BotMessageSquare className="w-5 h-5 text-[#F59E0B]" />
              <span className="hidden sm:inline text-sm font-semibold tracking-wide">
                Ask AI Assistant
              </span>
              <span className="sm:hidden text-sm font-semibold">
                Ask AI
              </span>
            </>
          )}
        </button>
        <div className="absolute inset-0 rounded-full bg-[#F59E0B]/20 blur-2xl animate-pulse -z-10" />
      </div>

      {/* Chat Window – professional, school palette */}
      {isOpen && (
        <div
          className="
            fixed bottom-0 left-0 right-0 z-50
            h-[85vh]
            sm:left-auto sm:right-6 sm:bottom-24
            sm:w-96 sm:h-[calc(100vh-120px)] sm:max-h-[650px]
            bg-white rounded-t-2xl sm:rounded-2xl
            shadow-2xl shadow-black/20 border border-[#1B3A5C]/10
            overflow-hidden flex flex-col
          "
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1B3A5C] to-[#162e49] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F59E0B] flex items-center justify-center font-bold text-[#1B3A5C] text-lg">
                TBA
              </div>
              <div>
                <p className="font-semibold text-sm">Ask Benedicta</p>
                <p className="text-xs text-gray-300">Online • Powered by AI</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#FAF7F2] space-y-4">
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSend(question)}
                    className="text-xs bg-white border border-[#8B5E3C]/20 px-3 py-2 rounded-full hover:bg-[#8B5E3C]/5 hover:border-[#8B5E3C]/40 transition shadow-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {messages.slice(1).map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#1B3A5C] text-white rounded-br-none"
                      : "bg-white border border-[#8B5E3C]/10 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <div className="prose prose-sm max-w-none prose-a:text-[#F59E0B]">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  <p
                    className={`text-[10px] mt-2 ${
                      msg.role === "user" ? "text-gray-300" : "text-[#8B5E3C]/50"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#8B5E3C]/10 px-4 py-3 rounded-2xl">
                  <div className="flex gap-1 text-[#1B3A5C]">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>•</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>•</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[#8B5E3C]/10 bg-white flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={loading}
              className="flex-1 border border-[#8B5E3C]/20 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#1B3A5C] focus:ring-1 focus:ring-[#1B3A5C]/20 bg-[#FAF7F2]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-[#1B3A5C] text-white px-4 rounded-xl hover:bg-[#162e49] disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}