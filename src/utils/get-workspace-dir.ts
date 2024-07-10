import * as fs from "node:fs";
import * as path from "node:path";
import { fsReadJson } from "./fs-read-json";
export const workspaceData = {
	workspaceDir: "",
};

export function getWorkspaceDir() {
	if (workspaceData.workspaceDir) {
		return workspaceData.workspaceDir;
	}
	if (process.env.POLY_WORKSPACE) {
		return process.env.POLY_WORKSPACE;
	}
	workspaceData.workspaceDir = process.cwd();
	// 重执行目录开始向上级目录查找, 直到找到 *.code-workspace 文件
	while (workspaceData.workspaceDir) {
		const files = fs.readdirSync(workspaceData.workspaceDir);
		const workspaceFile = files.find((file) => file === "polyrepo.config.json");

		if (workspaceFile) {
			return workspaceData.workspaceDir; // 找到 *.code-workspace 文件所在目录
		}

		const parentDir = path.dirname(workspaceData.workspaceDir);

		// 如果当前目录是根目录，就停止查找
		if (parentDir === workspaceData.workspaceDir) {
			break;
		}

		workspaceData.workspaceDir = parentDir; // 向上一级目录继续查找
	}
	if (workspaceData.workspaceDir) {
		return workspaceData.workspaceDir;
	}

	throw new Error(
		"Cannot find polyrepo.config.json file in current directory or its parent directories.",
	);
}

interface WorkspaceConfig {
	repos: string[];
	github: {
		username: string;
	};
}

let config: WorkspaceConfig | null = null;

export async function getWorkspaceConfig(): Promise<WorkspaceConfig> {
	if (config) {
		return config;
	}
	const dir = getWorkspaceDir();
	const configPath = path.join(dir, "polyrepo.config.json");
	if (!fs.existsSync(configPath)) {
		throw new Error("Cannot find polyrepo.config.json in current directory.");
	}
	config = (await fsReadJson(configPath)) as WorkspaceConfig;
	let i = -1;
	for (const repo of config.repos) {
		i++;
		if (!repo.startsWith("https://") && !repo.startsWith("http://")) {
			throw new Error(
				`Invalid repo url: ${repo} need to start with http or https`,
			);
		}
		if (repo.endsWith(".git")) {
			config.repos[i] = repo.slice(0, -4);
		}
	}
	return config;
}
