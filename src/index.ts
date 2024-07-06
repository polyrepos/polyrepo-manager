import { Command } from "commander";
const program = new Command();

program
	.version("0.1.0")
	.description("A simple CLI tool")
	.command("copy")
	.description("Copy a file from source to destination")
	.action(() => {
		import("./copy");
	});

program
	.command("install")
	.description("Install all workspace dependencies")
	.action(() => {
		import("./install");
	});

program
	.command("deps")
	.description("Update all workspace deps and install")
	.action(() => {
		import("./deps");
	});

program.parse(process.argv);
