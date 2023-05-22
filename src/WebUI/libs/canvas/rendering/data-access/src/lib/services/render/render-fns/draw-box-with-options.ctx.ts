import { getCompleteBoundsFromMultipleEntitiesWithPadding } from '@canvas/utils'
import { CANVAS_COLORS, CanvasEntity } from '@entities/shared'

export type DrawBoxOptions = {
	padding: number
	color: string
	lineWidth: number
}
export const drawBoxWithOptionsCtx = (
	ctx: CanvasRenderingContext2D,
	panelsInArea: CanvasEntity[],
	options: Partial<DrawBoxOptions>,
) => {
	const padding = options.padding ?? 10
	const color = options.color ?? CANVAS_COLORS.MultiSelectedPanelFillStyle
	const lineWidth = options.lineWidth ?? 1
	const selectionBoxBounds = getCompleteBoundsFromMultipleEntitiesWithPadding(panelsInArea, padding)

	ctx.save()
	const { left, top, width, height } = selectionBoxBounds
	ctx.strokeStyle = color
	ctx.lineWidth = lineWidth
	ctx.strokeRect(left, top, width, height)
	ctx.restore()
	return selectionBoxBounds
}
