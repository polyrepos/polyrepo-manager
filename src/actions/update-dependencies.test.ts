import { expect, test } from "bun:test";
import * as fs from "node:fs";
import { testPath } from "../test-tools/before-all";
import { updateDependencies } from "./update-dependencies";

test("test update version", async () => {
	fs.rmSync(testPath("env", ".gitignore"), { recursive: true, force: true });
	const pkg = JSON.parse(
		fs.readFileSync(testPath("template-base", "package.json")).toString(),
	);
	pkg.dependencies["@polyrepo/env"] = "0.0.1";
	fs.writeFileSync(
		testPath("template-base", "package.json"),
		JSON.stringify(pkg, null, 2),
	);
	updateDependencies();
	const envPkg = JSON.parse(
		fs.readFileSync(testPath("env", "package.json")).toString(),
	);
	const pkg2 = JSON.parse(
		fs.readFileSync(testPath("template-base", "package.json")).toString(),
	);
	expect(pkg2.devDependencies["@polyrepo/env"]).toEqual(undefined);
	expect(pkg2.dependencies["@polyrepo/env"]).toEqual(envPkg.version);
});
