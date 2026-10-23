import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.tsx"],
    // The Mission 1 integration spec drives ~145 characters through userEvent, which awaits
    // a macrotask per keystroke: measured 3.4-3.6s on a quiet run, against ~0.1s for the axe
    // scan. The tail is much longer under load - 10.2s in eight consecutive runs on a Windows
    // ARM64 laptop - so the 5s default failed about 1 run in 4 while passing in isolation. A
    // slower or more contended CI runner would flake the same way. Nothing here is asserted
    // on time; this only sets how long a test may take before being killed.
    testTimeout: 30_000,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
