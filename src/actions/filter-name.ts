import { allDirs, type WorkspaceItem } from "../utils/workspaces";
import { run } from "./run";

export async function filterName(
	dirs: WorkspaceItem[],
	filter: string,
	args: string,
) {
	const reg = new RegExp(filter);
	const filters = allDirs.filter((dir) => reg.test(dir.name));
	return run(filters, args);
}