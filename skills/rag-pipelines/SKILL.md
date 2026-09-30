---
name: rag-pipelines
description: >
  Builds retrieval-augmented generation pipelines end to end: document
  ingestion, structure-aware chunking, embeddings, vector storage,
  hybrid retrieval, and grounded answer generation with citations.
  Use when the user asks to "build RAG", "chat with my documents",
  "add knowledge base to AI", "semantic search", "RAG pipeline",
  "embed my docs", "company knowledge chatbot", "vector search", or
  wants an "agent that answers from docs". Covers library choices,
  chunking code, retrieval patterns, and the grounding prompt.
metadata:
  version: 1.0.0
license: MIT
---

# RAG Pipelines

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Build a RAG pipeline as a linear system: ingest, chunk, embed, store,
retrieve, augment, generate. Every stage has a small set of correct
choices. Make them deliberately, and keep metadata flowing through every
stage so answers can cite their sources.

## AI execution flow (follow in order)

1. **Scope**: Identify the document types (PDF, markdown, HTML, code),
   corpus size, expected query volume, and whether the system is
   multi-tenant. These drive every choice below.
2. **Ingest**: Load each document with a parser that preserves its
   structure. Record `source`, `doc_id`, and `tenant_id` up front.
3. **Chunk**: Split on document structure, not raw character counts.
   Target 300-800 tokens with 10-15% overlap. Attach metadata to every
   chunk.
4. **Embed and store**: Pick one embedding model and one vector store
   from the tables below. Index chunks with their metadata.
5. **Retrieve**: Top-k 5-10 with metadata filters. Add keyword search
   (hybrid) and reranking when precision matters.
6. **Generate**: Stuff retrieved context into the grounding prompt and
   require citations. Use the explicit fallback when context is missing.
7. **Secure and evaluate**: Enforce tenant isolation in the query layer.
   Build a small golden Q&A set and measure retrieval and faithfulness
   separately.
8. **Verify**: Run the pre-flight checklist at the bottom.

## Architecture

```
[docs] -> [parse] -> [structure-aware chunks] -> [embed] -> [vector store]
                                                              |
[question] -> [embed] -> [retrieve: filters + hybrid + rerank] |
                                                              v
                            [prompt: context + question] -> [LLM]
                                                              |
                                                  [answer with citations]
```

| Stage | Job | Output |
|---|---|---|
| Ingest | Parse files, keep structure | Raw sections |
| Chunk | Split on headings/paragraphs | 300-800 token chunks + metadata |
| Embed | Vectorize chunk text | Dense vectors |
| Store | Persist vectors + metadata | Searchable index |
| Retrieve | Filter, rank, optionally rerank | 5-10 relevant chunks |
| Augment | Format chunks into prompt | Context block |
| Generate | Answer grounded in context | Cited answer or fallback |

## Ingestion and chunking

Use a parser per format, not a plain-text dump:

- **PDF**: `pypdf` or `pdfplumber` (Python); keep the page number per block
- **Markdown**: split on heading hierarchy; the heading path becomes the
  `section` metadata
- **HTML**: `beautifulsoup4`; drop nav/script/footer, keep heading
  structure
- **Code**: split by function/class boundaries (tree-sitter or a
  per-language splitter), never mid-statement

Split on structure first (headings, then paragraphs), then enforce the
token cap. A chunk that crosses a section boundary confuses both
retrieval and the model. Aim for 300-800 tokens; 10-15% overlap carries
context across boundaries. Every chunk must carry `source`, `section`,
`page` (if known), `doc_id`, and `tenant_id`. Without metadata there are
no citations.

```python
import re

def chunk_markdown(text, source, doc_id, tenant_id,
                   max_tokens=600, overlap=0.12):
    """Split on headings, pack paragraphs to the token cap, carry overlap."""
    parts = re.split(r"(?m)^(#{1,4} .+)$", text)
    sections, heading, buf = [], "", []

    def flush():
        if buf:
            sections.append({"section": heading, "text": "\n\n".join(buf)})
            buf.clear()

    for part in parts:
        if part.startswith("#"):
            flush()
            heading = part.lstrip("#").strip()
            continue
        for para in part.split("\n\n"):
            para = para.strip()
            if not para:
                continue
            # len(p.split()) approximates tokens; use tiktoken for exact counts
            if sum(len(p.split()) for p in buf + [para]) > max_tokens:
                flush()
            buf.append(para)
    flush()

    chunks = []
    for i, s in enumerate(sections):
        body = s["text"]
        if i > 0:
            prev = sections[i - 1]["text"].split()
            body = " ".join(prev[-int(len(prev) * overlap):] + [body])
        chunks.append({"text": body, "metadata": {
            "source": source, "doc_id": doc_id, "tenant_id": tenant_id,
            "section": s["section"], "chunk_index": i}})
    return chunks
```

Oversized atomic blocks (big tables, long code listings) can stay as
single chunks over the cap; never split them mid-structure.

## Embeddings and vector store

| Need | Embedding model | Notes |
|---|---|---|
| Default, hosted | OpenAI `text-embedding-3-small` | Cheap, strong; `text-embedding-3-large` if recall-critical |
| Offline / private data | `bge-m3` or `nomic-embed-text` via Ollama | Local, no data leaves the machine |

```python
from openai import OpenAI
client = OpenAI()

def embed(texts):
    resp = client.embeddings.create(model="text-embedding-3-small",
                                    input=texts)
    return [d.embedding for d in resp.data]
```

For Ollama: `ollama pull nomic-embed-text`, then call the local
embeddings endpoint. Keep the same model for indexing and querying;
mixing models breaks similarity.

Pick the simplest store that fits:

| Scale | Store | Why |
|---|---|---|
| < 100k chunks, one machine | sqlite-vec, LanceDB, or Chroma | Embedded, zero infra |
| Postgres already deployed | pgvector | Vectors next to your data, SQL filters for free |
| > 1M chunks or high QPS | Qdrant or Pinecone | Managed scale, built-in filtering and hybrid |

Store `chunk_id`, `text`, `embedding`, and metadata fields as filterable
columns or JSON. In pgvector that is `embedding vector(1536)` plus plain
columns for `tenant_id`, `source`, `doc_id`.

## Retrieval

- **Top-k**: 5-10 chunks is the sweet spot. More context dilutes the
  answer; less loses coverage.
- **Filters**: Apply `tenant_id` and doc-type filters inside the query,
  before ranking.
- **Hybrid**: Vector + keyword (BM25 / FTS) beats vector-only on jargon,
  SKUs, error codes, and IDs. Fuse with reciprocal rank fusion.
- **Rerank**: When precision matters, fetch a wide candidate set (25-50),
  rerank with a cross-encoder (`bge-reranker`, Cohere Rerank), keep the
  top 5-8. Adds latency; use when accuracy justifies it.

```python
def retrieve(query, tenant_id, k=8, candidate_k=25):
    qvec = embed([query])[0]
    vec_hits = search_vectors(qvec, tenant_id=tenant_id, limit=candidate_k)
    kw_hits = search_keywords(query, tenant_id=tenant_id, limit=candidate_k)
    fused = rrf_fuse(vec_hits, kw_hits)
    return rerank(query, fused)[:k]   # skip rerank if latency matters

def rrf_fuse(*lists):
    scores, by_id = {}, {}
    for hits in lists:
        for rank, hit in enumerate(hits):
            by_id[hit.id] = hit
            scores[hit.id] = scores.get(hit.id, 0) + 1 / (60 + rank + 1)
    return sorted(by_id.values(), key=lambda h: scores[h.id], reverse=True)
```

## Generation

Format each chunk as a labeled block so the model can cite it:

```
[source: {meta.source}, section: {meta.section}, page: {meta.page}]
{chunk.text}
```

Join blocks with `---`, then use this system prompt template:

```python
SYSTEM = """You answer questions using ONLY the context below.
Rules:
- Use only facts present in the context. Never rely on outside knowledge.
- If the context does not contain the answer, say:
  "I don't have that in the docs."
- Cite every claim as [source: <title>, section: <name>] from the
  chunk metadata.
- Never invent numbers, dates, names, or quotes.

CONTEXT:
{context}

QUESTION:
{question}
"""
```

The fallback line is a feature, not a failure. A grounded refusal beats
a plausible hallucination in every production setting.

## Security: multi-tenant isolation

Tenant scoping belongs in the retrieval query (`WHERE tenant_id = %s` or
the store's filter API), never in the prompt. Once another tenant's
chunks reach the model's context, the leak has already happened; prompt
instructions are a suggestion, not a boundary. Write a test where a
tenant-A query cannot return tenant-B chunks.

## Eval basics

Build a golden set of 30-100 real questions with the expected source
document and answer. Measure the two halves separately:

- **Retrieval hit-rate**: was the correct chunk inside top-k? Low
  hit-rate means fix chunking, embeddings, or hybrid search.
- **Answer faithfulness**: is the generated answer fully supported by
  the retrieved text? Use an LLM-as-judge or NLI check. Low faithfulness
  means fix the prompt or context size.

A good pipeline on bad retrieval produces confident garbage; score them
independently so you know which stage broke.

## Anti-patterns (never do)

- Do not chunk by raw character count ignoring document structure
- Do not store chunks without source/section/page metadata; uncited
  answers cannot be trusted or audited
- Do not rely on prompt instructions to hide other tenants' documents
- Do not re-embed the whole corpus on every index; hash document content
  and re-embed only what changed (embedding cost surprises come from
  blind re-indexing)
- Do not use RAG where the real need is fine-tuning (tone, format,
  behavior), or fine-tuning where the need is facts; RAG injects facts
  at query time, fine-tuning changes how the model writes
- Do not skip the fallback path; a RAG system that always answers is a
  hallucination machine

## Related skills

- `agent-memory`: RAG supplies the knowledge-base layer of the four-layer memory model
- `security-audit`: multi-tenant retrieval isolation needs an audit pass before launch
- `model-distillation`: for behavior that should live in weights rather than retrieved context

## Pre-flight checklist

- [ ] Parsers chosen per format (PDF, markdown, HTML, code), not a plain-text dump
- [ ] Chunks split on structure, sized 300-800 tokens with 10-15% overlap
- [ ] Every chunk carries source, section, page, doc_id, tenant_id metadata
- [ ] One embedding model for indexing and querying; dimension matches the store schema
- [ ] Vector store matches scale (embedded / pgvector / managed)
- [ ] Retrieval uses top-k 5-10 with metadata filters; hybrid or keyword path for jargon and IDs
- [ ] Tenant isolation enforced in the query layer and tested cross-tenant
- [ ] Grounding prompt requires citations and includes the "I don't have that in the docs" fallback
- [ ] Golden Q&A set measures retrieval hit-rate and faithfulness separately
- [ ] Re-indexing re-embeds only changed documents
