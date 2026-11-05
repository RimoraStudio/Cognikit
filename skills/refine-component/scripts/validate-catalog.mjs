#!/usr/bin/env node
import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = resolve(SCRIPT_DIR, "..");
const CATALOG_DIR = join(SKILL_DIR, "catalog");
const ID_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const REFERENCE_PATTERN = /^[A-Z][A-Z0-9-]{2,31}$/;
const CATEGORIES = new Set([
  "actions",
  "forms",
  "navigation",
  "feedback",
  "content",
  "overlays",
  "page-patterns",
]);

async function readJson(file, label, errors) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    errors.push(`${label}: ${error.message}`);
    return null;
  }
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function requireArray(value, label, errors) {
  if (!Array.isArray(value)) errors.push(`${label} must be an array.`);
}

function resolveSkillPath(pathValue, label, errors) {
  if (!hasText(pathValue) || isAbsolute(pathValue) || /^[a-z][a-z\d+.-]*:/i.test(pathValue)) {
    errors.push(`${label} must be a non-empty relative path inside the skill package.`);
    return null;
  }

  const absolute = resolve(CATALOG_DIR, pathValue);
  const fromSkill = relative(SKILL_DIR, absolute);
  if (
    fromSkill === ".." ||
    fromSkill.startsWith(`..${sep}`) ||
    isAbsolute(fromSkill)
  ) {
    errors.push(`${label} escapes the skill package: ${pathValue}`);
    return null;
  }
  return absolute;
}

async function requireFile(pathValue, label, errors) {
  const absolute = resolveSkillPath(pathValue, label, errors);
  if (!absolute) return null;
  try {
    await access(absolute, constants.R_OK);
    return absolute;
  } catch {
    errors.push(`${label} does not exist or is unreadable: ${pathValue}`);
    return null;
  }
}

function validateMetadata(metadata, id, file, errors) {
  const label = `metadata for '${id}' (${file})`;
  if (!isRecord(metadata)) {
    errors.push(`${label} must be a JSON object.`);
    return;
  }

  if (metadata.id !== id || !ID_PATTERN.test(metadata.id || "")) {
    errors.push(`${label} must have an id matching its registry entry.`);
  }
  if (!REFERENCE_PATTERN.test(metadata.referenceCode || "")) {
    errors.push(`${label} must have a valid stable referenceCode.`);
  }
  for (const key of ["name", "purpose", "designConcept"]) {
    if (!hasText(metadata[key])) errors.push(`${label} is missing ${key}.`);
  }
  if (!CATEGORIES.has(metadata.category)) {
    errors.push(`${label} has an unsupported category '${metadata.category}'.`);
  }
  if (!isRecord(metadata.semantics)) {
    errors.push(`${label}.semantics must be an object.`);
  } else {
    for (const key of ["role", "name"]) {
      if (!hasText(metadata.semantics[key])) {
        errors.push(`${label}.semantics is missing ${key}.`);
      }
    }
  }
  for (const key of ["variants", "states", "interactions", "responsive", "verification"]) {
    requireArray(metadata[key], `${label}.${key}`, errors);
  }
  for (const key of ["platforms", "tokens", "api", "related"]) {
    if (metadata[key] !== undefined) requireArray(metadata[key], `${label}.${key}`, errors);
  }
  if (!isRecord(metadata.accessibility)) {
    errors.push(`${label}.accessibility must be an object.`);
  } else {
    for (const key of ["keyboard", "focus", "announcements"]) {
      if (key === "keyboard") requireArray(metadata.accessibility[key], `${label}.accessibility.keyboard`, errors);
      else if (!hasText(metadata.accessibility[key])) errors.push(`${label}.accessibility is missing ${key}.`);
    }
  }
}

export async function validateCatalog() {
  const errors = [];
  const warnings = [];
  const registryPath = join(CATALOG_DIR, "registry.json");
  const registry = await readJson(registryPath, "catalog/registry.json", errors);
  const entries = [];

  if (!isRecord(registry)) {
    return { errors, warnings, registry: null, entries, skillDir: SKILL_DIR, shellDir: join(SKILL_DIR, "catalog-shell") };
  }

  if (!/^\d+\.\d+\.\d+$/.test(registry.catalogVersion || "")) {
    errors.push("catalog/registry.json must include a semantic catalogVersion.");
  }
  if (!isRecord(registry.product) || !hasText(registry.product.name)) {
    errors.push("catalog/registry.json must include product.name.");
  } else if (!Array.isArray(registry.product.platforms) || registry.product.platforms.length === 0) {
    errors.push("catalog/registry.json product.platforms must be a non-empty array.");
  }
  if (!Array.isArray(registry.components) || registry.components.length === 0) {
    errors.push("catalog/registry.json components must be a non-empty array.");
  }

  const ids = new Set();
  const references = new Set();
  const relatedLinks = [];

  for (const entry of Array.isArray(registry.components) ? registry.components : []) {
    if (!isRecord(entry)) {
      errors.push("Each registry component must be an object.");
      continue;
    }
    const id = entry.id;
    if (!ID_PATTERN.test(id || "")) {
      errors.push(`Invalid component id '${id}'. Use lowercase kebab-case.`);
      continue;
    }
    if (ids.has(id)) errors.push(`Duplicate component id '${id}'.`);
    ids.add(id);

    const componentDir = `components/${id}`;
    const requiredFiles = [
      ["metadata", `${componentDir}/metadata.json`],
      ["source", `${componentDir}/component.tsx`],
      ["preview", `${componentDir}/preview.tsx`],
      ["notes", `${componentDir}/notes.md`],
    ];
    const resolvedFiles = {};
    for (const [key, expected] of requiredFiles) {
      if (entry[key] !== expected) {
        errors.push(`Component '${id}' must point ${key} to '${expected}'.`);
      }
      resolvedFiles[key] = await requireFile(entry[key], `component '${id}' ${key}`, errors);
    }

    for (const [key, suffix] of [["htmlExample", "index.html"], ["htmlStyles", "styles.css"], ["htmlScript", "app.js"]]) {
      if (entry[key] !== undefined) {
        const resolved = await requireFile(entry[key], `component '${id}' ${key}`, errors);
        resolvedFiles[key] = resolved;
        if (resolved && !resolved.endsWith(suffix)) {
          errors.push(`Component '${id}' ${key} must point to a ${suffix} file.`);
        }
      }
    }
    if (entry.htmlExample && !entry.htmlStyles) {
      errors.push(`Component '${id}' must list htmlStyles when it lists htmlExample.`);
    }

    const metadata = resolvedFiles.metadata
      ? await readJson(resolvedFiles.metadata, `component '${id}' metadata`, errors)
      : null;
    validateMetadata(metadata, id, entry.metadata, errors);

    if (metadata?.referenceCode) {
      if (references.has(metadata.referenceCode)) {
        errors.push(`Duplicate component referenceCode '${metadata.referenceCode}'.`);
      }
      references.add(metadata.referenceCode);
    }
    if (Array.isArray(metadata?.related)) relatedLinks.push([id, metadata.related]);

    entries.push({ id, entry, metadata, files: resolvedFiles });
  }

  for (const [id, related] of relatedLinks) {
    for (const relatedId of related) {
      if (!ids.has(relatedId)) errors.push(`Component '${id}' relates to unknown component '${relatedId}'.`);
    }
  }

  const shellDir = join(SKILL_DIR, "catalog-shell");
  for (const file of ["index.html", "styles.css", "catalog.js"]) {
    try {
      await access(join(shellDir, file), constants.R_OK);
    } catch {
      errors.push(`catalog-shell/${file} is missing or unreadable.`);
    }
  }

  return { errors, warnings, registry, entries, skillDir: SKILL_DIR, shellDir };
}

function isDirectExecution() {
  const invokedPath = process.argv[1];
  return invokedPath && pathToFileURL(resolve(invokedPath)).href === import.meta.url;
}

if (isDirectExecution()) {
  const result = await validateCatalog();
  for (const warning of result.warnings) console.warn(`[warning] ${warning}`);
  for (const error of result.errors) console.error(`[error] ${error}`);
  if (result.errors.length) {
    console.error(`Catalog validation failed with ${result.errors.length} error(s).`);
    process.exitCode = 1;
  } else {
    console.log(`Catalog valid: ${result.entries.length} component(s).`);
  }
}
