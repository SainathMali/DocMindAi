import React, { useState, useRef, useCallback } from "react";
import { uploadPdf } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";

const PdfIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UploadCloudIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

export default function UploadButton({ onUpload, onImageUpload, compact = false }) {
  const [activeTab, setActiveTab] = useState("pdf");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const resetFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = (selected) => {
    if (!selected) return;

    if (activeTab === "pdf") {
      if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
        alert("Please select a PDF file.");
        return;
      }
      setFile(selected);
      setPreview(null);
    } else {
      if (!selected.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleChange = (e) => handleFileSelect(e.target.files[0]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      handleFileSelect(dropped);
    },
    [activeTab]
  );

  const handleUpload = async () => {
    if (!file) return;

    if (activeTab === "image") {
      const imageItem = {
        id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        filename: file.name,
        type: "image",
        status: "ready",
        previewUrl: preview,
        uploadedAt: new Date().toISOString(),
      };
      onImageUpload?.(imageItem);
      resetFile();
      return;
    }

    setLoading(true);
    try {
      const result = await uploadPdf(file);
      onUpload({ ...result, type: "pdf" });
      resetFile();
    } catch (err) {
      alert(err.response?.data?.detail || err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    resetFile();
  };

  return (
    <div className={`w-full ${compact ? "max-w-none" : "max-w-xl mx-auto"}`}>
      {/* Tabs */}
      <div className="flex p-1 mb-4 rounded-xl bg-zinc-900/80 border border-white/[0.06]">
        <button
          type="button"
          onClick={() => switchTab("pdf")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "pdf"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <PdfIcon />
          PDF
        </button>
        <button
          type="button"
          onClick={() => switchTab("image")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "image"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <ImageIcon />
          Image
        </button>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 ${
          dragOver ? "dropzone-active" : "border-white/10 hover:border-white/20"
        } ${compact ? "p-6" : "p-10"} glass-panel`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={activeTab === "pdf" ? "application/pdf" : "image/*"}
          onChange={handleChange}
          className="hidden"
        />

        {preview && activeTab === "image" ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-40 rounded-lg object-contain border border-white/10"
            />
            <p className="text-sm text-zinc-300 truncate max-w-full">{file?.name}</p>
          </div>
        ) : file && activeTab === "pdf" ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400">
              <PdfIcon />
            </div>
            <p className="text-sm font-medium text-zinc-200 truncate max-w-full">{file.name}</p>
            <p className="text-xs text-zinc-500">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <UploadCloudIcon />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200">
                {activeTab === "pdf" ? "Drop your PDF here" : "Drop your image here"}
              </p>
              <p className="text-xs text-zinc-500 mt-1">or click to browse</p>
            </div>
            <p className="text-xs text-zinc-600">
              {activeTab === "pdf" ? "PDF files only" : "PNG, JPG, WEBP supported"}
            </p>
          </div>
        )}
      </div>

      {/* Image coming-soon note */}
      {activeTab === "image" && (
        <p className="text-xs text-zinc-500 text-center mt-3">
          Image analysis UI ready — backend integration coming soon
        </p>
      )}

      {/* Upload button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleUpload();
        }}
        disabled={loading || !file}
        className="w-full mt-4 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
      >
        {loading ? (
          <LoadingSpinner />
        ) : activeTab === "pdf" ? (
          "Upload & Index PDF"
        ) : (
          "Add Image"
        )}
      </button>
    </div>
  );
}
