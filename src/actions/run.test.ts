import { expect, test } from "bun:test";
import * as fs from "node:fs";
import { testPath } from "../test-tools/before-all";
import { allDirs, allDirsMap } from "../utils/workspaces";
import { run } from "./run";

test("run", async () => {
	await run(allDirs, "touch a.txt");
	expect(fs.existsSync(testPath("env", "a.txt"))).toBe(true);
	expect(fs.existsSync(testPath("template-base", "a.txt"))).toBe(true);
	fs.rmSync(testPath("env", "a.txt"));
	fs.rmSync(testPath("template-base", "a.txt"));
});
