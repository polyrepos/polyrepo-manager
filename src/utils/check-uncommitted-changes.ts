import { exec } from "node:child_process";

export function checkUncommittedChanges(dir: string) {
	return new Promise((resolve, reject) => {
		exec("git status --porcelain", { cwd: dir }, (error, stdout, stderr) => {
			if (error) {
				// 忽略非 Git 仓库
				if (stderr.includes("Not a git repository")) {
					resolve(false);
				} else {
					reject(error);
				}
			} else {
				resolve(stdout.trim().length > 0);
			}
		});
	});
}
