import fs from "node:fs";

describe("G0-10 test traceability", () => {
  it("contains one entry for every locked requirement", () => {
    const entries = JSON.parse(fs.readFileSync("docs/test-traceability.json", "utf8"));
    expect(entries.map((entry: { id: string }) => entry.id)).toEqual(
      Array.from({ length: 12 }, (_, index) => `G0-${String(index + 1).padStart(2, "0")}`),
    );
    expect(entries.every((entry: { tests: string[] }) => entry.tests.length > 0)).toBe(true);
  });
});
