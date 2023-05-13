import { EntityBounds } from '@design-app/shared'
import { getCompleteEntityBounds } from '@design-app/utils'

export const drawRectFromBounds = (ctx: CanvasRenderingContext2D, bounds: EntityBounds) => {
	const { left, top, width, height } = getCompleteEntityBounds(bounds)
	ctx.save()
	ctx.beginPath()
	ctx.globalAlpha = 1
	ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
	ctx.strokeStyle = '#49ff41'
	ctx.rect(left, top, width, height)
	ctx.stroke()
	ctx.fill()
	ctx.restore()
}
