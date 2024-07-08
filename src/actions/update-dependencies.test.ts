import { expect, test } from "bun:test";
import * as fs from "node:fs";
import { testPath } from "../test-tools/before-all";
import { fsReadJson } from "../utils/get-package";
import { allDirs } from "../utils/workspaces";
import { updateDependencies } from "./update-dependencies";

test("test update version", async () => {
	fs.writeFileSync(testPath("env2", "update-temp.txt"), "update");
	const pkg = fsReadJson(testPath("env2", "package.json"));
	pkg.dependencies["@polyrepo/env"] = "0.0.1";
	fs.writeFileSync(
		testPath("env2", "package.json"),
		JSON.stringify(pkg, null, 2),
	);
	updateDependencies(allDirs());
	const envPkg = fsReadJson(testPath("env2", "package.json"));
	const pkg2 = fsReadJson(testPath("template-base", "package.json"));
	expect(pkg2.devDependencies["@polyrepo/env"]).toEqual(undefined);
	expect(pkg2.dependencies["@polyrepo/env"]).toEqual(envPkg.version);
});
