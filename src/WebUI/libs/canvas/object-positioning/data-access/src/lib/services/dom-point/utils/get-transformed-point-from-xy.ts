import { Point, TransformedPoint } from '@shared/data-access/models'

export const getTransformedPointFromXY = (ctx: CanvasRenderingContext2D, point: Point) => {
	const originalPoint = new DOMPoint(point.x, point.y)
	return ctx.getTransform().invertSelf().transformPoint(originalPoint) as TransformedPoint
}
