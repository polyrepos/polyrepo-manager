import * as fs from "node:fs";
import * as path from "node:path";
import {
	getWorkspaceConfig,
	getWorkspaceDir,
} from "../utils/get-workspace-dir";
import { runCommandInDir } from "./run";

export async function clone() {
	const rootDir = getWorkspaceDir();
	const config = await getWorkspaceConfig();
	return Promise.all(
		config.repos.map(async (repo) => {
			const cleanUrl = repo.split("?")[0];
			const parts = cleanUrl.split("/");
			const name = parts[parts.length - 1];
			if (fs.existsSync(path.resolve(rootDir, name))) {
				console.log(`Repo ${name} already exists`);
				return;
			}
			await runCommandInDir(rootDir, `git clone --depth 1 ${repo}`);
		}),
	);
}
