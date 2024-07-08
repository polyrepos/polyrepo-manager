import chalk from "chalk";
import * as fs from "node:fs";
import { fsReadJson } from "../utils/get-package";
import { dirToMap, type WorkspaceItem } from "../utils/workspaces";

export async function updateDependencies(dirs: WorkspaceItem[]) {
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
						(pkg[depType] as Record<string, string>)[key] =
							(projectPkg.version as string) || "latest";
						console.log(
							`Update ${item.name}'s ${key} to ${projectPkg.version}`,
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
