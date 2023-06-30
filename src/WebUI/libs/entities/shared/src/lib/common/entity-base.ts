import { ENTITY_TYPE, EntityType } from './entity.type'
import { AngleRadians, POINT, Point, Size } from '@shared/data-access/models'
import { PanelModel } from '../panels'
import { z } from 'zod'
// import { Point } from '@shared/data-access/models'

export type EntityBase = {
	id: string
	type: EntityType
	location: Point
	angle: AngleRadians
}

export const ENTITY_BASE = z.object({
	location: POINT,
	angle: z.number(),
})

/*export const EntityFactory = {
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
 } as const*/

export const SizeByType = {
	[ENTITY_TYPE.PANEL]: { width: 18, height: 23 },
}

export const getEntitySize = (entity: EntityBase | EntityType | PanelModel) => {
	// return SizeByType[entity.type]
	const toSwitch = typeof entity === 'string' ? entity : entity.type
	switch (toSwitch) {
		case ENTITY_TYPE.PANEL:
			return { width: 18, height: 23 }
		case ENTITY_TYPE.STRING:
			throw new Error('Not implemented')
		default:
			throw new Error('Not implemented')
	}
}

export const getEntityCenter = (entity: EntityBase) => {
	const { width, height } = getEntitySize(entity)
	return {
		x: entity.location.x + width / 2,
		y: entity.location.y + height / 2,
	}
}

export const mapEntityWithSize = <T extends EntityBase>(
	entity: T,
): T & {
	size: Size
} => {
	const size = getEntitySize(entity)
	return {
		...entity,
		size,
	}
}

/*
 export const mapEntityWithSize = <T extends CanvasEntity>(
 entity: T,
 fn: (entity: T, size: T extends CanvasEntity ? T['width'] : never) => T,
 ): T => {
 const size = getEntitySize(entity)
 return fn(entity, size.width)
 }*/
