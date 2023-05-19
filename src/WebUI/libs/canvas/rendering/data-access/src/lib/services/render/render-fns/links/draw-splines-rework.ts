import { Bezier } from 'bezier-js'
import { Point } from '@shared/data-access/models'

export function drawSplinesRework(ctx: CanvasRenderingContext2D, points: number[]) {
	let controlPoints: number[] = []

	for (let i = 0; i < points.length - 2; i += 1) {
		controlPoints = controlPoints.concat(
			calculateControlPoints(
				points[2 * i],
				points[2 * i + 1],
				points[2 * i + 2],
				points[2 * i + 3],
				points[2 * i + 4],
				points[2 * i + 5],
			),
		)
	}

	// console.log('controlPoints', controlPoints)

	drawControlPoints(ctx, controlPoints)
	drawPoints(ctx, controlPoints)
	drawCurvedPath(ctx, controlPoints, points)
	drawPointsForCurvedLine(ctx, points)
}

function calculateControlPoints(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	x3: number,
	y3: number,
) {
	const tension = 0.5

	const args = [x1, y1, x2, y2, x3, y3]
	const startAndFinishVector = calculateVector(args, 0, 2)
	const startToMiddleDistance = calculateDistance(args, 0, 1)
	const middleToEndDistance = calculateDistance(args, 1, 2)
	const totalDistance = startToMiddleDistance + middleToEndDistance
	return [
		x2 - (startAndFinishVector[0] * tension * startToMiddleDistance) / totalDistance,
		y2 - (startAndFinishVector[1] * tension * startToMiddleDistance) / totalDistance,
		x2 + (startAndFinishVector[0] * tension * middleToEndDistance) / totalDistance,
		y2 + (startAndFinishVector[1] * tension * middleToEndDistance) / totalDistance,
	]
}

function calculateVector(arr: number[], i: number, j: number) {
	return [arr[2 * j] - arr[2 * i], arr[2 * j + 1] - arr[2 * i + 1]]
}

function calculateDistance(arr: number[], i: number, j: number) {
	return Math.sqrt(
		Math.pow(arr[2 * i] - arr[2 * j], 2) + Math.pow(arr[2 * i + 1] - arr[2 * j + 1], 2),
	)
}

/**
 * @description draw control points
 * [Control point 1 X, Control point 1 Y, Control point 2 X, Control point 2 Y, End point X, End point Y]
 */
export type BezierCurve = Readonly<[number, number, number, number, number, number]>

const isBezierCurve = (curve: unknown): curve is BezierCurve => {
	if (!Array.isArray(curve)) return false
	if (curve.length !== 6) return false
	return !curve.some((value) => typeof value !== 'number')
}

let cachedCurves: BezierCurve[] = []
let cachedBeziers: Bezier[] = []

function createCurvedPaths(points: number[]): BezierCurve[] {
	const curves: BezierCurve[] = []
	for (let i = 0; i < points.length - 2; i += 1) {
		const curve: (number | undefined)[] = [
			points[2 * i],
			points[2 * i + 1],
			points[2 * i + 2],
			points[2 * i + 3],
			points[2 * i + 4],
			points[2 * i + 5],
		]
		if (!isBezierCurve(curve)) {
			continue
		}
		// curve.inflections()
		console.log('curve', curve)
		curves.push(curve)
	}
	// console.log('curves', curves)
	cachedCurves = curves
	cachedBeziers = curves.map((curve) => new Bezier(...curve))
	console.log('cachedBeziers', cachedBeziers)
	return curves
}

function drawCurvedPath(ctx: CanvasRenderingContext2D, controlPoints: number[], points: number[]) {
	const amountOfPoints = points.length / 2
	if (amountOfPoints < 2) return
	if (amountOfPoints == 2) {
		ctx.beginPath()
		ctx.moveTo(points[0], points[1])
		ctx.lineTo(points[2], points[3])
		ctx.stroke()
	} else {
		/*	curve.moveTo(pathPoints[i], pathPoints[i + 1])
		 curve.bezierCurveTo(
		 controlPoints[0],
		 controlPoints[1],
		 controlPoints[2],
		 controlPoints[3],
		 pathPoints[i + 4],
		 pathPoints[i + 5],
		 )*/
		ctx.beginPath()
		// const curve = new Path2D()
		// curve.addPath(ctx)
		/*		curve.moveTo(points[0], points[1])
		 // from point 0 to point 1 is a quadratic
		 curve.quadraticCurveTo(controlPoints[0], controlPoints[1], points[2], points[3])
		 // for all middle points, connect with bezier
		 createCurvedPaths(points)
		 let i = 2
		 for (i = 2; i < amountOfPoints - 1; i += 1) {
		 curve.bezierCurveTo(
		 controlPoints[(2 * (i - 1) - 1) * 2],
		 controlPoints[(2 * (i - 1) - 1) * 2 + 1],
		 controlPoints[2 * (i - 1) * 2],
		 controlPoints[2 * (i - 1) * 2 + 1],
		 points[i * 2],
		 points[i * 2 + 1],
		 )
		 }
		 curve.quadraticCurveTo(
		 controlPoints[(2 * (i - 1) - 1) * 2],
		 controlPoints[(2 * (i - 1) - 1) * 2 + 1],
		 points[i * 2],
		 points[i * 2 + 1],
		 )

		 console.log('curve', curve)*/
		// curve.
		ctx.moveTo(points[0], points[1])
		// from point 0 to point 1 is a quadratic
		ctx.quadraticCurveTo(controlPoints[0], controlPoints[1], points[2], points[3])
		// for all middle points, connect with bezier
		createCurvedPaths(points)
		let i = 2
		for (i = 2; i < amountOfPoints - 1; i += 1) {
			ctx.bezierCurveTo(
				controlPoints[(2 * (i - 1) - 1) * 2],
				controlPoints[(2 * (i - 1) - 1) * 2 + 1],
				controlPoints[2 * (i - 1) * 2],
				controlPoints[2 * (i - 1) * 2 + 1],
				points[i * 2],
				points[i * 2 + 1],
			)
		}
		ctx.quadraticCurveTo(
			controlPoints[(2 * (i - 1) - 1) * 2],
			controlPoints[(2 * (i - 1) - 1) * 2 + 1],
			points[i * 2],
			points[i * 2 + 1],
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

const drawPointsForCurvedLine = (ctx: CanvasRenderingContext2D, points: number[]) => {
	for (let i = 0; i < points.length; i = i + 2) {
		const point1 = points[i]
		const point2 = points[i + 1]
		ctx.beginPath()
		ctx.arc(point1, point2, 5, 0, 2 * Math.PI)
		ctx.stroke()
	}
}

export function isPointOnCurvedPathV2(point: Point) {
	const tolerance = 5 // adjust this value to change the tolerance for how close the point needs to be to the path
	for (let i = 0; i < cachedBeziers.length; i += 1) {
		const curve = cachedBeziers[i]

		const distanceFromMouse = curve.project({ x: point.x, y: point.y }).d
		if (!distanceFromMouse) return false
		if (distanceFromMouse < tolerance) {
			return true
		}
		// const bez = new Bezier(curve[0], curve[1], curve[2], curve[3], curve[4], curve[5])
		// bez.getLUT()
		/*		const curvePoints = curve.getLUT(100)
		 for (let j = 0; j < curvePoints.length; j += 1) {
		 const curvePoint = curvePoints[j]
		 const distance = Math.sqrt(
		 Math.pow(point.x - curvePoint.x, 2) + Math.pow(point.y - curvePoint.y, 2),
		 )
		 if (distance < tolerance) {
		 return true
		 }
		 }*/
	}
	return false
}

export function isPointOnCurvedPath( // ctx: CanvasRenderingContext2D,
	point: {
		x: number
		y: number
	},
	pathPoints: number[],
): boolean {
	const tolerance = 50 // adjust this value to change the tolerance for how close the point needs to be to the path
	for (let i = 0; i < pathPoints.length - 6; i += 6) {
		const controlPoints = calculateControlPoints(
			pathPoints[i],
			pathPoints[i + 1],
			pathPoints[i + 2],
			pathPoints[i + 3],
			pathPoints[i + 4],
			pathPoints[i + 5],
		)
		const curve = new Path2D()
		curve.moveTo(pathPoints[i], pathPoints[i + 1])
		curve.bezierCurveTo(
			controlPoints[0],
			controlPoints[1],
			controlPoints[2],
			controlPoints[3],
			pathPoints[i + 4],
			pathPoints[i + 5],
		)
		/*		if (
		 ctx.isPointInStroke(curve, point.x, point.y) ||
		 ctx.isPointInPath(curve, point.x, point.y)
		 ) {
		 return true
		 }*/
		const distance = calculateDistanceToCurve(point, pathPoints.slice(i, i + 6))
		if (distance && distance < tolerance) {
			return true
		}
	}
	return false
}

function calculateDistanceToCurve(
	point: {
		x: number
		y: number
	},
	curvePoints: number[],
): number | undefined {
	const curve = new Bezier(curvePoints)
	return curve.project({ x: point.x, y: point.y }).d
}

/*
 function catmullRomSpline(points: Point[], alpha = 0.5): Point[] {
 const result: Point[] = []

 for (let i = 1; i < points.length - 2; i++) {
 const p0 = points[i - 1]
 const p1 = points[i]
 const p2 = points[i + 1]
 const p3 = points[i + 2]

 const d1 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2))
 const d2 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
 const d3 = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2))

 const b1 = {
 x: p1.x + ((p2.x - p0.x) * alpha) / (d1 + d2),
 y: p1.y + ((p2.y - p0.y) * alpha) / (d1 + d2),
 }

 const b2 = {
 x: p2.x - ((p3.x - p1.x) * alpha) / (d2 + d3),
 y: p2.y - ((p3.y - p1.y) * alpha) / (d2 + d3),
 }

 if (i === 1) {
 result.push(p1)
 }

 result.push(b1)
 result.push(b2)

 if (i === points.length - 3) {
 result.push(p2)
 }
 }

 return result
 }
 */
