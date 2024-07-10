import chalk from "chalk";
import * as fs from "node:fs";
import * as path from "node:path";
import { deepMerge } from "../utils/deep-merge";
import { fsReadJson } from "../utils/fs-read-json";
import { getWorkspaceDir } from "../utils/get-workspace-dir";
import { type WorkspaceItem, dirToMap } from "../utils/workspaces";

export async function copy(dirs: WorkspaceItem[]) {
	const dirMaps = dirToMap(dirs);
	const tasks = dirs.map(async (targetDir) => {
		const pkg = await fsReadJson(targetDir.packagePath);
		if (!pkg.polyCopy) {
			return;
		}
		if (!fs.existsSync(targetDir.dir)) {
			fs.mkdirSync(targetDir.dir, { recursive: true });
		}
		const rootDir = getWorkspaceDir();
		const keys = Object.keys(pkg.polyCopy);
		for (const packageName of keys) {
			const item = dirMaps[packageName];
			if (dirMaps[packageName]) {
				for (const file of pkg.polyCopy[packageName]) {
					const sourcePath = path.resolve(item.dir, file);
					let targetPath = path.resolve(targetDir.dir, file);
					if (file.endsWith(".merge")) {
						targetPath = targetPath.replace(".merge", "");
						if (fs.existsSync(targetPath) && fs.existsSync(sourcePath)) {
							const sourceContent = await fsReadJson(sourcePath);
							const targetContent = await fsReadJson(targetPath);
							deepMerge(targetContent, sourceContent, true);
							fs.writeFileSync(
								targetPath,
								JSON.stringify(targetContent, null, 2),
							);
							console.log(
								`Linked ${sourcePath.replace(rootDir, "").padEnd(40)} -> ${targetPath.replace(rootDir, "")}`,
							);
						} else if (
							!fs.existsSync(targetPath) &&
							fs.existsSync(sourcePath)
						) {
							fs.cpSync(sourcePath, targetPath, {
								recursive: true,
								force: true,
							});
							console.log(
								`Linked ${sourcePath.replace(rootDir, "").padEnd(40)} -> ${targetPath.replace(rootDir, "")}`,
							);
						}
					} else {
						try {
							fs.unlinkSync(targetPath);
							fs.rmSync(targetPath, { force: true, recursive: true });
						} catch (_err) {
							//
						}
						if (fs.existsSync(sourcePath)) {
							fs.cpSync(sourcePath, targetPath, {
								recursive: true,
								force: true,
							});
							console.log(
								`Linked ${sourcePath.replace(rootDir, "").padEnd(40)} -> ${targetPath.replace(rootDir, "")}`,
							);
						} else {
							console.error(`Source file does not exist: ${sourcePath}`);
						}
					}
				}
			}
		}
	});
	await Promise.all(tasks);
	console.log(chalk.green("✓ Polyrepo manage copy done."));
}
