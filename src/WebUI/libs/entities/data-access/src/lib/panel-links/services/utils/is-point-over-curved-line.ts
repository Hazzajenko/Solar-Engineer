import { APoint } from '@shared/utils'
import { isPointOnLineUsingAPoints } from '@canvas/utils'
import { Point, TransformedPoint } from '@shared/data-access/models'
import { CurvedNumberLine } from '@canvas/shared'
import { Bezier } from 'bezier-js'
import { PanelLinkId } from '@entities/shared'

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
	return
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
