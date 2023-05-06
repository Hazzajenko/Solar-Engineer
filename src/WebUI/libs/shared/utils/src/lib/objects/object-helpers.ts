export const objectToArray = <
	T extends
		| {
				id: string
		  }
		| string,
>(
	items: T[],
) => {
	return Object.values(items)
}
