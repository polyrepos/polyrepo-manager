import { spawn } from "node:child_process";
import * as path from "node:path";
import chalk from "chalk";
import type { WorkspaceItem } from "../utils/workspaces";

function runCommandInDir(dir: string, args: string[], padEnd: number) {
	return new Promise((resolve, reject) => {
		const command = args[0];
		const commandArgs = args.slice(1);

		const child = spawn(command, commandArgs, { cwd: dir, shell: true });
		const _basename = `${path.basename(dir)}`.padEnd(padEnd);
		const basename = chalk.blue(`${_basename} |`);

		const handleData = (
			stream: NodeJS.WriteStream,
			data: { toString: () => string },
		) => {
			const lines = data.toString().split("\n");
			lines.forEach((line, index) => {
				if (line.trim()) {
					stream.write(`${basename} ${line}\n`);
				}
			});
		};

		child.stdout.on("data", (data) => {
			handleData(process.stdout, data);
		});

		child.stderr.on("data", (data) => {
			handleData(process.stderr, data);
		});

		child.on("close", (code) => {
			if (code !== 0) {
				reject(new Error(`Command failed with exit code ${code}`));
			} else {
				resolve(null);
			}
		});
	});
}

export async function run(dirs: WorkspaceItem[], args: string[]) {
	const padEnd = dirs.reduce((max, item) => {
		return Math.max(max, path.basename(item.dir).length);
	}, 0);
	const promises = dirs.map((item) => runCommandInDir(item.dir, args, padEnd));
	await Promise.allSettled(promises);
}
