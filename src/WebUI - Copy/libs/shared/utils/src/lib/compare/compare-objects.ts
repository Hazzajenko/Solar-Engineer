export function compareObjects({ o1, o2 }: { o1: any; o2: any }) {
	for (const p in o1) {
		// eslint-disable-next-line no-prototype-builtins
		if (o1.hasOwnProperty(p)) {
			if (o1[p] !== o2[p]) {
				return false
			}
		}
	}
	for (const p in o2) {
		// eslint-disable-next-line no-prototype-builtins
		if (o2.hasOwnProperty(p)) {
			if (o1[p] !== o2[p]) {
				return false
			}
		}
	}
	return true
}

export const getDifferenceInTwoObjects = <T extends object>(o1: T, o2: T): Partial<T> => {
	const diff: Partial<T> = {}
	for (const p in o1) {
		// eslint-disable-next-line no-prototype-builtins
		if (o1.hasOwnProperty(p)) {
			if (o1[p] !== o2[p]) {
				diff[p] = o1[p]
			}
		}
	}
	return diff
}

export const getNewStateFromTwoObjects = <T extends object>(
	oldState: T,
	newState: T,
): Partial<T> => {
	const diff: Partial<T> = {}
	for (const p in oldState) {
		// eslint-disable-next-line no-prototype-builtins
		if (oldState.hasOwnProperty(p)) {
			if (oldState[p] !== newState[p]) {
				diff[p] = newState[p]
			}
		}
	}
	return diff
}

export const getDifferenceInTwoObjects2 = <T extends object>(oldState: T, newState: T) => {
	let diff = {}
	// const diff: Partial<T> = {}
	for (const p in oldState) {
		// eslint-disable-next-line no-prototype-builtins
		if (oldState.hasOwnProperty(p)) {
			if (oldState[p] !== newState[p]) {
				diff = {
					...diff,
					[`old${p}`]: oldState[p],
					[`new${p}`]: newState[p],
				}
			}
		}
	}
	return diff
}

export const getDifferenceInTwoObjects3 = <T extends object>(
	oldState: T,
	newState: T,
): [Partial<T>, Partial<T>] | undefined => {
	let isChanges = false
	const oldPartial: Partial<T> = {}
	const newPartial: Partial<T> = {}
	for (const p in oldState) {
		// eslint-disable-next-line no-prototype-builtins
		if (oldState.hasOwnProperty(p)) {
			if (oldState[p] !== newState[p]) {
				isChanges = true
				oldPartial[p] = oldState[p]
				newPartial[p] = newState[p]
			}
		}
	}
	if (!isChanges) {
		return undefined
	}
	return [oldPartial, newPartial]
}
