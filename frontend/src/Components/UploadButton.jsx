import React, { useState, useRef } from "react";
import { uploadPdf } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";

export default function UploadButton({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const result = await uploadPdf(file);
      onUpload(result);
      // clear file input and state after success
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      // show backend error details
      alert(err.response?.data?.detail || err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        className="border border-gray-300 rounded p-1"
      />
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? <LoadingSpinner /> : "Upload PDF"}
      </button>
    </div>
  );
}
