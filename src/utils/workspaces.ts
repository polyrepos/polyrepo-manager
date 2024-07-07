import * as fs from "node:fs";
import * as path from "node:path";
import { getWorkspaceConfig, getWorkspaceDir } from "./get-workspace-dir";

export interface WorkspaceItem {
	name: string;
	dir: string;
	repoName: string;
	packagePath: string;
}

function findFirstLevelDirs(): WorkspaceItem[] {
	const dirs: WorkspaceItem[] = [];
	const workspaceDir = getWorkspaceDir();
	const config = getWorkspaceConfig();
	const files: { dir: string; name: string }[] = [];
	for (const repo of config.repos) {
		const cleanUrl = repo.split("?")[0];
		const parts = cleanUrl.split("/");
		const name = parts[parts.length - 1];
		const theDir = path.resolve(workspaceDir, name);
		if (fs.existsSync(theDir)) {
			files.push({ dir: theDir, name });
		}
	}

	for (const theDir of files) {
		if (fs.lstatSync(theDir.dir).isSymbolicLink()) {
			continue;
		}
		if (
			fs.statSync(theDir.dir).isDirectory() &&
			fs.existsSync(path.join(theDir.dir, "package.json"))
		) {
			const packageJson = JSON.parse(
				fs.readFileSync(path.join(theDir.dir, "package.json")).toString(),
			);
			dirs.push({
				name: packageJson.name,
				dir: theDir.dir,
				repoName: theDir.name,
				packagePath: path.join(theDir.dir, "package.json"),
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
