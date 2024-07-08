// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function deepMerge(target: any, source: any, noCover: boolean) {
	for (const key of Object.keys(source)) {
		if (source[key] instanceof Object) {
			if (!target[key]) {
				Object.assign(target, { [key]: source[key] });
			} else {
				deepMerge(target[key], source[key], noCover);
			}
		} else {
			if (noCover) {
				if (!target[key]) {
					Object.assign(target, { [key]: source[key] });
				}
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}
}
