import { expect, test } from "bun:test";
import * as fs from "node:fs";
import { testPath } from "../test-tools/before-all";
import { updateVersion } from "./update-version";

test("test update version", async () => {
	fs.rmSync(testPath("env", ".gitignore"), { recursive: true, force: true });
	const pkg = JSON.parse(
		fs.readFileSync(testPath("template-bun", "package.json")).toString(),
	);
	pkg.devDependencies["@polyrepo/env"] = "0.0.1";
	pkg.dependencies["@polyrepo/env"] = "0.0.1";
	fs.writeFileSync(
		testPath("template-bun", "package.json"),
		JSON.stringify(pkg, null, 2),
	);
	updateVersion();
	const envPkg = JSON.parse(
		fs.readFileSync(testPath("env", "package.json")).toString(),
	);
	const pkg2 = JSON.parse(
		fs.readFileSync(testPath("template-bun", "package.json")).toString(),
	);
	expect(pkg2.devDependencies["@polyrepo/env"]).toEqual(envPkg.version);
	expect(pkg2.dependencies["@polyrepo/env"]).toEqual(envPkg.version);
});
