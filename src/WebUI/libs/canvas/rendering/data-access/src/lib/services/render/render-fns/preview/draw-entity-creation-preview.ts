import { CANVAS_COLORS } from '@entities/shared'
import { CanvasRenderOptions } from '../../../../types'

export const drawEntityCreationPreview = (
	ctx: CanvasRenderingContext2D,
	creationPreviewBounds: CanvasRenderOptions['creationPreviewBounds'],
) => {
	ctx.save()
	ctx.beginPath()
	ctx.globalAlpha = 0.4
	ctx.fillStyle = CANVAS_COLORS.PreviewPanelFillStyle
	const { top, left, width, height } = creationPreviewBounds
	ctx.rect(left, top, width, height)
	// ctx.rect(completeBounds.left, completeBounds.top, completeBounds.width, completeBounds.height)
	ctx.fill()
	ctx.stroke()
	ctx.restore()
}
