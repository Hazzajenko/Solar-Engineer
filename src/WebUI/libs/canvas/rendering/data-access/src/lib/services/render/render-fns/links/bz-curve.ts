import { Point } from '@shared/data-access/models'

export function bzCurve(ctx: CanvasRenderingContext2D, points: Point[], f = 0.3, t = 0.6) {
	// if (typeof(f) == 'undefined') f = 0.3;
	// if (typeof(t) == 'undefined') t = 0.6;

	ctx.beginPath()
	ctx.moveTo(points[0].x, points[0].y)

	let m = 0
	let dx1 = 0
	let dy1 = 0
	let dx2 = 0
	let dy2 = 0

	let preP = points[0]

	for (let i = 1; i < points.length; i++) {
		const curP = points[i]
		const nexP = points[i + 1]
		if (nexP) {
			m = gradient(preP, nexP)
			dx2 = (nexP.x - curP.x) * -f
			dy2 = dx2 * m * t
		} else {
			dx2 = 0
			dy2 = 0
		}

		ctx.bezierCurveTo(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y)

		dx1 = dx2
		dy1 = dy2
		preP = curP
	}
	ctx.stroke()
}

function gradient(a: Point, b: Point) {
	return (b.y - a.y) / (b.x - a.x)
}
