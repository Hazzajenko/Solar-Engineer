import { DrawOptions, QuadraticBezierAPointLine, QuadraticNumberLine } from '@canvas/shared'
import { APoint } from '@shared/utils'
import { setDrawOptions } from '../ctx'

export const createQuadraticNumberLine = (
	points: number[],
	controlPoints: number[],
	i: number,
): QuadraticNumberLine => [
	points[i * 2 - 2],
	points[i * 2 - 1],
	controlPoints[(2 * (i - 1) - 1) * 2],
	controlPoints[(2 * (i - 1) - 1) * 2 + 1],
	points[i * 2],
	points[i * 2 + 1],
]

export const drawQuadraticLineNumbersWithOptions = (
	ctx: CanvasRenderingContext2D,
	line: QuadraticNumberLine,
	isStart = false,
	isFinish = false,
	options?: Partial<DrawOptions>,
) => {
	ctx.save()
	setDrawOptions(ctx, options)
	const [startX, startY, controlX, controlY, endX, endY] = line
	if (isStart) {
		// ctx.beginPath()
		ctx.moveTo(startX, startY)
	}
	ctx.quadraticCurveTo(controlX, controlY, endX, endY)
	if (isFinish) ctx.stroke()
	ctx.restore()
}
export const drawQuadraticLineNumbers = (
	ctx: CanvasRenderingContext2D,
	line: QuadraticNumberLine,
	isStart = false,
	isFinish = false,
) => {
	const [startX, startY, controlX, controlY, endX, endY] = line
	if (isStart) {
		ctx.beginPath()
		ctx.moveTo(startX, startY)
	}
	ctx.quadraticCurveTo(controlX, controlY, endX, endY)
	if (isFinish) ctx.stroke()
}

export const getQuadraticXYByTUsingNumberLine = (
	quadraticLine: QuadraticNumberLine,
	t: number,
): APoint => {
	const [p0x, p0y, p1x, p1y, p2x, p2y] = quadraticLine
	const x = (1 - t) * (1 - t) * p2x + 2 * (1 - t) * t * p1x + t * t * p0x
	const y = (1 - t) * (1 - t) * p2y + 2 * (1 - t) * t * p1y + t * t * p0y
	return [x, y]
	/*	return {
	 x: (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cp1x + t * t * ex,
	 y: (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cp1y + t * t * ey,
	 }*/
	/*	const equation = (t: number, p0: number, p1: number, p2: number) =>
	 Math.pow(1 - t, 2) * p2 + 2 * (1 - t) * t * p1 + Math.pow(t, 2) * p0
	 const tx = equation(t, p0x, p1x, p2x)
	 const ty = equation(t, p0y, p1y, p2y)
	 return [tx, ty]*/
	/*	const equation = (t: number, idx: number) =>
	 Math.pow(1 - t, 2) * p2[idx] + 2 * (1 - t) * t * p1[idx] + Math.pow(t, 2) * p0[idx]
	 const tx = equation(t, 0)
	 const ty = equation(t, 1)
	 return [tx, ty]*/
}

export const drawQuadraticLine = (
	ctx: CanvasRenderingContext2D,
	line: QuadraticBezierAPointLine,
	isStart = false,
	isFinish = false,
) => {
	const [start, control, end] = line
	if (isStart) {
		ctx.beginPath()
		ctx.moveTo(start[0], start[1])
	}
	ctx.quadraticCurveTo(control[0], control[1], end[0], end[1])
	if (isFinish) ctx.stroke()
}
const getQuadraticXYAPoint = (t: number, quadraticBezierAPointLine: QuadraticBezierAPointLine) => {
	const [p0, p1, p2] = quadraticBezierAPointLine
	const equation = (t: number, idx: number) =>
		Math.pow(1 - t, 2) * p2[idx] + 2 * (1 - t) * t * p1[idx] + Math.pow(t, 2) * p0[idx]
	const tx = equation(t, 0)
	const ty = equation(t, 1)
	return [tx, ty]
}

function getQuadraticXY(
	t: number,
	sx: number,
	sy: number,
	cp1x: number,
	cp1y: number,
	ex: number,
	ey: number,
) {
	return {
		x: (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cp1x + t * t * ex,
		y: (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cp1y + t * t * ey,
	}
}
