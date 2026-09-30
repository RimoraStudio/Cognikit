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

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Copy the behavior of a large teacher model into a small student model
for one narrow, well-defined task. The pipeline is: scope the task,
generate training data with the teacher, fine-tune with LoRA, evaluate
on held-out examples, then export to GGUF and serve locally.

## AI execution flow (follow in order)

1. **Scope**: Pin down the exact task before touching any tooling.
   Distillation only works when the task is narrow and repeatable:
   "classify and draft support replies in our tone", "extract
   structured fields from invoices", "rewrite commits in conventional
   format". If the user wants a general assistant or broad knowledge,
   stop and steer them to a stock model plus RAG instead. Write the
   task down as one sentence; everything else follows from it.
2. **Data**: Collect 200 to 2000 real input examples. If the user has
   fewer than ~100 real inputs, generate synthetic inputs too, but keep
   them realistic. Run every input through the teacher model and record
   its ideal output. Format as JSONL, one object per line:

   ```json
   {"instruction": "Classify the ticket and draft a reply.", "input": "<raw ticket text>", "output": "<teacher's ideal response>"}
   ```

   Rules: quality over quantity, deduplicate near-identical inputs,
   remove malformed or empty outputs, and hold out 10% as an eval set
   that is never trained on. ToS caveat: prefer open-weight teachers
   (Llama, Qwen, DeepSeek) for anything commercial; API providers may
   restrict training on their outputs.
3. **Pick the student**: Choose the smallest model that can hold the
   task, sized to the target hardware.

   | Student size | RAM needed | Runs on | Good families |
   |---|---|---|---|
   | 1-3B | 2-4 GB | Raspberry Pi, old laptop | Qwen 2.5/3, Llama 3.2, Phi-3/4-mini, Gemma 3 |
   | 7-8B | 5-8 GB | Mini PC, modern laptop | Qwen 2.5/3, Llama 3.1, Mistral |
   | 13-14B | 10-12 GB | Workstation, small GPU | Qwen 2.5, Phi-4 |

   Default to a 3B or 7-8B instruct model. Smaller students learn
   narrow tasks surprisingly well and deploy anywhere.
4. **Fine-tune**: Use LoRA via unsloth on a single GPU or free Colab.
   Axolotl is a solid YAML-driven alternative for multi-GPU or
   team-shared configs.

   ```python
   from unsloth import FastLanguageModel
   from trl import SFTTrainer
   from datasets import load_dataset

   model, tokenizer = FastLanguageModel.from_pretrained(
       model_name="unsloth/Qwen2.5-7B-Instruct",
       max_seq_length=2048,
       load_in_4bit=True,
   )
   model = FastLanguageModel.get_peft_model(model, r=16, lora_alpha=32)

   dataset = load_dataset("json", data_files="train.jsonl", split="train")

   trainer = SFTTrainer(
       model=model,
       train_dataset=dataset,
       args=dict(
           learning_rate=2e-4,
           num_train_epochs=2,
           per_device_train_batch_size=2,
           output_dir="out",
       ),
   )
   trainer.train()
   model.save_pretrained("adapter")
   ```

   Hyperparameter defaults: learning rate ~2e-4, 2-3 epochs, LoRA
   r=16. On datasets under ~500 examples, more epochs overfits fast;
   watch for memorized outputs and stop early.
5. **Evaluate**: Run the student and the teacher on the held-out 10%.
   Score task accuracy, not vibes: exact-match rate for extraction,
   a rubric or judge prompt for generated text. Expect 80-95% of
   teacher quality on a well-scoped task. If the gap is bigger, fix
   the data (more coverage of failing input types, cleaner outputs)
   before touching hyperparameters.
6. **Export and deploy**: Merge the adapter into the base model or
   convert straight to GGUF with llama.cpp, then quantize. Q4_K_M is
   the sweet spot for quality per byte; go Q8_0 only if eval shows a
   real regression, and Q3 or below only for extreme size limits.

   ```bash
   python convert_hf_to_gguf.py ./merged --outfile student-f16.gguf
   ./llama-quantize student-f16.gguf student-q4_k_m.gguf Q4_K_M
   ```

   Then serve with Ollama using a minimal Modelfile:

   ```
   FROM ./student-q4_k_m.gguf
   TEMPLATE """{{ .Prompt }}"""
   PARAMETER temperature 0.2
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
- Do not start with under ~100 real examples and expect reliable
  behavior. Thin data produces a model that parrots a few cases.
- Do not distill a broad task. "Be helpful" does not distill;
  "answer billing questions in our tone" does.
- Do not skip the eval set. Training loss going down says nothing
  about task accuracy.
- Do not expect the student to beat the teacher. 80-95% of teacher
  quality on the narrow task is a win; chasing more means the task or
  data is wrong, not the student.
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
