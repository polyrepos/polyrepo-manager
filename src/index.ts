import { Command } from "commander";
import { copy } from "./actions/copy";
import { run } from "./actions/run";
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
	.command("run [args...]")
	.description("In all workspace run command")
	.action((args) => {
		run(allDirs, args);
	});

program
	.command("update")
	.description("Update all workspace dependencies version")
	.action(() => {
		updateVersion();
	});

program.parse(process.argv);
