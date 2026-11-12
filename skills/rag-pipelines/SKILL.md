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

> Part of [Cognikit](https://cognikit.rimora.space). A kit that gives AI agents cognitive abilities.

Build a RAG pipeline as a linear system: ingest, chunk, embed, store,
retrieve, augment, generate. Every stage has a small set of correct
choices. Make them deliberately, and keep metadata flowing through every
stage so answers can cite their sources.

## Keep guidance current

Before giving version-sensitive implementation advice, inspect the project's pinned dependencies and consult current primary documentation, release notes, or policy sources. Do not call a model, package version, API, price, threshold, or platform requirement “latest” without checking it for this task. Treat bundled code as an example tied to its stated versions; if current sources are unavailable, say so and do not invent replacement syntax.

## AI execution flow (follow in order)

1. **Scope**: Identify the document types (PDF, markdown, HTML, code),
   corpus size, expected query volume, and whether the system is
   multi-tenant. These drive every choice below.
2. **Ingest**: Load each document with a parser that preserves its
   structure. Record `source`, `doc_id`, and `tenant_id` up front.
3. **Chunk**: Split on document structure, not arbitrary character
   counts. Treat chunk size and overlap as tunable starting parameters;
   measure them with the selected embedding model's tokenizer and a
   retrieval eval set. Attach metadata to every chunk.
4. **Embed and store**: Compare current embedding and vector-store
   options against quality, privacy, latency, cost, and operational needs.
   Index chunks with their metadata.
5. **Retrieve**: Tune candidate and final counts using retrieval evals.
   Add keyword search or reranking when measured errors justify it.
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
| Chunk | Split on headings/paragraphs | Evaluated chunk size + metadata |
| Embed | Vectorize chunk text | Dense vectors |
| Store | Persist vectors + metadata | Searchable index |
| Retrieve | Filter, rank, optionally rerank | Evaluated relevant candidates |
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

Split on structure first (headings, then paragraphs), then enforce a token
budget measured with the selected model's supported tokenizer. Do not
equate whitespace word counts with tokens. Tune the budget and overlap
against retrieval evaluations; neither has one universal value. Every
chunk must carry `source`, `section`,
`page` (if known), `doc_id`, and `tenant_id`. Without metadata there are
no citations.

Implement the packer with the tokenizer for the selected embedding model:

1. Parse headings and atomic blocks (tables, code, lists) before packing.
2. Add paragraphs to the current chunk while the tokenizer reports that
   the candidate is within the chosen budget.
3. On overflow, emit the chunk and carry only a measured overlap that
   preserves context without exceeding the next chunk's budget.
4. Keep oversized atomic blocks intact or handle them with a format-aware
   strategy. Record the heading path and source offsets in metadata.

Do not substitute `len(text.split())` for a tokenizer while naming the
limit `max_tokens`; whitespace words are not model tokens.

Oversized atomic blocks (big tables, long code listings) can stay as
single chunks over the cap; never split them mid-structure.

## Embeddings and vector store

Choose an embedding model by evaluating retrieval quality, latency, cost,
dimensions, input limits, data residency, and provider terms. Use the
current provider docs linked in `references/sources.md`; names and
availability are not permanent defaults. Keep the model and dimensions
consistent between indexing and query time, and plan a re-embedding
migration if either changes.

```python
from openai import OpenAI
client = OpenAI()

def embed(texts, model):
    # Pass a model chosen and verified for this project.
    resp = client.embeddings.create(model=model, input=texts)
    return [d.embedding for d in resp.data]
```

For local inference, consult the serving tool's current embedding API and
choose a model that fits the corpus language and hardware. Keep one model
and vector dimension per index; do not mix embeddings from incompatible
models in the same vector space.

Pick the simplest store that fits:

| Requirement | Candidate direction | Verify |
|---|---|---|
| Local prototype or modest corpus | Embedded/local vector store | Durability, concurrency, filtering, backup, and package maturity |
| Existing relational database and SQL access control | Vector extension for that database | Index support, query plans, filtering semantics, and operational limits |
| Distributed scale or managed operations | Managed vector database | Region, consistency, filtering, hybrid search, quotas, cost, and exit path |

Store `chunk_id`, `text`, `embedding`, and filterable metadata. Configure
the vector dimension from the chosen model's actual output and index
schema; do not copy a dimension from another provider or model.

## Retrieval

- **Top-k**: Tune candidate and final counts against retrieval recall,
  answer quality, latency, and context budget. No single value is a
  universal sweet spot.
- **Filters**: Derive tenant identity from authenticated server-side
  context, enforce it in the retrieval query, and test isolation before
  ranking. Never trust a caller-supplied tenant ID by itself.
- **Hybrid**: Vector + keyword (BM25 / FTS) can help with jargon, SKUs,
  error codes, and IDs. Measure against vector-only retrieval and select
  a fusion method such as reciprocal rank fusion based on evaluation.
- **Rerank**: When measured errors justify it, compare a current reranker
  against the baseline, tune candidate/final counts, and measure latency
  and cost. Verify provider and model names against current docs.

```python
def retrieve(query, auth_context, *, final_k, candidate_k, use_reranker=False):
    # Resolve tenant identity from trusted authenticated server context.
    tenant_id = auth_context.tenant_id
    qvec = embed([query])[0]
    vec_hits = search_vectors(qvec, tenant_id=tenant_id, limit=candidate_k)
    kw_hits = search_keywords(query, tenant_id=tenant_id, limit=candidate_k)
    fused = rrf_fuse(vec_hits, kw_hits)
    if use_reranker:
        fused = rerank(query, fused)
    return fused[:final_k]

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

Build a representative golden set of real questions with expected source
documents and answers. Size it to task diversity and review capacity.
Measure the two halves separately:

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
- [ ] Chunk size and overlap were measured with the chosen tokenizer and retrieval evals
- [ ] Every chunk carries source, section, page, doc_id, tenant_id metadata
- [ ] One embedding model for indexing and querying; dimension matches the store schema
- [ ] Vector store matches scale (embedded / pgvector / managed)
- [ ] Retrieval candidate counts are evaluated; metadata filters and hybrid/keyword paths fit the data
- [ ] Tenant isolation enforced in the query layer and tested cross-tenant
- [ ] Grounding prompt requires citations and includes the "I don't have that in the docs" fallback
- [ ] Golden Q&A set measures retrieval hit-rate and faithfulness separately
- [ ] Re-indexing re-embeds only changed documents
