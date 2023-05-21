import { APoint } from '@shared/utils'
import {
	APointControlPoint,
	APointDrawPoint,
	APointLineToLine,
	BezierAPointLine,
	BezierNumberLine,
	CurvedLine,
	DrawOptions,
	QuadraticBezierAPointLine,
} from '@canvas/shared'
import { setDrawOptions } from '../ctx'

export const createBezierNumberLine = (
	points: number[],
	controlPoints: number[],
	i: number,
): BezierNumberLine => [
	points[i * 2 - 2],
	points[i * 2 - 1],
	controlPoints[(2 * (i - 1) - 1) * 2],
	controlPoints[(2 * (i - 1) - 1) * 2 + 1],
	controlPoints[2 * (i - 1) * 2],
	controlPoints[2 * (i - 1) * 2 + 1],
	points[i * 2],
	points[i * 2 + 1],
]

export const drawBezierLineNumbersWithOptions = (
	ctx: CanvasRenderingContext2D,
	line: BezierNumberLine,
	options?: Partial<DrawOptions>,
) => {
	ctx.save()
	setDrawOptions(ctx, options)
	const [startX, startY, control1X, control1Y, control2X, control2Y, endX, endY] = line
	ctx.beginPath()
	ctx.moveTo(startX, startY)
	ctx.bezierCurveTo(control1X, control1Y, control2X, control2Y, endX, endY)
	ctx.stroke()
	ctx.restore()
}

export const drawBezierLineNumbers = (
	ctx: CanvasRenderingContext2D,
	line: BezierNumberLine,
	isStart = false,
	isFinish = false,
) => {
	const [startX, startY, control1X, control1Y, control2X, control2Y, endX, endY] = line
	if (isStart) {
		ctx.beginPath()
		ctx.moveTo(startX, startY)
	}
	ctx.bezierCurveTo(control1X, control1Y, control2X, control2Y, endX, endY)
	if (isFinish) ctx.stroke()
}
export const drawBezierLine = (
	ctx: CanvasRenderingContext2D,
	line: BezierAPointLine,
	isStart = false,
	isFinish = false,
) => {
	const [start, control1, control2, end] = line
	if (isStart) {
		ctx.beginPath()
		ctx.moveTo(start[0], start[1])
	}
	ctx.bezierCurveTo(control1[0], control1[1], control2[0], control2[1], end[0], end[1])
	if (isFinish) ctx.stroke()
}
export const createCurvedLinePathObject = (
	controlPoints: APointControlPoint[],
	points: APointDrawPoint[],
) => {
	const mixLines: CurvedLine[] = []

	const amountOfPoints = points.length
	if (amountOfPoints < 2) return
	if (amountOfPoints == 2) {
		mixLines.push([points[0], points[1]])
	} else {
		mixLines.push([points[0], controlPoints[0], points[1]])
		let i
		for (i = 2; i < amountOfPoints - 1; i += 1) {
			mixLines.push([
				[points[i * 2 - 2][0], points[i * 2 - 1][1]],
				[controlPoints[2 * i - 3][0], controlPoints[2 * i - 2][1]],
				[controlPoints[4 * i - 4][0], controlPoints[4 * i - 3][1]],
				[points[i * 2][0], points[i * 2 + 1][1]],
			])
		}
		mixLines.push([points[i * 2 - 2], controlPoints[2 * i - 3], points[i * 2 - 1]])
	}

	return curvedLinePathObject(mixLines)
}

const curvedLinePathObject = (lines: CurvedLine[]) => ({
	lines,
	draw(ctx: CanvasRenderingContext2D) {
		for (let i = 0; i < this.lines.length; i += 1) {
			const line = this.lines[i]
			ctx.beginPath()
			switch (line.length) {
				case 2:
					ctx.moveTo(line[0][0], line[0][1])
					ctx.lineTo(line[1][0], line[1][1])
					break
				case 3:
					ctx.moveTo(line[0][0], line[0][1])
					ctx.quadraticCurveTo(line[1][0], line[1][1], line[2][0], line[2][1])
					break
				case 4:
					ctx.moveTo(line[0][0], line[0][1])
					ctx.bezierCurveTo(line[1][0], line[1][1], line[2][0], line[2][1], line[3][0], line[3][1])
					break
			}
			ctx.stroke()
		}
	},
})

const getLineObjectsFromPoints = (
	controlPoints: APointControlPoint[],
	points: APointDrawPoint[],
) => {
	const bezierAPointLines: BezierAPointLine[] = []
	const quadraticBezierAPointLines: QuadraticBezierAPointLine[] = []
	const lines: APointLineToLine[] = []
	const mixLines: CurvedLine[] = []

	const amountOfPoints = points.length
	if (amountOfPoints < 2) return { lines, quadraticBezierAPointLines, bezierAPointLines }
	if (amountOfPoints == 2) {
		lines.push([points[0], points[1]])
		mixLines.push([points[0], points[1]])
	} else {
		quadraticBezierAPointLines.push([points[0], controlPoints[0], points[1]])
		mixLines.push([points[0], controlPoints[0], points[1]])
		let i
		for (i = 2; i < amountOfPoints - 1; i += 1) {
			bezierAPointLines.push([
				[points[i * 2 - 2][0], points[i * 2 - 1][1]],
				[controlPoints[2 * i - 3][0], controlPoints[2 * i - 2][1]],
				[controlPoints[4 * i - 4][0], controlPoints[4 * i - 3][1]],
				[points[i * 2][0], points[i * 2 + 1][1]],
			])
			mixLines.push([
				[points[i * 2 - 2][0], points[i * 2 - 1][1]],
				[controlPoints[2 * i - 3][0], controlPoints[2 * i - 2][1]],
				[controlPoints[4 * i - 4][0], controlPoints[4 * i - 3][1]],
				[points[i * 2][0], points[i * 2 + 1][1]],
			])
		}
		quadraticBezierAPointLines.push([
			points[i * 2 - 2],
			controlPoints[2 * i - 3],
			points[i * 2 - 1],
		])
		mixLines.push([points[i * 2 - 2], controlPoints[2 * i - 3], points[i * 2 - 1]])
	}

	return {
		lines,
		quadraticBezierAPointLines,
		bezierAPointLines,
	}
}
export const reduceBezierNumberLineToAPointArray = (curves: BezierNumberLine[]) =>
	curves.reduce((acc, curve) => {
		const lines = []
		for (let t = 0; t < 1; t += 0.1) {
			const pointStart = getBezierXYByTUsingNumberLine(curve, t)
			const pointEnd = getBezierXYByTUsingNumberLine(curve, t + 0.1)
			lines.push(pointStart, pointEnd)
		}
		return [...acc, ...lines]
	}, [] as APoint[])
export const reduceBezierNumberLineToNumberArray = (curves: BezierNumberLine[]) =>
	curves.reduce((acc, curve) => {
		const lines = []
		for (let t = 0; t < 1; t += 0.1) {
			const pointStart = getBezierXYByTUsingNumberLine(curve, t)
			const pointEnd = getBezierXYByTUsingNumberLine(curve, t + 0.1)
			lines.push(pointStart[0], pointStart[1], pointEnd[0], pointEnd[1])
		}
		return [...acc, ...lines]
	}, [] as number[])

export const getBezierXYByTUsingNumberLine = (bezierLine: BezierNumberLine, t: number): APoint => {
	const [sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey] = bezierLine
	const x =
		Math.pow(1 - t, 3) * sx +
		3 * t * Math.pow(1 - t, 2) * cp1x +
		3 * t * t * (1 - t) * cp2x +
		t * t * t * ex
	const y =
		Math.pow(1 - t, 3) * sy +
		3 * t * Math.pow(1 - t, 2) * cp1y +
		3 * t * t * (1 - t) * cp2y +
		t * t * t * ey
	return [x, y]
}

export const getBezierXYByTUsingAPointLine = (bezierLine: BezierAPointLine, t: number) => {
	const [p0, p1, p2, p3] = bezierLine
	return getBezierXYByTUsingAPoints(p0, p1, p2, p3, t)
}
export const getBezierXYByTUsingAPoints = (
	p0: APoint,
	p1: APoint,
	p2: APoint,
	p3: APoint,
	t: number,
) => {
	const equation = (t: number, idx: number) =>
		Math.pow(1 - t, 3) * p3[idx] +
		3 * t * Math.pow(1 - t, 2) * p2[idx] +
		3 * Math.pow(t, 2) * (1 - t) * p1[idx] +
		p0[idx] * Math.pow(t, 3)
	const tx = equation(t, 0)
	const ty = equation(t, 1)
	return [tx, ty]
}

export function getBezierXYByTOld(
	t: number,
	sx: number,
	sy: number,
	cp1x: number,
	cp1y: number,
	cp2x: number,
	cp2y: number,
	ex: number,
	ey: number,
) {
	return {
		x:
			Math.pow(1 - t, 3) * sx +
			3 * t * Math.pow(1 - t, 2) * cp1x +
			3 * t * t * (1 - t) * cp2x +
			t * t * t * ex,
		y:
			Math.pow(1 - t, 3) * sy +
			3 * t * Math.pow(1 - t, 2) * cp1y +
			3 * t * t * (1 - t) * cp2y +
			t * t * t * ey,
	}
}

export const getBezierAngle = (
	t: number,
	sx: number,
	sy: number,
	cp1x: number,
	cp1y: number,
	cp2x: number,
	cp2y: number,
	ex: number,
	ey: number,
) => {
	const dx =
		Math.pow(1 - t, 2) * (cp1x - sx) + 2 * t * (1 - t) * (cp2x - cp1x) + t * t * (ex - cp2x)
	const dy =
		Math.pow(1 - t, 2) * (cp1y - sy) + 2 * t * (1 - t) * (cp2y - cp1y) + t * t * (ey - cp2y)
	return -Math.atan2(dx, dy) + 0.5 * Math.PI
}

/*function getBezierXYFromNumberArray(
 p0x: number,
 p0y: number,
 p1x: number,
 p1y: number,
 p2x: number,
 p2y: number,
 p3x: number,
 p3y: number,
 t: number,
 ) {
 const equation = (t: number, idx: number) =>
 Math.pow(1 - t, 3) * p3y +
 3 * t * Math.pow(1 - t, 2) * p2y +
 3 * Math.pow(t, 2) * (1 - t) * p1y +
 p0y * Math.pow(t, 3)
 const tx = equation(t, 0)
 const ty = equation(t, 1)
 return [tx, ty]
 }
 function getBezierXYFunc(p0: APoint, p1: APoint, p2: APoint, p3: APoint, t: number) {
 const equation = (t: number, idx: number) =>
 Math.pow(1 - t, 3) * p3[idx] +
 3 * t * Math.pow(1 - t, 2) * p2[idx] +
 3 * Math.pow(t, 2) * (1 - t) * p1[idx] +
 p0[idx] * Math.pow(t, 3)
 const tx = equation(t, 0)
 const ty = equation(t, 1)
 return [tx, ty]
 }*/
