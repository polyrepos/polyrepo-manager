import { checkUncommittedChanges } from "./check-uncommitted-changes";
import type { WorkspaceItem } from "./workspaces";

export async function filterUncommittedDirs(dirs: WorkspaceItem[]) {
	const uncommittedDirs: WorkspaceItem[] = [];
	for (const dir of dirs) {
		const hasUncommitted = await checkUncommittedChanges(dir.dir);
		if (hasUncommitted) {
			uncommittedDirs.push(dir);
		}
	}
	return uncommittedDirs;
}

export async function filterUnChangesDirs(dirs: WorkspaceItem[]) {
	const out: WorkspaceItem[] = [];
	for (const dir of dirs) {
		const hasUncommitted = await checkUncommittedChanges(dir.dir);
		if (!hasUncommitted) {
			out.push(dir);
		}
	}
	return out;
}
