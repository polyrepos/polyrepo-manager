import * as fs from "node:fs";
import * as path from "node:path";

export function getWorkspaceDir() {
	if (process.env.POLY_WORKSPACE) {
		return process.env.POLY_WORKSPACE;
	}
	let workspaceDir = process.cwd();
	// 重执行目录开始向上级目录查找, 直到找到 *.code-workspace 文件
	while (workspaceDir) {
		const files = fs.readdirSync(workspaceDir);
		const workspaceFile = files.find((file) =>
			file.endsWith(".code-workspace"),
		);

		if (workspaceFile) {
			return workspaceDir; // 找到 *.code-workspace 文件所在目录
		}

		const parentDir = path.dirname(workspaceDir);

		// 如果当前目录是根目录，就停止查找
		if (parentDir === workspaceDir) {
			break;
		}

		workspaceDir = parentDir; // 向上一级目录继续查找
	}
	if (workspaceDir) {
		return workspaceDir;
	}

	throw new Error(
		"Cannot find *.code-workspace file in current directory or its parent directories.",
	);
}
