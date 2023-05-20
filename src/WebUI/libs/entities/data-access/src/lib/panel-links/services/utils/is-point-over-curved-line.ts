import { APoint } from '@shared/utils'
import { isPointOnLineUsingAPoints } from '@canvas/utils'
import { TransformedPoint } from '@shared/data-access/models'

export const isPointOverCurvedLine = (
	microPoints: APoint[][][],
	currentPoint: TransformedPoint,
	ctx: CanvasRenderingContext2D,
) => {
	for (let i = 0; i < microPoints.length; i++) {
		const microPoint = microPoints[i]
		for (let j = 0; j < microPoint.length; j++) {
			const microPoint2 = microPoint[j]
			for (let k = 0; k < microPoint2.length; k++) {
				if (isPointOnLineUsingAPoints(currentPoint, microPoint2, ctx)) {
					// drawPathForMicroPoints(microPoint2, ctx)
					return true
				}
			}
		}
	}
	return false
}

const drawPathForMicroPoints = (microPoints: APoint[], ctx: CanvasRenderingContext2D) => {
	ctx.beginPath()
	ctx.moveTo(microPoints[0][0], microPoints[0][1])
	for (let i = 1; i < microPoints.length; i++) {
		const microPoint = microPoints[i]
		ctx.lineTo(microPoint[0], microPoint[1])
	}
	ctx.stroke()
}

// const isPointNearLine = (lineStart: APoint, lineEnd: APoint, point: APoint, threshold: number) => {
// 	const distanceToLine =
// 		Math.abs(
// 			(lineEnd[1] - lineStart[1]) * point[0] -
// 				(lineEnd[0] - lineStart[0]) * point[1] +
// 				lineEnd[0] * lineStart[1] -
// 				lineEnd[1] * lineStart[0],
// 		) / Math.sqrt(Math.pow(lineEnd[1] - lineStart[1], 2) + Math.pow(lineEnd[0] - lineStart[0], 2))

// 	return distanceToLine <= threshold
// }

// const isPointNearLine = (
// 	lineStart: TransformedPoint,
// 	lineEnd: TransformedPoint,
// 	point: TransformedPoint,
// 	threshold: number,
//   ) => {
// 	const distanceToLine = Math.abs(
// 	  (lineEnd.y - lineStart.y) * point.x - (lineEnd.x - lineStart.x) * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x,
// 	) / Math.sqrt(Math.pow(lineEnd.y - lineStart.y, 2) + Math.pow(lineEnd.x - lineStart.x, 2))

// 	return distanceToLine <= threshold
//   }
