import { Command } from "commander";
import { changed } from "./actions/changed";
import { clone } from "./actions/clone";
import { copy } from "./actions/copy";
import { pr } from "./actions/pr";
import { run } from "./actions/run";
import { setSecret } from "./actions/set-secret";
import { unChanged } from "./actions/unchanged";
import { updateDependencies } from "./actions/update-dependencies";
import { allDirs } from "./utils/workspaces";
const program = new Command();

program
	.version("0.1.0")
	.description("A simple CLI tool")
	.command("copy")
	.description("Copy a file from source to destination")
	.action(() => {
		copy();
	});

program
	.command("all <args>")
	.description("In all workspace run command")
	.action((args) => {
		run(allDirs, args);
	});

program
	.command("filter <filter> <args>")
	.description("In all workspace run command")
	.action((filter, args) => {
		filter(allDirs, filter, args);
	});

program
	.command("changed <args>")
	.description("Run all workspace has uncommitted dir")
	.action(async (args) => {
		changed(allDirs, args);
	});

program
	.command("unchanged <args>")
	.description("Run all workspace has uncommitted dir")
	.action(async (args) => {
		unChanged(allDirs, args);
	});

program
	.command("set-secret <key> <value>")
	.description("Run all workspace has uncommitted dir")
	.action(async (key, value) => {
		setSecret(allDirs, key, value);
	});

program
	.command("pr <event> <matchTitle>")
	.description("merge pr, like: poly pr squash 'chore(main): release'")
	.action(async (event, matchTitle) => {
		pr(allDirs, event, matchTitle);
	});

program
	.command("update")
	.description("Update all workspace dependencies version")
	.action(() => {
		updateDependencies();
	});

program
	.command("clone")
	.description("Clone all repos in workspace")
	.action(() => {
		clone();
	});

program.parse(process.argv);
