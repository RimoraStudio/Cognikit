"use strict";

const list = document.getElementById("component-list");
const search = document.getElementById("search");
const category = document.getElementById("category");
const count = document.getElementById("result-count");
const empty = document.getElementById("empty");

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text != null) element.textContent = String(text);
  return element;
}

function copyButton(label, onClick) {
  const button = node("button", "copy-button", label);
  button.type = "button";
  button.addEventListener("click", onClick);
  return button;
}

function showCopyFallback(article, value, label, status) {
  let field = article.querySelector(".copy-fallback");
  if (!field) {
    field = document.createElement("textarea");
    field.className = "copy-fallback";
    field.readOnly = true;
    article.append(field);
  }
  field.setAttribute("aria-label", `${label}. Copy the selected text manually.`);
  field.value = value;
  field.hidden = false;
  field.focus();
  field.select();
  status.textContent = "Clipboard permission was unavailable. The text is selected; press Ctrl+C or Command+C to copy it.";
}

function makeAgentPrompt(product, component) {
  const reference = component.referenceCode || component.id;
  const referenceUrl = new URL(`#component-${component.id}`, location.href).href;
  const lines = [
    `Follow component ${reference} (${component.name}) from the ${product.name} component catalog.`,
    `Reference: ${referenceUrl}`,
    "Adapt this component to the target project's framework, tokens, and behavior contract. Treat the example as a reference, not a requirement to copy unrelated page structure.",
    `Purpose: ${component.purpose}`,
    `Design concept: ${component.designConcept}`,
    `Semantics: ${[component.semantics?.element, component.semantics?.role, component.semantics?.name].filter(Boolean).join("; ")}`,
    `Variants: ${(component.variants || []).map((item) => `${item.name}: ${item.useWhen}${item.avoidWhen ? ` (avoid when: ${item.avoidWhen})` : ""}`).join(" | ") || "Use only what the target requires."}`,
    `States: ${(component.states || []).map((item) => `${item.name}: ${item.trigger} -> ${item.feedback}${item.recovery ? ` Recovery: ${item.recovery}` : ""}`).join(" | ")}`,
    `Interactions: ${(component.interactions || []).map((item) => `${item.input} -> ${item.result}${item.constraints ? ` (${item.constraints})` : ""}`).join(" | ")}`,
    `Keyboard: ${(component.accessibility?.keyboard || []).join("; ")}`,
    `Accessibility: ${[component.accessibility?.focus, component.accessibility?.announcements, component.accessibility?.contrast, component.accessibility?.motion, component.accessibility?.touchTarget].filter(Boolean).join(" ")}`,
    `Responsive rules: ${(component.responsive || []).join("; ")}`,
    `Design tokens: ${(component.tokens || []).join(", ") || "Follow the target project's existing tokens."}`,
    `Verify: ${(component.verification || []).join("; ")}`,
  ];
  return lines.join("\n");
}

async function readCodeFile(file) {
  const url = new URL(file.path, location.href);
  if (url.origin !== location.origin) throw new Error("Source files must be same-origin.");
  const response = await fetch(url.href);
  if (!response.ok) throw new Error(`Could not load ${file.label} (${response.status}).`);
  return response.text();
}

async function readAllCode(component) {
  return Promise.all(component.codeFiles.map(async (file) => ({
    file,
    source: await readCodeFile(file),
  })));
}

function render(data) {
  const query = search.value.trim().toLocaleLowerCase();
  const selectedCategory = category.value;
  const filtered = data.components.filter((component) => {
    const variants = (component.variants || []).map((variant) => variant.name);
    const searchable = [component.id, component.referenceCode, component.name, component.purpose, component.category, ...variants]
      .join(" ").toLocaleLowerCase();
    return (selectedCategory === "all" || component.category === selectedCategory) && searchable.includes(query);
  });

  list.replaceChildren();
  count.textContent = `${filtered.length} of ${data.components.length} components`;
  empty.hidden = filtered.length !== 0;

  for (const component of filtered) {
    const article = node("article", "component");
    article.id = `component-${component.id}`;
    const heading = node("div", "component-heading");
    heading.append(node("h2", "", component.name), node("span", "category", component.category));
    article.append(heading, node("p", "purpose", component.purpose));
    article.append(node("p", "design-concept", component.designConcept));
    article.append(node("p", "reference-code", `Component code: ${component.referenceCode || component.id}`));
    if (component.status && component.status !== "existing") {
      article.append(node("p", "status", `Status: ${component.status}`));
    }

    const actions = node("div", "component-actions");
    const copyStatus = node("span", "copy-status", "");
    copyStatus.setAttribute("role", "status");
    copyStatus.setAttribute("aria-live", "polite");
    actions.append(copyButton("Copy AI instruction", async () => {
      const prompt = makeAgentPrompt(data.product, component);
      try {
        await navigator.clipboard.writeText(prompt);
        copyStatus.textContent = `Instruction for ${component.referenceCode || component.id} copied.`;
      } catch {
        showCopyFallback(article, prompt, "AI instruction", copyStatus);
      }
    }));
    if (component.codeFiles?.length) {
      actions.append(copyButton("Copy implementation files", async () => {
        try {
          const files = await readAllCode(component);
          const source = files.map(({ file, source }) => `--- ${file.label} ---\n${source}`).join("\n\n");
          try {
            await navigator.clipboard.writeText(source);
            copyStatus.textContent = `Source for ${component.referenceCode || component.id} copied.`;
          } catch {
            showCopyFallback(article, source, "Implementation source", copyStatus);
          }
        } catch (error) {
          copyStatus.textContent = error instanceof Error ? error.message : "Could not load implementation source.";
        }
      }));
    }
    actions.append(copyStatus);
    article.append(actions);

    const contract = document.createElement("details");
    contract.append(node("summary", "", "Behavior contract"));
    const body = node("div", "details-body");
    const sections = [
      ["Semantics", [component.semantics?.element, component.semantics?.role, component.semantics?.name].filter(Boolean)],
      ["Variants", (component.variants || []).map((item) => `${item.name}: ${item.useWhen}`)],
      ["States", (component.states || []).map((item) => `${item.name}: ${item.trigger} -> ${item.feedback}${item.recovery ? ` Recovery: ${item.recovery}` : ""}`)],
      ["Interactions", (component.interactions || []).map((item) => `${item.input} -> ${item.result}${item.constraints ? ` (${item.constraints})` : ""}`)],
      ["Keyboard", component.accessibility?.keyboard || []],
      ["Accessibility", [component.accessibility?.focus, component.accessibility?.announcements, component.accessibility?.contrast, component.accessibility?.motion, component.accessibility?.touchTarget].filter(Boolean)],
      ["Responsive", component.responsive || []],
      ["Verification", component.verification || []],
    ];
    for (const [label, values] of sections) {
      if (!values.length) continue;
      body.append(node("h3", "", label));
      const items = document.createElement("ul");
      for (const value of values) items.append(node("li", "", value));
      body.append(items);
    }
    contract.append(body);
    article.append(contract);

    if (component.example) {
      const links = node("p", "links");
      const url = new URL(component.example, location.href);
      if (url.origin === location.origin) {
        const link = node("a", "", "Open framework-neutral HTML example");
        link.href = url.href;
        links.append(link);
        article.append(links);
      }
    }

    if (component.codeFiles?.length) {
      const sourceDetails = document.createElement("details");
      sourceDetails.className = "source-details";
      sourceDetails.append(node("summary", "", "View TSX and reference source"));
      const sourceBody = node("div", "source-body");
      sourceDetails.append(sourceBody);
      sourceDetails.addEventListener("toggle", async () => {
        if (!sourceDetails.open || sourceDetails.dataset.loaded) return;
        sourceDetails.dataset.loaded = "true";
        sourceBody.append(node("p", "source-loading", "Loading source files…"));
        try {
          const files = await readAllCode(component);
          sourceBody.replaceChildren();
          for (const { file, source } of files) {
            sourceBody.append(node("h3", "", file.label));
            const pre = document.createElement("pre");
            const code = document.createElement("code");
            code.textContent = source;
            pre.append(code);
            sourceBody.append(pre);
          }
        } catch (error) {
          sourceBody.replaceChildren(node("p", "load-error", error instanceof Error ? error.message : "Could not load implementation source."));
        }
      });
      article.append(sourceDetails);
    }
    list.append(article);
  }
}

async function init() {
  try {
    const response = await fetch("catalog.json");
    if (!response.ok) throw new Error(`Catalog request failed (${response.status}). Run scripts/build-catalog.mjs first.`);
    const data = await response.json();
    if (!data || !data.product || !Array.isArray(data.components)) throw new Error("Catalog shape is invalid.");
    const refs = data.components.map((component) => component.referenceCode || component.id);
    if (refs.some((reference) => !reference) || new Set(refs).size !== refs.length) {
      throw new Error("Each component must have a unique reference code or ID.");
    }

    document.getElementById("catalog-title").textContent = `${data.product.name} components`;
    document.getElementById("catalog-description").textContent = data.product.description || "Component behavior, states, and verification notes.";
    document.getElementById("catalog-meta").textContent = `${data.components.length} components / ${(data.product.platforms || []).join(", ")}`;
    for (const value of [...new Set(data.components.map((item) => item.category))].sort()) {
      const option = node("option", "", value);
      option.value = value;
      category.append(option);
    }
    search.addEventListener("input", () => render(data));
    category.addEventListener("change", () => render(data));
    render(data);
  } catch (error) {
    list.replaceChildren(node("p", "load-error", `Could not load catalog.json: ${error instanceof Error ? error.message : "unknown error"}`));
  }
}

init();
