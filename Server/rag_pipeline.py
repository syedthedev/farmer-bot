import os
import re

from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

from config import settings


embeddings = OpenAIEmbeddings(
    model=settings.EMBEDDING_MODEL,
    api_key=settings.OPENAI_API_KEY,
)

llm = ChatOpenAI(
    model=settings.MODEL_NAME,
    temperature=0,
    top_p=0.1,
    frequency_penalty=0,
    presence_penalty=0,
    api_key=settings.OPENAI_API_KEY,
)

_vectorstore = None
_retriever = None


FOLLOW_UP_KEYWORDS = {
    "identification",
    "identify",
    "lifecycle",
    "life cycle",
    "control",
    "control methods",
    "timing",
    "herbicide",
    "herbicides",
}


prompt = ChatPromptTemplate.from_template("""
You are FarmerBot, an agricultural weed identification and management assistant.

STRICT DATASET RULES

* Use only the provided context for weed identification, lifecycle, control, herbicide, timing, and management questions.
* Do not use external knowledge for species facts.
* Do not guess or hallucinate species names.
* Every weed-related answer must be supported by the provided context.
* If the requested weed information is not explicitly present in the context, respond exactly:

No strong match found in dataset.

CONVERSATIONAL RULES

If the user sends a greeting such as hi, hello, hey, good morning, or good evening, respond:

Hello! I can help identify weeds and provide weed management information from my dataset.

If the user sends thanks or thank you, respond:

You're welcome! Let me know if you need help identifying a weed.

CONVERSATION MEMORY

Previous chat:
{history}

Current active species:
{active_species}

IMPORTANT CONTEXT RULES

* Use Current active species only when the user's message is a short follow-up such as:
  identification, lifecycle, control methods, timing, herbicide.
* If the user asks a full question that includes another species name, use the species in the current question.
* If the user describes plant features, identify the weed from the provided context.
* After identifying a weed, that weed becomes the active species.

QUESTION TYPE RULES

1. Species Name Only

If the user only provides a weed species name, do not immediately return all information.

Return exactly:

I found <species> in the dataset.

What would you like to know?

1. Identification
2. Lifecycle
3. Control Methods

2. Identification Questions

Return:

Species: <species>
Confidence: <High|Medium|Low>

Relevant identification evidence from context:

* <evidence 1>
* <evidence 2>

3. Lifecycle Questions

Return only:

Species: <species>
Lifecycle: <lifecycle>

4. Control Questions

Return only:

Species: <species>
Control: <control methods>

5. Timing Questions

Return only:

Species: <species>
Timing: <timing>

6. Multi-part Questions

If the user requests multiple categories, return only the requested categories.

OUTPUT RULES

* Only return fields requested by the user.
* Do not show herbicide, timing, or management in the menu.
* However, if the user directly asks about timing, herbicide, or treatment window, answer it if present in context.
* Do not add extra explanations.
* Do not summarize.
* Do not invent missing values.
* If evidence is insufficient, respond exactly:

No strong match found in dataset.

Context:
{context}

Question:
{question}

Final Answer:
""")


def _init_retriever():
    global _vectorstore, _retriever

    if _retriever is not None:
        return

    os.makedirs(settings.CHROMA_PATH, exist_ok=True)

    _vectorstore = Chroma(
        collection_name=settings.COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=settings.CHROMA_PATH,
    )

    _retriever = _vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": settings.K},
    )


def clean_text(text: str) -> str:
    text = text.replace("\x07", " ")
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", text)
    return text.strip()


def is_low_quality_context(context: str) -> bool:
    return len(context) < 200


def format_history(history: list[dict]) -> str:
    if not history:
        return "None"

    lines = []

    for msg in history[-8:]:
        role = "User" if msg["role"] == "user" else "Assistant"
        lines.append(f"{role}: {msg['content']}")

    return "\n".join(lines)


def should_use_active_species(question: str, active_species: str | None) -> bool:
    if not active_species:
        return False

    q = question.lower().strip()

    return q in FOLLOW_UP_KEYWORDS


def build_effective_question(question: str, active_species: str | None) -> str:
    if should_use_active_species(question, active_species):
        return f"{active_species} {question}"

    return question


def extract_species_from_answer(answer: str) -> str | None:
    match = re.search(r"Species:\s*(.+)", answer, re.IGNORECASE)
    if match:
        species = match.group(1).strip()

        if species.lower() == "no strong match found in dataset.":
            return None

        return species

    match = re.search(r"I found\s+(.+?)\s+in the dataset", answer, re.IGNORECASE)
    if match:
        return match.group(1).strip()

    return None


def get_response(
    question: str,
    history: list[dict] | None = None,
    active_species: str | None = None,
) -> tuple[str, str | None]:
    try:
        _init_retriever()
    except Exception:
        return "Vector database not ready. Run ingestion script first.", None

    try:
        effective_question = build_effective_question(question, active_species)

        retrieved_docs = _retriever.invoke(effective_question)

        context_parts = []

        for i, doc in enumerate(retrieved_docs):
            page = doc.metadata.get("page", "Unknown")
            content = clean_text(doc.page_content)

            context_parts.append(
                f"Chunk {i + 1}\nPage: {page}\nContent: {content}"
            )

        context = "\n\n".join(context_parts)

        if is_low_quality_context(context):
            return "No strong match found in dataset.", None

        messages = prompt.format_messages(
            history=format_history(history or []),
            active_species=active_species or "None",
            context=context,
            question=effective_question,
        )

        response = llm.invoke(messages)
        answer = response.content.strip()

        detected_species = extract_species_from_answer(answer)

        return answer, detected_species

    except Exception as e:
        return f"Error generating response: {str(e)}", None