import { CANVAS_COLORS, CanvasColor } from '../../../types'
import { CompleteEntityBounds, getEntityAxisGridLinesByAxisV2 } from '../../../utils'
import { NearbyEntity } from '../nearby-entity'
import { getSnapToGridBoolean, handleSnapToGridWhenNearby } from '../utils'

export const getEntityGridLineWithEntityPreviewFn = (
	event: PointerEvent,
	axisPreviewRect: CompleteEntityBounds,
	mouseBounds: CompleteEntityBounds,
	closestEntity: NearbyEntity,
	fillStyle: CanvasColor,
	holdAltToSnapToGrid: boolean,
) => {
	return (ctx: CanvasRenderingContext2D) => {
		ctx.save()
		ctx.beginPath()
		ctx.globalAlpha = 0.4
		ctx.fillStyle = fillStyle

		const snapToGridBool = getSnapToGridBoolean(
			event.altKey,
			mouseBounds,
			closestEntity.axis,
			axisPreviewRect,
			holdAltToSnapToGrid,
		)

		handleSnapToGridWhenNearby(ctx, axisPreviewRect, mouseBounds, closestEntity, snapToGridBool)

		ctx.fill()
		ctx.stroke()
		ctx.restore()
		ctx.save()
		drawEntityGridLines(closestEntity, snapToGridBool).call(this, ctx)
		ctx.restore()
	}
}
export const drawEntityGridLines = (nearbyEntity: NearbyEntity, snapToGridBool: boolean) => {
	const gridLines = getEntityAxisGridLinesByAxisV2(nearbyEntity.bounds, nearbyEntity.axis)
	return (ctx: CanvasRenderingContext2D) => {
		ctx.save()
		ctx.beginPath()
		ctx.globalAlpha = snapToGridBool ? 0.6 : 0.4
		ctx.strokeStyle = CANVAS_COLORS.NearbyPanelStrokeStyle
		ctx.fillStyle = CANVAS_COLORS.NearbyPanelFillStyle
		ctx.moveTo(gridLines[0][0], gridLines[0][1])
		ctx.lineTo(gridLines[0][2], gridLines[0][3])
		ctx.moveTo(gridLines[1][0], gridLines[1][1])
		ctx.lineTo(gridLines[1][2], gridLines[1][3])
		ctx.stroke()
		ctx.restore()
	}
}