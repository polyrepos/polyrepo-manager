import { expect, test } from "bun:test";
import * as fs from "node:fs";
import { testPath } from "../test-tools/before-all";
import { allDirs } from "../utils/workspaces";
import { changes } from "./changes";

test("only run git changes", async () => {
	fs.rmSync(testPath("env", "a.txt"));
	fs.rmSync(testPath("template-base", "a.txt"));
	await changes(allDirs, "touch test2.txt");
	expect(fs.existsSync(testPath("env", "test2.txt"))).toBe(false);
	expect(fs.existsSync(testPath("template-base", "test2.txt"))).toBe(false);
	fs.writeFileSync(testPath("env", "add-commit.txt"), "test2");
	await changes(allDirs, "touch change.txt");
	expect(fs.existsSync(testPath("env", "change.txt"))).toBe(true);
	expect(fs.existsSync(testPath("template-base", "change.txt"))).toBe(false);
});
