import { beforeAll } from "bun:test";
import { config } from "dotenv";
import * as fs from "node:fs";
import * as path from "node:path";
import { clone } from "../actions/clone";
import { runCommandInDir } from "../actions/run";
import { workspaceData } from "../utils/get-workspace-dir";

config();

export const testPath = (...args: string[]) =>
	path.resolve(process.cwd(), "test-temp", ...args);

beforeAll(async () => {
	workspaceData.workspaceDir = testPath("");
	fs.rmSync(testPath(""), { recursive: true, force: true });
	fs.mkdirSync(testPath(""), { recursive: true });
	for (const repo of ["env", "env2", "template-base"]) {
		fs.mkdirSync(testPath(repo, "src"), { recursive: true });
		fs.cpSync(
			path.resolve(process.cwd(), "src", "test-tools", "mock", repo),
			testPath(repo),
			{ recursive: true },
		);
		// fs.renameSync(testPath(repo, "-git"), testPath(repo, ".git"));
		await runCommandInDir(
			testPath(repo),
			"git init && git add . && git commit -m init",
		);
	}

	fs.writeFileSync(
		testPath("", "polyrepo.config.json"),
		JSON.stringify(
			{
				repos: [
					"https://github.com/polyrepos/env",
					"https://github.com/polyrepos/env2.git",
					"https://github.com/polyrepos/template-base",
				],
			},
			null,
			2,
		),
	);
	await clone();
});
