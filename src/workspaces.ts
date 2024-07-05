import * as fs from "fs";
import * as path from "path";
import { env } from "@polyrepo/env";

interface Item {
	name: string;
	dir: string;
	polyCopy: Record<string, string[]>;
}

function findFirstLevelDirs(): Item[] {
	const dirs: Item[] = [];
	const workspaceDir = env("LINK_WORKSPACE") || "";
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
	{} as Record<string, Item>,
);
