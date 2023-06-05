import { EntityBase, getEntitySize } from '@entities/shared'

export const drawEntity = (
	ctx: CanvasRenderingContext2D,
	entity: EntityBase,
	fillStyle: string,
	strokeStyle: string,
) => {
	const { width, height } = getEntitySize(entity)
	ctx.save()
	ctx.fillStyle = fillStyle
	ctx.strokeStyle = strokeStyle
	ctx.translate(entity.location.x + width / 2, entity.location.y + height / 2)
	ctx.rotate(entity.angle)
	ctx.beginPath()
	ctx.rect(-width / 2, -height / 2, width, height)
	ctx.fill()
	ctx.stroke()
	ctx.closePath()
	ctx.restore()
}
