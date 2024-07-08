import * as fs from "node:fs";
export function fsReadJson(packagePath: string) {
	if (!fs.existsSync(packagePath)) {
		return {};
	}
	try {
		return JSON.parse(fs.readFileSync(packagePath).toString());
	} catch (_e) {
		return {};
	}
}
