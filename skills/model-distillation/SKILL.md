---
name: model-distillation
description: >
  Distills a large teacher model's capability into a small model that
  runs on modest hardware: generate training data with the teacher,
  fine-tune a student with LoRA, evaluate against a held-out set, then
  quantize to GGUF and deploy locally. Use when the user asks to
  "distill a model", "train a small model from GPT-4", "fine-tune for
  my task", "local model that does X", "LoRA fine-tuning", "make my own
  model", "run AI on small computer", "quantize model", or "replace API
  calls with local model". Produces a runnable local model, not a
  generic chatbot.
metadata:
  version: 1.0.0
license: MIT
---

# Model Distillation

> Part of [Cognikit](https://cognikit.rimora.space). A kit that gives AI agents cognitive abilities.

Copy the behavior of a large teacher model into a small student model
for one narrow, well-defined task. The pipeline is: scope the task,
generate training data with the teacher, fine-tune with LoRA, evaluate
on held-out examples, then export to GGUF and serve locally.

## Keep guidance current

Before giving version-sensitive implementation advice, inspect the project's pinned dependencies and consult current primary documentation, release notes, or policy sources. Do not call a model, package version, API, price, threshold, or platform requirement “latest” without checking it for this task. Treat bundled code as an example tied to its stated versions; if current sources are unavailable, say so and do not invent replacement syntax.

## AI execution flow (follow in order)

1. **Scope**: Pin down the exact task before touching any tooling.
   Distillation only works when the task is narrow and repeatable:
   "classify and draft support replies in our tone", "extract
   structured fields from invoices", "rewrite commits in conventional
   format". If the user wants a general assistant or broad knowledge,
   stop and steer them to a stock model plus RAG instead. Write the
   task down as one sentence; everything else follows from it.
2. **Data**: Build a representative, licensed dataset from real task
   inputs. There is no universal example count: start with a pilot, inspect
   coverage and quality, then add examples for failure modes. Synthetic
   data can help cover rare cases, but label it and review it. Reserve a
   held-out evaluation set before training. Check the chosen teacher's
   terms and data-handling rules before using its outputs for training.
   A simple JSONL shape is:

   ```json
   {"instruction": "Classify the ticket and draft a reply.", "input": "<raw ticket text>", "output": "<teacher's ideal response>"}
   ```

   Deduplicate near-identical inputs, remove malformed outputs, document
   provenance and consent, and keep evaluation examples out of training.
   Do not assume open-weight automatically means commercial-use rights;
   verify the specific model and data licenses.
3. **Pick the student**: Choose the smallest model that can hold the
   task, sized to the target hardware.

   Compare currently available models using task quality, license,
   tokenizer/context support, quantized memory requirements, latency, and
   target hardware. Estimate memory from the actual parameter count,
   precision, context length, runtime overhead, and concurrent workload;
   do not use parameter-count-only RAM tables as guarantees. Benchmark a
   small candidate set on the target hardware.
4. **Fine-tune**: Choose a maintained training stack that supports the
   selected architecture and hardware. Inspect the repository's pinned
   `trl`, `transformers`, `peft`, and CUDA/ROCm versions first. The example
   below follows the current TRL SFT/PEFT interface documented at
   `references/sources.md`; it is a starting point, not a tested lockfile.

   ```python
    from datasets import load_dataset
    from peft import LoraConfig
    from trl import SFTConfig, SFTTrainer

    dataset = load_dataset("json", data_files="train.jsonl", split="train")
    dataset = dataset.map(lambda row: {
        "text": f"Instruction: {row['instruction']}\n"
                f"Input: {row['input']}\nOutput: {row['output']}"
    })

    trainer = SFTTrainer(
        model="<verified-model-id>",
        train_dataset=dataset,
        args=SFTConfig(
            output_dir="out",
            learning_rate=2e-4,
            num_train_epochs=1,
            per_device_train_batch_size=2,
        ),
        peft_config=LoraConfig(r=16, lora_alpha=32, task_type="CAUSAL_LM"),
    )
    trainer.train()
    trainer.save_model("adapter")
   ```

   Treat these values as initial experiment settings, not recommendations
   for every model. Tune against the held-out task set and monitor
   overfitting, training stability, and resource use.
5. **Evaluate**: Run the student and the teacher on the held-out set.
   Score task-specific outcomes: exact-match or structured validity for
   extraction, and a fixed rubric plus human review for generated text.
   Compare against the teacher and a no-fine-tuning baseline. Set an
   acceptance threshold from the product's requirements; do not promise a
   fixed fraction of teacher quality. Diagnose failures before tuning.
6. **Export and deploy**: Merge the adapter into the base model only when
    the deployment format requires it. Use the current llama.cpp conversion
    and quantization instructions for the architecture.
   Compare supported quantization profiles on the held-out set and target
   hardware; quality, memory, and speed tradeoffs vary by model and task.

   ```bash
    # Use the converter and quantizer paths from the current llama.cpp build.
    python /path/to/llama.cpp/convert_hf_to_gguf.py ./merged \
      --outfile student-f16.gguf
    /path/to/llama.cpp/build/bin/llama-quantize \
      student-f16.gguf student-quantized.gguf <supported-type>
   ```

   Prepare GGUF quantization before importing it into Ollama. Use the
   model's correct chat template; do not override a working template with
   a generic one. Consult the current Ollama import docs in the sources
   reference.

   ```
    FROM ./student-quantized.gguf
   ```

   ```bash
   ollama create my-task-model -f Modelfile
   ollama run my-task-model "ticket text here"
   ```

   Serving options: Ollama for the simplest path, `llama-server` for a
   raw OpenAI-compatible endpoint, vLLM when a GPU is available and
   throughput matters.
7. **Verify**: Run the pre-flight checklist at the bottom.

## Anti-patterns (never do)

- Do not fine-tune facts or knowledge into the model. Facts shift,
  small models hallucinate them anyway, and retraining to update them
  is a treadmill. Teach behavior with fine-tuning; supply knowledge
  with RAG.
- Do not assume a fixed dataset size produces reliable behavior. Check
  coverage and held-out performance for the actual task.
- Do not distill a broad task. "Be helpful" does not distill;
  "answer billing questions in our tone" does.
- Do not skip the eval set. Training loss going down says nothing
  about task accuracy.
- Do not treat a target score as universal. Define product-specific
  acceptance criteria and compare baselines.
- Do not crank epochs to fix bad outputs. Iterate on data first.

## Related skills

- `rag-pipelines`: facts belong in retrieval, behavior belongs in weights; use both together
- `agent-memory`: an alternative to distillation when adaptation should stay editable
- `code-review`: review training-data generation scripts before burning GPU hours

## Pre-flight checklist

- [ ] Task written down as one narrow sentence; broad requests redirected to stock model + RAG
- [ ] 200+ training examples, deduplicated, real inputs where possible
- [ ] 10% held-out eval set that was never trained on
- [ ] Teacher ToS checked, or open-weight teacher used for commercial work
- [ ] Student size fits target hardware (see sizing table)
- [ ] Evaluated student vs teacher on the eval set with a concrete metric
- [ ] Exported GGUF at Q4_K_M (or justified otherwise) and verified with `ollama run` on a real input
