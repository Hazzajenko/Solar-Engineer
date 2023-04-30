import { AngleRadians, CanvasEntity, EntityType, SizeByType } from '@design-app/shared'
import { UpdateStr } from '@ngrx/entity/src/models'
import { Point } from '@shared/data-access/models'
import { newGuid } from '@shared/utils'
import { CanvasString } from 'deprecated/design-app/feature-design-canvas'

export const EntityFactory = {
	create: (type: EntityType, location: Point): CanvasEntity => {
		const { width, height } = SizeByType[type]
		return {
			id: newGuid(),
			type,
			location,
			width,
			height,
			angle: 0 as AngleRadians,
		}
	},
	update: (entity: CanvasEntity, changes: Partial<CanvasEntity>): CanvasEntity => {
		return {
			...entity,
			...changes,
		}
	},
	updateForStore: (
		entity: CanvasEntity,
		changes: Partial<CanvasEntity>,
	): UpdateStr<CanvasEntity> => {
		return {
			id: entity.id,
			changes,
		}
	},
} as const

export const updateObjectByIdForStore = <T extends CanvasEntity | CanvasString>(
	id: T['id'],
	changes: Partial<T>,
): UpdateStr<T> => {
	return {
		id: id,
		changes,
	}
}
