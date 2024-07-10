import { Command } from "commander";
import { clone } from "./actions/clone";
import { copy } from "./actions/copy";
import { pr } from "./actions/pr";
import { prettierPackage } from "./actions/prettier-package";
import { run } from "./actions/run";
import { setSecret } from "./actions/set-secret";
import { updateDependencies } from "./actions/update-dependencies";
import { filterDirsByOptions } from "./utils/filter-dirs-by-options";
import { allDirs } from "./utils/workspaces";
const program = new Command();

program
	.version("0.1.0")
	.description(
		"The purpose of monorepos should be questioned. Monorepos are used because sharing a set of code across multiple projects makes it inconvenient to frequently update dependencies, so everything is put into one repository. However, this makes it difficult to edit packages across different enterprises and projects. Traditional polyrepos do not have this issue. This approach does not align with first principles. Instead, we should focus on better combining multiple polyrepos rather than putting them into a single repository. Having each package in its own repository enhances modularity and flexibility. By creating a CLI tool to manage multiple polyrepos.",
	)
	.command("copy")
	.description(
		"The copy command is used to copy a file from a source path to a destination path",
	)
	.action(async () => {
		copy(await allDirs());
	});

program
	.command("run <args>")
	.option("--all", "Run all workspace")
	.option("--changed", "Run all workspace has uncommitted dir")
	.option("--unchanged", "Run all workspace has unchanged dir")
	.option("--filter", "Use package name match")
	.option("--unmatched", "Use package name unmatched")
	.description(
		"In all workspace run command, options: --all, --changed, --unchanged, --filter, --unmatched",
	)
	.action(async (args, options) => {
		const dirs = await filterDirsByOptions(await allDirs(), options);
		return run(dirs, args);
	});

program
	.command("set-secret <key> <value>")
	.option("--all", "Run all workspace")
	.option("--changed", "Run all workspace has uncommitted dir")
	.option("--unchanged", "Run all workspace has unchanged dir")
	.option("--filter", "Use package name match")
	.option("--unmatched", "Use package name unmatched")
	.description(
		"Run all workspace set github secret, options: --all, --changed, --unchanged, --filter, --unmatched",
	)
	.action(async (key, value, options) => {
		const dirs = await filterDirsByOptions(await allDirs(), options);
		setSecret(dirs, key, value);
	});

program
	.command("pr <event> <matchTitle>")
	.option("--all", "Run all workspace")
	.option("--changed", "Run all workspace has uncommitted dir")
	.option("--unchanged", "Run all workspace has unchanged dir")
	.option("--filter", "Use package name match")
	.option("--unmatched", "Use package name unmatched")
	.description(
		"merge pr, like: poly pr squash 'chore(main): release', options: --all, --changed, --unchanged, --filter, --unmatched",
	)
	.action(async (event, matchTitle, options) => {
		const dirs = await filterDirsByOptions(await allDirs(), options);
		pr(dirs, event, matchTitle);
	});

program
	.command("update")
	.option("--all", "Run all workspace")
	.option("--changed", "Run all workspace has uncommitted dir")
	.option("--unchanged", "Run all workspace has unchanged dir")
	.option("--filter", "Use package name match")
	.option("--unmatched", "Use package name unmatched")
	.option("--npm", "update all workspace dependencies version by npm")
	.description(
		"Update all workspace dependencies version, options: --all, --changed, --unchanged, --filter, --unmatched",
	)
	.action(async (options) => {
		const dirs = await filterDirsByOptions(await allDirs(), options);
		updateDependencies(dirs, options.npm || false);
	});

program
	.command("clone")
	.description("Clone all repos in workspace")
	.action(() => {
		clone();
	});

program
	.command("prettier-package")
	.option("--all", "Run all workspace")
	.option("--changed", "Run all workspace has uncommitted dir")
	.option("--unchanged", "Run all workspace has unchanged dir")
	.option("--filter", "Use package name match")
	.option("--unmatched", "Use package name unmatched")
	.description(
		"prettier your package.json, options: --all, --changed, --unchanged, --filter, --unmatched",
	)
	.action(async (options) => {
		const dirs = await filterDirsByOptions(await allDirs(), options);
		prettierPackage(dirs);
	});

program.parse(process.argv);
