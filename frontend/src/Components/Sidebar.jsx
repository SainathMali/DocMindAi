import React from "react";

export default function Sidebar({ documents, selectedId, onSelect }) {
  return (
    <aside className="w-80 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950/95 backdrop-blur-sm text-gray-100 flex flex-col border-r border-slate-800/50 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="px-6 py-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-white text-xl">🤖</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              DocMind
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Document Library</p>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mb-4">
              <span className="text-3xl">📁</span>
            </div>
            <p className="text-sm text-gray-400 font-medium">No documents yet</p>
            <p className="text-xs text-gray-600 mt-1">Upload a PDF to get started</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc, index) => (
              <li
                key={doc.document_id}
                onClick={() => onSelect(doc.document_id)}
                className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 ease-out transform hover:scale-[1.02] ${selectedId === doc.document_id
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                  : "bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 hover:border-slate-600/50"
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Active indicator */}
                {selectedId === doc.document_id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-r-full animate-pulse" />
                )}

                {/* Icon & Content */}
                <div className="flex items-start space-x-3 pl-1">
                  <div className="text-xl flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                    {doc.type === 'pdf' ? '📄' : doc.type === 'image' ? '🖼️' : '📝'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors duration-200"
                      title={doc.filename}
                    >
                      {doc.filename}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">
                        {doc.status || "Ready"}
                      </p>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <p className="text-xs text-gray-600">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {selectedId === doc.document_id && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-800/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Total documents</span>
          <span className="text-cyan-400 font-semibold">{documents.length}</span>
        </div>
        <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${(documents.length / 10) * 100}%` }}
          />
        </div>
      </div>
    </aside>
  );
}