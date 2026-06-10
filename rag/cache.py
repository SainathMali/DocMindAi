"""Lightweight in-memory caches for retrieval and conversational responses."""

import hashlib
import time
from dataclasses import dataclass
from typing import Any

from langchain_core.documents import Document


@dataclass
class CacheEntry:
    value: Any
    created_at: float


class TTLCache:
    """Simple TTL cache with max size eviction."""

    def __init__(self, maxsize: int = 256, ttl_seconds: float = 300.0) -> None:
        self._maxsize = maxsize
        self._ttl = ttl_seconds
        self._store: dict[str, CacheEntry] = {}

    def get(self, key: str) -> Any | None:
        entry = self._store.get(key)
        if entry is None:
            return None
        if time.monotonic() - entry.created_at > self._ttl:
            del self._store[key]
            return None
        return entry.value

    def set(self, key: str, value: Any) -> None:
        if len(self._store) >= self._maxsize:
            oldest_key = min(self._store, key=lambda k: self._store[k].created_at)
            del self._store[oldest_key]
        self._store[key] = CacheEntry(value=value, created_at=time.monotonic())


_retrieval_cache = TTLCache(maxsize=256, ttl_seconds=300.0)


def _cache_key(query: str, document_id: str | None, intent: str) -> str:
    raw = f"{query.strip().lower()}|{document_id or ''}|{intent}"
    return hashlib.sha256(raw.encode()).hexdigest()


def get_cached_retrieval(
    query: str, document_id: str | None, intent: str
) -> list[tuple[Document, float]] | None:
    return _retrieval_cache.get(_cache_key(query, document_id, intent))


def set_cached_retrieval(
    query: str,
    document_id: str | None,
    intent: str,
    results: list[tuple[Document, float]],
) -> None:
    _retrieval_cache.set(_cache_key(query, document_id, intent), results)
