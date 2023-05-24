import { CANVAS_COLORS, ENTITY_TYPE, SizeByType } from '@entities/shared'
import { CanvasRenderOptions } from '@canvas/rendering/data-access'

export const drawCreationDragBox = (
	ctx: CanvasRenderingContext2D,
	creationBox: CanvasRenderOptions['creationBox'],
) => {
	ctx.save()
	ctx.beginPath()
	ctx.globalAlpha = 0.4
	ctx.strokeStyle = CANVAS_COLORS.CreationBoxFillStyle
	ctx.lineWidth = 1
	const { x, y, width, height } = creationBox
	ctx.rect(x, y, width, height)
	ctx.fill()
	ctx.stroke()
	ctx.closePath()
	ctx.restore()

	const entitySize = SizeByType[ENTITY_TYPE.Panel]

	ctx.save()
	creationBox.spots.forEach((spot) => {
		ctx.save()
		ctx.beginPath()
		ctx.globalAlpha = 0.4
		ctx.fillStyle = spot.vacant
			? CANVAS_COLORS.PreviewPanelFillStyle
			: CANVAS_COLORS.TakenSpotFillStyle
		ctx.rect(spot.x, spot.y, entitySize.width, entitySize.height)
		ctx.fill()
		ctx.stroke()
		ctx.restore()
	})
	ctx.restore()
}