import { drawBezierLine, drawQuadraticLine, drawStraightLine } from '@canvas/utils'
import { APoint } from '@shared/utils'
import {
	APointControlPoint,
	APointDrawPoint,
	APointLineToLine,
	BezierAPointLine,
	QuadraticBezierAPointLine,
} from '@canvas/shared'

export const drawSplinesReworkWithAPoints = (ctx: CanvasRenderingContext2D, points: APoint[]) => {
	// let controlPoints: number[] = []
	let controlPointsV2: APoint[] = []
	if (points.length < 2) return
	for (let i = 0; i < points.length - 2; i += 1) {
		if (!points[2 * i] || !points[2 * i + 1] || !points[2 * i + 2]) {
			break
		}
		controlPointsV2 = controlPointsV2.concat(
			calculateControlPoints(points[2 * i], points[2 * i + 1], points[2 * i + 2]),
		)
	}
	/*
	 const lineObjects = createCurvedLinePathObject(controlPointsV2, points)
	 if (!lineObjects) return

	 lineObjects.draw(ctx)*/
	drawCurvedPath(ctx, controlPointsV2, points)
}

function calculateControlPoints(point1: APoint, point2: APoint, point3: APoint): [APoint, APoint] {
	/*	if (!point1 || !point2 || !point3)
	 return [
	 [0, 0],
	 [0, 0],
	 ]*/
	const tension = 0.5

	const startAndFinishVector = calculateVector(point1, point3)
	const startToMiddleDistance = calculateDistance(point1, point2)
	const middleToEndDistance = calculateDistance(point2, point3)
	const totalDistance = startToMiddleDistance + middleToEndDistance
	return [
		[
			point2[0] - (startAndFinishVector[0] * tension * startToMiddleDistance) / totalDistance,
			point2[1] - (startAndFinishVector[1] * tension * startToMiddleDistance) / totalDistance,
		],
		[
			point2[0] + (startAndFinishVector[0] * tension * middleToEndDistance) / totalDistance,
			point2[1] + (startAndFinishVector[1] * tension * middleToEndDistance) / totalDistance,
		],
	]
}

// function calculateVector(arr: number[], i: number, j: number) {
// 	return [arr[2 * j] - arr[2 * i], arr[2 * j + 1] - arr[2 * i + 1]]
// }
function calculateVector(point1: APoint, point2: APoint) {
	return [point2[0] - point1[0], point2[1] - point1[1]]
}

/*const calculateVector = (arr: number[], i: number, j: number) => {
 const x1 = arr[2 * i];
 const y1 = arr[2 * i + 1];
 const x2 = arr[2 * j];
 const y2 = arr[2 * j + 1];
 const dx = x2 - x1;
 const dy = y2 - y1;
 return [dx, dy];
 }*/

function calculateDistance(point1: APoint, point2: APoint) {
	const dx = point2[0] - point1[0]
	const dy = point2[1] - point1[1]
	return Math.sqrt(dx * dx + dy * dy)
}

// function calculateDistance(arr: number[], i: number, j: number) {
// 	return Math.sqrt(
// 		Math.pow(arr[2 * i] - arr[2 * j], 2) + Math.pow(arr[2 * i + 1] - arr[2 * j + 1], 2),
// 	)
// }

const drawCurvedPath = (
	ctx: CanvasRenderingContext2D,
	controlPoints: APointControlPoint[],
	points: APointDrawPoint[],
) => {
	const amountOfPoints = points.length
	if (amountOfPoints < 2) return
	if (amountOfPoints == 2) {
		const straightLine: APointLineToLine = [
			[points[0][0], points[0][1]],
			[points[1][0], points[1][1]],
		]
		drawStraightLine(ctx, straightLine, true, true)
		/*		ctx.beginPath()
		 ctx.moveTo(points[0][0], points[0][1])
		 ctx.lineTo(points[1][0], points[1][1])
		 ctx.stroke()*/
	} else {
		// ctx.beginPath()
		const quadraticLineStart: QuadraticBezierAPointLine = [
			[points[0][0], points[0][1]],
			[controlPoints[0][0], controlPoints[0][1]],
			[points[1][0], points[1][1]],
		]
		drawQuadraticLine(ctx, quadraticLineStart, true)
		// ctx.moveTo(points[0][0], points[0][1])
		// from point 0 to point 1 is a quadratic
		// ctx.quadraticCurveTo(controlPoints[0], controlPoints[1], points[2], points[3])

		let i = 2
		for (i = 2; i < amountOfPoints - 1; i += 1) {
			const controlPoint1 = controlPoints[2 * (i - 2)] ?? controlPoints[controlPoints.length - 2]
			const controlPoint2 =
				controlPoints[2 * (i - 2) + 1] ?? controlPoints[controlPoints.length - 1]
			/*			const bezierLine: BezierAPointLine = [
			 [points[i - 1][0], points[i - 1][1]],
			 [controlPoints[2 * (i - 2)][0], controlPoints[2 * (i - 2)][1]],
			 [controlPoints[2 * (i - 2) + 1][0], controlPoints[2 * (i - 2) + 1][1]],
			 [points[i][0], points[i][1]],
			 ]*/

			const bezierLine: BezierAPointLine = [
				[points[i - 1][0], points[i - 1][1]],
				controlPoint1,
				controlPoint2,
				[points[i][0], points[i][1]],
			]
			drawBezierLine(ctx, bezierLine)

			/*			ctx.bezierCurveTo(
			 controlPoints[(2 * (i - 1) - 1) * 2],
			 controlPoints[(2 * (i - 1) - 1) * 2 + 1],
			 controlPoints[2 * (i - 1) * 2],
			 controlPoints[2 * (i - 1) * 2 + 1],
			 points[i * 2],
			 points[i * 2 + 1],
			 )*/
			/*			cachedLines.push([
			 points[i * 2 - 2],
			 points[i * 2 - 1],
			 controlPoints[(2 * (i - 1) - 1) * 2],
			 controlPoints[(2 * (i - 1) - 1) * 2 + 1],
			 controlPoints[2 * (i - 1) * 2],
			 controlPoints[2 * (i - 1) * 2 + 1],
			 points[i * 2],
			 points[i * 2 + 1],
			 ])*/

			// updatedCacheLines
		}
		const quadraticLineFinish: QuadraticBezierAPointLine = [
			[points[i - 1][0], points[i - 1][1]],
			[controlPoints[controlPoints.length - 1][0], controlPoints[controlPoints.length - 1][1]], // [controlPoints[2 * (i - 2)][0], controlPoints[2 * (i - 2)][1]],
			[points[i][0], points[i][1]],
		]
		drawQuadraticLine(ctx, quadraticLineFinish, false, true)
		/*		ctx.quadraticCurveTo(
		 controlPoints[(2 * (i - 1) - 1) * 2],
		 controlPoints[(2 * (i - 1) - 1) * 2 + 1],
		 points[i * 2],
		 points[i * 2 + 1],
		 )*/
		ctx.stroke()
		/*		console.log('cachedLines', cachedLines)
		 if (cachedLines.length > 0) {
		 /!*const t = 0.5
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
		 })*!/
		 drawAllTPointsForCurve(ctx, cachedLines)
		 createLinesBetweenTPoints(ctx, cachedLines)
		 updatedCacheLines = cachedLines
		 }*/
	}
}
