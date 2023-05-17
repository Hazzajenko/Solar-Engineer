import { CANVAS_COLORS } from '@entities/shared'
import { CanvasRenderOptions } from '../../../../types'

export const drawClickNearEntityBounds = (
	ctx: CanvasRenderingContext2D,
	clickNearEntityBounds: CanvasRenderOptions['clickNearEntityBounds'],
) => {
	ctx.save()
	ctx.beginPath()
	ctx.globalAlpha = 0.4
	ctx.fillStyle = CANVAS_COLORS.TakenSpotFillStyle
	const { top, left, width, height } = clickNearEntityBounds
	ctx.rect(left, top, width, height)
	// ctx.rect(mouseBoxBounds.left, mouseBoxBounds.top, size.width, size.height)
	ctx.fill()
	ctx.stroke()
	ctx.restore()
}
