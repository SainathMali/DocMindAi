"""PDF text extraction using PyPDF."""

from pathlib import Path

from langchain_core.documents import Document
from pypdf import PdfReader


class PDFExtractionError(ValueError):
    """Raised when a PDF contains no extractable text."""


def extract_text_from_pdf(pdf_path: Path) -> list[Document]:
    """Extract text from all pages and preserve page numbers in metadata."""
    reader = PdfReader(str(pdf_path))
    documents: list[Document] = []

    for page_num, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").strip()
        if text:
            documents.append(
                Document(page_content=text, metadata={"page": page_num})
            )

    if not documents:
        raise PDFExtractionError(
            "No text could be extracted from this PDF. "
            "The file may be scanned or image-based."
        )

    return documents
