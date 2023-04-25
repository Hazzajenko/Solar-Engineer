import {
	CompleteEntityBounds,
	EntityBounds,
	eventToPointLocation,
	TransformedPoint,
} from '@design-app/feature-design-canvas'
import { Point, Size } from '@shared/data-access/models'

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

export const getBoundsFromMouseEvent = (event: MouseEvent, size: Size): EntityBounds => {
	const center = eventToPointLocation(event)
	return getBoundsFromCenterPoint(center, size)
}

export const isPointInsideBounds = (point: Point, bounds: EntityBounds): boolean => {
	return (
		point.x >= bounds.left &&
		point.x <= bounds.right &&
		point.y >= bounds.top &&
		point.y <= bounds.bottom
	)
}

export const getCenterPointFromBounds = (bounds: EntityBounds): Point => {
	return {
		x: bounds.centerX,
		y: bounds.centerY,
	}
}

export const getCenterPointFromTwoPoints = (point1: Point, point2: Point): Point => {
	return {
		x: (point1.x + point2.x) / 2,
		y: (point1.y + point2.y) / 2,
	}
}