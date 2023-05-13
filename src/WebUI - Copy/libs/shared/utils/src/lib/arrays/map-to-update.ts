import { UpdateStr } from '@ngrx/entity/src/models'

export function mapToUpdateArr<
	T extends {
		id: string
	},
>(arr: T[], changes: Partial<T>): UpdateStr<T>[] {
	return arr.map((item) => {
		return {
			id: item.id,
			changes,
		}
	})
}