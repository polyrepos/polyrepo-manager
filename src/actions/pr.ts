import { exec } from "node:child_process";
import { promisify } from "node:util";
import { getWorkspaceConfig } from "../utils/get-workspace-dir";
import type { WorkspaceItem } from "../utils/workspaces";
import { runCommandInDir } from "./run";

const execAsync = promisify(exec);

export async function pr(
	dirs: WorkspaceItem[],
	event: string,
	prNameStart: string,
) {
	if (!prNameStart) {
		throw new Error(
			"Please provide a PR name start, like: chore(main): release",
		);
	}
	if (!["squash", "merge", "rebase"].includes(event)) {
		throw new Error(
			"Please provide a valid event, like: squash | merge | rebase",
		);
	}
	const config = await getWorkspaceConfig();
	const USERNAME = config.github.username;

	const tasks = dirs.map(async (dir) => {
		const REPO_NAME = dir.repoName;
		const { stdout: prList } = await execAsync(
			`gh pr list --repo "${USERNAME}/${REPO_NAME}" --search "is:open" --json number,title,mergeable`,
		);

		const prs = JSON.parse(prList).filter(
			(pr: { title: string; mergeable: string }) => {
				if (pr.mergeable !== "MERGEABLE") {
					console.log(
						`PR ${pr.title} mergeable is ${pr.mergeable}, skipping...`,
					);
					return false;
				}
				return pr.title.startsWith(prNameStart);
			},
		);

		if (!prs.length) {
			console.log(`No PRs found for repository: ${dir.repoName}`);
			return;
		}
		for (const pr of prs) {
			console.log(
				`PR ${pr.title} ${event} for repository, run:`,
				`gh pr merge ${pr.number} --${event} --repo "${USERNAME}/${dir.repoName}"`,
			);
			try {
				await runCommandInDir(
					dir.dir,
					`gh pr merge ${pr.number} --${event} --repo "${USERNAME}/${dir.repoName}"`,
				);
			} catch (error) {
				console.error(`Failed to merge PR ${pr.title}:`, error);
			}
		}
	});
	await Promise.all(tasks);
}
