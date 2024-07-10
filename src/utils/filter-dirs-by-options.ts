import {
	filterUnChangesDirs,
	filterUncommittedDirs,
} from "./filter-uncommitted-dirs";
import type { WorkspaceItem } from "./workspaces";

export async function filterDirsByOptions(
	dirs: WorkspaceItem[],
	options: Record<string, unknown>,
): Promise<WorkspaceItem[]> {
	if (options.all) {
		return dirs;
	}
	if (options.changed) {
		return await filterUncommittedDirs(dirs);
	}
	if (options.unchanged) {
		return await filterUnChangesDirs(dirs);
	}
	if (options.filter && typeof options.filter === "string") {
		const reg = new RegExp(options.filter);
		return dirs.filter((dir) => reg.test(dir.packageName));
	}
	if (options.unmatched && typeof options.unmatched === "string") {
		const reg = new RegExp(options.unmatched);
		return dirs.filter((dir) => !reg.test(dir.packageName));
	}
	return dirs;
}
