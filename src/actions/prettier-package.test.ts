import { expect, test } from "bun:test";
import { testPath } from "../test-tools/before-all";
import { fsReadJson } from "../utils/fs-read-json";
import { allDirs } from "../utils/workspaces";
import { copy } from "./copy";
import { prettierPackage } from "./prettier-package";

test("test prettier package", async () => {
	await copy(await allDirs());
	const pkg = await fsReadJson(testPath("env2", "package.json"));
	const keys = Object.keys(pkg);
	expect(keys[1]).toEqual("polyCopy");
	await prettierPackage(await allDirs());
	const pkg2 = await fsReadJson(testPath("env2", "package.json"));
	const keys2 = Object.keys(pkg2);
	expect(keys2[1]).toEqual("private");
});
