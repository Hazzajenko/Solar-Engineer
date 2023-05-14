import { rotate } from './rotate'
import {
	CanvasEntity,
	CompleteEntityBounds,
	EntityBounds,
	Point,
	SAME_AXIS_POSITION,
	SameAxisPosition,
	Size,
	TransformedPoint,
	TrigonometricBoundsTuple,
} from '@shared/data-access/models'

export const getCompleteEntityBounds = (bounds: EntityBounds): CompleteEntityBounds => ({
	...bounds,
	width: bounds.right - bounds.left,
	height: bounds.bottom - bounds.top,
})

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
 * [left, top, right, bottom, centerX, centerY]
 */
export type CompleteEntityBoundsTuple = [number, number, number, number, number, number]
export const getEntityArrayBounds = (element: CanvasEntity): CompleteEntityBoundsTuple => {
	return [
		element.location.x,
		element.location.y,
		element.location.x + element.width,
		element.location.y + element.height,
		element.location.x + element.width / 2,
		element.location.y + element.height / 2,
	]
}

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

export const getBoundsFromCenterPoint = (center: Point, size: Size): EntityBounds => {
	const halfWidth = size.width / 2
	const halfHeight = size.height / 2
	return {
		left: center.x - halfWidth,
		top: center.y - halfHeight,
		right: center.x + halfWidth,
		bottom: center.y + halfHeight,
		centerX: center.x,
		centerY: center.y,
	}
}

export const getCompleteBoundsFromCenterTransformedPoint = (
	center: TransformedPoint,
	size: Size,
): CompleteEntityBounds => {
	const halfWidth = size.width / 2
	const halfHeight = size.height / 2
	return {
		left: center.x - halfWidth,
		top: center.y - halfHeight,
		right: center.x + halfWidth,
		bottom: center.y + halfHeight,
		centerX: center.x,
		centerY: center.y,
		width: size.width,
		height: size.height,
	}
}
