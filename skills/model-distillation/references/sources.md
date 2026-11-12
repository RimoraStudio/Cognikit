# Primary sources

Check the source corresponding to the installed versions before copying API examples. Links are starting points, not claims that a particular release remains current.

- TRL supervised fine-tuning: https://huggingface.co/docs/trl/sft_trainer
- TRL PEFT integration: https://huggingface.co/docs/trl/peft_integration
- PEFT LoRA developer guide: https://huggingface.co/docs/peft/developer_guides/lora
- Hugging Face model cards and licensing: https://huggingface.co/docs/hub/model-cards
- Ollama model import, including GGUF: https://docs.ollama.com/import
- llama.cpp project and current conversion/quantization tooling: https://github.com/ggml-org/llama.cpp

Training and inference compatibility depends on the model architecture, Python/CUDA stack, and target runtime. Verify those together, and test the exact commands in a clean environment before publishing them as a supported recipe.
