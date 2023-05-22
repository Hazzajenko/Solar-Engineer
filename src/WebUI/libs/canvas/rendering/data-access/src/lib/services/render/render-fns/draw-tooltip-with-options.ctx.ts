import { CANVAS_COLORS, PanelLinkModel } from '@entities/shared'
import { Point } from '@shared/data-access/models'

export type DrawTooltipOptions = {
	padding: number
	color: string
	lineWidth: number
}

export const drawPanelLinkTooltip = (
	ctx: CanvasRenderingContext2D,
	point: Point,
	panelLink: PanelLinkModel,
) => {
	// ctx.save()
	ctx.fillStyle = CANVAS_COLORS.TooltipFillStyle
	ctx.strokeStyle = CANVAS_COLORS.TooltipStrokeStyle
	ctx.lineWidth = 1
	ctx.font = '12px Arial'
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	const heading = `Panel Link: ${panelLink.id}`
	const lines = ['Panel Link', panelLink.id]
	// const lines = [`From: ${panelLink.positivePanelId}`, `To: ${panelLink.negativePanelId}`]
	const textWidth = Math.max(
		...lines.map((line) => ctx.measureText(line).width),
		ctx.measureText(heading).width,
	)
	const textHeight = 12 * lines.length
	const padding = 10
	const { x, y } = point
	const width = textWidth + padding * 2
	const height = textHeight + padding * 2
	ctx.fillRect(x - width / 2, y - height / 2, width, height)
	ctx.strokeRect(x - width / 2, y - height / 2, width, height)
	// ctx.fillStyle = CANVAS_COLORS.TooltipTextFillStyle
	// ctx.fillText(heading, x, y)
	// ctx.restore()
	// ctx.fillText(heading, x, y - textHeight / 2 + 12)
	for (let i = 0; i < lines.length; i++) {
		ctx.fillText(lines[i], x, y - textHeight / 2 + 12 * (i + 1))
	}
	ctx.restore()
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
}
