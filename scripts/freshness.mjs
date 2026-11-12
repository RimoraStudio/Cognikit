#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const ledgerPath = join(root, "skill-freshness.json");
const skillsDir = join(root, "skills");
const today = new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`);
const fail = (message) => { console.error(`::error::${message}`); process.exit(1); };
if (!existsSync(ledgerPath)) fail("skill-freshness.json is missing");

let ledger;
try { ledger = JSON.parse(readFileSync(ledgerPath, "utf8")); }
catch { fail("skill-freshness.json is not valid JSON"); }
if (ledger.schema_version !== 1 || !ledger.skills || typeof ledger.skills !== "object") {
  fail("Unsupported freshness ledger schema");
}

const actual = readdirSync(skillsDir).filter((name) => statSync(join(skillsDir, name)).isDirectory());
const expected = Object.keys(ledger.skills);
let pending = 0;
let overdue = 0;
let invalid = false;
for (const name of actual) {
  const record = ledger.skills[name];
  if (!record) { console.error(`::error::${name} is missing from the freshness ledger`); invalid = true; continue; }
  const { risk, interval_days: interval, reviewed_on: reviewed } = record;
  if (!new Set(["low", "medium", "high"]).has(risk) || !Number.isInteger(interval) || interval < 1) {
    console.error(`::error::${name} has invalid risk or interval_days`); invalid = true; continue;
  }
  if (reviewed === null) {
    pending++;
    console.log(`::warning::${name} has no recorded content review`);
    continue;
  }
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(reviewed)
    ? new Date(`${reviewed}T00:00:00Z`)
    : new Date(Number.NaN);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== reviewed) {
    console.error(`::error::${name} has invalid reviewed_on date`); invalid = true; continue;
  }
  const elapsed = Math.floor((today - parsed) / 86400000);
  if (elapsed < 0) { console.error(`::error::${name} reviewed_on is in the future`); invalid = true; continue; }
  if (elapsed > interval) {
    overdue++;
    console.log(`::warning::${name} review overdue by ${elapsed - interval} day(s) (reviewed ${reviewed}, interval ${interval})`);
  } else {
    console.log(`::notice::${name} reviewed ${elapsed} day(s) ago; next review in ${interval - elapsed} day(s)`);
  }
}
for (const name of expected) if (!actual.includes(name)) {
  console.error(`::error::Ledger entry '${name}' has no skills/${name} directory`); invalid = true;
}
console.log(`Freshness summary: ${actual.length} skill(s), ${pending} pending, ${overdue} overdue.`);
if (invalid) process.exit(1);
