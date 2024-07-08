import { filterUnChangesDirs } from "../utils/filter-uncommitted-dirs";
import type { WorkspaceItem } from "../utils/workspaces";
import { run } from "./run";

export async function unChanges(dirs: WorkspaceItem[], args: string) {
	const filters: WorkspaceItem[] = await filterUnChangesDirs(dirs);
	return run(filters, args);
}
