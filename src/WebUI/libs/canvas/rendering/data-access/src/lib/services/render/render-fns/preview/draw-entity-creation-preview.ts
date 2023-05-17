import { CANVAS_COLORS, PANEL_STROKE_STYLE } from '@entities/shared'
import { CanvasRenderOptions } from '../../../../types'

export const drawEntityCreationPreview = (
	ctx: CanvasRenderingContext2D,
	creationPreviewBounds: CanvasRenderOptions['creationPreviewBounds'],
) => {
	ctx.save()
	ctx.beginPath()
	ctx.globalAlpha = 0.4
	ctx.fillStyle = CANVAS_COLORS.PreviewPanelFillStyle
	ctx.strokeStyle = PANEL_STROKE_STYLE.DEFAULT
	const { top, left, width, height } = creationPreviewBounds
	ctx.fillRect(left, top, width, height)
	ctx.strokeRect(left, top, width, height)
	/*	ctx.rect(left, top, width, height)
	 ctx.fill()
	 ctx.stroke()*/
	ctx.restore()
}
