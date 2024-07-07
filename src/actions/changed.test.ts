import { expect, test } from "bun:test";
import * as fs from "node:fs";
import { testPath } from "../test-tools/before-all";
import { allDirs } from "../utils/workspaces";
import { changes } from "./changed";

test("only run git changed", async () => {
	await changes(allDirs, "touch test2.txt");
	expect(fs.existsSync(testPath("env", "test2.txt"))).toBe(false);
	expect(fs.existsSync(testPath("template-base", "test2.txt"))).toBe(false);
	fs.writeFileSync(testPath("env", "add-commit.txt"), "test2");
	await changes(allDirs, "touch changed.txt");
	expect(fs.existsSync(testPath("env", "changed.txt"))).toBe(true);
	expect(fs.existsSync(testPath("template-base", "changed.txt"))).toBe(false);
	fs.rmSync(testPath("env", "changed.txt"));
});
