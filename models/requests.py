from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User question or message")
    document_id: str | None = Field(
        default=None,
        description="Optional document ID to scope retrieval",
    )
    session_id: str | None = Field(
        default=None,
        description="Optional session ID for conversation continuity",
    )
