/**
 * @template {PropertyKey} T
 * @template {PropertyKey} U
 *
 * @param {Record<T, U>} input
 * @returns {Record<U, T>}
 */
export function reverseRecord(input: Record<PropertyKey, PropertyKey>) {
	const entries = Object.entries(input).map(([key, value]) => [value, key])
	return Object.fromEntries(entries)
}
