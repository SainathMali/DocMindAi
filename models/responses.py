from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(..., examples=["ok"])
    version: str
    ollama_configured: bool
    chroma_configured: bool


class SourceChunk(BaseModel):
    content: str
    document_id: str
    page: int | None = None
    chunk_index: int | None = None


class UploadResponse(BaseModel):
    document_id: str
    filename: str
    status: str = Field(..., examples=["indexed"])
    chunk_count: int
    message: str


class ChatResponse(BaseModel):
    answer: str
    document_id: str | None = None
    session_id: str | None = None
    sources: list[SourceChunk] = Field(default_factory=list)


class ErrorResponse(BaseModel):
    detail: str
