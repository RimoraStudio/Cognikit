#!/usr/bin/env node
// Cognikit skill validator. Replaces the shell+yq pipeline so it runs
// identically locally and in CI with only Node installed.
// Usage: node scripts/validate.mjs

import { readdirSync, existsSync, readFileSync, statSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SKILLS_DIR = join(ROOT, "skills");

let failed = false;
let warnings = 0;

const error = (file, msg) => {
  console.log(`::error file=${file}::${msg}`);
  failed = true;
};
const warn = (file, msg) => {
  console.log(`::warning file=${file}::${msg}`);
  warnings++;
};
const ok = (msg) => console.log(`  [OK] ${msg}`);

// --- frontmatter parsing -------------------------------------------------

// Extract the block between the first and second --- lines.
// Tolerates CRLF endings from Windows contributors.
function frontmatterOf(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0].trim() !== "---") return null;
  const end = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
  if (end === -1) return null;
  return lines.slice(1, end).join("\n");
}

// Minimal scalar reader: matches `key: value` at column 0 or `key:` alone.
function field(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return m ? m[1].trim() : "";
}

function metadataVersion(fm) {
  const m = fm.match(/^metadata:\s*\n((?:[ \t]+\S.*\n?)+)/m);
  if (!m) return "";
  const v = m[1].match(/^[ \t]+version:\s*(.+)$/m);
  return v ? v[1].trim() : "";
}

// --- validation ----------------------------------------------------------

if (!existsSync(SKILLS_DIR)) {
  console.log("::error::No skills/ directory found");
  process.exit(1);
}

const skillDirs = readdirSync(SKILLS_DIR)
  .map((d) => join(SKILLS_DIR, d))
  .filter((p) => statSync(p).isDirectory())
  .sort();

if (skillDirs.length === 0) {
  console.log("::error::No skill directories found under skills/");
  process.exit(1);
}

const EM_DASH = /\u2014|\u2013/;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;
const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

for (const dir of skillDirs) {
  const name = basename(dir);
  const mdPath = join(dir, "SKILL.md");
  const readmePath = join(dir, "README.md");
  console.log(`\n==============================================`);
  console.log(`Validating: ${name}`);
  console.log(`==============================================`);

  if (!existsSync(readmePath)) {
    error(readmePath, `README.md not found in ${dir}`);
  } else {
    const readme = readFileSync(readmePath, "utf8");
    const requiredSections = [
      [/^#\s+.+/m, "a title"],
      [/^##\s+(when to use|use it for)\b/im, "a use-case section"],
      [/^##\s+(install|how to use)\b/im, "install or invocation instructions"],
      [/^##\s+package contents\b/im, "a package contents section"],
    ];
    for (const [pattern, label] of requiredSections) {
      if (!pattern.test(readme)) error(readmePath, `README.md must include ${label}`);
    }
    if (requiredSections.every(([pattern]) => pattern.test(readme))) {
      ok("README.md has a title, usage, install, and package contents");
    }
  }

  if (!existsSync(mdPath)) {
    error(mdPath, `SKILL.md not found in ${dir}`);
    continue;
  }

  const text = readFileSync(mdPath, "utf8");
  const fm = frontmatterOf(text);

  if (fm === null || fm.trim() === "") {
    error(mdPath, "No YAML frontmatter found in SKILL.md");
    continue;
  }

  let missing = false;
  for (const key of ["name", "description", "license"]) {
    if (!field(fm, key)) {
      error(mdPath, `Missing required field: ${key}`);
      missing = true;
    }
  }
  if (!metadataVersion(fm)) {
    error(mdPath, "Missing required field: metadata.version");
    missing = true;
  }

  // No disallowed top-level keys (official spec + Cognikit's metadata use)
  const allowed = new Set(["name", "description", "license", "compatibility", "metadata", "allowed-tools"]);
  for (const line of fm.split("\n")) {
    const m = line.match(/^([a-z][a-z0-9_-]*):/);
    if (m && !allowed.has(m[1])) {
      error(mdPath, `Unexpected top-level frontmatter key: ${m[1]} (move it under metadata:)`);
      missing = true;
    }
  }
  if (missing) continue;

  const fmName = field(fm, "name");
  if (!KEBAB.test(fmName)) {
    error(mdPath, `Skill name '${fmName}' must be kebab-case`);
  } else {
    ok(`name: ${fmName}`);
  }

  // Referenced files must exist
  const refs = [...text.matchAll(/references\/[A-Za-z0-9._/-]+/g)]
    .map((m) => m[0].replace(/[.,;:)]+$/, ""))
    .filter((v, i, a) => a.indexOf(v) === i);
  if (refs.length === 0) {
    console.log("  [INFO] No reference files mentioned in SKILL.md");
  }
  for (const ref of refs) {
    if (!existsSync(join(dir, ref))) {
      error(mdPath, `Referenced file '${ref}' not found at ${dir}/${ref}`);
    } else {
      ok(`reference exists: ${ref}`);
    }
  }

  // Size limit: warn over 50KB
  const size = statSync(mdPath).size;
  if (size > 51200) {
    warn(mdPath, `SKILL.md is ${size} bytes (over 50KB). Consider splitting into references/`);
  } else {
    ok(`SKILL.md size: ${size} bytes`);
  }

  // Em dash and emoji checks (warn only) on SKILL.md + references
  const checkFiles = [mdPath];
  const refsDir = join(dir, "references");
  if (existsSync(refsDir)) {
    for (const f of readdirSync(refsDir)) {
      if (f.endsWith(".md")) checkFiles.push(join(refsDir, f));
    }
  }
  for (const f of checkFiles) {
    const content = readFileSync(f, "utf8");
    const dashes = content.split("").filter((c) => EM_DASH.test(c)).length;
    if (dashes > 0) warn(f, `Found ${dashes} em/en dash(es). Use periods, commas, or line breaks instead.`);
    const emojis = content.split("").filter((c) => EMOJI.test(c)).length;
    if (emojis > 0) warn(f, `Found ${emojis} potential emoji(s). Avoid emojis in skill content.`);
  }

  console.log(`  [DONE] ${name} validation complete`);
}

// --- registry.json ---------------------------------------------------------

console.log(`\n==============================================`);
console.log("Validating registry.json");
console.log(`==============================================`);

const regPath = join(ROOT, "registry.json");
if (!existsSync(regPath)) {
  warn("registry.json", "registry.json not found at repo root");
} else {
  let registry;
  try {
    registry = JSON.parse(readFileSync(regPath, "utf8"));
    ok("registry.json is valid JSON");
  } catch {
    error("registry.json", "registry.json is not valid JSON");
  }

  if (registry) {
    const names = (registry.skills || []).map((s) => s.name || s.id).filter(Boolean);
    for (const regName of names) {
      const short = regName.replace(/^cognikit\//, "");
      if (existsSync(join(SKILLS_DIR, short))) {
        ok(`registry skill '${regName}' exists at skills/${short}`);
      } else {
        error("registry.json", `Skill '${regName}' listed in registry.json but skills/${short} not found`);
      }
    }

    // every related link must point to a registered skill
    const nameSet = new Set(names.map((n) => n.replace(/^cognikit\//, "")));
    for (const s of registry.skills || []) {
      for (const rel of s.related || []) {
        if (!nameSet.has(rel)) {
          warn("registry.json", `'${s.name}' has a related link to unregistered skill '${rel}'`);
        }
      }
    }

    // Active specialist skills need representative evals. Routers and deprecated aliases are exempt.
    for (const s of registry.skills || []) {
      const evalsPath = join(SKILLS_DIR, s.name, "evals", "evals.json");
      const requiresEvals = !s.deprecated && s.category !== "meta";
      if (!existsSync(evalsPath)) {
        if (requiresEvals) error(evalsPath, `Active specialist '${s.name}' must include evals/evals.json`);
        continue;
      }

      let data;
      try {
        data = JSON.parse(readFileSync(evalsPath, "utf8"));
      } catch {
        error(evalsPath, "evals/evals.json is not valid JSON");
        continue;
      }

      if (data.skill_name !== s.name) {
        error(evalsPath, `skill_name must match '${s.name}'`);
      }
      if (!Array.isArray(data.evals) || data.evals.length === 0) {
        error(evalsPath, "evals must be a non-empty array");
        continue;
      }

      const ids = new Set();
      data.evals.forEach((item, index) => {
        const label = `eval ${index + 1}`;
        if (item.id === undefined || ids.has(item.id)) {
          error(evalsPath, `${label} must have a unique id`);
        } else {
          ids.add(item.id);
        }
        if (typeof item.prompt !== "string" || !item.prompt.trim()) {
          error(evalsPath, `${label} must include a prompt`);
        }
        if (typeof item.expected_output !== "string" || !item.expected_output.trim()) {
          error(evalsPath, `${label} must include expected_output`);
        }
        if (!Array.isArray(item.files)) {
          error(evalsPath, `${label} files must be an array`);
        }
      });
      ok(`evals: ${data.evals.length} prompt(s)`);
    }
  }
}

console.log(`\n==============================================`);
console.log("Validation Summary");
console.log(`==============================================`);
console.log(`Warnings: ${warnings}`);
if (failed) {
  console.log("::error::Validation failed with errors above");
  process.exit(1);
}
console.log("All validations passed.");
