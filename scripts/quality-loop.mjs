import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const profile =
  process.argv.find((argument) => argument.startsWith("--profile="))?.split("=")[1] ?? "full";
const allowedProfiles = new Set(["fast", "full"]);
if (!allowedProfiles.has(profile)) {
  console.error(`Unknown quality-loop profile: ${profile}`);
  process.exit(2);
}

const fastStages = [
  ["Scope lock", "npm", ["run", "scope:check"]],
  ["Secret scan", "npm", ["run", "secrets:check"]],
  ["Traceability", "npm", ["run", "traceability:check"]],
  ["Formatting", "npm", ["run", "format:check"]],
  ["Lint", "npm", ["run", "lint"]],
  ["Type check", "npm", ["run", "typecheck"]],
  ["Unit and integration", "npm", ["run", "test"]],
];
const stages =
  profile === "full"
    ? [
        ...fastStages,
        ["Production build", "npm", ["run", "build"]],
        ["Browser and accessibility E2E", "npm", ["run", "test:e2e"]],
        ["Runtime dependency audit", "npm", ["run", "security:deps"]],
      ]
    : fastStages;

// On Windows `npm` is `npm.cmd`, which Node refuses to spawn without a shell. Pass the
// stage as one pre-joined string rather than command + args, because combining an args
// array with `shell: true` is deprecated (DEP0190). Every stage above is a hardcoded
// literal, so nothing external reaches the shell. POSIX keeps the unshelled path.
const onWindows = process.platform === "win32";
const runStage = (command, args) =>
  onWindows
    ? spawnSync([command, ...args].join(" "), { cwd: process.cwd(), stdio: "inherit", shell: true })
    : spawnSync(command, args, { cwd: process.cwd(), stdio: "inherit", shell: false });

const startedAt = new Date();
const results = [];
console.log(`\nMindKata bounded quality loop — ${profile} profile\n`);

for (const [label, command, args] of stages) {
  console.log(`\n▶ ${label}`);
  const result = runStage(command, args);
  const passed = result.status === 0;
  results.push({ label, passed, exitCode: result.status });
  if (!passed) break;
}

const report = {
  profile,
  startedAt: startedAt.toISOString(),
  finishedAt: new Date().toISOString(),
  passed: results.length === stages.length && results.every((result) => result.passed),
  stages: results,
  nextAction:
    "If failed, diagnose the first failed stage, make the smallest in-scope repair, and run the loop again. Stop after five failed repair cycles or on a protected decision.",
};
const artifactDirectory = path.join(process.cwd(), ".artifacts", "quality-loop");
fs.mkdirSync(artifactDirectory, { recursive: true });
fs.writeFileSync(
  path.join(artifactDirectory, "latest.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

if (!report.passed) {
  console.error("\nQUALITY LOOP FAILED — repair the first failing stage, then rerun.\n");
  process.exit(1);
}
console.log("\nQUALITY LOOP PASSED — evidence recorded in .artifacts/quality-loop/latest.json.\n");
