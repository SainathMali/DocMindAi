import asyncio
import logging
import time

from models.requests import ChatRequest
from models.responses import ChatResponse, SourceChunk
from rag.chain import generate_answer, generate_conversational
from rag.intent import classify_intent, needs_retrieval
from rag.prompts import LOW_CONFIDENCE_RESPONSE
from rag.retriever import retrieve
from utils.config import Settings

logger = logging.getLogger(__name__)

FALLBACK_ANSWER = (
    "I'm having trouble generating a response right now. "
    "Please try again in a moment."
)


class ChatService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    async def chat(self, request: ChatRequest) -> ChatResponse:
        intent = classify_intent(request.message)
        t0 = time.perf_counter()

        try:
            if not needs_retrieval(intent):
                t_gen = time.perf_counter()
                answer = await asyncio.to_thread(
                    generate_conversational,
                    request.message,
                    self._settings,
                    intent,
                )
                generation_ms = (time.perf_counter() - t_gen) * 1000
                total_ms = (time.perf_counter() - t0) * 1000
                logger.info(
                    "pipeline intent=%s rewritten_query=n/a retrieval_ms=0 "
                    "rerank_ms=0 generation_ms=%.1f total_ms=%.1f chunks=0",
                    intent.value,
                    generation_ms,
                    total_ms,
                )
                return ChatResponse(
                    answer=answer,
                    document_id=request.document_id,
                    session_id=request.session_id,
                    sources=[],
                )

            t_retrieval = time.perf_counter()
            chunks, scores, rewritten_query, metrics = await asyncio.to_thread(
                retrieve,
                request.message,
                self._settings,
                request.document_id,
                intent,
            )
            retrieval_block_ms = (time.perf_counter() - t_retrieval) * 1000

            if not chunks:
                total_ms = (time.perf_counter() - t0) * 1000
                logger.info(
                    "pipeline intent=%s rewritten_query=%r retrieval_ms=%.1f "
                    "rerank_ms=%.1f generation_ms=0 total_ms=%.1f chunks=0",
                    intent.value,
                    rewritten_query,
                    metrics.get("retrieval_ms", 0),
                    metrics.get("rerank_ms", 0),
                    total_ms,
                )
                return ChatResponse(
                    answer=LOW_CONFIDENCE_RESPONSE,
                    document_id=request.document_id,
                    session_id=request.session_id,
                    sources=[],
                )

            t_gen = time.perf_counter()
            answer = await asyncio.to_thread(
                generate_answer,
                request.message,
                chunks,
                self._settings,
                intent,
            )
            generation_ms = (time.perf_counter() - t_gen) * 1000
            total_ms = (time.perf_counter() - t0) * 1000

            logger.info(
                "pipeline intent=%s rewritten_query=%r retrieval_ms=%.1f "
                "rerank_ms=%.1f generation_ms=%.1f total_ms=%.1f chunks=%d scores=%s",
                intent.value,
                rewritten_query,
                metrics.get("retrieval_ms", 0),
                metrics.get("rerank_ms", retrieval_block_ms),
                generation_ms,
                total_ms,
                len(chunks),
                [round(s, 3) for s in scores],
            )

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

        except (ConnectionError, OSError, TimeoutError):
            raise
        except Exception as exc:
            logger.exception("Chat failed for intent=%s: %s", intent.value, exc)
            return ChatResponse(
                answer=FALLBACK_ANSWER,
                document_id=request.document_id,
                session_id=request.session_id,
                sources=[],
            )
