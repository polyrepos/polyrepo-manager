import { describe, expect, it } from "bun:test";
import { filterDirsByOptions } from "./filter-dirs-by-options";
import type { WorkspaceItem } from "./workspaces";

describe("filterDirsByOptions", () => {
	const mockDirs: WorkspaceItem[] = [
		{
			packageName: "package1",
			dir: "path/to/package1",
			homepage: "1",
			packagePath: "a",
			repoName: "package1",
		},
		{
			packageName: "package2",
			dir: "path/to/package2",
			homepage: "2",
			packagePath: "b",
			repoName: "package2",
		},
		// Add more mock WorkspaceItem objects as needed
	];

	it("should return all dirs if options.all is true", async () => {
		const options = { all: true };
		const result = await filterDirsByOptions([...mockDirs], options);
		expect(result).toEqual(mockDirs);
	});

	it("should filter dirs by regex if options.filter is a string", async () => {
		const options = { filter: "package1" };
		const result = await filterDirsByOptions([...mockDirs], options);
		expect(result).toEqual([mockDirs[0]]);
	});

	it("should return all dirs if no options match", async () => {
		const options = { unmatched: "package1" };
		const result = await filterDirsByOptions([...mockDirs], options);
		expect(result).toEqual([mockDirs[1]]);
	});
});
