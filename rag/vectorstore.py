"""ChromaDB persistent vector store."""

from langchain_chroma import Chroma
from langchain_core.documents import Document

from rag.embeddings import get_embeddings
from utils.config import Settings

_vectorstore: Chroma | None = None
_vectorstore_key: tuple[str, str] | None = None


def _build_metadata_filter(document_id: str | None) -> dict | None:
    if not document_id:
        return None
    return {"document_id": {"$eq": document_id}}


def get_vectorstore(settings: Settings) -> Chroma:
    """Return a cached Chroma vector store backed by persistent storage."""
    global _vectorstore, _vectorstore_key

    key = (str(settings.chroma_persist_dir), settings.chroma_collection_name)
    if _vectorstore is None or _vectorstore_key != key:
        _vectorstore = Chroma(
            collection_name=settings.chroma_collection_name,
            embedding_function=get_embeddings(settings),
            persist_directory=str(settings.chroma_persist_dir),
        )
        _vectorstore_key = key

    return _vectorstore


def reset_vectorstore_cache() -> None:
    """Clear the in-memory vector store cache after indexing."""
    global _vectorstore, _vectorstore_key
    _vectorstore = None
    _vectorstore_key = None


def index_documents(chunks: list[Document], settings: Settings) -> int:
    """Embed and store document chunks in ChromaDB."""
    if not chunks:
        raise ValueError("No chunks to index.")

    store = get_vectorstore(settings)
    ids = [
        f"{chunk.metadata['document_id']}_{chunk.metadata['chunk_index']}"
        for chunk in chunks
    ]
    store.add_documents(chunks, ids=ids)
    reset_vectorstore_cache()
    return len(chunks)


def similarity_search_with_scores(
    query: str,
    settings: Settings,
    document_id: str | None = None,
    k: int | None = None,
) -> list[tuple[Document, float]]:
    """Search with relevance scores (lower distance = more similar)."""
    store = get_vectorstore(settings)
    top_k = k if k is not None else settings.retrieval_candidate_k
    search_filter = _build_metadata_filter(document_id)
    return store.similarity_search_with_score(
        query, k=top_k, filter=search_filter
    )


def similarity_search(
    query: str,
    settings: Settings,
    document_id: str | None = None,
    k: int | None = None,
) -> list[Document]:
    """Search for the top-k most similar chunks, optionally scoped to a document."""
    results = similarity_search_with_scores(query, settings, document_id, k)
    return [doc for doc, _ in results]
