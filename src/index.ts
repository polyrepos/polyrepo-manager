import { Command } from "commander";
import { changes } from "./actions/changed";
import { clone } from "./actions/clone";
import { copy } from "./actions/copy";
import { run } from "./actions/run";
import { unChanges } from "./actions/unchanged";
import { updateVersion } from "./actions/update-version";
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
	.command("run <args>")
	.description("In all workspace run command")
	.action((args) => {
		run(allDirs, args);
	});

program
	.command("changed <args>")
	.description("Run all workspace has uncommitted dir")
	.action(async (args) => {
		changes(allDirs, args);
	});

program
	.command("unchanged <args>")
	.description("Run all workspace has uncommitted dir")
	.action(async (args) => {
		unChanges(allDirs, args);
	});

program
	.command("update")
	.description("Update all workspace dependencies version")
	.action(() => {
		updateVersion();
	});

program
	.command("clone")
	.description("Clone all repos in workspace")
	.action(() => {
		clone();
	});

program.parse(process.argv);
