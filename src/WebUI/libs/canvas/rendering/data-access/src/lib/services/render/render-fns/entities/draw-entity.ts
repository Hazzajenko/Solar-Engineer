import { CanvasEntity } from '@entities/shared'

export const drawEntity = (
	ctx: CanvasRenderingContext2D,
	entity: CanvasEntity,
	fillStyle: string,
	strokeStyle: string,
) => {
	ctx.save()
	ctx.fillStyle = fillStyle
	ctx.strokeStyle = strokeStyle
	ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
	ctx.rotate(entity.angle)
	ctx.beginPath()
	ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
	ctx.fill()
	ctx.stroke()
	ctx.closePath()
	ctx.restore()
}
