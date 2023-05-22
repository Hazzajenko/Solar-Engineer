import { APoint } from '@shared/utils'
import { isPointOnLineUsingAPoints } from '@canvas/utils'
import { Point, TransformedPoint } from '@shared/data-access/models'
import { BezierNumberLine, CurvedNumberLine } from '@canvas/shared'
import { Bezier } from 'bezier-js'
import { PanelLinkId, SizeByType } from '@entities/shared'

export const isPointOverCurvedLineNoCtx = (
	panelLinkIdPointsTuple: [PanelLinkId, CurvedNumberLine][][],
	currentPoint: TransformedPoint,
) => {
	for (let i = 0; i < panelLinkIdPointsTuple.length; i++) {
		const panelLinkIdPoints = panelLinkIdPointsTuple[i]
		for (let j = 0; j < panelLinkIdPoints.length; j++) {
			const [panelLinkId, curvedLines] = panelLinkIdPoints[j]
			if (handleLineSwitch(curvedLines, currentPoint)) {
				return panelLinkId
			}
			/*
			 if (isPointOverCurvedLine(circuitCurvedLines, curvedLines, currentPoint)) {
			 return panelLinkId
			 }*/
		}
	}
	return
	/*for (let i = 0; i < circuitCurvedLines.length; i++) {
	 const curvedLines = circuitCurvedLines[i]
	 for (let j = 0; j < curvedLines.length; j++) {
	 const lines = curvedLines[j]
	 switch (lines.length) {
	 case 4: {
	 const d = getDistanceToLine(
	 currentPoint,
	 { x: lines[0], y: lines[1] },
	 { x: lines[2], y: lines[3] },
	 )
	 if (d < 10) {
	 return true
	 }
	 break
	 }
	 case 6: {
	 const bezier = new Bezier(lines[0], lines[1], lines[2], lines[3], lines[4], lines[5])
	 const project = bezier.project(currentPoint)
	 if (project.d && project.d < 10) {
	 return true
	 }
	 break
	 }
	 case 8: {
	 const bezier = new Bezier(
	 lines[0],
	 lines[1],
	 lines[2],
	 lines[3],
	 lines[4],
	 lines[5],
	 lines[6],
	 lines[7],
	 )
	 const project = bezier.project(currentPoint)
	 if (project.d && project.d < 10) {
	 return true
	 }
	 break
	 }
	 }
	 }
	 }*/
	// return false
}

const handleLineSwitch = (lines: CurvedNumberLine, currentPoint: TransformedPoint) => {
	switch (lines.length) {
		case 4: {
			const d = getDistanceToLine(
				currentPoint,
				{ x: lines[0], y: lines[1] },
				{ x: lines[2], y: lines[3] },
			)
			if (d < 10) {
				return true
			}
			break
		}
		case 6: {
			const bezier = new Bezier(lines[0], lines[1], lines[2], lines[3], lines[4], lines[5])
			const project = bezier.project(currentPoint)

			if (project.d && project.d < 10 && project.t && project.t > 0.1 && project.t < 0.9) {
				return true
			}
			// project.t
			/*			if (project.d && project.d < 10) {
			 return true
			 }*/
			break
		}
		case 8: {
			// return isPointWithinAllowedT(currentPoint, lines)
			const bezier = new Bezier(
				lines[0],
				lines[1],
				lines[2],
				lines[3],
				lines[4],
				lines[5],
				lines[6],
				lines[7],
			)

			// const [aStart, aFinish] = adjustLineBySizeOfPanel(lines[0], lines[1], lines[6], lines[7])
			// const adjustedProjectStart = bezier.project({ x: aStart[0], y: aStart[1] }).t
			// const adjustedProjectFinish = bezier.project({ x: aFinish[0], y: aFinish[1] }).t

			/*		const bezier = new Bezier(
			 aStart[0],
			 aStart[1],
			 lines[2],
			 lines[3],
			 lines[4],
			 lines[5],
			 aFinish[0],
			 aFinish[1],
			 )*/
			/*			const calculateAllowedTBasedOnLength = (length: number) => {
			 return 0.2 + (0.6 * length) / bezier.length()
			 }*/

			// const lineLength = bezier.length()
			// const allowedT = 0.2 + (0.6 * lineLength) / bezier.length()
			// console.log('allowedT', allowedT)
			/*			const lineLength = bezier.length()
			 const adjustFromPanelSize = lineLength - SizeByType['panel'].height * 2
			 const percentage = (adjustFromPanelSize / lineLength) * 100
			 console.log('percentage', percentage)*/
			const project = bezier.project(currentPoint)
			if (project.d && project.d < 10 && project.t && project.t > 0.1 && project.t < 0.9) {
				return true
			}
			/*	if (
			 project.d &&
			 project.d < 10 &&
			 project.t &&
			 adjustedProjectStart &&
			 adjustedProjectFinish &&
			 project.t > adjustedProjectStart &&
			 project.t < adjustedProjectFinish
			 ) {
			 return true
			 }*/
			/*	if (project.d && project.d < 10 && project.t && project.t > 0.1 && project.t < 0.9) {
			 return true
			 }*/
			break
		}
	}
	return
}

const adjustLineBySizeOfPanel = (
	point1X: number,
	point1Y: number,
	point2X: number,
	point2Y: number,
) => {
	const size = SizeByType['panel']
	const { width, height } = size
	const dx = point2X - point1X
	const dy = point2Y - point1Y
	const length = Math.sqrt(dx * dx + dy * dy)
	const unitX = dx / length
	const unitY = dy / length

	const newPoint1 = {
		x: point1X + width * unitY,
		y: point1Y - height * unitX,
	}
	const newPoint2 = {
		x: point2X + width * unitY,
		y: point2Y - height * unitX,
	}

	return [
		[newPoint1.x, newPoint1.y],
		[newPoint2.x, newPoint2.y],
	]
}
const adjustLineByWidthAndHeight = (
	point1: Point,
	point2: Point,
	width: number,
	height: number,
) => {
	const dx = point2.x - point1.x
	const dy = point2.y - point1.y
	const length = Math.sqrt(dx * dx + dy * dy)
	const unitX = dx / length
	const unitY = dy / length

	const newPoint1 = {
		x: point1.x + width * unitY,
		y: point1.y - height * unitX,
	}
	const newPoint2 = {
		x: point2.x + width * unitY,
		y: point2.y - height * unitX,
	}

	return [
		[newPoint1.x, newPoint1.y],
		[newPoint2.x, newPoint2.y],
	]
}

const isPointWithinAllowedT = (
	point: Point,
	lines: BezierNumberLine, // minT: number,
	// maxT: number,
): boolean => {
	const bezier = new Bezier(
		lines[0],
		lines[1],
		lines[2],
		lines[3],
		lines[4],
		lines[5],
		lines[6],
		lines[7],
	)

	const minT = 0.1
	const maxT = 0.9

	const length = bezier.length()
	const allowedT = [
		minT + (0.6 * length * minT) / length,
		maxT - (0.6 * length * (1 - maxT)) / length,
	]

	const project = bezier.project(point)

	return (
		project.d !== undefined &&
		project.d < 10 &&
		project.t !== undefined &&
		project.t >= allowedT[0] &&
		project.t <= allowedT[1]
	)
}

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
					return true
				}
			}
		}
	}
	return false
}

export const isPointOverCurvedLineV2 = (
	circuitCurvedLines: CurvedNumberLine[][],
	currentPoint: TransformedPoint,
	ctx: CanvasRenderingContext2D,
) => {
	for (let i = 0; i < circuitCurvedLines.length; i++) {
		const curvedLines = circuitCurvedLines[i]
		for (let j = 0; j < curvedLines.length; j++) {
			const lines = curvedLines[j]
			if (lines.length === 4) {
				const d = getDistanceToLine(
					currentPoint,
					{ x: lines[0], y: lines[1] },
					{ x: lines[2], y: lines[3] },
				)
				if (d < 10) {
					ctx.beginPath()
					ctx.moveTo(lines[0], lines[1])
					ctx.lineTo(currentPoint.x, currentPoint.y)
					ctx.stroke()
					return true
				}
			}
			if (lines.length === 6) {
				const bezier = new Bezier(lines[0], lines[1], lines[2], lines[3], lines[4], lines[5])
				const project = bezier.project(currentPoint)
				if (project.d && project.d < 10) {
					ctx.beginPath()
					ctx.moveTo(project.x, project.y)
					ctx.lineTo(currentPoint.x, currentPoint.y)
					ctx.stroke()
					return true
				}
			}
			if (lines.length === 8) {
				const bezier = new Bezier(
					lines[0],
					lines[1],
					lines[2],
					lines[3],
					lines[4],
					lines[5],
					lines[6],
					lines[7],
				)
				const project = bezier.project(currentPoint)
				if (project.d && project.d < 10) {
					ctx.beginPath()
					ctx.moveTo(project.x, project.y)
					ctx.lineTo(currentPoint.x, currentPoint.y)
					ctx.stroke()
					return true
				}
			}
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
