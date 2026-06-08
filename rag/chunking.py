"""Document chunking with RecursiveCharacterTextSplitter."""

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_documents(
    documents: list[Document],
    document_id: str,
    filename: str,
    chunk_size: int = 500,
    chunk_overlap: int = 100,
) -> list[Document]:
    """Split page documents into chunks with document and page metadata."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )

    chunks: list[Document] = []
    chunk_index = 0

    for doc in documents:
        page = doc.metadata.get("page")
        for split in splitter.split_text(doc.page_content):
            chunks.append(
                Document(
                    page_content=split,
                    metadata={
                        "document_id": document_id,
                        "filename": filename,
                        "page": page,
                        "chunk_index": chunk_index,
                    },
                )
            )
            chunk_index += 1

    return chunks
