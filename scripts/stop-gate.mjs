import { spawnSync } from "node:child_process";

// On Windows `npm` is `npm.cmd`, which Node refuses to spawn without a shell. The command
// is passed as one string because pairing an args array with `shell: true` is deprecated
// (DEP0190); it is a hardcoded literal, so nothing external reaches the shell.
const result =
  process.platform === "win32"
    ? spawnSync("npm run qa:fast", { stdio: "inherit", shell: true })
    : spawnSync("npm", ["run", "qa:fast"], { stdio: "inherit", shell: false });
if (result.status !== 0) {
  console.error(
    "Claude may not stop: the fast quality loop is failing. Repair the first failure and rerun.",
  );
  process.exit(2);
}
