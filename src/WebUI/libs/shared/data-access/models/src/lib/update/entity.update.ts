export type EntityUpdate<
	TEntity extends object & {
		id: string
	},
> = {
	readonly id: TEntity['id']
	readonly changes: Partial<TEntity>
}
