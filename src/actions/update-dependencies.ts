import chalk from "chalk";
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import { fsReadJson } from "../utils/fs-read-json";
import { type WorkspaceItem, dirToMap } from "../utils/workspaces";

export async function updateDependencies(
	dirs: WorkspaceItem[],
	loadNpm: boolean,
) {
	let updateTimes = 0;
	const dirMap = dirToMap(dirs);
	await Promise.allSettled(
		dirs.map(async (item) => {
			const pkg = await fsReadJson(item.packagePath);
			for (const depType of ["dependencies", "devDependencies"]) {
				const keys = Object.keys(pkg[depType] || {});
				for (const key of keys) {
					if (!(pkg[depType] as Record<string, string>)[key]) {
						continue;
					}
					const project = dirMap[key];
					if (project) {
						const projectPkg = await fsReadJson(project.packagePath);
						if (loadNpm) {
							const latestVersion = execSync(`npm show ${key} version`)
								.toString()
								.trim();
							(pkg[depType] as Record<string, string>)[key] =
								latestVersion || "latest";
						} else {
							(pkg[depType] as Record<string, string>)[key] =
								(projectPkg.version as string) || "latest";
						}
						console.log(
							`Update ${item.packageName}'s ${key} to ${(pkg[depType] as Record<string, string>)[key]} ${loadNpm ? "by npm" : ""}`,
						);
						updateTimes++;
						fs.writeFileSync(
							`${item.dir}/package.json`,
							JSON.stringify(pkg, null, 2),
						);
					}
				}
			}
		}),
	);
	console.log(chalk.green(`✓ Update ${updateTimes} dependencies`));
}
