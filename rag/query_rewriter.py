"""Rule-based query expansion for improved retrieval — no LLM call."""

import re

from rag.intent import Intent

_TOPIC_PREFIXES = re.compile(
    r"^\s*("
    r"teach\s+me(\s+about)?|"
    r"what\s+is(\s+a)?|what\s+are(\s+the)?|what's|"
    r"define|definition\s+of|meaning\s+of|"
    r"explain(\s+me)?|"
    r"summarize|summarise|summary\s+of|"
    r"compare|comparison\s+of|difference\s+between|"
    r"give\s+(\w+\s+)?code\s+for|write\s+(\w+\s+)?code\s+for|"
    r"show\s+me(\s+about)?|tell\s+me\s+about|"
    r"how\s+does|how\s+do|"
    r"in\s+detail\s+about|"
    r")\s*",
    re.IGNORECASE,
)

_SUFFIX_NOISE = re.compile(
    r"\s+(in\s+detail|please|for\s+me|thoroughly|step\s+by\s+step)\s*[?.!]*$",
    re.IGNORECASE,
)


def extract_topic(query: str) -> str:
    """Extract the core subject from a user question."""
    text = query.strip().rstrip("?.!")
    text = _TOPIC_PREFIXES.sub("", text)
    text = _SUFFIX_NOISE.sub("", text)
    text = re.sub(r"\s+vs\.?\s+.+$", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s+versus\s+.+$", "", text, flags=re.IGNORECASE)
    return text.strip() or query.strip()


def rewrite_query(query: str, intent: Intent) -> str:
    """Expand a weak user question into a richer retrieval query."""
    if intent in (Intent.GREETING, Intent.GENERAL_CHAT):
        return query.strip()

    topic = extract_topic(query)
    topic_lower = topic.lower()

    if intent == Intent.DEFINITION:
        return (
            f"definition of {topic}, what is {topic}, "
            f"{topic} explanation, example of {topic}, applications of {topic}"
        )

    if intent == Intent.DETAILED_EXPLANATION:
        return (
            f"definition of {topic}, types of {topic}, how {topic} works, "
            f"{topic} examples, {topic} applications, step by step {topic}"
        )

    if intent == Intent.SUMMARY:
        return (
            f"summary of {topic}, key points of {topic}, "
            f"main ideas {topic}, overview {topic}, important concepts {topic}"
        )

    if intent == Intent.COMPARISON:
        parts = re.split(r"\s+vs\.?\s+|\s+versus\s+", query, maxsplit=1, flags=re.IGNORECASE)
        if len(parts) == 2:
            a, b = parts[0].strip(), parts[1].strip().rstrip("?.!")
            a = extract_topic(a) or a
            b = extract_topic(b) or b
            return (
                f"{a} definition, {b} definition, "
                f"differences between {a} and {b}, similarities, use cases, comparison"
            )
        return f"comparison of {topic}, differences, similarities, use cases"

    if intent == Intent.CODE_REQUEST:
        lang = _detect_language(query)
        lang_part = f"{lang} " if lang else ""
        return (
            f"{lang_part}code for {topic}, {topic} implementation, "
            f"{topic} program example, {topic} operations code"
        )

    # DOCUMENT_QUERY and others
    return (
        f"{topic}, explanation of {topic}, "
        f"{topic} definition, {topic} examples, {topic} applications"
    )


def _detect_language(query: str) -> str:
    match = re.search(
        r"\b(java|python|javascript|typescript|c\+\+|c#|go|rust|spring\s+boot)\b",
        query,
        re.IGNORECASE,
    )
    return match.group(1).lower() if match else ""
