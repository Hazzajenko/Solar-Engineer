import { getSnapToGridBoolean, handleSnapToGridWhenNearby } from '../utils'
import {
	AXIS,
	Axis,
	CompleteEntityBounds,
	EntityBounds,
	NearbyEntity,
} from '@shared/data-access/models'
import { getCompleteEntityBounds } from '@canvas/utils'
import { CANVAS_COLORS, CanvasColor } from '@entities/shared'

export const getCenterLineBetweenTwoEntitiesWithPreviewFn = (
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
		)

		ctx.fill()
		ctx.stroke()
		ctx.restore()
		ctx.save()
		drawLineBetweenTwoEntities(closestEntity, axisPreviewRect, snapToGridBool).call(this, ctx)
		ctx.restore()
	}
}

export const makeBoundsSmallerByAxis = (bounds: CompleteEntityBounds, axis: Axis) => {
	const { width, height } = bounds
	switch (axis) {
		case AXIS.X:
			return {
				...bounds,
				left: bounds.left + width / 4,
				right: bounds.right - width / 4,
			}
		case AXIS.Y:
			return {
				...bounds,
				top: bounds.top + height / 4,
				bottom: bounds.bottom - height / 4,
			}
	}
}
export const drawLineBetweenTwoEntities = (
	nearbyEntity: NearbyEntity,
	mouseBounds: CompleteEntityBounds,
	snapToGridBool: boolean,
) => {
	const nearbyToComplete = getCompleteEntityBounds(nearbyEntity.bounds)
	const gridLines = getLinePointsBetweenTwoEntitiesV2(
		nearbyToComplete,
		mouseBounds,
		nearbyEntity.axis,
	)
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

export const drawLineBetweenTwoEntitiesV2 = (
	ctx: CanvasRenderingContext2D,
	nearbyEntity: NearbyEntity,
	mouseBounds: CompleteEntityBounds,
	snapToGridBool: boolean,
) => {
	const nearbyToComplete = getCompleteEntityBounds(nearbyEntity.bounds)
	const gridLines = getLinePointsBetweenTwoEntitiesV2(
		nearbyToComplete,
		mouseBounds,
		nearbyEntity.axis,
	)
	ctx.save()
	// ctx.beginPath()
	ctx.globalAlpha = snapToGridBool ? 0.6 : 0.4
	ctx.strokeStyle = CANVAS_COLORS.NearbyPanelStrokeStyle
	// ctx.fillStyle = CANVAS_COLORS.NearbyPanelFillStyle
	ctx.moveTo(gridLines[0], gridLines[1])
	ctx.lineTo(gridLines[2], gridLines[3])
	ctx.stroke()
	ctx.restore()
}

export const getLinePointsBetweenTwoEntities = (
	bounds1: EntityBounds,
	bounds2: EntityBounds,
	axis: Axis,
): number[] => {
	if (axis === AXIS.Y) {
		return [bounds1.centerX, bounds1.centerY, bounds2.centerX, bounds2.centerY]
	}
	return [bounds1.centerX, bounds1.centerY, bounds2.centerX, bounds2.centerY]
}

export const getLinePointsBetweenTwoEntitiesV2 = (
	bounds1: CompleteEntityBounds,
	bounds2: CompleteEntityBounds,
	axis: Axis,
): number[] => {
	if (axis === AXIS.Y) {
		if (bounds1.centerX > bounds2.centerX) {
			return [bounds1.left, bounds1.centerY, bounds2.right, bounds2.centerY]
		}
		return [bounds1.right, bounds1.centerY, bounds2.left, bounds2.centerY]
	}
	if (bounds1.centerY > bounds2.centerY) {
		return [bounds1.centerX, bounds1.top, bounds2.centerX, bounds2.bottom]
	}
	return [bounds1.centerX, bounds1.bottom, bounds2.centerX, bounds2.top]
}
