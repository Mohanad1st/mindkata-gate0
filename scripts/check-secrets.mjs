import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const ignored = new Set([
  ".git",
  ".next",
  "node_modules",
  "playwright-report",
  "test-results",
  ".artifacts",
]);
const patterns = [
  { name: "private key", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: "GitHub token", regex: /gh[pousr]_[A-Za-z0-9_]{30,}/ },
  { name: "Anthropic key", regex: /sk-ant-[A-Za-z0-9_-]{20,}/ },
  { name: "OpenAI key", regex: /sk-(?:proj-)?[A-Za-z0-9_-]{30,}/ },
  { name: "Supabase service key assignment", regex: /SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^\s"']+/ },
];
const failures = [];

walk(root);

if (failures.length) {
  console.error("SECRET CHECK FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("SECRET CHECK PASSED — no high-risk credential pattern found.");

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(target);
      continue;
    }
    if (entry.name === "package-lock.json" || fs.statSync(target).size > 1_000_000) continue;
    const content = fs.readFileSync(target, "utf8");
    for (const pattern of patterns) {
      if (pattern.regex.test(content))
        failures.push(`${pattern.name}: ${path.relative(root, target)}`);
    }
  }
}
