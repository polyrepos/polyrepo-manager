import * as fs from "node:fs";
import { allDirs, allDirsMap } from "../utils/workspaces";

export async function updateVersion() {
	await Promise.allSettled(
		allDirs.map((item) => {
			for (const depType of ["dependencies", "devDependencies"]) {
				const keys = Object.keys(item.package[depType] || {});
				for (const key of keys) {
					const project = allDirsMap[key];
					if (project) {
						(item.package[depType] as Record<string, string>)[key] =
							(project.package.version as string) || "latest";
						fs.writeFileSync(
							`${item.dir}/package.json`,
							JSON.stringify(item.package, null, 2),
						);
					}
				}
			}
		}),
	);
}
