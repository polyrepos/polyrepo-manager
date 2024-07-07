import { filterUncommittedDirs } from "../utils/filter-uncommitted-dirs";
import type { WorkspaceItem } from "../utils/workspaces";
import { run } from "./run";

export async function changed(dirs: WorkspaceItem[], args: string) {
	const uncommittedDirs: WorkspaceItem[] = await filterUncommittedDirs(dirs);
	return run(uncommittedDirs, args);
}
