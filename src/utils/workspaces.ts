import * as fs from "node:fs";
import * as path from "node:path";
import { fsReadJson } from "./get-package";
import { getWorkspaceConfig, getWorkspaceDir } from "./get-workspace-dir";
import { memoize } from "./memoize";

export interface WorkspaceItem {
	name: string;
	dir: string;
	repoName: string;
	homepage: string;
	packagePath: string;
}

function findFirstLevelDirs(): WorkspaceItem[] {
	const dirs: WorkspaceItem[] = [];
	const workspaceDir = getWorkspaceDir();
	const config = getWorkspaceConfig();
	const files: { dir: string; name: string; homepage: string }[] = [];
	for (const homepage of config.repos) {
		const cleanUrl = homepage.split("?")[0];
		const parts = cleanUrl.split("/");
		const name = parts[parts.length - 1];
		const theDir = path.resolve(workspaceDir, name);
		if (fs.existsSync(theDir)) {
			files.push({ dir: theDir, name, homepage });
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
			const packageJson = fsReadJson(path.join(theDir.dir, "package.json"));
			dirs.push({
				name: packageJson.name,
				dir: theDir.dir,
				repoName: theDir.name,
				homepage: theDir.homepage,
				packagePath: path.join(theDir.dir, "package.json"),
			});
		}
	}
	return dirs;
}
export const allDirs = memoize(() => findFirstLevelDirs());
export const dirToMap = memoize((dirs: WorkspaceItem[]) =>
	dirs.reduce(
		(acc, cur) => {
			acc[cur.name] = cur;
			return acc;
		},
		{} as Record<string, WorkspaceItem>,
	),
);
