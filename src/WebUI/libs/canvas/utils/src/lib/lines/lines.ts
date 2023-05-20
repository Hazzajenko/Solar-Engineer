import { Point } from '@shared/data-access/models'
import { BezierNumberLine, CurvedNumberLine, LineToLineNumberLine, QuadraticNumberLine } from '@canvas/shared'
import { APoint, distance2dPoint } from '@shared/utils'
// import { CubicBezier } from '../../../../rendering/data-access/src/lib/services/render/render-fns/links/deprecated/test.class2'

const DistanceToLineThreshold = 2

/*export const isPointOnLineWithThreshold = (point: Point, linePoints: number[], threshold: number): boolean => {
 for (let i = 0; i < linePoints.length /2; i += 2) {
 const p1 = linePoints[2*i]
 const p2 = linePoints[2*i + 1]
 const distanceToLine = getDistanceToLine(point, p1, p2)
 if (distanceToLine <= threshold) {
 return true
 }
 }
 return false
 }*/
export const isPointOnLine = (point: Point, linePoints: Point[]): boolean => {
	for (let i = 0; i < linePoints.length - 1; i++) {
		const p1 = linePoints[i]
		const p2 = linePoints[i + 1]
		const distanceToLine = getDistanceToLine(point, p1, p2)
		if (distanceToLine <= DistanceToLineThreshold) {
			return true
		}
	}
	return false
}

const getDistanceToLine = (point: Point, lineStart: Point, lineEnd: Point): number => {
	const numerator = Math.abs(
		(lineEnd.y - lineStart.y) * point.x -
			(lineEnd.x - lineStart.x) * point.y +
			lineEnd.x * lineStart.y -
			lineEnd.y * lineStart.x,
	)
	const denominator = Math.sqrt((lineEnd.y - lineStart.y) ** 2 + (lineEnd.x - lineStart.x) ** 2)
	return numerator / denominator
}

export const isPointOnLineUsingBigPoints = (
	point: Point,
	linePoints: APoint[],
	ctx: CanvasRenderingContext2D,
): boolean => {
	for (let i = 0; i < linePoints.length / 2; i += 2) {
		const p1 = linePoints[2 * i]
		const p2 = linePoints[2 * i + 1]
		// const distanceToLine = distance2dPoint(point, { x: p1[0], y: p1[1] }, { x: p2[0], y: p2[1] })
		// const distanceToLine = isPointNearLine(p1, p2, [point.x, point.y], 5)
		const distanceToLine = getDistanceToLine(point, { x: p1[0], y: p1[1] }, { x: p2[0], y: p2[1] })
		// const distanceToLine = getDistanceToLineUsingAPoints(point, p1, p2)
		// if (distanceToLine) {
		if (distanceToLine <= DistanceToLineThreshold) {
			console.log('distanceToLine', distanceToLine)
			ctx.save()
			ctx.lineWidth = 2
			ctx.strokeStyle = 'red'
			ctx.beginPath()
			ctx.moveTo(p1[0], p1[1])
			ctx.lineTo(p2[0], p2[1])
			ctx.stroke()
			ctx.closePath()
			ctx.restore()
			// c
			// ctx.strokeStyle = 'black'
			/*			ctx.beginPath()
			 ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
			 ctx.stroke()
			 ctx.closePath()*/
			return true
		}
	}
	return false
}
export const isPointOnLineUsingAPoints = (
	point: Point,
	linePoints: APoint[],
	ctx: CanvasRenderingContext2D,
): boolean => {
	// const bezzy = new Bezier().
	for (let i = 0; i < linePoints.length / 2; i += 2) {
		const newPoints = getLinePoints(linePoints[i], linePoints[i + 1], 5)
		for (let j = 0; j < newPoints.length; j++) {
			const p = newPoints[j]
			const distanceToLine = distance2dPoint([point.x, point.y], p)
			if (distanceToLine <= DistanceToLineThreshold) {
				console.log('distanceToLine', distanceToLine)
				ctx.save()
				ctx.lineWidth = 2
				ctx.strokeStyle = 'red'
				ctx.beginPath()
				ctx.moveTo(p[0], p[1])
				ctx.lineTo(point.x, point.y)
				ctx.stroke()
				ctx.closePath()
				ctx.restore()
				// c
				// ctx.strokeStyle = 'black'
				/*			ctx.beginPath()
				 ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
				 ctx.stroke()
				 ctx.closePath()*/
				return true
			}
		}
		/*	const distanceToLine = distance2dPoint([point.x, point.y], linePoints[i])


		 /!*
		 const p1 = linePoints[2 * i]
		 const p2 = linePoints[2 * i + 1]
		 // const distanceToLine = distance2dPoint(point, { x: p1[0], y: p1[1] }, { x: p2[0], y: p2[1] })
		 // const distanceToLine = isPointNearLine(p1, p2, [point.x, point.y], 5)
		 const distanceToLine = getDistanceToLine(point, { x: p1[0], y: p1[1] }, { x: p2[0], y: p2[1] })*!/
		 // const distanceToLine = getDistanceToLineUsingAPoints(point, p1, p2)
		 // if (distanceToLine) {
		 if (distanceToLine <= DistanceToLineThreshold) {
		 console.log('distanceToLine', distanceToLine)
		 ctx.save()
		 ctx.lineWidth = 2
		 ctx.strokeStyle = 'red'
		 ctx.beginPath()

		 /!*		ctx.moveTo(linePoints[0][0], linePoints[0][1])
		 for (let i = 1; i < linePoints.length; i++) {
		 ctx.lineTo(linePoints[i][0], linePoints[i][1])
		 }*!/
		 // const centerPointTT = centerPoint(p1, p2)
		 // ctx.moveTo(centerPointTT[0], centerPointTT[1])
		 ctx.moveTo(linePoints[i][0], linePoints[i][1])

		 ctx.lineTo(point.x, point.y)
		 // ctx.moveTo(p1[0], p1[1])
		 // ctx.lineTo(p2[0], p2[1])
		 ctx.stroke()
		 ctx.closePath()
		 ctx.beginPath()
		 // ctx.moveTo(p2[0], p2[1])
		 ctx.lineTo(point.x, point.y)
		 ctx.stroke()
		 // ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
		 // ctx.closePath()
		 ctx.restore()
		 // c
		 // ctx.strokeStyle = 'black'
		 /!*			ctx.beginPath()
		 ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
		 ctx.stroke()
		 ctx.closePath()*!/
		 return true
		 }*/
	}
	return false
}

const getDistanceToLineUsingAPoints = (
	point: Point,
	lineStart: APoint,
	lineEnd: APoint,
): number => {
	const numerator = Math.abs(
		(lineEnd[1] - lineStart[1]) * point.x -
			(lineEnd[0] - lineStart[0]) * point.y +
			lineEnd[0] * lineStart[1] -
			lineEnd[1] * lineStart[0],
	)
	const denominator = Math.sqrt((lineEnd[1] - lineStart[1]) ** 2 + (lineEnd[0] - lineStart[0]) ** 2)
	return numerator / denominator
}

const getDistanceToLineUsingAPointsV2 = (
	point: APoint,
	lineStart: APoint,
	lineEnd: APoint,
): number => {
	const numerator = Math.abs(
		(lineEnd[1] - lineStart[1]) * point[0] -
			(lineEnd[0] - lineStart[0]) * point[1] +
			lineEnd[0] * lineStart[1] -
			lineEnd[1] * lineStart[0],
	)
	const denominator = Math.sqrt((lineEnd[1] - lineStart[1]) ** 2 + (lineEnd[0] - lineStart[0]) ** 2)
	return numerator / denominator
}

/*function isPointOnLineV2(px, py, x1, y1, x2, y2, width) {
 return distancePointFromLine(px, py, x1, y1, x2, y2, width) <= width / 2
 }

 function distancePointFromLine(
 x0: number,
 y0: number,
 x1: number,
 y1: number,
 x2: number,
 y2: number,
 ) {
 return (
 Math.abs((x2 - x1) * (y1 - y0) - (x1 - x0) * (y2 - y1)) /
 Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
 )
 }*/

export const curvedNumberLineSwitch = (
	curvedLine: CurvedNumberLine,
): BezierNumberLine | QuadraticNumberLine | LineToLineNumberLine => {
	switch (curvedLine.length) {
		case 4:
			return curvedLine as LineToLineNumberLine
		case 6:
			return curvedLine as QuadraticNumberLine
		case 8:
			return curvedLine as BezierNumberLine
	}
}

const isPointNearLine = (lineStart: APoint, lineEnd: APoint, point: APoint, threshold: number) => {
	const distanceToLine =
		Math.abs(
			(lineEnd[1] - lineStart[1]) * point[0] -
				(lineEnd[0] - lineStart[0]) * point[1] +
				lineEnd[0] * lineStart[1] -
				lineEnd[1] * lineStart[0],
		) / Math.sqrt(Math.pow(lineEnd[1] - lineStart[1], 2) + Math.pow(lineEnd[0] - lineStart[0], 2))

	return distanceToLine <= threshold
}

const getLinePoints = (pointA: APoint, pointB: APoint, numPoints: number): APoint[] => {
	const linePoints: APoint[] = []

	for (let i = 0; i < numPoints; i++) {
		const t = i / (numPoints - 1)
		const x = pointA[0] * (1 - t) + pointB[0] * t
		const y = pointA[1] * (1 - t) + pointB[1] * t
		linePoints.push([x, y])
	}

	return linePoints
}

/*
 export const distanceToLine = (point: Point, line: Line): number =>
 joinScalar(point, line);

 export const joinScalar = (a: NVector, b: NVector): number =>
 a[0] * b[7] +
 a[1] * b[6] +
 a[2] * b[5] +
 a[3] * b[4] +
 a[4] * b[3] +
 a[5] * b[2] +
 a[6] * b[1] +
 a[7] * b[0];*/
