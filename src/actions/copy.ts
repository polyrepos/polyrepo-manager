import * as fs from "node:fs";
import * as path from "node:path";
import chalk from "chalk";
import { getWorkspaceDir } from "../utils/get-workspace-dir";
import { allDirs, allDirsMap } from "../utils/workspaces";

// 对象深度合并, 如果有目标对象的属性有值, 则不覆盖
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function deepMerge(target: any, source: any) {
	for (const key of Object.keys(source)) {
		if (source[key] instanceof Object) {
			if (!target[key]) {
				Object.assign(target, { [key]: source[key] });
			} else {
				deepMerge(target[key], source[key]);
			}
		} else {
			if (!target[key]) {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}
}

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
					if (file.endsWith(".merge") && fs.existsSync(targetPath)) {
						const sourceContent = JSON.parse(
							fs.readFileSync(sourcePath).toString(),
						);
						const targetContent = JSON.parse(
							fs.readFileSync(targetPath).toString(),
						);
						const newPkg = deepMerge(targetContent, sourceContent);
						fs.writeFileSync(targetPath, JSON.stringify(newPkg, null, 2));
					} else {
						try {
							fs.unlinkSync(targetPath);
							fs.rmSync(targetPath, { force: true, recursive: true });
						} catch (err) {
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
							console.error(
								`Source file does not exist: ${sourcePath.replace(rootDir, "")}`,
							);
						}
					}
				}
			}
		}
	}
	console.log(chalk.green("✓ Polyrepo manage copy done."));
}
