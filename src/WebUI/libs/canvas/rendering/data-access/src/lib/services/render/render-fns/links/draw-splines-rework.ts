import { Bezier } from 'bezier-js'
import { Point } from '@shared/data-access/models'
import { getBezierXYByTUsingAPoints, isPointOnLine } from '@canvas/utils'

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

	// drawControlPoints(ctx, controlPoints)
	// drawPoints(ctx, controlPoints)
	drawCurvedPath(ctx, controlPoints, points)
	// drawPointsForCurvedLine(ctx, points)
	// drawCachedBezierPoints(ctx)
	// getLineIntersectionsForBezier()
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
	// const curvesV2: BezierOf8[] = []
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
	cachedBeziers = curves.map((curve) =>
		Bezier.quadraticFromPoints(
			{ x: curve[0], y: curve[1] },
			{ x: curve[2], y: curve[3] },
			{ x: curve[4], y: curve[5] },
		),
	)
	// cachedBeziers = curves.map((curve) => new Bezier(...curve))
	console.log('cachedBeziers', cachedBeziers)
	return curves
}

const createBezierFromPoints = (points: Point[]): Bezier => {
	const [start, control, end] = points
	return Bezier.quadraticFromPoints(start, control, end)
}

function drawCachedBezierPoints(ctx: CanvasRenderingContext2D) {
	/*	cachedBeziers.forEach((bezier) => {
	 bezier.getLUT().forEach((point) => {
	 ctx.beginPath()
	 ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI)
	 ctx.stroke()
	 })
	 })*/
}

function getLineIntersectionsForBezier() {
	for (let i = 0; i < cachedBeziers.length - 2; i += 1) {
		const curve = cachedBeziers[i]
		const nextCurve = cachedBeziers[i + 1]
		const intersections = curve.intersects(nextCurve)
		console.log('intersections', intersections)
	}
}

type BezierOf8 = [number, number, number, number, number, number, number, number]

let updatedCacheLines: BezierOf8[] = []

function drawCurvedPath(ctx: CanvasRenderingContext2D, controlPoints: number[], points: number[]) {
	const cachedLines: BezierOf8[] = []
	const amountOfPoints = points.length / 2
	if (amountOfPoints < 2) return
	if (amountOfPoints == 2) {
		ctx.beginPath()
		ctx.moveTo(points[0], points[1])
		ctx.lineTo(points[2], points[3])
		ctx.stroke()
	} else {
		ctx.beginPath()
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
			cachedLines.push([
				points[i * 2 - 2],
				points[i * 2 - 1],
				controlPoints[(2 * (i - 1) - 1) * 2],
				controlPoints[(2 * (i - 1) - 1) * 2 + 1],
				controlPoints[2 * (i - 1) * 2],
				controlPoints[2 * (i - 1) * 2 + 1],
				points[i * 2],
				points[i * 2 + 1],
			])

			// updatedCacheLines
		}
		ctx.quadraticCurveTo(
			controlPoints[(2 * (i - 1) - 1) * 2],
			controlPoints[(2 * (i - 1) - 1) * 2 + 1],
			points[i * 2],
			points[i * 2 + 1],
		)
		ctx.stroke()
		console.log('cachedLines', cachedLines)
		if (cachedLines.length > 0) {
			/*const t = 0.5
			 cachedLines.forEach((line) => {
			 const point2 = getBezierXY(
			 [line[0], line[1]],
			 [line[2], line[3]],
			 [line[4], line[5]],
			 [line[6], line[7]],
			 t,
			 )
			 console.log('point2', point2)
			 showPt(ctx, point2[0], point2[1], 'blue')
			 })*/
			drawAllTPointsForCurve(ctx, cachedLines)
			createLinesBetweenTPoints(ctx, cachedLines)
			updatedCacheLines = cachedLines
		}
	}
}

const drawAllTPointsForCurve = (ctx: CanvasRenderingContext2D, curves: BezierOf8[]) => {
	curves.forEach((line) => {
		for (let t = 0; t < 1; t += 0.1) {
			const point2 = getBezierXYByTUsingAPoints(
				[line[0], line[1]],
				[line[2], line[3]],
				[line[4], line[5]],
				[line[6], line[7]],
				t,
			)
			showPt(ctx, point2[0], point2[1], 'blue')
		}
	})
}

function createLinesBetweenTPoints(ctx: CanvasRenderingContext2D, curves: BezierOf8[]) {
	for (let i = 0; i < curves.length; i++) {
		const line = curves[i]
		for (let t = 0; t < 1; t += 0.1) {
			const pointStart = getBezierXYByTUsingAPoints(
				[line[0], line[1]],
				[line[2], line[3]],
				[line[4], line[5]],
				[line[6], line[7]],
				t,
			)
			const pointEnd = getBezierXYByTUsingAPoints(
				[line[0], line[1]],
				[line[2], line[3]],
				[line[4], line[5]],
				[line[6], line[7]],
				t + 0.1,
			)
			drawLine(ctx, pointStart[0], pointStart[1], pointEnd[0], pointEnd[1])
		}
	}
}

function convertBezierOf8ToLineNumberArray(curves: BezierOf8[]) {
	return curves.reduce((acc, curve) => {
		const lines = []
		for (let t = 0; t < 1; t += 0.1) {
			const pointStart = getBezierXYByTUsingAPoints(
				[curve[0], curve[1]],
				[curve[2], curve[3]],
				[curve[4], curve[5]],
				[curve[6], curve[7]],
				t,
			)
			const pointEnd = getBezierXYByTUsingAPoints(
				[curve[0], curve[1]],
				[curve[2], curve[3]],
				[curve[4], curve[5]],
				[curve[6], curve[7]],
				t + 0.1,
			)
			lines.push(pointStart[0], pointStart[1], pointEnd[0], pointEnd[1])
		}
		return [...acc, ...lines]
	}, [] as number[])
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

const getPointsInBezierByT = () => {
	const bezier = cachedCurves[0]
	// const points = bezier.getLUT(100)
	// getBezierXYByT(bezier, t)
}

function distance(p1: Point, p2: Point): number {
	return Math.sqrt(distanceSq(p1, p2))
}

function distanceSq(p1: Point, p2: Point): number {
	return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
}

export const isPointOnCurvedPathV4 = (point: Point) => {
	return updatedCacheLines.some((line) => {
		let result = false
		for (let i = 1; i < 10; i++) {
			const t = i / 10
			const point2 = getBezierXYByTUsingAPoints(
				[line[0], line[1]],
				[line[2], line[3]],
				[line[4], line[5]],
				[line[6], line[7]],
				t,
			)
			const far = distance(point, { x: point2[0], y: point2[1] })
			if (far < 50) {
				console.log('far', far)
			}
			if (far < 5) {
				result = true
				break
			}
		}
		return result
	})
}

export function isPointOnCurvedPathV3(point: Point) {
	return !!cachedBeziers.find((bezier) => {
		const curvePoints = bezier.getLUT(100)
		return isPointOnLine(point, curvePoints)
	})
	/*const tolerance = 5 // adjust this value to change the tolerance for how close the point needs to be to the path
	 for (let i = 0; i < cachedBeziers.length; i += 1) {
	 const curve = cachedBeziers[i]

	 /!*		const distanceFromMouse = curve.project({ x: point.x, y: point.y }).d
	 if (!distanceFromMouse) return false
	 if (distanceFromMouse < tolerance) {
	 console.log('distanceFromMouse', distanceFromMouse)
	 return true
	 }*!/
	 // const bez = new Bezier(curve[0], curve[1], curve[2], curve[3], curve[4], curve[5])
	 // bez.getLUT()
	 const curvePoints = curve.getLUT(100)
	 return isPointOnLine(point, curvePoints)
	 /!*		for (let j = 0; j < curvePoints.length; j += 1) {
	 const curvePoint = curvePoints[j]
	 const distance = Math.sqrt(
	 Math.pow(point.x - curvePoint.x, 2) + Math.pow(point.y - curvePoint.y, 2),
	 )
	 if (distance < tolerance) {
	 return true
	 }
	 }*!/
	 }
	 return false*/
}

export function isPointOnCurvedPathV2(point: Point) {
	const tolerance = 5 // adjust this value to change the tolerance for how close the point needs to be to the path
	for (let i = 0; i < cachedBeziers.length; i += 1) {
		const curve = cachedBeziers[i]

		const distanceFromMouse = curve.project({ x: point.x, y: point.y }).d
		if (!distanceFromMouse) return false
		if (distanceFromMouse < tolerance) {
			console.log('distanceFromMouse', distanceFromMouse)
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

// let ctxCache: CanvasRenderingContext2D | null = null

export function isPointOnCurvedPath(
	ctx: CanvasRenderingContext2D,
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
		if (
			ctx.isPointInStroke(curve, point.x, point.y) ||
			ctx.isPointInPath(curve, point.x, point.y)
		) {
			console.log('isPointInStroke', ctx)
			return true
		}
		// let ctx: CanvasRenderingContext2D
		/*		if (!ctxCache) {
		 const canvas = document.getElementById('canvas') as HTMLCanvasElement
		 // const canvas = document.createElement('canvas')
		 // canvas.width = 1000
		 // canvas.height = 1000
		 ctxCache = canvas.getContext('2d')
		 /!*			if (ctxCache) {
		 ctx = ctxCache
		 }*!/
		 }
		 if (ctxCache) {
		 const ctx = ctxCache

		 if (
		 ctx.isPointInStroke(curve, point.x, point.y) ||
		 ctx.isPointInPath(curve, point.x, point.y)
		 ) {
		 console.log('isPointInStroke', ctx)
		 return true
		 }
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
