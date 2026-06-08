from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=PROJECT_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Local RAG Assistant"
    app_version: str = "0.1.0"
    debug: bool = False

    ollama_base_url: str = "http://localhost:11434"
    llm_model: str = "llama3.2:1b"
    embedding_model: str = "nomic-embed-text"

    upload_dir: Path = Field(default=PROJECT_ROOT / "data" / "uploads")
    chroma_persist_dir: Path = Field(default=PROJECT_ROOT / "data" / "chroma_db")
    chroma_collection_name: str = "rag_documents"

    chunk_size: int = 500
    chunk_overlap: int = 100
    retrieval_k: int = 3

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    def ensure_directories(self) -> None:
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.chroma_persist_dir.mkdir(parents=True, exist_ok=True)


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.ensure_directories()
    return settings
