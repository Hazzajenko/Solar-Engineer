import { Point } from '@shared/data-access/models'

export function drawSplinesReworkObjects(
	ctx: CanvasRenderingContext2D,
	points: { x: number; y: number }[],
) {
	let cps: number[] = []

	for (let i = 0; i < points.length - 2; i += 1) {
		const { x: x1, y: y1 } = points[i]
		const { x: x2, y: y2 } = points[i + 1]
		const { x: x3, y: y3 } = points[i + 2]

		cps = cps.concat(
			calculateControlPoints(points[i], points[i + 1], points[i + 2]),
			// calculateControlPoints(x1, y1, x2, y2, x3, y3),
		)
	}

	console.log('cps', cps)
	console.log('points', points)
	drawControlPoints(ctx, cps)
	drawPoints(ctx, cps)
	drawCurvedPath(ctx, cps, points)
}

function calculateControlPoints(p1: Point, p2: Point, p3: Point): [number, number, number, number] {
	const t = 0.5
	const d01 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
	const d12 = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2))
	const d012 = d01 + d12
	const v = [(p3.x - p1.x) / d012, (p3.y - p1.y) / d012]
	const c1 = [p2.x - v[0] * t * d01, p2.y - v[1] * t * d01]
	const c2 = [p2.x + v[0] * t * d12, p2.y + v[1] * t * d12]
	return [...c1, ...c2] as [number, number, number, number]
}

function calculateVector(arr: { x: number; y: number }[], i: number, j: number) {
	const { x: xj, y: yj } = arr[j]
	const { x: xi, y: yi } = arr[i]
	return [xj - xi, yj - yi]
}

// given an array of x,y's, return distance between any two,
// note that i and j are indexes to the points, not directly into the array.
function calculateDistance(arr: number[], i: number, j: number) {
	return Math.sqrt(
		Math.pow(arr[2 * i] - arr[2 * j], 2) + Math.pow(arr[2 * i + 1] - arr[2 * j + 1], 2),
	)
}

function drawCurvedPath(ctx: CanvasRenderingContext2D, cps: number[], pts: number[]) {
	const len = pts.length / 2 // number of points
	if (len < 2) return
	if (len == 2) {
		ctx.beginPath()
		ctx.moveTo(pts[0], pts[1])
		ctx.lineTo(pts[2], pts[3])
		ctx.stroke()
	} else {
		ctx.beginPath()
		ctx.moveTo(pts[0], pts[1])
		// from point 0 to point 1 is a quadratic
		ctx.quadraticCurveTo(cps[0], cps[1], pts[2], pts[3])
		// for all middle points, connect with bezier
		let i = 2
		for (i = 2; i < len - 1; i += 1) {
			// console.log("to", pts[2*i], pts[2*i+1]);
			ctx.bezierCurveTo(
				cps[(2 * (i - 1) - 1) * 2],
				cps[(2 * (i - 1) - 1) * 2 + 1],
				cps[2 * (i - 1) * 2],
				cps[2 * (i - 1) * 2 + 1],
				pts[i * 2],
				pts[i * 2 + 1],
			)
		}
		ctx.quadraticCurveTo(
			cps[(2 * (i - 1) - 1) * 2],
			cps[(2 * (i - 1) - 1) * 2 + 1],
			pts[i * 2],
			pts[i * 2 + 1],
		)
		ctx.stroke()
	}
}

function drawControlPoints(ctx: CanvasRenderingContext2D, cps: number[]) {
	for (let i = 0; i < cps.length; i += 4) {
		showPt(ctx, cps[i], cps[i + 1], 'pink')
		showPt(ctx, cps[i + 2], cps[i + 3], 'pink')
		drawLine(ctx, cps[i], cps[i + 1], cps[i + 2], cps[i + 3], 'pink')
	}
}

function drawPoints(ctx: CanvasRenderingContext2D, pts: number[]) {
	for (let i = 0; i < pts.length; i += 2) {
		showPt(ctx, pts[i], pts[i + 1], 'black')
	}
}

function showPt(ctx: CanvasRenderingContext2D, x: number, y: number, fillStyle?: string) {
	ctx.save()
	ctx.beginPath()
	if (fillStyle) {
		ctx.fillStyle = fillStyle
	}
	ctx.arc(x, y, 5, 0, 2 * Math.PI)
	ctx.fill()
	ctx.restore()
}

function drawLine(
	ctx: CanvasRenderingContext2D,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	strokeStyle?: string,
) {
	ctx.beginPath()
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
	if (strokeStyle) {
		ctx.save()
		ctx.strokeStyle = strokeStyle
		ctx.stroke()
		ctx.restore()
	} else {
		ctx.save()
		ctx.strokeStyle = 'pink'
		ctx.stroke()
		ctx.restore()
	}
}
