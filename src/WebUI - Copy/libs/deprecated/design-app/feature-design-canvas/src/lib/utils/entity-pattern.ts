export const toEntities = <
	T extends {
		id: string
	},
>(
	collection: T[],
) => {
	return collection.reduce(
		(prev, next) => ({
			...prev,
			[next.id]: next,
		}),
		{},
	)
}
