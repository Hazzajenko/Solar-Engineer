import { CANVAS_COLORS } from '@entities/shared'

export const drawSelectionBoxBoundsCtxFn = (selectionBoxBounds: {
	left: number
	top: number
	width: number
	height: number
}) => {
	return (ctx: CanvasRenderingContext2D) => {
		ctx.save()
		const { left, top, width, height } = selectionBoxBounds
		ctx.strokeStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
		ctx.lineWidth = 1
		ctx.strokeRect(left, top, width, height)
		ctx.restore()
	}
}
