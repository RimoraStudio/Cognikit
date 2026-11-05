# Model Distillation

Distill a large teacher model into a small model that runs on modest hardware. Covers task scoping, training data generation, LoRA fine-tuning with unsloth, student model sizing by RAM, evaluation against the teacher, GGUF quantization, and deployment with Ollama or llama.cpp.

## When to use

Use it to fine-tune or distill a teacher model into a smaller local model, evaluate the student, quantize it, or deploy it on modest hardware.

## Install

```sh
npx skills add RimoraStudio/cognikit/tree/main/skills/model-distillation --global --yes
```

## Package contents

- `SKILL.md`: complete agent instructions
- `evals/evals.json`: sample prompts for checking skill behavior

## Related skills

- [`rag-pipelines`](../rag-pipelines/README.md)
- [`agent-memory`](../agent-memory/README.md)
- [`code-review`](../code-review/README.md)

## License

MIT. See the repository license.
