import React, { useState } from "react";
import AnswerFormatter from "./AnswerFormatter";

export default function Message({ message, isUser }) {
  const [showSources, setShowSources] = useState(false);

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-fadeIn">
        <div className="max-w-2xl">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-500/90 to-blue-500/90 text-white px-6 py-4 shadow-lg shadow-cyan-500/20 transform transition-all duration-200 hover:scale-[1.02]">
            <div className="text-sm font-medium leading-relaxed">
              {message.content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-6 animate-fadeIn">
      <div className="max-w-2xl w-full">
        <div className="flex items-start gap-4">
          {/* AI Avatar */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
            <span className="text-white text-lg font-bold">🤖</span>
          </div>

          <div className="flex-1">
            {/* Message Content */}
            <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 px-6 py-4 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300">
              <div className="text-gray-100 text-sm leading-relaxed prose-invert max-w-none">
                <AnswerFormatter content={message.content} />
              </div>
            </div>

            {/* Sources Section */}
            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 ml-0">
                <button
                  onClick={() => setShowSources(!showSources)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-all duration-200 flex items-center gap-2 group"
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${showSources ? "rotate-180" : "group-hover:translate-y-0.5"
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <span className="group-hover:underline">
                    {showSources ? "Hide Sources" : "Show Sources"}
                  </span>
                  <span className="text-cyan-500">({message.sources.length})</span>
                </button>

                {showSources && (
                  <div className="mt-3 space-y-2 animate-slideDown">
                    {message.sources.map((src, idx) => (
                      <div
                        key={idx}
                        className="group p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-cyan-500/40 hover:bg-slate-900/70 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-md bg-cyan-500/20 flex items-center justify-center">
                            <span className="text-cyan-400 text-xs font-bold">{idx + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-300 truncate">
                              {src.document_id || "Source Document"}
                            </p>
                            {src.page && (
                              <p className="text-xs text-cyan-400/70 mt-1">
                                📄 Page {src.page}
                              </p>
                            )}
                            {src.text && (
                              <p className="text-xs text-gray-400 mt-2 line-clamp-2 italic">
                                "{src.text.substring(0, 150)}..."
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}