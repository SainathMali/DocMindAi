import React, { useState, useRef, useEffect } from "react";
import { askQuestion } from "../services/api";
import Message from "./Message";

export default function ChatWindow({ documentId }) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    if (isNearBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const response = await askQuestion(input, documentId);
      const aiMsg = {
        role: "assistant",
        content: response.answer,
        sources: response.sources || [],
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errMsg = { role: "assistant", content: "Error: unable to get response", sources: [] };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-gradient-to-tr from-purple-500/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 flex justify-between items-center px-8 py-4 border-b border-slate-800/50 bg-slate-950/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <span className="text-white text-sm">💬</span>
          </div>
          <span className="text-sm font-medium text-gray-400">Chat</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50">
          <span className="text-xs font-medium text-gray-400">Model:</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-cyan-400">LIama3.1</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-6 min-h-0 max-w-4xl mx-auto w-full scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center animate-fadeIn">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">💡</div>
              <p className="text-gray-300 font-light text-xl">
                Ask me anything about your document
              </p>
              <p className="text-gray-500 text-sm">
                Powered by Llama 3.1 • RAG Technology
              </p>
              <div className="flex gap-3 justify-center mt-6">
                <div className="px-3 py-1.5 rounded-lg bg-slate-800/50 text-xs text-gray-400">Summarize this document</div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-800/50 text-xs text-gray-400">Key takeaways</div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-800/50 text-xs text-gray-400">Explain concepts</div>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <Message key={idx} message={msg} isUser={msg.role === "user"} />
        ))}

        {loading && (
          <div className="flex items-center space-x-4 animate-fadeIn">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div className="flex space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-gray-400 text-sm font-light">Analyzing document...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="relative z-10 flex-shrink-0 px-6 py-6 max-w-4xl mx-auto w-full">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur" />

          <div className="relative flex gap-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-2 focus-within:border-cyan-500/50 focus-within:shadow-lg focus-within:shadow-cyan-500/10 transition-all duration-300">
            {/* Upload Icon Button */}
            <button className="flex-shrink-0 w-11 h-11 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-gray-400 hover:text-cyan-400 transition-all duration-200 flex items-center justify-center group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Ask a question about your document..."
              className="flex-1 bg-transparent text-white rounded-lg px-2 py-3 placeholder-gray-500 focus:outline-none font-light"
              disabled={loading}
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 whitespace-nowrap shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transform hover:scale-105 active:scale-95"
            >
              <span>Send</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 text-xs">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 text-xs">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}