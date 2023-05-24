import { CanvasEntity, PanelModel } from '@entities/shared'
import { UpdateStr } from '@ngrx/entity/src/models'

export const updateMany = (array: CanvasEntity[], key: keyof CanvasEntity) => {
	return array.map(
		(entity) =>
			({
				id: entity.id,
				changes: {
					[key]: entity[key],
				},
			} as UpdateStr<PanelModel>),
	)
}

export function mapManyToUpdateStr<T extends CanvasEntity>(
	array: T[],
	key: keyof T,
): UpdateStr<T>[] {
	return array.map(
		(entity) =>
			({
				id: entity.id,
				changes: {
					[key]: entity[key],
				},
			} as UpdateStr<T>),
	)
}

export function mapManyToUpdateStrV2<T extends CanvasEntity>(
	array: T[],
	keys: (keyof T)[],
): UpdateStr<T>[] {
	return array.map(
		(entity) =>
			({
				id: entity.id,
				get changes() {
					const changes: Partial<T> = {}
					keys.forEach((key) => (changes[key] = entity[key]))
					return changes
				},
			} as UpdateStr<T>),
	)
}

export const updateManyWith = <T extends CanvasEntity>(
	array: T[],
	key: keyof T,
	value: T[typeof key],
) => {
	return array.map(
		(entity) =>
			({
				id: entity.id,
				changes: {
					[key]: value,
				},
			} as UpdateStr<T>),
	)
}

export const updateManyWithFn = <T extends CanvasEntity>(
	array: T[],
	key: keyof T,
	fn: (entity: T) => T[typeof key],
) => {
	return array.map(
		(entity) =>
			({
				id: entity.id,
				changes: {
					[key]: fn(entity),
				},
			} as UpdateStr<T>),
	)
}
