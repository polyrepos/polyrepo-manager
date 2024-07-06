import { filterUncommittedDirs } from "../utils/filter-uncommitted-dirs";
import { type WorkspaceItem, allDirs } from "../utils/workspaces";
import { run } from "./run";

export async function changes(dirs: WorkspaceItem[], args: string) {
	const uncommittedDirs: WorkspaceItem[] = await filterUncommittedDirs(allDirs);
	return run(uncommittedDirs, args);
}
