import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import UploadButton from "../Components/UploadButton";
import ChatWindow from "../Components/ChatWindow";

export default function Home() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);

  const handleUpload = (result) => {
    setDocuments((prev) => [...prev, result]);
    setSelectedDocId(result.document_id);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar documents={documents} selectedId={selectedDocId} onSelect={setSelectedDocId} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        {selectedDocId ? (
          <ChatWindow documentId={selectedDocId} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 overflow-y-auto relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-5xl mx-auto animate-fadeIn">
              {/* Top Navigation - Model Selector & Brand */}
              <div className="flex justify-between items-center mb-16 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">📄</span>
                  </div>
                  <span className="text-sm font-medium text-gray-400">DocMind AI</span>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300">
                  <span className="text-xs font-medium text-gray-400">Model:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-cyan-400">Llama 3.1</span>
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Centered Brand Name */}
              <div className="text-center mb-12 animate-slideUp">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse-glow">
                    DocMind AI
                  </span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
                  Ask anything, upload documents, and get intelligent answers
                </p>
              </div>

              {/* Main Upload Box - Like Perplexity */}
              <div className="mb-16 w-full max-w-3xl mx-auto animate-fadeIn">
                <UploadButton onUpload={handleUpload} />
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto px-4">
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer p-6 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-500" />
                  <div className="relative">
                    <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">💬</div>
                    <h3 className="font-semibold text-white mb-2 text-lg">Ask Anything</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">Upload PDFs and ask intelligent questions with RAG technology</p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer p-6 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
                  <div className="relative">
                    <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">📄</div>
                    <h3 className="font-semibold text-white mb-2 text-lg">Multiple Formats</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">Support for PDF, images, and text documents</p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer p-6 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />
                  <div className="relative">
                    <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">🧠</div>
                    <h3 className="font-semibold text-white mb-2 text-lg">Smart Analysis</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">AI-powered understanding with source attribution</p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 cursor-pointer p-6 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-500" />
                  <div className="relative">
                    <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">⚡</div>
                    <h3 className="font-semibold text-white mb-2 text-lg">Fast Retrieval</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">Lightning-fast processing with accurate results</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}