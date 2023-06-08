import { z } from 'zod'

export type EntityUpdate<
	TEntity extends object & {
		id: string
	},
> = {
	readonly id: TEntity['id']
	readonly changes: Partial<TEntity>
}

export const EntityUpdate = <
	TEntity extends z.ZodObject<any, any, any> & {
		id: string
	},
>(
	entity: TEntity,
) => {
	return z.object({
		id: z.string(),
		changes: entity.partial().nonstrict(),
	})
}

export const UpdateStr = <
	TEntity extends z.ZodObject<any, any, any> & {
		id: string
	},
>(
	entity: TEntity,
) => {
	return z.object({
		id: z.string(),
		changes: entity.partial().nonstrict(),
	})
}
