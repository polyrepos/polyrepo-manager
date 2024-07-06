import { $ } from "zx";
import { allDirs } from "../utils/workspaces";

$.verbose = true;

export async function run(...args: string[]) {
	await Promise.allSettled(
		allDirs.map((item) => {
			return $`cd ${item.dir} && ${[...args]}`;
		}),
	);
}
