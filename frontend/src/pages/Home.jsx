import React, { useState } from "react";
import "../App.css";
import Sidebar from "../Components/Sidebar";
import UploadButton from "../Components/UploadButton";
import ChatWindow from "../Components/ChatWindow";

const MODEL_NAME = "Llama 3.2";

function AppHeader({ title, subtitle, onMenuClick, showMenu }) {
  return (
    <header className="glass-header flex items-center gap-3 px-4 sm:px-6 h-14 flex-shrink-0 z-20">
      {showMenu && (
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
          aria-label="Open sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      <div className="logo-mark hidden sm:flex">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-zinc-100 truncate">{title}</h1>
        {subtitle && (
          <p className="text-xs text-zinc-500 truncate">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-white/[0.06]">
        <span className="status-dot" />
        <span className="text-xs font-medium text-zinc-400 hidden sm:inline">{MODEL_NAME}</span>
      </div>
    </header>
  );
}

function WelcomeScreen({ onUpload, onImageUpload }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 overflow-y-auto relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            animation: "pulse-soft 4s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto text-center animate-slideUp">
        <div className="logo-mark w-14 h-14 rounded-2xl mx-auto mb-6">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight mb-2">
          DocMind AI
        </h1>
        <p className="text-base text-indigo-400/90 font-medium mb-2">
          Chat with Documents & Images
        </p>
        <p className="text-sm text-zinc-500 leading-relaxed mb-8 max-w-md mx-auto">
          Upload PDFs and ask intelligent questions powered by local RAG.
          Image analysis UI is ready for upcoming vision features.
        </p>

        <UploadButton onUpload={onUpload} onImageUpload={onImageUpload} />
      </div>
    </div>
  );
}

export default function Home() {
  const [documents, setDocuments] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const hasSelection = selectedId !== null;
  const isImageMode = selectedType === "image";

  const selectedDocument = documents.find((d) => d.document_id === selectedId);
  const selectedImage = images.find((img) => img.id === selectedId);

  const handleUpload = (result) => {
    setDocuments((prev) => [...prev, result]);
    setSelectedType("pdf");
    setSelectedId(result.document_id);
    setSidebarOpen(false);
  };

  const handleImageUpload = (imageItem) => {
    setImages((prev) => [...prev, imageItem]);
    setSelectedType("image");
    setSelectedId(imageItem.id);
    setSidebarOpen(false);
  };

  const handleSelectDocument = (id) => {
    setSelectedType("pdf");
    setSelectedId(id);
    setSidebarOpen(false);
  };

  const handleSelectImage = (id) => {
    setSelectedType("image");
    setSelectedId(id);
    setSidebarOpen(false);
  };

  const headerTitle = hasSelection
    ? isImageMode
      ? selectedImage?.filename || "Image"
      : selectedDocument?.filename || "Document"
    : "DocMind AI";

  const headerSubtitle = hasSelection
    ? isImageMode
      ? "Image analysis"
      : `${selectedDocument?.chunk_count ?? 0} chunks indexed`
    : null;

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 sidebar-overlay lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          documents={documents}
          images={images}
          selectedId={selectedId}
          selectedType={selectedType}
          onSelectDocument={handleSelectDocument}
          onSelectImage={handleSelectImage}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main */}
      <div className="app-main">
        <AppHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          onMenuClick={() => setSidebarOpen(true)}
          showMenu={!sidebarOpen}
        />

        {hasSelection ? (
          <ChatWindow
            documentId={isImageMode ? null : selectedId}
            documentName={
              isImageMode ? selectedImage?.filename : selectedDocument?.filename
            }
            isImageMode={isImageMode}
            imagePreview={selectedImage?.previewUrl}
          />
        ) : (
          <WelcomeScreen onUpload={handleUpload} onImageUpload={handleImageUpload} />
        )}
      </div>
    </div>
  );
}
