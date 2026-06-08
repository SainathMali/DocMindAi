"""Ollama embedding model — reusable cached instance."""

from langchain_ollama import OllamaEmbeddings

from utils.config import Settings

_embeddings: OllamaEmbeddings | None = None
_settings_key: tuple[str, str] | None = None


def get_embeddings(settings: Settings) -> OllamaEmbeddings:
    """Return a cached OllamaEmbeddings instance configured from settings."""
    global _embeddings, _settings_key

    key = (settings.ollama_base_url, settings.embedding_model)
    if _embeddings is None or _settings_key != key:
        _embeddings = OllamaEmbeddings(
            model=settings.embedding_model,
            base_url=settings.ollama_base_url,
        )
        _settings_key = key

    return _embeddings
