import { expect, test } from "bun:test";
import { testPath } from "../test-tools/before-all";
import { getWorkspaceConfig, getWorkspaceDir } from "./get-workspace-dir";

test("get-workspace", async () => {
	const dir = getWorkspaceDir();
	expect(dir).toBe(testPath(""));
	const config = await getWorkspaceConfig();
	expect(config.repos).toHaveLength(3);
	expect(config.repos).toEqual([
		"https://github.com/polyrepos/env",
		"https://github.com/polyrepos/env2",
		"https://github.com/polyrepos/template-base",
	]);
});
