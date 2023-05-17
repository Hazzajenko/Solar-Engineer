import { ENTITY_TYPE, EntityType } from './entity.type'
import { AngleRadians, Point, Size } from '@shared/data-access/models'
// import { Point } from '@shared/data-access/models'

export type CanvasEntity = {
	id: string
	type: EntityType
	location: Point
	width: number
	height: number
	angle: AngleRadians
}

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
	[ENTITY_TYPE.Panel]: { width: 18, height: 23 },
}

export const getEntitySize = (entity: CanvasEntity) => {
	return SizeByType[entity.type]
}

export const getEntityCenter = (entity: CanvasEntity) => {
	const { width, height } = getEntitySize(entity)
	return {
		x: entity.location.x + width / 2,
		y: entity.location.y + height / 2,
	}
}

export const mapEntityWithSize = <T extends CanvasEntity>(
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
