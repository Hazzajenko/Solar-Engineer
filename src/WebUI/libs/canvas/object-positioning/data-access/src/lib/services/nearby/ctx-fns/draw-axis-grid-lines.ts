import { getSnapToGridBoolean, handleSnapToGridWhenNearby } from '../utils'
import {
	CANVAS_COLORS,
	CanvasColor,
	CompleteEntityBounds,
	NearbyEntity,
} from '@shared/data-access/models'
import { getEntityAxisGridLinesByAxisV2 } from '@canvas/utils'

export const getEntityGridLineWithEntityPreviewFn = (
	altKey: boolean,
	axisPreviewRect: CompleteEntityBounds,
	mouseBounds: CompleteEntityBounds,
	closestEntity: NearbyEntity,
	fillStyle: CanvasColor,
	holdAltToSnapToGrid: boolean,
	isMovingExistingEntity: boolean,
) => {
	return (ctx: CanvasRenderingContext2D) => {
		ctx.save()
		ctx.beginPath()
		isMovingExistingEntity ? (ctx.globalAlpha = 1) : (ctx.globalAlpha = 0.6)
		ctx.fillStyle = fillStyle

		const snapToGridBool = getSnapToGridBoolean(
			altKey,
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
		/*		if (isMovingExistingEntity) {
		 ctx.globalAlpha = 1
		 } else {
		 ctx.globalAlpha = snapToGridBool ? 0.6 : 0.4
		 }*/
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
