import chalk from "chalk";
import * as fs from "node:fs";
import { allDirs, allDirsMap } from "../utils/workspaces";

export async function updateDependencies() {
	let updateTimes = 0;
	await Promise.allSettled(
		allDirs.map((item) => {
			const pkg = JSON.parse(fs.readFileSync(item.packagePath).toString());
			for (const depType of ["dependencies", "devDependencies"]) {
				const keys = Object.keys(pkg[depType] || {});
				for (const key of keys) {
					if (!(pkg[depType] as Record<string, string>)[key]) {
						continue;
					}
					const project = allDirsMap[key];
					if (project) {
						const projectPkg = JSON.parse(
							fs.readFileSync(project.packagePath).toString(),
						);
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
