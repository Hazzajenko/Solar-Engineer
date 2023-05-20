import { APointLineToLine, LineToLineNumberLine } from '@canvas//shared'

export const drawStraightLineNumbers = (
	ctx: CanvasRenderingContext2D,
	line: LineToLineNumberLine,
	isStart = false,
	isFinish = false,
) => {
	const [startX, startY, endX, endY] = line
	if (isStart) {
		ctx.beginPath()
		ctx.moveTo(startX, startY)
	}
	ctx.lineTo(endX, endY)
	if (isFinish) ctx.stroke()
}
export const drawStraightLine = (
	ctx: CanvasRenderingContext2D,
	line: APointLineToLine,
	isStart = false,
	isFinish = false,
) => {
	const [start, end] = line
	if (isStart) {
		ctx.beginPath()
		ctx.moveTo(start[0], start[1])
	}
	ctx.lineTo(end[0], end[1])
	if (isFinish) ctx.stroke()
}
