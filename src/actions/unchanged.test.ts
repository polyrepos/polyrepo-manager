import { expect, test } from "bun:test";
import * as fs from "node:fs";
import { testPath } from "../test-tools/before-all";
import { allDirs } from "../utils/workspaces";
import { changes } from "./changed";

test("only run git unchanged", async () => {
	await changes(allDirs, "touch test2.txt");
	expect(fs.existsSync(testPath("env", "test2.txt"))).toBe(false);
	expect(fs.existsSync(testPath("template-base", "test2.txt"))).toBe(false);
	fs.writeFileSync(testPath("env", "add-commit.txt"), "test2");
	await changes(allDirs, "touch unchanged.txt");
	expect(fs.existsSync(testPath("env", "unchanged.txt"))).toBe(false);
	expect(fs.existsSync(testPath("template-base", "unchanged.txt"))).toBe(true);
	fs.rmSync(testPath("env", "unchanged.txt"));
});
