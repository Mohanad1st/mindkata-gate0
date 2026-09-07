import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { parseReceipt, summarize, type Receipt } from "../lib/receipt-summary.ts";

const directory = process.argv[2];
if (directory === undefined) {
  console.error("Usage: node scripts/aggregate-receipts.ts <directory-of-exported-receipts>");
  process.exit(2);
}

const resolved = path.resolve(process.cwd(), directory);
if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
  console.error(`Not a directory: ${resolved}`);
  process.exit(2);
}

const files = fs
  .readdirSync(resolved)
  .filter((entry) => entry.toLowerCase().endsWith(".json"))
  .sort();

const receipts: Receipt[] = [];
const rejected: { file: string; reason: string }[] = [];

for (const file of files) {
  const absolute = path.join(resolved, file);
  let raw: unknown;
  try {
    // Strip a leading byte-order mark. A browser export never has one, but a receipt re-saved
    // through a Windows editor or spreadsheet often does, and JSON.parse rejects it outright.
    raw = JSON.parse(fs.readFileSync(absolute, "utf8").replace(/^﻿/, ""));
  } catch {
    rejected.push({ file, reason: "not valid JSON" });
    continue;
  }
  const result = parseReceipt(raw);
  if (result.ok) receipts.push(result.receipt);
  else rejected.push({ file, reason: result.reason });
}

function formatMinutes(value: number | null): string {
  return value === null ? "n/a" : `${value.toFixed(1)} min`;
}

console.log(`\nGate 0 receipt summary — ${resolved}`);
console.log(
  `Files scanned: ${files.length}   accepted: ${receipts.length}   rejected: ${rejected.length}\n`,
);

for (const summary of summarize(receipts)) {
  console.log(`Mission ${summary.missionId}`);
  console.log(`  receipt files:        ${summary.receipts}`);
  console.log(`  participants:         ${summary.sessionCodes}`);
  if (summary.duplicatesCollapsed > 0) {
    console.log(`  duplicates collapsed: ${summary.duplicatesCollapsed}`);
  }
  console.log(`  started:              ${summary.started}`);
  console.log(`  completed:            ${summary.completed}`);
  console.log(`  median page-open:     ${formatMinutes(summary.medianCompletionMinutes)}`);
  console.log(`  median task time:     ${formatMinutes(summary.medianTaskMinutes)}`);
  if (summary.medianCompletionMinutes !== null && summary.medianTaskMinutes !== null) {
    console.log(
      `  of which reading:     ${formatMinutes(summary.medianCompletionMinutes - summary.medianTaskMinutes)}`,
    );
  }
  console.log("");
}

if (rejected.length > 0) {
  console.log("Rejected files (excluded from every count above):");
  for (const entry of rejected) console.log(`  ${entry.file} — ${entry.reason}`);
  console.log("");
}

console.log("Read before using these numbers:");
console.log(
  "  - These are operational counts only. Nothing here is compared against a Gate 0A threshold,",
);
console.log("    and no GO / PIVOT / STOP verdict is produced. Apply docs/scope-lock.md yourself.");
console.log(
  "  - Mission 1 and Mission 2 receipts carry DIFFERENT anonymous session codes, because a code",
);
console.log(
  "    is generated per mission record. Two receipts cannot be linked to one participant from",
);
console.log(
  "    these files alone, so the per-user Mission 2 continuation rate must come from facilitator",
);
console.log("    observation, not from this output.");
console.log(
  "  - 'completed' counts a recorded completion event; it does not mean completed without",
);
console.log("    facilitator rescue. Rescue is an observed measure.");
console.log("  - TWO medians are reported and they measure different things (ADR 0010):");
console.log(
  "    page-open = mission page mount to completion. Includes time spent reading the brief, and",
);
console.log(
  "                any idle time: session storage survives a reload, so a paused session keeps",
);
console.log("                counting.");
console.log(
  "    task time = first answer changed to completion. This is the interval the Kit's \"timing",
);
console.log(
  '                begins and ends at defined events" requirement describes. Null for receipts',
);
console.log("                exported before ADR 0010.");
console.log(
  "    WHICH of the two the Gate 0A 12-minute median is scored on is a founder decision, and it",
);
console.log(
  "    must be settled BEFORE the first participant runs. 04_Gate_0A_Scorecard.md forbids",
);
console.log(
  "    lowering a threshold after observing results, and picking the measurement definition once",
);
console.log(
  "    the numbers exist is the same thing. Compare both against the facilitator's observed",
);
console.log("    timings either way.\n");

if (files.length === 0) {
  console.error("No .json files found — nothing was aggregated.");
  process.exit(1);
}
if (receipts.length === 0) {
  console.error("Every file was rejected — the counts above are all zero for that reason.");
  process.exit(1);
}
