# Local RAG Assistant — Backend

FastAPI backend for uploading PDFs and chatting with them locally using Ollama, LangChain, and ChromaDB.

## Prerequisites

- Python 3.11+
- [Ollama](https://ollama.com/) running locally

```bash
ollama pull llama3.2:1b
ollama pull nomic-embed-text
```

## Setup

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS / Linux
```

> On Windows, ChromaDB may require [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).

## Run

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs

## API Endpoints

| Method | Endpoint        | Description                    |
|--------|-----------------|--------------------------------|
| GET    | `/health`       | Health check                   |
| POST   | `/upload/pdf`   | Upload and index a PDF         |
| POST   | `/chat`         | Ask a question over indexed docs |

## Test Flow

### 1. Upload a PDF

Swagger UI → **POST /upload/pdf** → select a text-based PDF.

Expected response:

```json
{
  "document_id": "uuid-here",
  "filename": "report.pdf",
  "status": "indexed",
  "chunk_count": 12,
  "message": "PDF uploaded and indexed successfully (12 chunks)."
}
```

### 2. Ask a question

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"What is this document about?\", \"document_id\": \"uuid-here\"}"
```

### 3. Verify sources

The response includes `sources` — the exact chunks retrieved from ChromaDB before the LLM answer.

## Project Structure

```
routes/     HTTP endpoints
services/   Business logic orchestration
rag/        Loader, chunking, embeddings, vectorstore, retriever, chain
models/     Pydantic schemas
utils/      Config and file helpers
data/       Uploads and ChromaDB storage
```
