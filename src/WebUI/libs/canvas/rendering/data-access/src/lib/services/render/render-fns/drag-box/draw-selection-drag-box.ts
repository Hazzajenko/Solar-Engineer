import { CANVAS_COLORS } from '@entities/shared'
import { CanvasRenderOptions } from '@canvas/rendering/data-access'

export const drawSelectionDragBox = (
	ctx: CanvasRenderingContext2D,
	selectionBox: CanvasRenderOptions['selectionBox'],
) => {
	ctx.save()
	ctx.beginPath()
	ctx.globalAlpha = 0.4
	ctx.strokeStyle = CANVAS_COLORS.SelectionBoxFillStyle
	ctx.lineWidth = 1
	const { x, y, width, height } = selectionBox
	ctx.rect(x, y, width, height)
	ctx.fill()
	ctx.stroke()
	ctx.closePath()
	ctx.restore()
}
