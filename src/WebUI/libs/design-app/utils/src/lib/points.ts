import { EventPoint, EventWithOffsets } from '@design-app/feature-design-canvas'
import { TransformedPoint } from '@design-app/shared'
import { Point, Size } from '@shared/data-access/models'

export const getTopLeftPointFromTransformedPoint = (
	point: TransformedPoint,
	size: Size,
): TransformedPoint => {
	return {
		x: point.x - size.width / 2,
		y: point.y - size.height / 2,
	} as TransformedPoint
}

export function eventToPointLocation(event: MouseEvent): Point {
	return { x: event.offsetX, y: event.offsetY }
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