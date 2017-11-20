export function uw<T>(arg: T | null | undefined): T {
	if (arg == null) {
		throw new Error('PANIC')
	}
	return arg
}
