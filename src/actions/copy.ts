import * as fs from "node:fs";
import * as path from "node:path";
import chalk from "chalk";
import { getWorkspaceDir } from "../utils/get-workspace-dir";
import { allDirs, allDirsMap } from "../utils/workspaces";

export function copy() {
	for (const targetDir of allDirs) {
		const pkg = JSON.parse(fs.readFileSync(targetDir.packagePath).toString());
		if (!pkg.polyCopy) {
			continue;
		}
		if (!fs.existsSync(targetDir.dir)) {
			fs.mkdirSync(targetDir.dir, { recursive: true });
		}
		const rootDir = getWorkspaceDir();
		const keys = Object.keys(pkg.polyCopy);
		for (const packageName of keys) {
			const item = allDirsMap[packageName];
			if (allDirsMap[packageName]) {
				for (const file of pkg.polyCopy[packageName]) {
					const sourcePath = path.resolve(item.dir, file);
					const targetPath = path.resolve(targetDir.dir, file);
					try {
						fs.unlinkSync(targetPath);
						fs.rmSync(targetPath, { force: true, recursive: true });
					} catch (err) {
						//
					}
					if (fs.existsSync(sourcePath)) {
						fs.cpSync(sourcePath, targetPath, { recursive: true, force: true });
						console.log(
							`Linked ${sourcePath.replace(rootDir, "").padEnd(40)} -> ${targetPath.replace(rootDir, "")}`,
						);
					} else {
						console.error(
							`Source file does not exist: ${sourcePath.replace(rootDir, "")}`,
						);
					}
				}
			}
		}
	}
	console.log(chalk.green("✓ Polyrepo manage copy done."));
}
