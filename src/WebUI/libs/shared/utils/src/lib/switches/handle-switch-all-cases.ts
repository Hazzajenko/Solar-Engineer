// Externally-visible signature
export function handleAllSwitchCases(component: never): never
// Implementation signature
export function handleAllSwitchCases<T>(component: T) {
	throw new Error('Unknown input kind: ' + component)
}
