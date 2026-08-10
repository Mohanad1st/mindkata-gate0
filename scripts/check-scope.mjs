import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const lock = JSON.parse(fs.readFileSync(path.join(root, "config/scope-lock.json"), "utf8"));
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const failures = [];

for (const prohibited of lock.prohibitedPaths) {
  if (fs.existsSync(path.join(root, prohibited)))
    failures.push(`Prohibited Gate 0 path exists: ${prohibited}`);
}

const runtimeDependencies = Object.keys(pkg.dependencies ?? {}).sort();
const allowedDependencies = [...lock.allowedRuntimeDependencies].sort();
if (JSON.stringify(runtimeDependencies) !== JSON.stringify(allowedDependencies)) {
  failures.push(
    `Runtime dependencies differ from the scope lock. Expected ${allowedDependencies.join(", ")}; found ${runtimeDependencies.join(", ")}.`,
  );
}

const sourceRoots = ["app", "components", "content", "lib"];
const sourceFiles = [];
for (const sourceRoot of sourceRoots) walk(path.join(root, sourceRoot), sourceFiles);

for (const file of sourceFiles.filter((candidate) => /\.(ts|tsx|js|mjs)$/.test(candidate))) {
  const content = fs.readFileSync(file, "utf8").toLowerCase();
  for (const pattern of lock.prohibitedSourcePatterns) {
    if (content.includes(pattern.toLowerCase())) {
      failures.push(
        `Prohibited Gate 0 integration pattern "${pattern}" in ${path.relative(root, file)}`,
      );
    }
  }
}

const scenarioSource = fs.readFileSync(path.join(root, "content/scenarios/index.ts"), "utf8");
for (const mission of lock.approvedMissions) {
  if (!scenarioSource.includes(`id: "${mission}"`))
    failures.push(`Approved mission ${mission} is missing.`);
}
if (/id:\s*"[3-9]/.test(scenarioSource))
  failures.push("An unapproved mission identifier is present.");

if (failures.length) {
  console.error("SCOPE CHECK FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("SCOPE CHECK PASSED — Gate 0 boundaries are intact.");

function walk(directory, results) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target, results);
    else results.push(target);
  }
}
