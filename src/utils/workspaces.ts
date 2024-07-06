import * as fs from "node:fs";
import * as path from "node:path";
import { getWorkspaceDir } from "./get-workspace-dir";

export interface WorkspaceItem {
	name: string;
	dir: string;
	package: Record<string, unknown>;
	polyCopy: Record<string, string[]>;
}

function findFirstLevelDirs(): WorkspaceItem[] {
	const dirs: WorkspaceItem[] = [];
	const workspaceDir = getWorkspaceDir();
	const files = fs.readdirSync(workspaceDir);
	for (const file of files) {
		const theDir = path.join(workspaceDir, file);
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
				polyCopy: packageJson.polyCopy,
				package: packageJson,
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
