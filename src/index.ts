import { Command } from "commander";
import { changed } from "./actions/changed";
import { clone } from "./actions/clone";
import { copy } from "./actions/copy";
import { pr } from "./actions/pr";
import { prettierPackage } from "./actions/prettier-package";
import { run } from "./actions/run";
import { setSecret } from "./actions/set-secret";
import { unChanged } from "./actions/unchanged";
import { updateDependencies } from "./actions/update-dependencies";
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
	.command("all <args>")
	.description("In all workspace run command")
	.action(async (args) => {
		run(await allDirs(), args);
	});

program
	.command("filter <filter> <args>")
	.description(
		`poly filter "template-" "touch README.md", The run package.name is match /template-/ repos.`,
	)
	.action(async (filter, args) => {
		filter(await allDirs(), filter, args);
	});

program
	.command("changed <args>")
	.description("Run all workspace has uncommitted dir")
	.action(async (args) => {
		changed(await allDirs(), args);
	});

program
	.command("unchanged <args>")
	.description("Run all workspace has changed dir")
	.action(async (args) => {
		unChanged(await allDirs(), args);
	});

program
	.command("set-secret <key> <value>")
	.description("Run all workspace set github secret")
	.action(async (key, value) => {
		setSecret(await allDirs(), key, value);
	});

program
	.command("pr <event> <matchTitle>")
	.description("merge pr, like: poly pr squash 'chore(main): release'")
	.action(async (event, matchTitle) => {
		pr(await allDirs(), event, matchTitle);
	});

program
	.command("update")
	.option("--npm", "update all workspace dependencies version by npm")
	.description("Update all workspace dependencies version")
	.action(async (options) => {
		updateDependencies(await allDirs(), options.npm || false);
	});

program
	.command("clone")
	.description("Clone all repos in workspace")
	.action(() => {
		clone();
	});

program
	.command("prettier-package")
	.description("prettier your package.json")
	.action(async () => {
		prettierPackage(await allDirs());
	});

program.parse(process.argv);
