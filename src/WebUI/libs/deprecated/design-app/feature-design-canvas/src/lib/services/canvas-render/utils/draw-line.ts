import { Point } from '@shared/data-access/models'

export const drawLine = (ctx: CanvasRenderingContext2D, a: Point, b: Point) => {
	ctx.beginPath()
	ctx.moveTo(a.x, a.y)
	ctx.lineTo(b.x, b.y)
	ctx.stroke()
}
