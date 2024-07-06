import * as fs from "node:fs";
import * as path from "node:path";
import { getWorkspaceConfig, getWorkspaceDir } from "./get-workspace-dir";

export interface WorkspaceItem {
	name: string;
	dir: string;
	packagePath: string;
}

function findFirstLevelDirs(): WorkspaceItem[] {
	const dirs: WorkspaceItem[] = [];
	const workspaceDir = getWorkspaceDir();
	const config = getWorkspaceConfig();
	const files: string[] = [];
	for (const repo of config.repos) {
		const cleanUrl = repo.split("?")[0];
		// 分割路径并获取最后一部分
		const parts = cleanUrl.split("/");
		const theDir = path.resolve(workspaceDir, parts[parts.length - 1]);
		if (fs.existsSync(theDir)) {
			files.push(theDir);
		}
	}

	for (const theDir of files) {
		if (fs.lstatSync(theDir).isSymbolicLink()) {
			continue;
		}
		if (
			fs.statSync(theDir).isDirectory() &&
			fs.existsSync(path.join(theDir, "package.json"))
		) {
			const packageJson = JSON.parse(
				fs.readFileSync(path.join(theDir, "package.json")).toString(),
			);
			dirs.push({
				name: packageJson.name,
				dir: theDir,
				packagePath: path.join(theDir, "package.json"),
			});
		}
	}
	return dirs;
}
export const allDirs = findFirstLevelDirs();
export const allDirsMap = allDirs.reduce(
	(acc, cur) => {
		acc[cur.name] = cur;
		return acc;
	},
	{} as Record<string, WorkspaceItem>,
);
