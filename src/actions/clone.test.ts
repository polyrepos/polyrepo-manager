import { expect, test } from "bun:test";
import * as fs from "node:fs";
import { testPath } from "../test-tools/before-all";

test("clone", async () => {
	for (const dir of ["env", "template-bun"]) {
		expect(fs.existsSync(testPath(dir))).toBe(true);
	}
});
