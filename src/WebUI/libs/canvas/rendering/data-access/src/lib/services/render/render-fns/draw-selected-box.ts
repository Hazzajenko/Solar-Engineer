import { getCompleteBoundsFromMultipleEntitiesWithPadding } from '@canvas/utils'
import { CANVAS_COLORS, EntityBase } from '@entities/shared'

export const drawSelectedBox = (ctx: CanvasRenderingContext2D, panelsInArea: EntityBase[]) => {
	const selectionBoxBounds = getCompleteBoundsFromMultipleEntitiesWithPadding(panelsInArea, 10)

	ctx.save()
	const { left, top, width, height } = selectionBoxBounds
	ctx.strokeStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
	ctx.lineWidth = 1
	ctx.strokeRect(left, top, width, height)
	ctx.restore()
}

export const getDrawSelectedBoxFn = (panelsInArea: EntityBase[]) => {
	return (ctx: CanvasRenderingContext2D) => {
		drawSelectedBox(ctx, panelsInArea)
	}
}
