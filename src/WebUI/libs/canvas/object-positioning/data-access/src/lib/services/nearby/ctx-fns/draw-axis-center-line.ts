import { getSnapToGridBoolean, handleSnapToGridWhenNearby } from '../utils'
import {
	AXIS,
	Axis,
	CompleteEntityBounds,
	EntityBounds,
	NearbyEntity,
} from '@shared/data-access/models'
import { CANVAS_COLORS, CanvasColor } from '@entities/shared'

export const getEntityAxisCenterWithEntityPreviewFn = (
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

		handleSnapToGridWhenNearby(
			ctx,
			axisPreviewRect,
			mouseBounds,
			closestEntity,
			snapToGridBool,
			undefined,
			// isMovingExistingEntity,
		)

		ctx.fill()
		ctx.stroke()
		ctx.restore()
		ctx.save()
		getDrawMiddleOfEntityAxisLine(closestEntity, snapToGridBool).call(this, ctx)
		ctx.restore()
	}
}
export const getDrawMiddleOfEntityAxisLine = (
	nearbyEntity: NearbyEntity,
	snapToGridBool: boolean,
) => {
	const gridLines = getMiddleOfEntityAxisLinePoints(nearbyEntity.bounds, nearbyEntity.axis)
	return (ctx: CanvasRenderingContext2D) => {
		ctx.save()
		ctx.beginPath()
		ctx.globalAlpha = snapToGridBool ? 0.6 : 0.4
		ctx.strokeStyle = CANVAS_COLORS.NearbyPanelStrokeStyle
		ctx.fillStyle = CANVAS_COLORS.NearbyPanelFillStyle
		ctx.moveTo(gridLines[0], gridLines[1])
		ctx.lineTo(gridLines[2], gridLines[3])
		ctx.stroke()
		ctx.restore()
	}
}

export const drawMiddleOfEntityAxisLine = (
	ctx: CanvasRenderingContext2D,
	nearbyEntity: NearbyEntity,
	snapToGridBool: boolean,
) => {
	const gridLines = getMiddleOfEntityAxisLinePoints(nearbyEntity.bounds, nearbyEntity.axis)
	ctx.save()
	ctx.beginPath()
	ctx.globalAlpha = snapToGridBool ? 0.6 : 0.4
	ctx.strokeStyle = CANVAS_COLORS.NearbyPanelStrokeStyle
	ctx.fillStyle = CANVAS_COLORS.NearbyPanelFillStyle
	ctx.moveTo(gridLines[0], gridLines[1])
	ctx.lineTo(gridLines[2], gridLines[3])
	ctx.stroke()
	ctx.restore()
}

export const getMiddleOfEntityAxisLinePoints = (bounds: EntityBounds, axis: Axis): number[] => {
	if (axis === AXIS.Y) {
		return [0, bounds.centerY, window.innerWidth, bounds.centerY]
	}
	return [bounds.centerX, 0, bounds.centerX, window.innerHeight]
}