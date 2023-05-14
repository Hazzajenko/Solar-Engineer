import { CANVAS_COLORS, CompleteEntityBounds } from '@shared/data-access/models'

export const getDefaultDrawPreviewCtxFn = (completeBounds: CompleteEntityBounds) => {
	return (ctx: CanvasRenderingContext2D) => {
		ctx.save()
		ctx.beginPath()
		ctx.globalAlpha = 0.4
		ctx.fillStyle = CANVAS_COLORS.PreviewPanelFillStyle
		ctx.rect(completeBounds.left, completeBounds.top, completeBounds.width, completeBounds.height)
		ctx.fill()
		ctx.stroke()
		ctx.restore()
	}
}
