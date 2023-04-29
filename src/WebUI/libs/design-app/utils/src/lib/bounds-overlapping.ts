import {
	CanvasEntity,
	DIAGONAL_DIRECTION,
	EntityBounds,
	getBoundsFromTwoPoints,
	getDiagonalDirectionFromTwoPoints,
	getEntityBounds,
	getStartingSpotForCreationBox,
	SizeByType,
	SpotInBox,
	TransformedPoint,
} from '@design-app/feature-design-canvas'
import { ENTITY_TYPE } from '@design-app/shared'
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

export const getAllEntitiesBetweenTwoPoints = (
	point1: TransformedPoint,
	point2: TransformedPoint,
	entities: CanvasEntity[], // direction: DiagonalDirection,
) => {
	const direction = getDiagonalDirectionFromTwoPoints(point1, point2)
	if (!direction) return []
	return entities.filter((entity) => {
		const { left, top, right, bottom } = getEntityBounds(entity)

		switch (direction) {
			case DIAGONAL_DIRECTION.BottomLeftToTopRight:
				return (
					point1.x < point2.x &&
					point1.y > point2.y &&
					point1.x < left &&
					point2.x > right &&
					point2.y < top &&
					point1.y > bottom
				)
			case DIAGONAL_DIRECTION.TopLeftToBottomRight:
				return (
					point1.x < point2.x &&
					point1.y < point2.y &&
					point1.x < left &&
					point2.x > right &&
					point1.y < top &&
					point2.y > bottom
				)
			case DIAGONAL_DIRECTION.TopRightToBottomLeft:
				return (
					point1.x > point2.x &&
					point1.y < point2.y &&
					point1.x > left &&
					point2.x < right &&
					point1.y < top &&
					point2.y > bottom
				)
			case DIAGONAL_DIRECTION.BottomRightToTopLeft:
				return (
					point1.x > point2.x &&
					point1.y > point2.y &&
					point1.x > left &&
					point2.x < right &&
					point2.y < top &&
					point1.y > bottom
				)
		}
		return false
	})
}

export const getAllAvailableEntitySpotsBetweenTwoPoints = (
	point1: TransformedPoint,
	point2: TransformedPoint,
	entities: CanvasEntity[],
): SpotInBox[] => {
	const distanceX = point1.x - point2.x
	const distanceY = point1.y - point2.y
	const entitySize = SizeByType[ENTITY_TYPE.Panel]
	const widthWithMidSpacing = entitySize.width + 2
	const heightWithMidSpacing = entitySize.height + 2
	const entitiesInX = Math.floor(distanceX / widthWithMidSpacing)
	const entitiesInY = Math.floor(distanceY / heightWithMidSpacing)
	const diagonalDirection = getDiagonalDirectionFromTwoPoints(point1, point2)
	if (!diagonalDirection) return []

	const startingPoint = getStartingSpotForCreationBox(diagonalDirection, entitySize)
	const twoPointBounds = getBoundsFromTwoPoints(point1, point2)

	const existingEntities = filterEntitiesInsideBounds(twoPointBounds, entities)
	const widthIsPositive = entitiesInX > 0
	const adjustedWidth = widthIsPositive ? -widthWithMidSpacing : widthWithMidSpacing

	const heightIsPositive = entitiesInY > 0
	const adjustedHeight = heightIsPositive ? -heightWithMidSpacing : heightWithMidSpacing
	const spots: SpotInBox[] = []
	for (let i = 0; i < Math.abs(entitiesInX); i++) {
		for (let a = 0; a < Math.abs(entitiesInY); a++) {
			const spot: SpotInBox = {
				vacant: true,
				x: point1.x + startingPoint.x + i * adjustedWidth,
				y: point1.y + startingPoint.y + a * adjustedHeight,
			}
			existingEntities.forEach((entity) => {
				const firstSpot = {
					x: spot.x - entity.width / 2,
					y: spot.y - entity.height / 2,
				}
				const secondSpot = {
					x: spot.x + entity.width + entity.width / 2,
					y: spot.y + entity.width + entity.height / 2,
				}
				if (isEntityInsideTwoPoints(entity, firstSpot, secondSpot)) {
					spot.vacant = false
				}
			})
			spots.push(spot)
		}
	}

	return spots
}

export const isPointInsideBounds = (point: Point, bounds: EntityBounds): boolean => {
	return (
		point.x >= bounds.left &&
		point.x <= bounds.right &&
		point.y >= bounds.top &&
		point.y <= bounds.bottom
	)
}