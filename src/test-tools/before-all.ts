import { beforeAll, beforeEach } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { config } from "dotenv";
import { clone } from "../actions/clone";
import { workspaceData } from "../utils/get-workspace-dir";

config();

export const testPath = (...args: string[]) =>
	path.resolve(
		process.env.TEST_WORKSPACE || process.cwd(),
		"test-temp",
		...args,
	);

beforeEach(() => {
	for (const file of ["a.text", "text2.txt", "changed.txt", "unchanged.txt"]) {
		try {
			fs.rmSync(testPath("env", file));
			fs.rmSync(testPath("template.base", file));
		} catch (_) {}
	}
});

beforeAll(async () => {
	workspaceData.workspaceDir = testPath("");
	fs.rmSync(testPath(""), { recursive: true, force: true });
	fs.mkdirSync(testPath(""), { recursive: true });
	fs.writeFileSync(
		testPath("", "polyrepo.config.json"),
		JSON.stringify(
			{
				repos: [
					"https://github.com/polyrepos/env",
					"https://github.com/polyrepos/template-base",
				],
			},
			null,
			2,
		),
	);
	fs.writeFileSync(
		testPath("", "polyrepo.config.json"),
		JSON.stringify(
			{
				repos: [
					"https://github.com/polyrepos/env",
					"https://github.com/polyrepos/template-base",
				],
			},
			null,
			2,
		),
	);
	await clone();
});
