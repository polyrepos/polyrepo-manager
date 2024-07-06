import { beforeAll } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { clone } from "../actions/clone";
import { workspaceData } from "../utils/get-workspace-dir";

export const testPath = (...args: string[]) =>
	path.resolve(process.cwd(), "test-temp", ...args);

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
					"https://github.com/polyrepos/template-bun",
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
					"https://github.com/polyrepos/template-bun",
				],
			},
			null,
			2,
		),
	);
	await clone();
});
