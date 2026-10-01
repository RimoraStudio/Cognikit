import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

export interface SkillEntry {
  name: string;
  deprecated?: boolean;
  replacement?: string[];
  displayName: string;
  description: string;
  version: string;
  license: string;
  category: string;
  tags: string[];
  install: string;
  githubUrl: string;
  docs: string;
  related: string[];
  references: string[];
  skillBody: string;
  skillFrontmatter: Record<string, string>;
}

export interface Bundle {
  name: string;
  displayName: string;
  description: string;
  install: string;
  skills: string[];
}

export interface Registry {
  name: string;
  tagline: string;
  installAll: string;
  bundles: Bundle[];
  skills: SkillEntry[];
}

function parseFrontmatter(text: string): Record<string, string> {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out: Record<string, string> = {};
  let key = "";
  for (const line of m[1].split(/\r?\n/)) {
    const top = line.match(/^([a-z][a-z0-9_-]*):\s*(.*)$/);
    if (top) {
      key = top[1];
      out[key] = top[2].trim();
    }
  }
  return out;
}

function stripFrontmatter(text: string): string {
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

export function loadRegistry(): Registry {
  const raw = readFileSync(join(REPO_ROOT, "registry.json"), "utf8");
  const registry = JSON.parse(raw) as Registry;
  for (const skill of registry.skills) {
    const mdPath = join(REPO_ROOT, "skills", skill.name, "SKILL.md");
    if (existsSync(mdPath)) {
      const text = readFileSync(mdPath, "utf8");
      skill.skillBody = stripFrontmatter(text);
      skill.skillFrontmatter = parseFrontmatter(text);
    } else {
      skill.skillBody = "";
      skill.skillFrontmatter = {};
    }
  }
  return registry;
}

export function evalCount(skillName: string): number {
  const evalsPath = join(REPO_ROOT, "skills", skillName, "evals", "evals.json");
  if (!existsSync(evalsPath)) return 0;
  try {
    const data = JSON.parse(readFileSync(evalsPath, "utf8"));
    return Array.isArray(data.evals) ? data.evals.length : 0;
  } catch {
    return 0;
  }
}
