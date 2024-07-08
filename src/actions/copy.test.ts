import { describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import { testPath } from "../test-tools/before-all";
import { fsReadJson } from "../utils/get-package";
import { allDirs } from "../utils/workspaces";
import { copy } from "./copy";

describe("copy", () => {
	test("check poly copy", () => {
		const pkg = fsReadJson(testPath("env", "package.json"));
		expect(pkg.polyCopy).toBeTruthy();
	});
	test("run copy", async () => {
		fs.rmSync(testPath("env", ".gitignore"), { recursive: true, force: true });
		expect(fs.existsSync(testPath("env", ".gitignore"))).toBe(false);
		copy(allDirs());
		expect(fs.existsSync(testPath("env", ".gitignore"))).toBe(true);
	});
});
