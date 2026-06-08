"""Document retriever with optional document_id filtering."""

from langchain_core.documents import Document

from rag.vectorstore import similarity_search
from utils.config import Settings


def retrieve(
    query: str,
    settings: Settings,
    document_id: str | None = None,
) -> list[Document]:
    """Retrieve the most relevant chunks for a query."""
    return similarity_search(
        query=query,
        settings=settings,
        document_id=document_id,
        k=settings.retrieval_k,
    )
