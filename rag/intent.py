"""Fast rule-based query intent classification — no LLM call."""

import re
from enum import Enum


class Intent(str, Enum):
    GREETING = "greeting"
    DEFINITION = "definition"
    DETAILED_EXPLANATION = "detailed_explanation"
    CODE_REQUEST = "code_request"
    SUMMARY = "summary"
    COMPARISON = "comparison"
    GENERAL_CHAT = "general_chat"
    DOCUMENT_QUERY = "document_query"


_GREETING = re.compile(
    r"^\s*(hi|hello|hey|hiya|howdy|good\s+(morning|afternoon|evening)|greetings)"
    r"(\s+there)?[\s!.,?]*$",
    re.IGNORECASE,
)

_GENERAL_CHAT = re.compile(
    r"^\s*(thanks?|thank\s+you|thx|ok(ay)?|cool|great|nice|got\s+it|understood|"
    r"bye|goodbye|see\s+you|cheers|awesome|perfect|sounds\s+good)[\s!.,?]*$",
    re.IGNORECASE,
)

_SUMMARY = re.compile(
    r"\b(summarize|summarise|summary|tl;?dr|key\s+points?|main\s+points?|"
    r"overview|brief\s+summary|recap)\b",
    re.IGNORECASE,
)

_COMPARISON = re.compile(
    r"\b(vs\.?|versus|compare|comparison|difference(s)?\s+between|"
    r"similarit(y|ies)\s+between|contrast)\b",
    re.IGNORECASE,
)

_CODE = re.compile(
    r"\b(code|snippet|implement|"
    r"give\s+(\w+\s+)*code|write\s+(\w+\s+)*code|"
    r"write\s+(a\s+)?(\w+\s+)?(code|example|program)|"
    r"spring\s+boot|java\s+code|python\s+code|show\s+me\s+.*code)\b",
    re.IGNORECASE,
)

_DETAILED = re.compile(
    r"\b(in\s+detail|detailed|explain\s+.*\s+thoroughly|teach\s+me|"
    r"walk\s+me\s+through|step\s+by\s+step|comprehensive|deep\s+dive)\b",
    re.IGNORECASE,
)

_DEFINITION = re.compile(
    r"^\s*(what\s+is|what\s+are|what's|define|definition\s+of|meaning\s+of|"
    r"explain\s+\w+)\b",
    re.IGNORECASE,
)


def classify_intent(query: str) -> Intent:
    """Classify user query intent using fast pattern matching."""
    text = query.strip()
    if not text:
        return Intent.DOCUMENT_QUERY

    if _GREETING.match(text):
        return Intent.GREETING
    if _GENERAL_CHAT.match(text):
        return Intent.GENERAL_CHAT
    if _SUMMARY.search(text):
        return Intent.SUMMARY
    if _COMPARISON.search(text):
        return Intent.COMPARISON
    if _CODE.search(text):
        return Intent.CODE_REQUEST
    if _DETAILED.search(text):
        return Intent.DETAILED_EXPLANATION
    if _DEFINITION.search(text):
        return Intent.DEFINITION

    return Intent.DOCUMENT_QUERY


def needs_retrieval(intent: Intent) -> bool:
    """Whether this intent requires document retrieval."""
    return intent not in (Intent.GREETING, Intent.GENERAL_CHAT)


def retrieval_k_for_intent(intent: Intent, default_k: int) -> int:
    """Final chunk count (3–4) sent to LLM after re-ranking."""
    mapping = {
        Intent.DEFINITION: min(3, default_k),
        Intent.DETAILED_EXPLANATION: min(4, default_k),
        Intent.CODE_REQUEST: min(3, default_k),
        Intent.SUMMARY: min(4, default_k),
        Intent.COMPARISON: min(3, default_k),
        Intent.DOCUMENT_QUERY: min(3, default_k),
    }
    return mapping.get(intent, default_k)
