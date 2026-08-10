import fs from "node:fs";

describe("G0-09 scope lock", () => {
  it("allows only the approved minimal runtime dependencies", () => {
    const scope = JSON.parse(fs.readFileSync("config/scope-lock.json", "utf8"));
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    expect(Object.keys(pkg.dependencies).sort()).toEqual(
      [...scope.allowedRuntimeDependencies].sort(),
    );
    expect(scope.approvedMissions).toEqual(["1", "2"]);
  });
});
