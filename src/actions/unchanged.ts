import {
	filterUnChangesDirs,
	filterUncommittedDirs,
} from "../utils/filter-uncommitted-dirs";
import { type WorkspaceItem, allDirs } from "../utils/workspaces";
import { run } from "./run";

export async function unChanges(dirs: WorkspaceItem[], args: string) {
	const filters: WorkspaceItem[] = await filterUnChangesDirs(allDirs);
	return run(filters, args);
}
