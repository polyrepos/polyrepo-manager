import { expect, test } from "bun:test";
import { testPath } from "../test-tools/before-all";
import { getWorkspaceConfig, getWorkspaceDir } from "./get-workspace-dir";

test("get-workspace", () => {
	const dir = getWorkspaceDir();
	expect(dir).toBe(testPath(""));
	const config = getWorkspaceConfig();
	expect(config.repos).toHaveLength(2);
	expect(config.repos).toEqual([
		"https://github.com/polyrepos/env",
		"https://github.com/polyrepos/template-bun",
	]);
});
