import { CANVAS_COLORS, ENTITY_TYPE, SizeByType } from '@entities/shared'
import { CanvasRenderOptions } from '@canvas/rendering/data-access'

export const drawCreationDragBox = (
	ctx: CanvasRenderingContext2D,
	creationBox: CanvasRenderOptions['creationBox'],
	isLoggedIn: boolean,
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

	const entitySize = SizeByType[ENTITY_TYPE.PANEL]

	ctx.save()
	creationBox.spots.forEach((spot, index) => {
		ctx.save()
		ctx.beginPath()
		ctx.globalAlpha = 0.4
		ctx.fillStyle = spot.vacant
			? CANVAS_COLORS.PreviewPanelFillStyle
			: CANVAS_COLORS.TakenSpotFillStyle
		ctx.fillStyle = index > 30 && isLoggedIn ? CANVAS_COLORS.TakenSpotFillStyle : ctx.fillStyle
		// ctx.fillStyle = index < 30 && !isLoggedIn ? ctx.fillStyle : CANVAS_COLORS.TakenSpotFillStyle
		ctx.rect(spot.x, spot.y, entitySize.width, entitySize.height)
		ctx.fill()
		ctx.stroke()
		ctx.restore()
	})
	ctx.restore()

	if (creationBox.spots.length > 30 && isLoggedIn) {
		ctx.save()
		const fontSize = 10
		ctx.font = `${fontSize}px Consolas, sans-serif`
		const stringNameText = `Too many panels to create at once (${creationBox.spots.length}), max is 30.`
		const metrics = ctx.measureText(stringNameText)
		const stringNameTextHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
		ctx.fillStyle = 'black'
		const firstSpot = creationBox.spots[0]
		const lastSpot = creationBox.spots[creationBox.spots.length - 1]
		let left = lastSpot.x
		let top = lastSpot.y + entitySize.height * 2 + stringNameTextHeight
		if (lastSpot.y < firstSpot.y) {
			top = lastSpot.y - entitySize.height - stringNameTextHeight
		}
		if (lastSpot.x > firstSpot.x) {
			left = lastSpot.x - metrics.width
		}
		ctx.fillText(stringNameText, left, top - 2)
		ctx.restore()
	}
}
