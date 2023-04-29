import { getBoundsFromTwoPoints, getEntityBounds } from './bounds'
import { CanvasEntity, EntityBounds } from '@design-app/shared'
import { Point } from '@shared/data-access/models'

export const isEntityInsideTwoPoints = (entity: CanvasEntity, point1: Point, point2: Point) => {
	const bounds = getEntityBounds(entity)
	const box = getBoundsFromTwoPoints(point1, point2)

	return !(
		box.right < bounds.left ||
		box.left > bounds.right ||
		box.bottom < bounds.top ||
		box.top > bounds.bottom
	)
}

export const checkOverlapBetweenTwoBounds = (
	bounds1: EntityBounds,
	bounds2: EntityBounds,
): boolean => {
	return !(
		bounds2.right < bounds1.left ||
		bounds2.left > bounds1.right ||
		bounds2.bottom < bounds1.top ||
		bounds2.top > bounds1.bottom
	)
}

export const isEntityInsideBounds = (entity: CanvasEntity, bounds: EntityBounds): boolean => {
	const entityBounds = getEntityBounds(entity)
	return (
		entityBounds.left >= bounds.left &&
		entityBounds.top >= bounds.top &&
		entityBounds.right <= bounds.right &&
		entityBounds.bottom <= bounds.bottom
	)
}

export const isEntityOverlappingWithBounds = (
	entity: CanvasEntity,
	bounds: EntityBounds,
): boolean => {
	const entityBounds = getEntityBounds(entity)
	return checkOverlapBetweenTwoBounds(entityBounds, bounds)
}

export const filterEntitiesInsideBounds = (
	bounds: EntityBounds,
	entities: CanvasEntity[],
): CanvasEntity[] => {
	return entities.filter((entity) => isEntityInsideBounds(entity, bounds))
}

export const isPointInsideBounds = (point: Point, bounds: EntityBounds): boolean => {
	return (
		point.x >= bounds.left &&
		point.x <= bounds.right &&
		point.y >= bounds.top &&
		point.y <= bounds.bottom
	)
}