export function memoize<T>(fn: T): T {
	const cache = new Map();
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return ((...args: any[]) => {
		const key = JSON.stringify(args);
		if (cache.has(key)) {
			return cache.get(key);
		}
		// biome-ignore lint/complexity/noBannedTypes: <explanation>
		const result = (fn as Function)(...args);
		cache.set(key, result);
		return result;
	}) as T;
}
