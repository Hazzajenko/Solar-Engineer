import {
	getBoundsFromTwoPoints,
	getCompleteEntityBounds,
	getCompleteEntityBoundsFromEntity,
	getEntityBounds,
	getStretchedEntityBoundsByValue,
} from './bounds'
import { EntityBounds, Point } from '@shared/data-access/models'
import { CanvasEntity } from '@entities/shared'

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

export const isPointInsideEntity = (point: Point, entity: CanvasEntity): boolean => {
	const bounds = getEntityBounds(entity)
	return isPointInsideBounds(point, bounds)
}

export const isPointInsideStretchedEntityByValue = (
	point: Point,
	entity: CanvasEntity,
	value: number,
): boolean => {
	const bounds = getStretchedEntityBoundsByValue(entity, value)
	return isPointInsideBounds(point, bounds)
}

const ENTITY_LEFT_SIDE_THRESHOLD = 10
const ENTITY_RIGHT_SIDE_THRESHOLD = 10

export const isPointInsideLeftSideOfEntity = (point: Point, entity: CanvasEntity): boolean => {
	const bounds = getEntityBounds(entity)
	return point.x <= bounds.left + ENTITY_LEFT_SIDE_THRESHOLD && isPointInsideBounds(point, bounds)
}

export const isPointInsideRightSideOfEntity = (point: Point, entity: CanvasEntity): boolean => {
	const bounds = getEntityBounds(entity)
	return point.x >= bounds.right - ENTITY_RIGHT_SIDE_THRESHOLD && isPointInsideBounds(point, bounds)
}

export const isPointInsideRightSideOfEntityWithRotation = (
	point: Point,
	entity: CanvasEntity,
): boolean => {
	const bounds = getCompleteEntityBounds(getEntityBounds(entity))
	// const bounds = getEntityBounds(entity)
	const rotatedPoint = rotatePoint(point, entity.angle, { x: bounds.centerX, y: bounds.centerY })
	const rotatedRightSide = bounds.centerX + bounds.height / 2 - ENTITY_RIGHT_SIDE_THRESHOLD
	return rotatedPoint.x >= rotatedRightSide && isPointInsideBounds(rotatedPoint, bounds)
}

export const isPointInsideMiddleRightOfEntityWithRotationV2 = (
	point: Point,
	entity: CanvasEntity,
): boolean => {
	const bounds = getCompleteEntityBounds(getEntityBounds(entity))
	const rotatedPoint = rotatePoint(point, entity.angle, { x: bounds.centerX, y: bounds.centerY })
	const rotatedMiddleRight = bounds.centerX + bounds.height / 4 - ENTITY_RIGHT_SIDE_THRESHOLD
	return (
		rotatedPoint.x >= rotatedMiddleRight &&
		rotatedPoint.y >= bounds.centerY - bounds.height / 4 &&
		rotatedPoint.y <= bounds.centerY + bounds.height / 4
	)
}

export const isPointInsidePanelSymbols = (point: Point, entity: CanvasEntity) => {
	const bounds = getCompleteEntityBoundsFromEntity(entity)
	if (isPointWithinPointByValue(point, { x: bounds.left, y: bounds.centerY }, 5)) {
		return 'negative'
	}
	if (isPointWithinPointByValue(point, { x: bounds.right, y: bounds.centerY }, 5)) {
		return 'positive'
	}
	return false
	// if (point.x)
	// const bounds = getEntityBounds(entity)
	/*	const [x1, y1, x2, y2] = adjustTwoPointTuplesByValueAndAxis(
	 bounds.left,
	 bounds.top,
	 bounds.left,
	 bounds.bottom,
	 bounds.height / 4,
	 'y',
	 )
	 const leftBoundary = bounds.left + bounds.width / 4

	 return (
	 /!*		isPointBetweenTwoPoints(
	 point,
	 { x: bounds.left, y: bounds.top },
	 { x: bounds.left, y: bounds.bottom },
	 ) &&
	 point.x >= bounds.left + ENTITY_LEFT_SIDE_THRESHOLD &&
	 point.x <= bounds.right - ENTITY_RIGHT_SIDE_THRESHOLD &&
	 isPointInsideBounds(point, bounds) &&*!/
	 point.y >= y1 &&
	 point.y <= y2 &&
	 point.x <= leftBoundary &&
	 point.x >= bounds.left - bounds.width / 4
	 // point.x <= bounds.right - ENTITY_RIGHT_SIDE_THRESHOLD
	 )*/
}
/*
 // const heightBoundary = bounds.top + bounds.height / 4
 return (
 isPointBetweenTwoPoints(
 point,
 { x: bounds.left, y: bounds.top },
 { x: bounds.left, y: bounds.bottom },
 ) &&
 point.x >= bounds.left + ENTITY_LEFT_SIDE_THRESHOLD &&
 point.x <= bounds.right - ENTITY_RIGHT_SIDE_THRESHOLD &&
 isPointInsideBounds(point, bounds)
 )
 }*/

const isPointWithinPointByValue = (point: Point, center: Point, value: number): boolean => {
	return (
		point.x >= center.x - value &&
		point.x <= center.x + value &&
		point.y >= center.y - value &&
		point.y <= center.y + value
	)
}

const isPointBetweenTwoPoints = (point: Point, start: Point, end: Point): boolean => {
	return (point.x >= start.x && point.x <= end.x) || (point.x >= end.x && point.x <= start.x)
}

const rotatePoint = (point: Point, angle: number, center: Point): Point => {
	const radians = (angle * Math.PI) / 180
	const cos = Math.cos(radians)
	const sin = Math.sin(radians)
	const translatedPoint = {
		x: point.x - center.x,
		y: point.y - center.y,
	}
	const rotatedPoint = {
		x: translatedPoint.x * cos - translatedPoint.y * sin,
		y: translatedPoint.x * sin + translatedPoint.y * cos,
	}
	return {
		x: rotatedPoint.x + center.x,
		y: rotatedPoint.y + center.y,
	}
}
