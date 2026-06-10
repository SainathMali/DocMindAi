"""RAG generation chain using Ollama with intent-aware prompts."""

import logging

from langchain_core.documents import Document
from langchain_ollama import ChatOllama

from rag.intent import Intent
from rag.prompts import GREETING_PROMPT, GENERAL_CHAT_PROMPT, build_rag_prompt
from utils.config import Settings

logger = logging.getLogger(__name__)

_llm: ChatOllama | None = None
_llm_key: tuple[str, str, float, int] | None = None

# Token caps per intent — shorter = faster generation
_NUM_PREDICT = {
    Intent.GREETING: 80,
    Intent.GENERAL_CHAT: 100,
    Intent.DEFINITION: 256,
    Intent.DOCUMENT_QUERY: 384,
    Intent.SUMMARY: 512,
    Intent.COMPARISON: 512,
    Intent.CODE_REQUEST: 640,
    Intent.DETAILED_EXPLANATION: 768,
}


def get_llm(settings: Settings, num_predict: int = 384) -> ChatOllama:
    """Return a cached ChatOllama instance tuned for latency."""
    global _llm, _llm_key

    key = (
        settings.ollama_base_url,
        settings.llm_model,
        settings.ollama_temperature,
        num_predict,
    )
    if _llm is None or _llm_key != key:
        _llm = ChatOllama(
            model=settings.llm_model,
            base_url=settings.ollama_base_url,
            temperature=settings.ollama_temperature,
            num_predict=num_predict,
            timeout=settings.ollama_timeout,
        )
        _llm_key = key

    return _llm


def _format_context(chunks: list[Document]) -> str:
    """Compact context format — page tag only, no redundant labels."""
    parts: list[str] = []
    for chunk in chunks:
        page = chunk.metadata.get("page", "?")
        parts.append(f"[p.{page}] {chunk.page_content}")
    return "\n\n".join(parts)


def _invoke_llm(prompt: str, settings: Settings, intent: Intent) -> str:
    num_predict = _NUM_PREDICT.get(intent, 384)
    llm = get_llm(settings, num_predict=num_predict)
    response = llm.invoke(prompt)
    content = response.content if hasattr(response, "content") else str(response)
    return content.strip()


def generate_conversational(question: str, settings: Settings, intent: Intent) -> str:
    """Fast conversational response without retrieval."""
    if intent == Intent.GREETING:
        prompt = f"{GREETING_PROMPT}\n\nUser: {question}\n\nReply:"
    else:
        prompt = f"{GENERAL_CHAT_PROMPT}\n\nUser: {question}\n\nReply:"

    return _invoke_llm(prompt, settings, intent)


def generate_answer(
    question: str,
    chunks: list[Document],
    settings: Settings,
    intent: Intent = Intent.DOCUMENT_QUERY,
) -> str:
    """Generate a grounded answer from retrieved chunks using Llama via Ollama."""
    context = _format_context(chunks)
    prompt = build_rag_prompt(intent, context, question)
    logger.debug("RAG prompt length: %d chars, chunks: %d", len(prompt), len(chunks))
    return _invoke_llm(prompt, settings, intent)
