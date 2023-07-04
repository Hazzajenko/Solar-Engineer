import { Point } from '@shared/data-access/models'

export const drawCursor = (ctx: CanvasRenderingContext2D, point: Point) => {
	ctx.save()
	ctx.translate(point.x, point.y)
	ctx.fillStyle = 'rgba(0,0,0,0.5)'
	ctx.beginPath()
	ctx.moveTo(42.9742 * 0.5, 31.931 * 0.5)
	ctx.lineTo(8.249 * 0.5, 0.0)
	ctx.lineTo(8.2259 * 0.5, 47.1744 * 0.5)
	ctx.lineTo(18.7634 * 0.5, 37.0918 * 0.5)
	ctx.lineTo(24.9524 * 0.5, 51.2001 * 0.5)
	ctx.lineTo(34.6083 * 0.5, 46.9643 * 0.5)
	ctx.lineTo(28.4193 * 0.5, 32.856 * 0.5)
	ctx.lineTo(42.9742 * 0.5, 31.931 * 0.5)
	ctx.closePath()
	ctx.moveTo(30.6563 * 0.5, 45.4222 * 0.5)
	ctx.lineTo(26.4943 * 0.5, 47.2481 * 0.5)
	ctx.lineTo(19.7877 * 0.5, 31.9602 * 0.5)
	ctx.lineTo(11.2288 * 0.5, 40.1496 * 0.5)
	ctx.lineTo(11.2452 * 0.5, 6.8303 * 0.5)
	ctx.lineTo(35.7716 * 0.5, 29.3832 * 0.5)
	ctx.lineTo(23.9497 * 0.5, 30.1344 * 0.5)
	ctx.lineTo(30.6563 * 0.5, 45.4222 * 0.5)
	ctx.closePath()
	ctx.fill()
	ctx.restore()
}
