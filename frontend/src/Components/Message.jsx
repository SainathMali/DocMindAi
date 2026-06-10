import React, { useState } from "react";
import AnswerFormatter from "./AnswerFormatter";

const AssistantAvatar = () => (
  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  </div>
);

export default function Message({ message, isUser }) {
  const [showSources, setShowSources] = useState(false);

  if (isUser) {
    return (
      <div className="flex justify-end animate-fadeIn group">
        <div className="max-w-[85%] sm:max-w-[75%] md:max-w-[65%]">
          <div className="rounded-2xl rounded-br-md bg-zinc-800 text-zinc-100 px-4 py-3 text-[0.9375rem] leading-relaxed">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  const sourceText = (src) => src.content || src.text || "";

  return (
    <div className="flex gap-3 animate-fadeIn group">
      <AssistantAvatar />

      <div className="flex-1 min-w-0 max-w-[85%] sm:max-w-[75%] md:max-w-[65%]">
        <div className="text-[0.9375rem] leading-relaxed prose-chat">
          <AnswerFormatter content={message.content} />
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowSources(!showSources)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <svg
                className={`w-3.5 h-3.5 transition-transform ${showSources ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {showSources ? "Hide" : "Show"} sources ({message.sources.length})
            </button>

            {showSources && (
              <div className="mt-2 space-y-2 animate-slideDown">
                {message.sources.map((src, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-zinc-900/60 border border-white/[0.06] text-xs"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-semibold text-[10px]">
                        {idx + 1}
                      </span>
                      {src.page != null && (
                        <span className="text-zinc-500">Page {src.page}</span>
                      )}
                    </div>
                    {sourceText(src) && (
                      <p className="text-zinc-400 leading-relaxed line-clamp-3">
                        {sourceText(src)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
