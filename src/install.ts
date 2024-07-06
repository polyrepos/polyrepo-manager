import { $ } from "zx";
import { allDirs } from "./workspaces";

async function start() {
	await Promise.allSettled(
		allDirs.map((item) => {
			console.log("install project:", item.dir);
			return $`cd ${item.dir} && bun install`;
		}),
	);
}

start();
