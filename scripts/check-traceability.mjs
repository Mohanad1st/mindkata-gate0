import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const entries = JSON.parse(fs.readFileSync(path.join(root, "docs/test-traceability.json"), "utf8"));
const failures = [];

for (const entry of entries) {
  if (!entry.id || !entry.requirement || !Array.isArray(entry.tests) || entry.tests.length === 0) {
    failures.push(`Malformed traceability entry: ${JSON.stringify(entry)}`);
    continue;
  }
  for (const testPath of entry.tests) {
    const absolute = path.join(root, testPath);
    if (!fs.existsSync(absolute)) {
      failures.push(`${entry.id} references missing test ${testPath}`);
      continue;
    }
    if (!fs.readFileSync(absolute, "utf8").includes(entry.id)) {
      failures.push(`${testPath} does not cite ${entry.id}`);
    }
  }
}

if (failures.length) {
  console.error("TRACEABILITY CHECK FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(
  `TRACEABILITY CHECK PASSED — ${entries.length} locked requirements are mapped to tests.`,
);
