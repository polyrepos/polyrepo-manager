import { beforeEach, describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import { testPath } from "../test-tools/before-all";
import { allDirs } from "../utils/workspaces";
import { changed } from "./changed";
import { unChanged } from "./unchanged";

beforeEach(() => {
	for (const file of [
		"a.text",
		"b.txt",
		"changed.txt",
		"unchanged.txt",
		"add-commit.txt",
	]) {
		for (const repo of ["env", "template-base"]) {
			if (fs.existsSync(testPath(repo, file))) {
				fs.rmSync(testPath(repo, file));
			}
		}
	}
});

describe("changed and unchanged", async () => {
	const dirs = await allDirs();
	await test("only run git changed", async () => {
		await changed(dirs, "touch b.txt");
		expect(fs.existsSync(testPath("env", "b.txt"))).toBe(false);
		expect(fs.existsSync(testPath("template-base", "b.txt"))).toBe(false);
		fs.writeFileSync(testPath("env", "add-commit.txt"), "test2");
		await changed(dirs, "touch changed.txt");
		expect(fs.existsSync(testPath("env", "changed.txt"))).toBe(true);
		expect(fs.existsSync(testPath("template-base", "changed.txt"))).toBe(false);
	});
	await test("only run git unchanged", async () => {
		await unChanged(dirs, "touch b.txt");
		expect(fs.existsSync(testPath("env", "b.txt"))).toBe(true);
		expect(fs.existsSync(testPath("template-base", "b.txt"))).toBe(true);
		fs.rmSync(testPath("env", "b.txt"));
		fs.rmSync(testPath("template-base", "b.txt"));
		fs.writeFileSync(testPath("env", "add-commit.txt"), "test2");
		await unChanged(dirs, "touch unchanged.txt");
		expect(fs.existsSync(testPath("env", "unchanged.txt"))).toBe(false);
		expect(fs.existsSync(testPath("template-base", "unchanged.txt"))).toBe(
			true,
		);
	});
});
