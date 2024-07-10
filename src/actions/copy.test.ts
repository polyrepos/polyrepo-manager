import { describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import { testPath } from "../test-tools/before-all";
import { fsReadJson } from "../utils/fs-read-json";
import { allDirs } from "../utils/workspaces";
import { copy } from "./copy";

describe("copy", async () => {
	test("check poly copy", async () => {
		const pkg = await fsReadJson(testPath("env", "package.json"));
		expect(pkg.polyCopy).toBeTruthy();
	});
	test("run copy", async () => {
		fs.rmSync(testPath("env2", ".gitignore"), { recursive: true, force: true });
		expect(fs.existsSync(testPath("env2", ".gitignore"))).toBe(false);
		await copy(await allDirs());
		expect(fs.existsSync(testPath("env2", ".gitignore"))).toBe(true);
	});
});
