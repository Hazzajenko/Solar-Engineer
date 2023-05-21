import { DrawOptions } from '@canvas/shared'

export const setDrawOptions = (ctx: CanvasRenderingContext2D, options?: Partial<DrawOptions>) => {
	if (!options) {
		ctx.fillStyle = 'black'
		ctx.strokeStyle = 'black'
		ctx.lineWidth = 1
		return
	}
	const {
		fillStyle,
		strokeStyle,
		lineWidth,
		lineCap,
		lineJoin,
		miterLimit,
		lineDashOffset,
		lineDash,
		shadowBlur,
		shadowColor,
		shadowOffsetX,
	} = options
	if (fillStyle) ctx.fillStyle = fillStyle
	if (strokeStyle) ctx.strokeStyle = strokeStyle
	if (lineWidth) ctx.lineWidth = lineWidth
	if (lineCap) ctx.lineCap = lineCap
	if (lineJoin) ctx.lineJoin = lineJoin
	if (miterLimit) ctx.miterLimit = miterLimit
	if (lineDashOffset) ctx.lineDashOffset = lineDashOffset
	if (lineDash) ctx.setLineDash(lineDash)
	if (shadowBlur) ctx.shadowBlur = shadowBlur
	if (shadowColor) ctx.shadowColor = shadowColor
	if (shadowOffsetX) ctx.shadowOffsetX = shadowOffsetX
}
