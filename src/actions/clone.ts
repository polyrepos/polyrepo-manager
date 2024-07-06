import * as fs from "node:fs";
import * as path from "node:path";
import {
	getWorkspaceConfig,
	getWorkspaceDir,
} from "../utils/get-workspace-dir";
import { runCommandInDir } from "./run";

export async function clone() {
	const rootDir = getWorkspaceDir();
	const config = getWorkspaceConfig();
	for (const repo of config.repos) {
		const cleanUrl = repo.split("?")[0];
		// 分割路径并获取最后一部分
		const parts = cleanUrl.split("/");
		if (fs.existsSync(path.resolve(rootDir, parts[parts.length - 1]))) {
			console.log(`Repo ${parts[parts.length - 1]} already exists`);
			continue;
		}
		await runCommandInDir(rootDir, `git clone ${repo}`);
	}
}
