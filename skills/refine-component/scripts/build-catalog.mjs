#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, relative, sep } from "node:path";
import { validateCatalog } from "./validate-catalog.mjs";

const result = await validateCatalog();
if (result.errors.length) {
  for (const error of result.errors) console.error(`[error] ${error}`);
  console.error("Catalog build stopped. Fix validation errors and run again.");
  process.exit(1);
}

function shellRelativePath(filePath) {
  const rel = relative(result.shellDir, filePath);
  return rel.split(sep).join("/");
}

const components = result.entries.map(({ entry, metadata, files }) => {
  const codeFiles = [
    { label: "component.tsx", path: shellRelativePath(files.source) },
    { label: "preview.tsx", path: shellRelativePath(files.preview) },
    { label: "notes.md", path: shellRelativePath(files.notes) },
  ];
  for (const key of ["htmlExample", "htmlStyles", "htmlScript"]) {
    if (files[key]) {
      const labels = {
        htmlExample: "Framework-neutral example: index.html",
        htmlStyles: "Framework-neutral example: styles.css",
        htmlScript: "Framework-neutral example: app.js",
      };
      codeFiles.push({ label: labels[key], path: shellRelativePath(files[key]) });
    }
  }

  return {
    ...metadata,
    example: files.htmlExample ? shellRelativePath(files.htmlExample) : undefined,
    codeFiles,
  };
});

const output = {
  catalogVersion: result.registry.catalogVersion,
  product: result.registry.product,
  components,
};
const outputPath = `${result.shellDir}/catalog.json`;
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`Built catalog-shell/catalog.json for ${components.length} component(s).`);
