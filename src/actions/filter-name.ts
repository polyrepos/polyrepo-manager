import type { WorkspaceItem } from "../utils/workspaces";
import { run } from "./run";

export async function filterName(
	dirs: WorkspaceItem[],
	filter: string,
	args: string,
) {
	const reg = new RegExp(filter);
	const filters = dirs.filter((dir) => reg.test(dir.packageName));
	return run(filters, args);
}
