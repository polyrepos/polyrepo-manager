export async function waitFor<T extends (...args: unknown[]) => unknown>(
	conditionFn: T,
	interval = 100,
	maxWait = 10 * 1000,
): Promise<T> {
	return new Promise((resolve, reject) => {
		const startTime = Date.now();

		async function checkCondition() {
			try {
				const result = await conditionFn();
				if (result) {
					resolve(result as unknown as T);
				} else if (Date.now() - startTime >= maxWait) {
					reject(new Error("Wait for Timeout exceeded"));
				} else {
					setTimeout(checkCondition, interval);
				}
			} catch (error) {
				reject(error);
			}
		}

		checkCondition();
	});
}
