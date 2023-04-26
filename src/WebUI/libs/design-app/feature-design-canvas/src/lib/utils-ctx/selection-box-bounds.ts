import { CANVAS_COLORS } from '../types'
import { AngleRadians } from '../utils'

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

export const drawSelectionBoxBoundsCtxFnWithTranslateRotate = (selectionBoxBounds: {
	left: number
	top: number
	width: number
	height: number
	angle: AngleRadians
}) => {
	return (ctx: CanvasRenderingContext2D) => {
		ctx.save()
		const { left, top, width, height } = selectionBoxBounds
		ctx.strokeStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
		ctx.lineWidth = 1
		ctx.translate(left + width / 2, top + height / 2)
		ctx.rotate(selectionBoxBounds.angle)
		ctx.rect(-width / 2, -height / 2, width, height)
		ctx.stroke()
		// ctx.strokeRect(left, top, width, height)
		ctx.restore()
	}
}
// ctx.translate(location.x + entity.width / 2, location.y + entity.height / 2)
// ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)