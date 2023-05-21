import { CANVAS_COLORS } from '@entities/shared'
import { Point } from '@shared/data-access/models'

export type DrawTooltipOptions = {
	padding: number
	color: string
	lineWidth: number
}
export const drawTooltipWithOptionsCtx = (
	ctx: CanvasRenderingContext2D,
	point: Point,
	text: string, // options: Partial<DrawTooltipOptions>,
) => {
	ctx.save()
	ctx.fillStyle = CANVAS_COLORS.TooltipFillStyle
	ctx.strokeStyle = CANVAS_COLORS.TooltipStrokeStyle
	ctx.lineWidth = 1
	ctx.font = '12px Arial'
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	const textWidth = ctx.measureText(text).width
	const textHeight = 12
	const padding = 10
	const { x, y } = point
	const width = textWidth + padding * 2
	const height = textHeight + padding * 2
	ctx.fillRect(x - width / 2, y - height / 2, width, height)
	ctx.strokeRect(x - width / 2, y - height / 2, width, height)
	ctx.fillStyle = CANVAS_COLORS.TooltipTextFillStyle
	ctx.fillText(text, x, y)
	ctx.restore()
	/*	const { x, y } = { x: 100, y: 100 }
	 const width = textWidth + padding * 2
	 const height = textHeight + padding * 2
	 ctx.fillRect(x - width / 2, y - height / 2, width, height)
	 ctx.strokeRect(x - width / 2, y - height / 2, width, height)
	 ctx.fillStyle = CANVAS_COLORS.TooltipTextFillStyle
	 ctx.fillText(text, x, y)*/
	// ctx.restore()

	/*	const padding = options.padding ?? 10
	 const color = options.color ?? CANVAS_COLORS.MultiSelectedPanelFillStyle
	 const lineWidth = options.lineWidth ?? 1
	 const selectionBoxBounds = getCompleteBoundsFromMultipleEntitiesWithPadding(panelsInArea, padding)

	 ctx.save()
	 const { left, top, width, height } = selectionBoxBounds
	 ctx.strokeStyle = color
	 ctx.lineWidth = lineWidth
	 ctx.strokeRect(left, top, width, height)
	 ctx.restore()*/
}
