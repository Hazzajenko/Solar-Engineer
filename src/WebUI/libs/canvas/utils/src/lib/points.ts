import {
	Axis,
	EventPoint,
	EventWithOffsets,
	Point,
	Size,
	TransformedPoint,
} from '@shared/data-access/models'

export const getTopLeftPointFromTransformedPoint = (
	point: TransformedPoint,
	size: Size,
): TransformedPoint => {
	return {
		x: point.x - size.width / 2,
		y: point.y - size.height / 2,
	} as TransformedPoint
}

export function eventToPointLocation(event: MouseEvent | TouchEvent): Point {
	if (event instanceof MouseEvent) {
		return { x: event.offsetX, y: event.offsetY }
	}
	return singleTouchEventToPointLocation(event)
}

export const singleTouchEventToPointLocation = (event: TouchEvent): Point => {
	const touch = event.touches[0]
	return { x: touch.clientX, y: touch.clientY }
}

export const singleTouchEventEndToPointLocation = (event: TouchEvent): Point => {
	const touch = event.changedTouches[0]
	return { x: touch.clientX, y: touch.clientY }
}

export const eventToEventPoint = (event: MouseEvent | PointerEvent): EventPoint => ({
	x: event.offsetX,
	y: event.offsetY,
	_type: 'EventPoint',
})

export const eventOffsetsToPointLocation = (event: EventWithOffsets): Point => ({
	x: event.offsetX,
	y: event.offsetY,
})

export function getTransformedPointFromXy(ctx: CanvasRenderingContext2D, point: Point) {
	const originalPoint = new DOMPoint(point.x, point.y)
	return ctx.getTransform().invertSelf().transformPoint(originalPoint) as TransformedPoint
}

export function getTransformedPointFromEvent(ctx: CanvasRenderingContext2D, event: MouseEvent) {
	const originalPoint = new DOMPoint(event.offsetX, event.offsetY)

	return ctx.getTransform().invertSelf().transformPoint(originalPoint) as TransformedPoint
}

export const adjustTwoPointCoorsByValue = (
	point1: Point,
	point2: Point,
	value: number,
): [Point, Point] => {
	const dx = point2.x - point1.x
	const dy = point2.y - point1.y
	const length = Math.sqrt(dx * dx + dy * dy)
	const unitX = dx / length
	const unitY = dy / length

	const newPoint1 = {
		x: point1.x + value * unitY,
		y: point1.y - value * unitX,
	}
	const newPoint2 = {
		x: point2.x + value * unitY,
		y: point2.y - value * unitX,
	}

	return [newPoint1, newPoint2]
}

export const adjustTwoPointTuplesByValueAndAxis = (
	point1X: number,
	point1Y: number,
	point2X: number,
	point2Y: number,
	value: number,
	axis: Axis,
) => {
	const dx = point2X - point1X
	const dy = point2Y - point1Y
	const length = Math.sqrt(dx * dx + dy * dy)
	const unitX = dx / length
	const unitY = dy / length

	const newPoint1 = {
		x: point1X + value * unitY,
		y: point1Y - value * unitX,
	}
	const newPoint2 = {
		x: point2X + value * unitY,
		y: point2Y - value * unitX,
	}

	if (axis === 'x') {
		return [newPoint1.x, point1Y, newPoint2.x, point2Y]
	}
	return [point1X, newPoint1.y, point2X, newPoint2.y]
	/*	if (axis === 'y') {
	 return [point1X, newPoint1.y, point2X, newPoint2.y]
	 }*/

	// return [axis === 'x' ? newPoint1.x : newPoint1.y, axis === 'x' ? newPoint2.x : newPoint2.y]
}
export const adjustTwoPointTuplesByValue = (
	point1X: number,
	point1Y: number,
	point2X: number,
	point2Y: number,
	value: number,
) => {
	const dx = point2X - point1X
	const dy = point2Y - point1Y
	const length = Math.sqrt(dx * dx + dy * dy)
	const unitX = dx / length
	const unitY = dy / length

	const newPoint1 = {
		x: point1X + value * unitY,
		y: point1Y - value * unitX,
	}
	const newPoint2 = {
		x: point2X + value * unitY,
		y: point2Y - value * unitX,
	}

	return [
		[newPoint1.x, newPoint1.y],
		[newPoint2.x, newPoint2.y],
	]
}
