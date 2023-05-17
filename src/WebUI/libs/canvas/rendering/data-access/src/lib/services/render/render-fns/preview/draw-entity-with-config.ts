import { CANVAS_COLORS, PANEL_STROKE_STYLE } from '@entities/shared'

export type DrawEntityWithConfigOptions = {
	fillStyle: string
	strokeStyle: string
	globalAlpha: number
}

export function drawEntityWithConfig(
	ctx: CanvasRenderingContext2D,
	bounds: {
		top: number
		left: number
		width: number
		height: number
	},
	options: Partial<{
		fillStyle: string
		strokeStyle: string
		globalAlpha: number
	}>,
) {
	const { top, left, width, height } = bounds
	const fillStyle = options.fillStyle ?? CANVAS_COLORS.DefaultPanelFillStyle
	const strokeStyle = options.strokeStyle ?? PANEL_STROKE_STYLE.DEFAULT
	const globalAlpha = options.globalAlpha ?? 1

	ctx.save()
	ctx.globalAlpha = globalAlpha
	ctx.fillStyle = fillStyle
	ctx.strokeStyle = strokeStyle
	ctx.beginPath()
	ctx.fillRect(left, top, width, height)
	ctx.strokeRect(left, top, width, height)
	/*	ctx.rect(left, top, width, height)
	 ctx.fill()
	 ctx.stroke()*/
	ctx.restore()
}
