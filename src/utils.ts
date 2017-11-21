export function uw<T>(arg: T | null | undefined): T {
	if (arg == null) {
		throw new Error('PANIC')
	}
	return arg
}

// https://github.com/sindresorhus/strip-bom/blob/master/index.js
export const stripBOM = (x: any) => {
	if (typeof x !== 'string') {
		throw new TypeError('Expected a string, got ' + typeof x)
	}

	// Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
	// conversion translates it to FEFF (UTF-16 BOM)
	if (x.charCodeAt(0) === 0xfeff) {
		return x.slice(1)
	}

	return x
}