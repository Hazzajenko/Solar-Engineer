export type Point = [number, number]

// distance between 2 points
function distance(p1: Point, p2: Point): number {
	return Math.sqrt(distanceSq(p1, p2))
}

// distance between 2 points squared
function distanceSq(p1: Point, p2: Point): number {
	return Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2)
}

// Sistance squared from a point p to the line segment vw
function distanceToSegmentSq(p: Point, v: Point, w: Point): number {
	const l2 = distanceSq(v, w)
	if (l2 === 0) {
		return distanceSq(p, v)
	}
	let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2
	t = Math.max(0, Math.min(1, t))
	return distanceSq(p, lerp(v, w, t))
}

function lerp(a: Point, b: Point, t: number): Point {
	return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

// Adapted from https://seant23.wordpress.com/2010/11/12/offset-bezier-curves/
function flatness(points: Point[], offset: number): number {
	const p1 = points[offset + 0]
	const p2 = points[offset + 1]
	const p3 = points[offset + 2]
	const p4 = points[offset + 3]

	let ux = 3 * p2[0] - 2 * p1[0] - p4[0]
	ux *= ux
	let uy = 3 * p2[1] - 2 * p1[1] - p4[1]
	uy *= uy
	let vx = 3 * p3[0] - 2 * p4[0] - p1[0]
	vx *= vx
	let vy = 3 * p3[1] - 2 * p4[1] - p1[1]
	vy *= vy

	if (ux < vx) {
		ux = vx
	}

	if (uy < vy) {
		uy = vy
	}

	return ux + uy
}

function getPointsOnBezierCurveWithSplitting(
	points: Point[],
	offset: number,
	tolerance: number,
	newPoints?: Point[],
): Point[] {
	const outPoints = newPoints || []
	if (flatness(points, offset) < tolerance) {
		const p0 = points[offset + 0]
		if (outPoints.length) {
			const d = distance(outPoints[outPoints.length - 1], p0)
			if (d > 1) {
				outPoints.push(p0)
			}
		} else {
			outPoints.push(p0)
		}
		outPoints.push(points[offset + 3])
	} else {
		// subdivide
		const t = 0.5
		const p1 = points[offset + 0]
		const p2 = points[offset + 1]
		const p3 = points[offset + 2]
		const p4 = points[offset + 3]

		const q1 = lerp(p1, p2, t)
		const q2 = lerp(p2, p3, t)
		const q3 = lerp(p3, p4, t)

		const r1 = lerp(q1, q2, t)
		const r2 = lerp(q2, q3, t)

		const red = lerp(r1, r2, t)

		getPointsOnBezierCurveWithSplitting([p1, q1, r1, red], 0, tolerance, outPoints)
		getPointsOnBezierCurveWithSplitting([red, r2, q3, p4], 0, tolerance, outPoints)
	}
	return outPoints
}

export function simplify(points: Point[], distance: number): Point[] {
	return simplifyPoints(points, 0, points.length, distance)
}

// Ramer–Douglas–Peucker algorithm
// https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
function simplifyPoints(
	points: Point[],
	start: number,
	end: number,
	epsilon: number,
	newPoints?: Point[],
): Point[] {
	const outPoints = newPoints || []

	// find the most distance point from the endpoints
	const s = points[start]
	const e = points[end - 1]
	let maxDistSq = 0
	let maxNdx = 1
	for (let i = start + 1; i < end - 1; ++i) {
		const distSq = distanceToSegmentSq(points[i], s, e)
		if (distSq > maxDistSq) {
			maxDistSq = distSq
			maxNdx = i
		}
	}

	// if that point is too far, split
	if (Math.sqrt(maxDistSq) > epsilon) {
		simplifyPoints(points, start, maxNdx + 1, epsilon, outPoints)
		simplifyPoints(points, maxNdx, end, epsilon, outPoints)
	} else {
		if (!outPoints.length) {
			outPoints.push(s)
		}
		outPoints.push(e)
	}

	return outPoints
}

export function pointsOnBezierCurves(
	points: Point[],
	tolerance = 0.15,
	distance?: number,
): Point[] {
	const newPoints: Point[] = []
	const numSegments = (points.length - 1) / 3
	for (let i = 0; i < numSegments; i++) {
		const offset = i * 3
		getPointsOnBezierCurveWithSplitting(points, offset, tolerance, newPoints)
	}
	if (distance && distance > 0) {
		return simplifyPoints(newPoints, 0, newPoints.length, distance)
	}
	return newPoints
}

/*export const getControlPointsForBezierCurve = (
 element: NonDeleted<ExcalidrawLinearElement>,
 endPoint: Point,
 ) => {
 const shape = getShapeForElement(element as ExcalidrawLinearElement)
 if (!shape) {
 return null
 }

 const ops = getCurvePathOps(shape[0])
 let currentP: Mutable<Point> = [0, 0]
 let index = 0
 let minDistance = Infinity
 let controlPoints: Mutable<Point>[] | null = null

 while (index < ops.length) {
 const { op, data } = ops[index]
 if (op === 'move') {
 currentP = data as unknown as Mutable<Point>
 }
 if (op === 'bcurveTo') {
 const p0 = currentP
 const p1 = [data[0], data[1]] as Mutable<Point>
 const p2 = [data[2], data[3]] as Mutable<Point>
 const p3 = [data[4], data[5]] as Mutable<Point>
 const distance = distance2d(p3[0], p3[1], endPoint[0], endPoint[1])
 if (distance < minDistance) {
 minDistance = distance
 controlPoints = [p0, p1, p2, p3]
 }
 currentP = p3
 }
 index++
 }

 return controlPoints
 }

 export const getPointsInBezierCurve = (
 element: NonDeleted<ExcalidrawLinearElement>,
 endPoint: Point,
 ) => {
 const controlPoints: Mutable<Point>[] = getControlPointsForBezierCurve(element, endPoint)!
 if (!controlPoints) {
 return []
 }
 const pointsOnCurve: Mutable<Point>[] = []
 let t = 1
 // Take 20 points on curve for better accuracy
 while (t > 0) {
 const point = getBezierXY(
 controlPoints[0],
 controlPoints[1],
 controlPoints[2],
 controlPoints[3],
 t,
 )
 pointsOnCurve.push([point[0], point[1]])
 t -= 0.05
 }
 if (pointsOnCurve.length) {
 if (arePointsEqual(pointsOnCurve.at(-1)!, endPoint)) {
 pointsOnCurve.push([endPoint[0], endPoint[1]])
 }
 }
 return pointsOnCurve
 }

 export const getBezierCurveArcLengths = (
 element: NonDeleted<ExcalidrawLinearElement>,
 endPoint: Point,
 ) => {
 const arcLengths: number[] = []
 arcLengths[0] = 0
 const points = getPointsInBezierCurve(element, endPoint)
 let index = 0
 let distance = 0
 while (index < points.length - 1) {
 const segmentDistance = distance2d(
 points[index][0],
 points[index][1],
 points[index + 1][0],
 points[index + 1][1],
 )
 distance += segmentDistance
 arcLengths.push(distance)
 index++
 }

 return arcLengths
 }

 export const getBezierCurveLength = (
 element: NonDeleted<ExcalidrawLinearElement>,
 endPoint: Point,
 ) => {
 const arcLengths = getBezierCurveArcLengths(element, endPoint)
 return arcLengths.at(-1) as number
 }

 // This maps interval to actual interval t on the curve so that when t = 0.5, its actually the point at 50% of the length
 export const mapIntervalToBezierT = (
 // element: NonDeleted<ExcalidrawLinearElement>,
 endPoint: Point,
 interval: number, // The interval between 0 to 1 for which you want to find the point on the curve,
 ) => {
 const arcLengths = getBezierCurveArcLengths(element, endPoint)
 const pointsCount = arcLengths.length - 1
 const curveLength = arcLengths.at(-1) as number
 const targetLength = interval * curveLength
 let low = 0
 let high = pointsCount
 let index = 0
 // Doing a binary search to find the largest length that is less than the target length
 while (low < high) {
 index = Math.floor(low + (high - low) / 2)
 if (arcLengths[index] < targetLength) {
 low = index + 1
 } else {
 high = index
 }
 }
 if (arcLengths[index] > targetLength) {
 index--
 }
 if (arcLengths[index] === targetLength) {
 return index / pointsCount
 }

 return (
 1 -
 (index + (targetLength - arcLengths[index]) / (arcLengths[index + 1] - arcLengths[index])) /
 pointsCount
 )
 }*/

export const arePointsEqual = (p1: Point, p2: Point) => {
	return p1[0] === p2[0] && p1[1] === p2[1]
}
