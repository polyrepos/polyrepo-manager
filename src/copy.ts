import * as fs from "node:fs";
import * as path from "node:path";
import { allDirs, allDirsMap } from "./workspaces";

// 定义要链接的文件和目录

for (const targetDir of allDirs) {
	if (!targetDir.polyCopy) {
		continue;
	}
	if (!fs.existsSync(targetDir.dir)) {
		fs.mkdirSync(targetDir.dir, { recursive: true });
	}
	const keys = Object.keys(targetDir.polyCopy);
	for (const packageName of keys) {
		const item = allDirsMap[packageName];
		if (allDirsMap[packageName]) {
			for (const file of targetDir.polyCopy[packageName]) {
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
					console.log(`Linked ${sourcePath} -> ${targetPath}`);
				} else {
					console.error(`Source file does not exist: ${sourcePath}`);
				}
			}
		}
	}
	console.log("Polyrepo manage copy done.");
}
