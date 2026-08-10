import { spawnSync } from "node:child_process";

const result = spawnSync("npm", ["run", "qa:fast"], { stdio: "inherit", shell: false });
if (result.status !== 0) {
  console.error(
    "Claude may not stop: the fast quality loop is failing. Repair the first failure and rerun.",
  );
  process.exit(2);
}
