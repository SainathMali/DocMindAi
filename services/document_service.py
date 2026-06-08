from rag.chunking import chunk_documents
from rag.loader import extract_text_from_pdf
from rag.vectorstore import index_documents
from utils.config import Settings
from utils.file_handler import save_upload, validate_pdf


class DocumentService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    async def upload_pdf(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str | None,
    ) -> dict[str, str | int]:
        validate_pdf(filename, content_type)

        document_id, destination = save_upload(
            file_bytes, filename, self._settings.upload_dir
        )
        safe_name = destination.name.split("_", maxsplit=1)[1]

        page_documents = extract_text_from_pdf(destination)
        chunks = chunk_documents(
            page_documents,
            document_id=document_id,
            filename=safe_name,
            chunk_size=self._settings.chunk_size,
            chunk_overlap=self._settings.chunk_overlap,
        )
        chunk_count = index_documents(chunks, self._settings)

        return {
            "document_id": document_id,
            "filename": safe_name,
            "status": "indexed",
            "chunk_count": chunk_count,
            "message": (
                f"PDF uploaded and indexed successfully ({chunk_count} chunks)."
            ),
        }
