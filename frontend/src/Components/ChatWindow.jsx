import React, { useState, useRef, useEffect } from "react";
import { askQuestion } from "../services/api";
import Message from "./Message";

const SUGGESTIONS = [
  "Summarize this document",
  "What are the key takeaways?",
  "Explain the main concepts",
];

export default function ChatWindow({ documentId, documentName, isImageMode, imagePreview }) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [documentId, isImageMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 120;
    if (isNearBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async (text) => {
    const message = (text ?? input).trim();
    if (!message || loading) return;

    if (isImageMode) {
      const userMsg = { role: "user", content: message };
      const aiMsg = {
        role: "assistant",
        content:
          "**Image analysis is coming soon.**\n\nYour image has been added to the library. Full vision-based Q&A will be available in a future update. PDF chat is fully supported — upload a PDF to get started.",
        sources: [],
      };
      setMessages((prev) => [...prev, userMsg, aiMsg]);
      setInput("");
      return;
    }

    const userMsg = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await askQuestion(message, documentId);
      const aiMsg = {
        role: "assistant",
        content: response.answer,
        sources: response.sources || [],
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errMsg = {
        role: "assistant",
        content: "Sorry, I couldn't get a response. Please ensure the backend and Ollama are running.",
        sources: [],
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center animate-fadeIn px-4">
              {isImageMode && imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Selected"
                    className="w-32 h-32 object-cover rounded-xl border border-white/10 mb-4 shadow-lg"
                  />
                  <h3 className="text-lg font-medium text-zinc-200 mb-1">Analyze this image</h3>
                  <p className="text-sm text-zinc-500 max-w-sm">
                    Ask questions about your image. Vision analysis backend is being prepared.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-zinc-200 mb-1">
                    Chat with {documentName || "your document"}
                  </h3>
                  <p className="text-sm text-zinc-500 max-w-sm mb-6">
                    Ask anything about the uploaded content. Answers are grounded in your document with source citations.
                  </p>
                </>
              )}

              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSend(s)}
                    className="suggestion-chip px-3 py-1.5 rounded-full text-xs text-zinc-400 border border-white/[0.08] bg-zinc-900/50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <Message key={`${msg.role}-${idx}`} message={msg} isUser={msg.role === "user"} />
          ))}

          {loading && (
            <div className="flex gap-3 animate-fadeIn">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 pt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
        <div className="max-w-3xl mx-auto">
          <div className="chat-input-shell rounded-2xl bg-zinc-900/80 border border-white/[0.06] p-2 transition-shadow duration-200">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isImageMode
                  ? "Ask a question about this image..."
                  : "Message DocMind AI..."
              }
              disabled={loading}
              className="w-full bg-transparent text-zinc-100 text-sm px-3 py-2 resize-none focus:outline-none placeholder-zinc-500 max-h-32"
              style={{ minHeight: "2.5rem" }}
            />
            <div className="flex items-center justify-between px-2 pt-1">
              <p className="text-[11px] text-zinc-600 hidden sm:block">
                Enter to send · Shift+Enter for new line
              </p>
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="ml-auto p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all duration-150"
                aria-label="Send message"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-[11px] text-zinc-600 text-center mt-2">
            DocMind AI can make mistakes. Verify important information from sources.
          </p>
        </div>
      </div>
    </div>
  );
}
