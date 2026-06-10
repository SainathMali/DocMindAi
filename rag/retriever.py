"""Document retriever with query rewriting, re-ranking, and deduplication."""

import logging
import re
import time

from langchain_core.documents import Document

from rag.cache import get_cached_retrieval, set_cached_retrieval
from rag.intent import Intent, retrieval_k_for_intent
from rag.query_rewriter import rewrite_query
from rag.vectorstore import similarity_search_with_scores
from utils.config import Settings

logger = logging.getLogger(__name__)


def _normalize_content(text: str) -> str:
    return " ".join(text.lower().split())


def _deduplicate_chunks(
    scored_chunks: list[tuple[Document, float]],
) -> list[tuple[Document, float]]:
    """Remove duplicate or near-duplicate chunks."""
    seen: set[str] = set()
    unique: list[tuple[Document, float]] = []

    for doc, score in scored_chunks:
        key = _normalize_content(doc.page_content)[:300]
        if key in seen:
            continue
        seen.add(key)
        unique.append((doc, score))

    return unique


def _lexical_overlap(query: str, text: str) -> float:
    """Token overlap ratio between query and chunk (0.0–1.0)."""
    q_tokens = {t for t in _tokenize(query) if len(t) > 2}
    t_tokens = {t for t in _tokenize(text) if len(t) > 2}
    if not q_tokens:
        return 0.0
    return len(q_tokens & t_tokens) / len(q_tokens)


def _tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.lower())


def _rerank_chunks(
    scored_chunks: list[tuple[Document, float]],
    rewritten_query: str,
) -> list[tuple[Document, float]]:
    """Re-rank by combining vector distance with lexical relevance."""
    if not scored_chunks:
        return []

    ranked: list[tuple[Document, float, float]] = []
    for doc, vector_score in scored_chunks:
        overlap = _lexical_overlap(rewritten_query, doc.page_content)
        combined = vector_score - (overlap * 0.12)
        ranked.append((doc, vector_score, combined))

    ranked.sort(key=lambda x: x[2])
    return [(doc, score) for doc, score, _ in ranked]


def _confidence_max_k(best_score: float, max_k: int) -> int:
    """Reduce chunk count when vector match confidence is weak."""
    if best_score <= 0.65:
        return max_k
    if best_score <= 0.85:
        return min(max_k, 3)
    if best_score <= 1.0:
        return min(max_k, 2)
    return 0


def _filter_by_relevance(
    scored_chunks: list[tuple[Document, float]],
    threshold: float,
    max_k: int,
) -> list[tuple[Document, float]]:
    """Keep only chunks that pass the similarity threshold."""
    if not scored_chunks:
        return []

    best_score = scored_chunks[0][1]
    allowed_k = _confidence_max_k(best_score, max_k)

    if allowed_k == 0 or best_score > threshold:
        logger.info(
            "Low retrieval confidence: best_score=%.3f threshold=%.3f",
            best_score,
            threshold,
        )
        return []

    relative_cap = best_score * 1.25 + 0.08
    filtered: list[tuple[Document, float]] = []
    for doc, score in scored_chunks:
        if score > threshold or score > relative_cap:
            continue
        filtered.append((doc, score))
        if len(filtered) >= allowed_k:
            break

    return filtered


def retrieve(
    query: str,
    settings: Settings,
    document_id: str | None = None,
    intent: Intent = Intent.DOCUMENT_QUERY,
) -> tuple[list[Document], list[float], str, dict[str, float]]:
    """
    Retrieve, re-rank, and filter chunks.

    Returns: (documents, scores, rewritten_query, metrics)
    """
    metrics: dict[str, float] = {
        "retrieval_ms": 0.0,
        "rerank_ms": 0.0,
    }

    rewritten = rewrite_query(query, intent)
    max_k = retrieval_k_for_intent(intent, settings.retrieval_final_k)
    cache_key_query = rewritten

    if settings.cache_retrieval:
        cached = get_cached_retrieval(cache_key_query, document_id, intent.value)
        if cached is not None:
            logger.debug("Retrieval cache hit intent=%s", intent.value)
            docs = [doc for doc, _ in cached]
            scores = [score for _, score in cached]
            return docs, scores, rewritten, metrics

    t0 = time.perf_counter()
    scored = similarity_search_with_scores(
        rewritten,
        settings,
        document_id=document_id,
        k=settings.retrieval_candidate_k,
    )
    metrics["retrieval_ms"] = (time.perf_counter() - t0) * 1000

    t1 = time.perf_counter()
    deduped = _deduplicate_chunks(scored)
    reranked = _rerank_chunks(deduped, rewritten)
    filtered = _filter_by_relevance(
        reranked,
        threshold=settings.similarity_score_threshold,
        max_k=max_k,
    )
    metrics["rerank_ms"] = (time.perf_counter() - t1) * 1000

    if settings.cache_retrieval and filtered:
        set_cached_retrieval(cache_key_query, document_id, intent.value, filtered)

    docs = [doc for doc, _ in filtered]
    scores = [score for _, score in filtered]
    return docs, scores, rewritten, metrics
