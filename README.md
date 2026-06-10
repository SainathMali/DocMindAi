# DocMind AI

**Turn Documents Into Conversations**

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Ollama](https://img.shields.io/badge/Ollama-Local_LLM-000000?logo=ollama&logoColor=white)](https://ollama.com/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_Store-FF6F00)](https://www.trychroma.com/)

DocMind AI is a **local-first RAG (Retrieval-Augmented Generation) application** that lets you upload PDF documents and chat with them using Ollama — no cloud API keys or usage costs required.

The backend handles PDF ingestion, embedding, vector search, and grounded answer generation. The React frontend provides a modern chat workspace with document selection, markdown answers, and source citations.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Installation Guide](#installation-guide)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Ollama Setup](#ollama-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Current Status](#current-status)
- [Roadmap](#roadmap)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

---

## Project Overview

DocMind AI combines a **FastAPI backend** with a **React + Vite frontend** to deliver a NotebookLM-style experience that runs entirely on your machine.

1. Upload a PDF through the web UI or API.
2. The backend extracts text, chunks it, embeds it, and stores vectors in ChromaDB.
3. Ask questions in natural language.
4. The system retrieves relevant passages, sends them to Ollama (Llama 3.2), and returns a grounded answer with source chunks.

All inference and storage happen locally.

---

## Features

### Backend

- **PDF upload & indexing** — PyPDF text extraction, chunking, embedding, and ChromaDB persistence
- **RAG chat** — Similarity search + Ollama generation with source citations
- **Intent detection** — Classifies greetings, definitions, summaries, comparisons, code requests, and more
- **Query rewriting** — Expands weak questions into richer retrieval queries before search
- **Retrieval optimization** — Top-6 candidate fetch, deduplication, lexical re-ranking, confidence filtering (3–4 chunks to LLM)
- **Teacher-mode prompts** — Explains concepts in natural prose instead of copying PDF headings
- **Retrieval caching** — TTL cache to avoid duplicate vector searches
- **Performance logging** — Retrieval, re-rank, and generation timings logged server-side
- **CORS enabled** — Ready for the React dev server
- **OpenAPI docs** — Interactive Swagger UI at `/docs`

### Frontend

- **Welcome screen** with PDF / Image upload tabs (drag-and-drop)
- **Document sidebar** — Lists uploaded PDFs and locally added images
- **Chat workspace** — ChatGPT-style UI with markdown rendering and source panels
- **Responsive layout** — Mobile-friendly sidebar and chat interface

> **Note:** Image upload UI is prepared in the frontend; backend image analysis is not yet implemented.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend API** | FastAPI, Uvicorn, Pydantic |
| **RAG / LLM** | LangChain, LangChain-Ollama |
| **Embeddings** | Ollama `nomic-embed-text` |
| **LLM** | Ollama `llama3.2:1b` |
| **Vector DB** | ChromaDB (`langchain-chroma`) |
| **PDF parsing** | PyPDF |
| **Frontend** | React 19, Vite 8, Tailwind CSS 4 |
| **HTTP client** | Axios |
| **Markdown** | react-markdown, remark-gfm |

---

## Architecture Overview

```
┌──────────────┐     HTTP      ┌─────────────────────────────────────────────┐
│  React UI    │ ────────────► │              FastAPI Backend                 │
│  (Vite)      │               │  routes → services → rag / utils             │
└──────────────┘               └──────────┬──────────────────┬───────────────┘
                                          │                  │
                              ┌───────────▼──────────┐   ┌───▼────────────┐
                              │   data/uploads/      │   │ data/chroma_db/ │
                              │   (PDF files)        │   │ (vector index)  │
                              └──────────────────────┘   └────────────────┘
                                          │
                              ┌───────────▼──────────┐
                              │   Ollama (local)     │
                              │  • nomic-embed-text  │
                              │  • llama3.2:1b       │
                              └──────────────────────┘
```

### RAG Pipeline

```
PDF Upload
    │
    ▼
Processing          PyPDF text extraction (per-page metadata)
    │
    ▼
Chunking            RecursiveCharacterTextSplitter (500 / 100 overlap)
    │
    ▼
Embeddings          Ollama nomic-embed-text
    │
    ▼
ChromaDB            Persistent collection: rag_documents
    │
    ▼
User Question
    │
    ▼
Intent Detection    Greeting, definition, summary, comparison, code, etc.
    │
    ▼
Query Rewriting     Expand query for better retrieval (when needed)
    │
    ▼
Retrieval           Top-6 candidates → dedupe → re-rank → filter → 3–4 chunks
    │
    ▼
Ollama              Teacher-mode prompt + llama3.2:1b generation
    │
    ▼
Response            Answer + source chunks (page, content, document_id)
```

---

## Project Structure

```
ChatPdf/
├── main.py                 # FastAPI entry point
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variable template
│
├── routes/                 # HTTP layer
│   ├── health.py           # GET /health
│   ├── upload.py           # POST /upload/pdf
│   └── chat.py             # POST /chat
│
├── services/               # Business logic
│   ├── document_service.py # Upload → index pipeline
│   └── chat_service.py     # Intent → retrieve → generate
│
├── rag/                    # RAG pipeline
│   ├── loader.py           # PDF text extraction
│   ├── chunking.py         # Text splitting
│   ├── embeddings.py       # Ollama embeddings
│   ├── vectorstore.py      # ChromaDB operations
│   ├── retriever.py        # Search, re-rank, filter
│   ├── intent.py           # Query intent classification
│   ├── query_rewriter.py   # Retrieval query expansion
│   ├── prompts.py          # Teacher-mode prompts
│   ├── chain.py            # Ollama generation
│   └── cache.py            # Retrieval TTL cache
│
├── models/                 # Pydantic schemas
│   ├── requests.py
│   └── responses.py
│
├── utils/                  # Config & file helpers
│   ├── config.py
│   └── file_handler.py
│
├── data/
│   ├── uploads/            # Stored PDF files
│   └── chroma_db/          # ChromaDB persistence
│
└── frontend/               # React + Vite app
    ├── src/
    │   ├── pages/Home.jsx
    │   ├── Components/     # Sidebar, ChatWindow, UploadButton, etc.
    │   └── Services/api.js # Backend API client
    ├── package.json
    └── vite.config.js
```

---

## Installation Guide

### Prerequisites

- **Python 3.11+**
- **Node.js 18+** (for the frontend)
- **[Ollama](https://ollama.com/)** installed and running locally
- **Git**

> On Windows, ChromaDB may require [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) if pre-built wheels are unavailable.

### Clone the repository

```bash
git clone https://github.com/your-username/docmind-ai.git
cd docmind-ai
```

---

## Backend Setup

```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (macOS / Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env        # macOS / Linux
copy .env.example .env      # Windows
```

Edit `.env` to adjust Ollama models, chunk sizes, CORS origins, and RAG tuning parameters.

---

## Frontend Setup

```bash
cd frontend
npm install
```

The API client in `frontend/src/Services/api.js` points to `http://localhost:8000` by default.

---

## Ollama Setup

1. Install Ollama from [https://ollama.com](https://ollama.com).

2. Pull the required models:

```bash
ollama pull llama3.2:1b
ollama pull nomic-embed-text
```

3. Ensure Ollama is running (default: `http://localhost:11434`).

4. Verify:

```bash
ollama list
```

---

## Running the Application

### Terminal 1 — Backend

```bash
# From project root (with venv activated)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- API: [http://localhost:8000](http://localhost:8000)
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

- App: [http://localhost:5173](http://localhost:5173) (default Vite port)

### Quick test (API)

```bash
# Health check
curl http://localhost:8000/health

# Chat (after uploading a PDF and copying document_id)
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"What is this document about?\", \"document_id\": \"YOUR_DOCUMENT_ID\"}"
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check and config status |
| `POST` | `/upload/pdf` | Upload and index a PDF (multipart form, field: `file`) |
| `POST` | `/chat` | Ask a question over indexed documents |
| `GET` | `/docs` | Swagger UI (auto-generated) |

### `POST /upload/pdf`

**Request:** `multipart/form-data` with `file` (PDF)

**Response:**
```json
{
  "document_id": "uuid",
  "filename": "report.pdf",
  "status": "indexed",
  "chunk_count": 12,
  "message": "PDF uploaded and indexed successfully (12 chunks)."
}
```

### `POST /chat`

**Request:**
```json
{
  "message": "What is binary search?",
  "document_id": "optional-uuid",
  "session_id": "optional-string"
}
```

**Response:**
```json
{
  "answer": "Binary search is...",
  "document_id": "uuid",
  "session_id": null,
  "sources": [
    {
      "content": "chunk text...",
      "document_id": "uuid",
      "page": 3,
      "chunk_index": 7
    }
  ]
}
```

> `session_id` is accepted by the API but conversation memory is not yet implemented.

---

## Configuration

Key environment variables (see `.env.example`):

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama API URL |
| `LLM_MODEL` | `llama3.2:1b` | Chat model |
| `EMBEDDING_MODEL` | `nomic-embed-text` | Embedding model |
| `CHUNK_SIZE` | `500` | Text chunk size |
| `CHUNK_OVERLAP` | `100` | Chunk overlap |
| `RETRIEVAL_CANDIDATE_K` | `6` | Initial retrieval count |
| `RETRIEVAL_FINAL_K` | `4` | Max chunks sent to LLM |
| `SIMILARITY_SCORE_THRESHOLD` | `1.0` | Relevance cutoff |
| `CORS_ORIGINS` | Vite dev URLs | Allowed frontend origins |
| `DEBUG` | `false` | Enable debug logging |

---

## Current Status

| Area | Status |
|------|--------|
| PDF upload & indexing | ✅ Working |
| RAG chat with sources | ✅ Working |
| Intent detection & query rewriting | ✅ Working |
| Teacher-mode answer generation | ✅ Working |
| React chat UI | ✅ Working |
| Image upload UI | 🟡 Frontend only |
| Image analysis backend | ❌ Not implemented |
| Chat history / sessions | ❌ Not implemented |
| Document list / delete API | ❌ Not implemented |
| Persistent frontend document list | ❌ In-memory only (lost on refresh) |
| Multi-document chat (no `document_id`) | 🟡 Backend supports; UI always scopes to selected doc |
| Authentication | ❌ Not implemented |

---

## Roadmap

- [ ] **Better RAG** — Cross-encoder re-ranking, hybrid search, streaming responses
- [ ] **Chat History** — Per-document conversation memory via `session_id`
- [ ] **Persistent Documents** — Document list/delete APIs and frontend persistence
- [ ] **Image Analysis** — Vision model integration for image Q&A
- [ ] **Multi-Document Chat** — Search and chat across all uploaded PDFs from the UI

---

## Screenshots

<!-- Add screenshots here -->

| Welcome Screen | Chat Workspace |
|----------------|----------------|
| _Screenshot coming soon_ | _Screenshot coming soon_ |

| Document Sidebar | Source Citations |
|------------------|------------------|
| _Screenshot coming soon_ | _Screenshot coming soon_ |

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please keep pull requests focused and include a clear description of changes.

---

## Author

**DocMind AI**

Built as a local RAG learning and document Q&A platform.

- GitHub: [@your-username](https://github.com/your-username)

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <sub>DocMind AI — Turn Documents Into Conversations. 100% local. No API costs.</sub>
</p>
