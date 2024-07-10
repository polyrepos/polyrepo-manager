import { fs, path } from "zx";
import { deepMerge } from "../utils/deep-merge";
import { fsReadJson } from "../utils/fs-read-json";
import type { WorkspaceItem } from "../utils/workspaces";

export async function prettierPackage(dirs: WorkspaceItem[]) {
	return Promise.all(
		dirs.map(async (dir) => {
			const pkg = await fsReadJson(dir.packagePath);
			const otherKeys = { homepage: dir.homepage, version: "0.0.1" };
			deepMerge(otherKeys, pkg, true);

			// 把 pkg 中的 name, version, private 按顺序放到 newPkg 中
			let newPkg = {} as Record<string, unknown>;
			const other = {} as Record<string, unknown>;
			const keys = Object.keys(pkg);
			const sortKeys = [
				"name",
				"version",
				"description",
				"keywords",
				"private",
				"homepage",
				"bugs",
				"license",
				"author",
				"contributors",
				"main",
				"module",
				"type",
				"types",
				"files",
				"exports",
				"bin",
				"scripts",
				"polyCopy",
				"dependencies",
				"devDependencies",
				"peerDependencies",
				"optionalDependencies",
				"engines",
				"browserslist",
				"eslintConfig",
				"jest",
			];

			// 把 keys 中找到到 sortKeys 的值, 按照 sortKeys 的顺序放到 newPkg 中
			for (const key of sortKeys) {
				if (keys.includes(key)) {
					newPkg[key] = pkg[key];
				} else {
					other[key] = pkg[key];
				}
			}
			newPkg = { ...newPkg, ...other };
			await fs.writeJson(path.join(dir.dir, "package.json"), newPkg, {
				spaces: 2,
			});
			console.log(`Prettier ${dir.packageName}`);
		}),
	);
}
