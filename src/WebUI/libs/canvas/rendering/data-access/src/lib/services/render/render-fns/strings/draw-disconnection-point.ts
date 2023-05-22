import { CANVAS_COLORS, CanvasPanel } from '@entities/shared'
import { drawBoxWithOptionsCtx } from '../draw-box-with-options.ctx'

export const drawDisconnectionPoint = (ctx: CanvasRenderingContext2D, panel: CanvasPanel): void => {
	ctx.save()
	ctx.strokeStyle = 'orange'
	ctx.lineWidth = 2
	const width = panel.width + 4
	const height = panel.height + 4
	ctx.strokeRect(-width / 2, -height / 2, width, height)
	ctx.restore()
}

export const drawDisconnectionPointBox = (
	ctx: CanvasRenderingContext2D,
	panel: CanvasPanel,
): void => {
	const { left, top } = drawBoxWithOptionsCtx(ctx, [panel], {
		color: CANVAS_COLORS.HoveringOverPanelInLinkMenuStrokeStyle,
		lineWidth: 2,
		padding: 5,
	})
	const fontSize = 8
	ctx.font = `${fontSize}px Consolas, sans-serif`
	const text = 'DP'
	ctx.fillStyle = 'black'
	ctx.fillText(text, left, top - 2)
}
