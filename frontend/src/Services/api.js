import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await API.post(
    "/upload/pdf",
    formData
  );
  return response.data; // UploadResponse
};

export const askQuestion = async (
  message,
  documentId
) => {
  const response = await API.post(
    "/chat",
    {
      message,
      document_id: documentId,
    }
  );

  return response.data;
};