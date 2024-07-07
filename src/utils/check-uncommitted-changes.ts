import { exec } from "node:child_process";

export function checkUncommittedChanges(dir: string) {
	return new Promise((resolve, reject) => {
		// 执行两个 git 命令来检测变更和未追踪的文件
		exec("git status --porcelain", { cwd: dir }, (error, stdout, stderr) => {
			if (error) {
				// 忽略非 Git 仓库
				if (stderr.includes("Not a git repository")) {
					resolve(false);
				} else {
					reject(error);
				}
			} else {
				// 检查已追踪文件的变更
				if (stdout.trim().length > 0) {
					resolve(true);
				} else {
					// 如果没有已追踪文件的变更，再检查未追踪文件
					exec(
						"git ls-files --others --exclude-standard",
						{ cwd: dir },
						(error, stdout, _stderr) => {
							if (error) {
								reject(error);
							} else {
								resolve(stdout.trim().length > 0);
							}
						},
					);
				}
			}
		});
	});
}
