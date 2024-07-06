import { describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import { testPath } from "../test-tools/before-all";
import { copy } from "./copy";

describe("copy", () => {
	test("check poly copy", () => {
		const pkg = JSON.parse(
			fs.readFileSync(testPath("env", "package.json")).toString(),
		);
		expect(pkg.polyCopy).toBeTruthy();
	});
	test("run copy", async () => {
		fs.rmSync(testPath("env", ".gitignore"), { recursive: true, force: true });
		expect(fs.existsSync(testPath("env", ".gitignore"))).toBe(false);
		copy();
		expect(fs.existsSync(testPath("env", ".gitignore"))).toBe(true);
	});
});
