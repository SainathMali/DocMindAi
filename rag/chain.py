from langchain_core.documents import Document
from langchain_ollama import ChatOllama
from utils.config import Settings

RAG_PROMPT = """You are a helpful assistant.
Use the provided context to answer the user's question comprehensively.
Format the answer using markdown:
- Use headings for major sections.
- Use bullet points or numbered lists for key points.
{{ ... }}
{context}
Question:
{question}
Answer:
"""

_llm: ChatOllama | None = None
_llm_key: tuple[str, str] | None = None

def get_llm(settings: Settings) -> ChatOllama:
    """Return a cached ChatOllama instance."""
    global _llm, _llm_key
    key = (settings.ollama_base_url, settings.llm_model)
    if _llm is None or _llm_key != key:
        _llm = ChatOllama(model=settings.llm_model, base_url=settings.ollama_base_url)
        _llm_key = key
    return _llm

def _format_context(chunks: list[Document]) -> str:
    parts: list[str] = []
    for index, chunk in enumerate(chunks, start=1):
        page = chunk.metadata.get("page", "?")
        parts.append(f"[{index}] (Page {page})\n{chunk.page_content}")
    return "\n\n".join(parts)

def generate_answer(question: str, chunks: list[Document], settings: Settings) -> str:
    """Generate an answer from retrieved chunks using Llama via Ollama."""
    context = _format_context(chunks)
    prompt = RAG_PROMPT.format(context=context, question=question)
    response = get_llm(settings).invoke(prompt)
    return response.content.strip()
