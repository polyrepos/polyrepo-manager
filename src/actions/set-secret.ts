import { getWorkspaceConfig } from "../utils/get-workspace-dir";
import type { WorkspaceItem } from "../utils/workspaces";
import { runCommandInDir } from "./run";

export async function setSecret(
	dirs: WorkspaceItem[],
	key: string,
	value: string,
) {
	const config = getWorkspaceConfig();
	for (const dir of dirs) {
		console.log("Setting secret for repository:", dir.repoName);
		await runCommandInDir(
			dir.dir,
			`gh secret set ${key} --body "${value}" --repo ${config.github.username}/${dir.repoName}`,
		);
	}
}
