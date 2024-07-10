import { promises as fs } from "node:fs";

export async function fsReadJson(packagePath: string) {
	try {
		await fs.access(packagePath);
		const data = await fs.readFile(packagePath, "utf-8");
		return JSON.parse(data);
	} catch (e) {
		console.error(e);
		return {};
	}
}
