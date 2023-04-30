import { CANVAS_COLORS, CanvasEntity } from '../../../types'
import { getCompleteBoundsFromMultipleEntitiesWithPadding } from '../../../utils'

export const drawSelectedBox = (ctx: CanvasRenderingContext2D, panelsInArea: CanvasEntity[]) => {
	const selectionBoxBounds = getCompleteBoundsFromMultipleEntitiesWithPadding(panelsInArea, 10)

	ctx.save()
	const { left, top, width, height } = selectionBoxBounds
	ctx.strokeStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
	ctx.lineWidth = 1
	ctx.strokeRect(left, top, width, height)
	ctx.restore()
}

export const getDrawSelectedBoxFn = (panelsInArea: CanvasEntity[]) => {
	return (ctx: CanvasRenderingContext2D) => {
		drawSelectedBox(ctx, panelsInArea)
	}
}
