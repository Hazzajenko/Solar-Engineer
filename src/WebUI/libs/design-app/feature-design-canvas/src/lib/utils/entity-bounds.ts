import { CanvasEntity, SizeByType, TransformedPoint } from '../types'
import { AngleRadians } from './angles'
import {
	DIAGONAL_DIRECTION,
	DiagonalDirection,
	getDiagonalDirectionFromTwoPoints,
	getStartingSpotForCreationBox,
	SpotInBox,
} from './directions'
import { SAME_AXIS_POSITION, SameAxisPosition } from './positioning'
import { rotate } from './rotate'
import { ENTITY_TYPE } from '@design-app/shared'
import { Point, Size } from '@shared/data-access/models'


export type EntityBounds = {
	left: number
	top: number
	right: number
	bottom: number
	centerX: number
	centerY: number
}

export type CompleteEntityBounds = EntityBounds & {
	width: number
	height: number
}

export type TrigonometricBounds = CompleteEntityBounds & {
	angle: AngleRadians
}

export const getCompleteEntityBounds = (bounds: EntityBounds): CompleteEntityBounds => {
	return {
		...bounds,
		width: bounds.right - bounds.left,
		height: bounds.bottom - bounds.top,
	}
}

export const getEntityBounds = (entity: CanvasEntity): EntityBounds => {
	return {
		left: entity.location.x,
		top: entity.location.y,
		right: entity.location.x + entity.width,
		bottom: entity.location.y + entity.height,
		centerX: entity.location.x + entity.width / 2,
		centerY: entity.location.y + entity.height / 2,
	}
}

/**
 * @description
 * [minX, minY, maxX, maxY]
 * [left, top, right, bottom]
 */
export type TrigonometricBoundsTuple = [number, number, number, number]

export const getEntityTrigonometricBoundsTuple = (
	entity: CanvasEntity,
): TrigonometricBoundsTuple => {
	const { left, top, right, bottom, centerX, centerY } = getEntityBounds(entity)
	const [x11, y11] = rotate(left, top, centerX, centerY, entity.angle)
	const [x12, y12] = rotate(left, bottom, centerX, centerY, entity.angle)
	const [x21, y21] = rotate(right, bottom, centerX, centerY, entity.angle)
	const [x22, y22] = rotate(right, top, centerX, centerY, entity.angle)
	const minX = Math.min(x11, x12, x22, x21)
	const minY = Math.min(y11, y12, y22, y21)
	const maxX = Math.max(x11, x12, x22, x21)
	const maxY = Math.max(y11, y12, y22, y21)
	return [minX, minY, maxX, maxY]
}

/*export const getEntityTrigonometricBoundsTupleWithAngle = (
 entity: CanvasEntity,
 angle: AngleRadians,
 ): TrigonometricBoundsTuple => {
 const { left, top, right, bottom, centerX, centerY } = getEntityBounds(entity)
 // const angle = entity.angle * (Math.PI / 180); // convert degrees to radians
 const cos = Math.cos(angle)
 const sin = Math.sin(angle)
 // angle = -angle

 const [x11, y11] = rotate(left, top, centerX, centerY, angle)
 const [x12, y12] = rotate(left, bottom, centerX, centerY, angle, sin, cos)
 const [x21, y21] = rotate(right, bottom, centerX, centerY, angle, sin, cos)
 const [x22, y22] = rotate(right, top, centerX, centerY, angle, sin, cos)

 const minX = Math.min(x11, x12, x22, x21)
 const minY = Math.min(y11, y12, y22, y21)
 const maxX = Math.max(x11, x12, x22, x21)
 const maxY = Math.max(y11, y12, y22, y21)

 return [minX, minY, maxX, maxY]
 }*/
export const getEntityTrigonometricBoundsTupleFromUnknown = (
	entity: CanvasEntity,
): TrigonometricBoundsTuple => {
	const { left, top, right, bottom, centerX, centerY } = getEntityBounds(entity)
	const [x11, y11] = rotate(left, top, centerX, centerY, entity.angle)
	const [x12, y12] = rotate(left, bottom, centerX, centerY, entity.angle)
	const [x21, y21] = rotate(right, bottom, centerX, centerY, entity.angle)
	const [x22, y22] = rotate(right, top, centerX, centerY, entity.angle)
	/*
	 const [x11, y11] = rotate(x1, y1, cx, cy, element.angle);
	 const [x12, y12] = rotate(x1, y2, cx, cy, element.angle);
	 const [x22, y22] = rotate(x2, y2, cx, cy, element.angle);
	 const [x21, y21] = rotate(x2, y1, cx, cy, element.angle);*/
	const minX = Math.min(x11, x12, x22, x21)
	const minY = Math.min(y11, y12, y22, y21)
	const maxX = Math.max(x11, x12, x22, x21)
	const maxY = Math.max(y11, y12, y22, y21)
	return [minX, minY, maxX, maxY]

	/*	return {
	 ...bounds,
	 angle: entity.angle,
	 }*/
}
// {id: string, location: {x: number, y: number}, angle: AngleRadians, width: number, height: number, type: "panel"}[]

export const getCommonEntityTrigonometricBounds = (
	entities: CanvasEntity[],
): TrigonometricBoundsTuple => {
	let minX = Infinity
	let maxX = -Infinity
	let minY = Infinity
	let maxY = -Infinity

	entities.forEach((entity) => {
		const [x1, y1, x2, y2] = getEntityTrigonometricBoundsTuple(entity)
		minX = Math.min(minX, x1)
		minY = Math.min(minY, y1)
		maxX = Math.max(maxX, x2)
		maxY = Math.max(maxY, y2)
	})

	return [minX, minY, maxX, maxY]
}

export const getCommonTrigonometricBoundsFromPoints = (
	points: Point[],
): TrigonometricBoundsTuple => {
	let minX = Infinity
	let maxX = -Infinity
	let minY = Infinity
	let maxY = -Infinity

	points.forEach((point) => {
		minX = Math.min(minX, point.x)
		minY = Math.min(minY, point.y)
		maxX = Math.max(maxX, point.x)
		maxY = Math.max(maxY, point.y)
	})

	return [minX, minY, maxX, maxY]
}

export const getBoundsFromTwoPoints = (point1: Point, point2: Point): EntityBounds => {
	const [left, top, right, bottom] = [
		Math.min(point1.x, point2.x),
		Math.min(point1.y, point2.y),
		Math.max(point1.x, point2.x),
		Math.max(point1.y, point2.y),
	]

	return {
		left,
		top,
		right,
		bottom,
		centerX: (left + right) / 2,
		centerY: (top + bottom) / 2,
	}
}

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

export const getBoundsFromPoints = (points: Point[]): EntityBounds => {
	let minX = Infinity
	let maxX = -Infinity
	let minY = Infinity
	let maxY = -Infinity

	points.forEach((point) => {
		minX = Math.min(minX, point.x)
		minY = Math.min(minY, point.y)
		maxX = Math.max(maxX, point.x)
		maxY = Math.max(maxY, point.y)
	})

	return {
		left: minX,
		top: minY,
		right: maxX,
		bottom: maxY,
		centerX: (minX + maxX) / 2,
		centerY: (minY + maxY) / 2,
	}
}

export const getCompleteBoundsFromPoints = (points: Point[]): CompleteEntityBounds => {
	const bounds = getBoundsFromPoints(points)
	return getCompleteEntityBounds(bounds)
}

export const getCompleteBoundsFromPointsArray = (pointsArray: Point[]): CompleteEntityBounds => {
	let minX = Infinity
	let maxX = -Infinity
	let minY = Infinity
	let maxY = -Infinity

	// getBoundsCornerFromPoint()

	pointsArray.forEach((point) => {
		minX = Math.min(minX, point.x)
		minY = Math.min(minY, point.y)
		maxX = Math.max(maxX, point.x)
		maxY = Math.max(maxY, point.y)
	})

	const bounds = {
		left: minX,
		top: minY,
		right: maxX,
		bottom: maxY,
		centerX: (minX + maxX) / 2,
		centerY: (minY + maxY) / 2,
	}

	return getCompleteEntityBounds(bounds)
}

export const getCompleteBoundsFromBoundsArray = (
	boundsArray: EntityBounds[],
): CompleteEntityBounds => {
	let minX = Infinity
	let maxX = -Infinity
	let minY = Infinity
	let maxY = -Infinity

	boundsArray.forEach((bounds) => {
		minX = Math.min(minX, bounds.left)
		minY = Math.min(minY, bounds.top)
		maxX = Math.max(maxX, bounds.right)
		maxY = Math.max(maxY, bounds.bottom)
	})
	const bounds = {
		left: minX,
		top: minY,
		right: maxX,
		bottom: maxY,
		centerX: (minX + maxX) / 2,
		centerY: (minY + maxY) / 2,
	}
	return getCompleteEntityBounds(bounds)
}

export const getBoundsFromArrPoints = (points: number[][]): EntityBounds => {
	let minX = Infinity
	let maxX = -Infinity
	let minY = Infinity
	let maxY = -Infinity

	points.forEach((point) => {
		minX = Math.min(minX, point[0])
		minY = Math.min(minY, point[1])
		maxX = Math.max(maxX, point[0])
		maxY = Math.max(maxY, point[1])
	})

	return {
		left: minX,
		top: minY,
		right: maxX,
		bottom: maxY,
		centerX: (minX + maxX) / 2,
		centerY: (minY + maxY) / 2,
	}
}

export const getCommonBoundsFromBounds = (bounds1: EntityBounds, bounds2: EntityBounds) => {
	const left = Math.max(bounds1.left, bounds2.left)
	const top = Math.max(bounds1.top, bounds2.top)
	const right = Math.min(bounds1.right, bounds2.right)
	const bottom = Math.min(bounds1.bottom, bounds2.bottom)

	return {
		left,
		top,
		right,
		bottom,
		centerX: (left + right) / 2,
		centerY: (top + bottom) / 2,
	}
}

export const filterEntitiesInsideBounds = (
	bounds: EntityBounds,
	entities: CanvasEntity[],
): CanvasEntity[] => {
	return entities.filter((entity) => isEntityInsideBounds(entity, bounds))
}

export const filterAllEntityBetweenTwoPoints = (
	point1: TransformedPoint,
	point2: TransformedPoint,
	entity: CanvasEntity,
	direction: DiagonalDirection,
) => {
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

// export const getAllAvailableEntitySpotsBetweenTwoPoints

export const getCommonBoundsFromMultipleEntities = (
	entities: CanvasEntity[],
): EntityBounds | null => {
	if (entities.length === 0) {
		return null
	}

	const bounds = entities.map(getEntityBounds)

	const left = Math.min(...bounds.map((b) => b.left))
	const top = Math.min(...bounds.map((b) => b.top))
	const right = Math.max(...bounds.map((b) => b.right))
	const bottom = Math.max(...bounds.map((b) => b.bottom))

	return {
		left,
		top,
		right,
		bottom,
		centerX: (left + right) / 2,
		centerY: (top + bottom) / 2,
	}
}

export const getCompleteBoundsFromMultipleEntitiesWithPadding = (
	entities: CanvasEntity[],
	padding: number,
): CompleteEntityBounds => {
	const bounds = entities.map(getEntityBounds)
	const left = Math.min(...bounds.map((b) => b.left)) - padding
	const top = Math.min(...bounds.map((b) => b.top)) - padding
	const right = Math.max(...bounds.map((b) => b.right)) + padding
	const bottom = Math.max(...bounds.map((b) => b.bottom)) + padding

	return {
		left,
		top,
		right,
		bottom,
		centerX: (left + right) / 2,
		centerY: (top + bottom) / 2,
		width: right - left,
		height: bottom - top,
	}
}

export const getCompleteBoundsFromMultipleEntitiesWithPaddingWithAngle = (
	entities: CanvasEntity[],
	padding: number,
	angle: AngleRadians,
): TrigonometricBounds => {
	const bounds = entities.map(getEntityBounds)
	const left = Math.min(...bounds.map((b) => b.left)) - padding
	const top = Math.min(...bounds.map((b) => b.top)) - padding
	const right = Math.max(...bounds.map((b) => b.right)) + padding
	const bottom = Math.max(...bounds.map((b) => b.bottom)) + padding

	return {
		left,
		top,
		right,
		bottom,
		centerX: (left + right) / 2,
		centerY: (top + bottom) / 2,
		width: right - left,
		height: bottom - top,
		angle,
	}
}

export const getTrigonometricBoundsFromMultipleEntitiesMakeCentrePivotPoint = (
	entities: CanvasEntity[],
	pivotPoint: Point,
): TrigonometricBounds => {
	const bounds = entities.map(getEntityBounds)
	const left = Math.min(...bounds.map((b) => b.left))
	const top = Math.min(...bounds.map((b) => b.top))
	const right = Math.max(...bounds.map((b) => b.right))
	const bottom = Math.max(...bounds.map((b) => b.bottom))

	return {
		left,
		top,
		right,
		bottom,
		centerX: pivotPoint.x,
		centerY: pivotPoint.y,
		width: right - left,
		height: bottom - top,
		angle: 0 as AngleRadians,
	}
}

/*
 export const getTrigonometricBoundsFromMultipleEntitiesWithPadding = (
 entities: CanvasEntity[],
 padding: number,
 ): TrigonometricBounds => {
 const bounds = entities.map(getEntityBounds)
 const left = Math.min(...bounds.map((b) => b.left)) - padding
 const top = Math.min(...bounds.map((b) => b.top)) - padding
 const right = Math.max(...bounds.map((b) => b.right)) + padding
 const bottom = Math.max(...bounds.map((b) => b.bottom)) + padding

 return {
 left,
 top,
 right,
 bottom,
 centerX: (left + right) / 2,
 centerY: (top + bottom) / 2,
 width: right - left,
 height: bottom - top,
 angle: 0,
 }
 }
 */

export const getCompleteBoundsFromMultipleEntities = (
	entities: CanvasEntity[],
): CompleteEntityBounds => {
	const bounds = entities.map(getEntityBounds)
	const left = Math.min(...bounds.map((b) => b.left))
	const top = Math.min(...bounds.map((b) => b.top))
	const right = Math.max(...bounds.map((b) => b.right))
	const bottom = Math.max(...bounds.map((b) => b.bottom))

	return {
		left,
		top,
		right,
		bottom,
		centerX: (left + right) / 2,
		centerY: (top + bottom) / 2,
		width: right - left,
		height: bottom - top,
	}
}

export const getTopLeftPointFromBounds = (bounds: EntityBounds): Point => {
	return {
		x: bounds.left,
		y: bounds.top,
	}
}

export const getTopLeftPointFromTransformedPoint = (
	point: TransformedPoint,
	size: Size,
): TransformedPoint => {
	return {
		x: point.x - size.width / 2,
		y: point.y - size.height / 2,
	} as TransformedPoint
}

export const getTopLeftPointFromEvent = (event: MouseEvent, size: Size): Point => {
	return {
		x: event.offsetX - size.width / 2,
		y: event.offsetY - size.height / 2,
	}
}

export const getTopLeftPointFromEntity = (entity: CanvasEntity): Point => {
	return {
		x: entity.location.x - entity.width / 2,
		y: entity.location.y - entity.height / 2,
	}
}

export const getTopLeftFromBounds = (bounds: EntityBounds): Point => {
	return {
		x: bounds.left,
		y: bounds.top,
	}
}

export const BOUNDS_CORNER = {
	TOP_LEFT: 'topLeft',
	TOP_RIGHT: 'topRight',
	BOTTOM_LEFT: 'bottomLeft',
	BOTTOM_RIGHT: 'bottomRight',
} as const

export type BoundsCorner = (typeof BOUNDS_CORNER)[keyof typeof BOUNDS_CORNER]

export const getBoundsCornerFromPoint = (
	point: Point,
	bounds: EntityBounds,
): BoundsCorner | undefined => {
	const { left, top, right, bottom } = bounds
	if (point.x === left && point.y === top) {
		return BOUNDS_CORNER.TOP_LEFT
	}
	if (point.x === right && point.y === top) {
		return BOUNDS_CORNER.TOP_RIGHT
	}
	if (point.x === left && point.y === bottom) {
		return BOUNDS_CORNER.BOTTOM_LEFT
	}
	if (point.x === right && point.y === bottom) {
		return BOUNDS_CORNER.BOTTOM_RIGHT
	}
	return undefined
}

export const getOppositeCorner = (corner: BoundsCorner): BoundsCorner => {
	switch (corner) {
		case BOUNDS_CORNER.TOP_LEFT:
			return BOUNDS_CORNER.BOTTOM_RIGHT
		case BOUNDS_CORNER.TOP_RIGHT:
			return BOUNDS_CORNER.BOTTOM_LEFT
		case BOUNDS_CORNER.BOTTOM_LEFT:
			return BOUNDS_CORNER.TOP_RIGHT
		case BOUNDS_CORNER.BOTTOM_RIGHT:
			return BOUNDS_CORNER.TOP_LEFT
	}
}

export const getBoundsPointByCorner = (corner: BoundsCorner, bounds: EntityBounds): Point => {
	const { left, top, right, bottom } = bounds
	switch (corner) {
		case BOUNDS_CORNER.TOP_LEFT:
			return { x: left, y: top }
		case BOUNDS_CORNER.TOP_RIGHT:
			return { x: right, y: top }
		case BOUNDS_CORNER.BOTTOM_LEFT:
			return { x: left, y: bottom }
		case BOUNDS_CORNER.BOTTOM_RIGHT:
			return { x: right, y: bottom }
	}
}

export const getCornerPointsFromAxisPosition = (
	axisPosition: SameAxisPosition,
	bounds: EntityBounds,
): Point[] => {
	const { left, top, right, bottom } = bounds
	switch (axisPosition) {
		case SAME_AXIS_POSITION.TOP:
			return [
				{ x: left, y: top },
				{ x: right, y: top },
			]
		case SAME_AXIS_POSITION.BOTTOM:
			return [
				{ x: left, y: bottom },
				{ x: right, y: bottom },
			]
		case SAME_AXIS_POSITION.LEFT:
			return [
				{ x: left, y: top },
				{ x: left, y: bottom },
			]
		case SAME_AXIS_POSITION.RIGHT:
			return [
				{ x: right, y: top },
				{ x: right, y: bottom },
			]
	}
}

export const isBoundsInsideBounds = (
	bounds: EntityBounds,
	boundsToCheck: EntityBounds,
): boolean => {
	const { left, top, right, bottom } = bounds
	const {
		left: leftToCheck,
		top: topToCheck,
		right: rightToCheck,
		bottom: bottomToCheck,
	} = boundsToCheck
	return (
		left >= leftToCheck && top >= topToCheck && right <= rightToCheck && bottom <= bottomToCheck
	)
}

export const domRectToBounds = (domRect: DOMRect): EntityBounds => {
	return {
		left: domRect.left,
		top: domRect.top,
		right: domRect.right,
		bottom: domRect.bottom,
		centerX: domRect.x + domRect.width / 2,
		centerY: domRect.y + domRect.height / 2,
	}
}

/*
 export const isPointInsideBounds = (point: Point, bounds: EntityBounds): boolean => {
 const { left, top, right, bottom } = bounds
 return point.x >= left && point.x <= right && point.y >= top && point.y <= bottom
 }*/