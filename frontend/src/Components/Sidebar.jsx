import React from "react";

const PdfIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ImageIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

function ItemRow({ item, isSelected, onSelect, icon, subtitle }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(item.id || item.document_id)}
        className={`w-full text-left group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
          isSelected
            ? "bg-indigo-500/15 border border-indigo-500/30"
            : "hover:bg-white/[0.04] border border-transparent"
        }`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
            isSelected ? "bg-indigo-500/20 text-indigo-400" : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              isSelected ? "text-zinc-100" : "text-zinc-300 group-hover:text-zinc-100"
            }`}
            title={item.filename}
          >
            {item.filename}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">{subtitle}</p>
        </div>
        {isSelected && <span className="status-dot flex-shrink-0" />}
      </button>
    </li>
  );
}

export default function Sidebar({
  documents,
  images,
  selectedId,
  selectedType,
  onSelectDocument,
  onSelectImage,
  onClose,
}) {
  const totalCount = documents.length + images.length;
  const isEmpty = totalCount === 0;

  return (
    <aside className="flex flex-col h-full w-full bg-zinc-950 border-r border-white/[0.06]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="logo-mark">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">DocMind AI</h2>
            <p className="text-xs text-zinc-500">Library</p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/[0.06] flex items-center justify-center mb-3 text-zinc-500">
              <PdfIcon className="w-5 h-5" />
            </div>
            <p className="text-sm text-zinc-400 font-medium">No files yet</p>
            <p className="text-xs text-zinc-600 mt-1">Upload a PDF or image to begin</p>
          </div>
        ) : (
          <div className="space-y-5">
            {documents.length > 0 && (
              <section>
                <h3 className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Documents ({documents.length})
                </h3>
                <ul className="space-y-1">
                  {documents.map((doc) => (
                    <ItemRow
                      key={doc.document_id}
                      item={doc}
                      isSelected={selectedType === "pdf" && selectedId === doc.document_id}
                      onSelect={onSelectDocument}
                      icon={<PdfIcon />}
                      subtitle={doc.status === "indexed" ? `${doc.chunk_count ?? 0} chunks` : doc.status || "Ready"}
                    />
                  ))}
                </ul>
              </section>
            )}

            {images.length > 0 && (
              <section>
                <h3 className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Images ({images.length})
                </h3>
                <ul className="space-y-1">
                  {images.map((img) => (
                    <ItemRow
                      key={img.id}
                      item={img}
                      isSelected={selectedType === "image" && selectedId === img.id}
                      onSelect={onSelectImage}
                      icon={<ImageIcon />}
                      subtitle="Image analysis"
                    />
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="px-4 py-3 border-t border-white/[0.06] bg-zinc-950/80">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">Total files</span>
          <span className="font-medium text-zinc-300">{totalCount}</span>
        </div>
        <div className="flex gap-3 mt-2 text-[11px] text-zinc-500">
          <span>{documents.length} PDF{documents.length !== 1 ? "s" : ""}</span>
          <span>·</span>
          <span>{images.length} image{images.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </aside>
  );
}
