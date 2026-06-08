from models.requests import ChatRequest
from models.responses import ChatResponse, SourceChunk
from rag.chain import generate_answer
from rag.retriever import retrieve
from utils.config import Settings

NO_CONTEXT_ANSWER = (
    "I don't have enough information in the uploaded documents."
)


class ChatService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    async def chat(self, request: ChatRequest) -> ChatResponse:
        chunks = retrieve(
            request.message,
            self._settings,
            document_id=request.document_id,
        )

        if not chunks:
            return ChatResponse(
                answer=NO_CONTEXT_ANSWER,
                document_id=request.document_id,
                session_id=request.session_id,
                sources=[],
            )

        answer = generate_answer(request.message, chunks, self._settings)
        sources = [
            SourceChunk(
                content=chunk.page_content,
                document_id=str(chunk.metadata.get("document_id", "")),
                page=chunk.metadata.get("page"),
                chunk_index=chunk.metadata.get("chunk_index"),
            )
            for chunk in chunks
        ]

        resolved_document_id = request.document_id or (
            str(chunks[0].metadata.get("document_id"))
            if chunks[0].metadata.get("document_id")
            else None
        )

        return ChatResponse(
            answer=answer,
            document_id=resolved_document_id,
            session_id=request.session_id,
            sources=sources,
        )
