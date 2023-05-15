import { GraphicsState, NEARBY_LINES_STATE } from '@canvas/graphics/data-access'

import { CompleteEntityBounds, NearbyEntity } from '@shared/data-access/models'
import { CANVAS_COLORS, CanvasColor } from '@entities/shared'
import {
	getLinePointsBetweenTwoEntitiesV2,
	getMiddleOfEntityAxisLinePoints,
} from '@canvas/object-positioning/data-access'
import { getCompleteEntityBounds, getEntityAxisGridLinesByAxisV2 } from '@canvas/utils'
import { CanvasRenderOptions } from '../../../../types'

export const drawNearbyLineDrawCtxFnFromNearbyLinesState = (
	ctx: CanvasRenderingContext2D,
	nearbyLinesState: GraphicsState['nearbyLinesState'],
	axisPreviewRect: CompleteEntityBounds,
	mouseBounds: CompleteEntityBounds,
	closestEntity: NearbyEntity,
	fillStyle: CanvasColor,
	snapToGridBool: boolean,
	isMovingExistingEntity: boolean,
) => {
	switch (nearbyLinesState) {
		case NEARBY_LINES_STATE.TWO_SIDE_AXIS_LINES:
			return drawEntityGridLineWithEntityPreviewFn(
				ctx,
				axisPreviewRect,
				mouseBounds,
				closestEntity,
				CANVAS_COLORS.HoveredPanelFillStyle,
				snapToGridBool,
				isMovingExistingEntity,
			)
		case NEARBY_LINES_STATE.CENTER_LINE_SCREEN_SIZE:
			return drawEntityAxisCenterWithEntityPreviewFn(
				ctx,
				axisPreviewRect,
				mouseBounds,
				closestEntity,
				CANVAS_COLORS.HoveredPanelFillStyle,
				snapToGridBool,
				isMovingExistingEntity,
			)
		case NEARBY_LINES_STATE.CENTER_LINE_BETWEEN_TWO_ENTITIES:
			return drawCenterLineBetweenTwoEntitiesWithPreviewFn(
				ctx,
				axisPreviewRect,
				mouseBounds,
				closestEntity,
				CANVAS_COLORS.HoveredPanelFillStyle,
				snapToGridBool,
				isMovingExistingEntity,
			)
		default:
			throw new Error(`${nearbyLinesState} is not implemented`)
	}
}

export const drawNearbyLineDrawCtxFnFromNearbyLinesStateOptimised = (
	ctx: CanvasRenderingContext2D,
	nearbyLinesState: GraphicsState['nearbyLinesState'],
	nearbyOptions: NonNullable<CanvasRenderOptions['nearby']>,
	fillStyle: CanvasColor,
) => {
	/*	const {
	 axisPreviewRect,
	 mouseBounds,
	 nearbyEntity: closestEntity,
	 snapToGridBool,
	 isMovingExistingEntity,
	 } = nearbyOptions*/
	// }
	switch (nearbyLinesState) {
		case NEARBY_LINES_STATE.TWO_SIDE_AXIS_LINES:
			return drawEntityGridLineWithEntityPreviewFnV2(ctx, nearbyOptions, fillStyle)
		case NEARBY_LINES_STATE.CENTER_LINE_SCREEN_SIZE:
			return drawEntityAxisCenterWithEntityPreviewFn(
				ctx,
				nearbyOptions.axisPreviewRect,
				nearbyOptions.mouseBounds,
				nearbyOptions.nearbyEntity,
				fillStyle,
				nearbyOptions.snapToGridBool,
				nearbyOptions.isMovingExistingEntity,
			)
		case NEARBY_LINES_STATE.CENTER_LINE_BETWEEN_TWO_ENTITIES:
			return drawCenterLineBetweenTwoEntitiesWithPreviewFnV2(ctx, nearbyOptions, fillStyle)
		default:
			throw new Error(`${nearbyLinesState} is not implemented`)
	}
}

export const drawEntityGridLineWithEntityPreviewFn = (
	ctx: CanvasRenderingContext2D,
	axisPreviewRect: CompleteEntityBounds,
	mouseBounds: CompleteEntityBounds,
	closestEntity: NearbyEntity,
	fillStyle: CanvasColor,
	snapToGridBool: boolean,
	isMovingExistingEntity: boolean,
) => {
	ctx.save()
	ctx.beginPath()
	isMovingExistingEntity ? (ctx.globalAlpha = 1) : (ctx.globalAlpha = 0.6)
	ctx.fillStyle = fillStyle

	if (snapToGridBool) {
		ctx.rect(
			axisPreviewRect.left,
			axisPreviewRect.top,
			axisPreviewRect.width,
			axisPreviewRect.height,
		)
	} else {
		ctx.rect(mouseBounds.left, mouseBounds.top, mouseBounds.width, mouseBounds.height)
	}

	ctx.fill()
	ctx.stroke()
	ctx.restore()
	ctx.save()
	const gridLines = getEntityAxisGridLinesByAxisV2(closestEntity.bounds, closestEntity.axis)

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

export const drawEntityGridLineWithEntityPreviewFnV2 = (
	ctx: CanvasRenderingContext2D,
	nearbyOptions: NonNullable<CanvasRenderOptions['nearby']>,
	fillStyle: CanvasColor,
) => {
	const {
		axisPreviewRect,
		mouseBounds,
		nearbyEntity: closestEntity,
		snapToGridBool,
		isMovingExistingEntity,
	} = nearbyOptions

	ctx.save()
	ctx.beginPath()
	isMovingExistingEntity ? (ctx.globalAlpha = 1) : (ctx.globalAlpha = 0.6)
	ctx.fillStyle = fillStyle

	if (snapToGridBool) {
		ctx.rect(
			axisPreviewRect.left,
			axisPreviewRect.top,
			axisPreviewRect.width,
			axisPreviewRect.height,
		)
	} else {
		ctx.rect(mouseBounds.left, mouseBounds.top, mouseBounds.width, mouseBounds.height)
	}

	ctx.fill()
	ctx.stroke()
	ctx.restore()
	ctx.save()
	const gridLines = getEntityAxisGridLinesByAxisV2(closestEntity.bounds, closestEntity.axis)

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

export const drawEntityAxisCenterWithEntityPreviewFn = (
	ctx: CanvasRenderingContext2D,
	axisPreviewRect: CompleteEntityBounds,
	mouseBounds: CompleteEntityBounds,
	closestEntity: NearbyEntity,
	fillStyle: CanvasColor,
	snapToGridBool: boolean,
	isMovingExistingEntity: boolean,
) => {
	ctx.save()
	ctx.beginPath()
	isMovingExistingEntity ? (ctx.globalAlpha = 1) : (ctx.globalAlpha = 0.6)
	ctx.fillStyle = fillStyle

	if (snapToGridBool) {
		ctx.rect(
			axisPreviewRect.left,
			axisPreviewRect.top,
			axisPreviewRect.width,
			axisPreviewRect.height,
		)
	} else {
		ctx.rect(mouseBounds.left, mouseBounds.top, mouseBounds.width, mouseBounds.height)
	}

	ctx.fill()
	ctx.stroke()
	ctx.restore()
	ctx.save()
	const gridLines = getMiddleOfEntityAxisLinePoints(closestEntity.bounds, closestEntity.axis)

	ctx.save()
	ctx.beginPath()
	ctx.globalAlpha = snapToGridBool ? 0.6 : 0.4
	ctx.strokeStyle = CANVAS_COLORS.NearbyPanelStrokeStyle
	ctx.fillStyle = CANVAS_COLORS.NearbyPanelFillStyle
	ctx.moveTo(gridLines[0], gridLines[1])
	ctx.lineTo(gridLines[2], gridLines[3])
	ctx.stroke()
	ctx.restore()

	ctx.restore()
}
export const drawCenterLineBetweenTwoEntitiesWithPreviewFnV2 = (
	ctx: CanvasRenderingContext2D,
	nearbyOptions: NonNullable<CanvasRenderOptions['nearby']>,
	fillStyle: CanvasColor,
) => {
	const {
		axisPreviewRect,
		mouseBounds,
		nearbyEntity: closestEntity,
		snapToGridBool,
		isMovingExistingEntity,
	} = nearbyOptions
	ctx.save()
	ctx.beginPath()
	isMovingExistingEntity ? (ctx.globalAlpha = 1) : (ctx.globalAlpha = 0.6)
	ctx.fillStyle = fillStyle

	if (snapToGridBool) {
		ctx.rect(
			axisPreviewRect.left,
			axisPreviewRect.top,
			axisPreviewRect.width,
			axisPreviewRect.height,
		)
	} else {
		ctx.rect(mouseBounds.left, mouseBounds.top, mouseBounds.width, mouseBounds.height)
	}

	ctx.fill()
	ctx.stroke()
	ctx.restore()
	ctx.save()
	const nearbyToComplete = getCompleteEntityBounds(closestEntity.bounds)
	const gridLines = getLinePointsBetweenTwoEntitiesV2(
		nearbyToComplete,
		mouseBounds,
		closestEntity.axis,
	)

	ctx.save()
	ctx.beginPath()
	ctx.globalAlpha = snapToGridBool ? 0.6 : 0.4
	ctx.strokeStyle = CANVAS_COLORS.NearbyPanelStrokeStyle
	ctx.fillStyle = CANVAS_COLORS.NearbyPanelFillStyle
	ctx.moveTo(gridLines[0], gridLines[1])
	ctx.lineTo(gridLines[2], gridLines[3])
	ctx.stroke()
	ctx.restore()

	// drawLineBetweenTwoEntities(closestEntity, axisPreviewRect, snapToGridBool).call(this, ctx)
	ctx.restore()
}

export const drawCenterLineBetweenTwoEntitiesWithPreviewFn = (
	ctx: CanvasRenderingContext2D,
	axisPreviewRect: CompleteEntityBounds,
	mouseBounds: CompleteEntityBounds,
	closestEntity: NearbyEntity,
	fillStyle: CanvasColor,
	snapToGridBool: boolean,
	isMovingExistingEntity: boolean,
) => {
	ctx.save()
	ctx.beginPath()
	isMovingExistingEntity ? (ctx.globalAlpha = 1) : (ctx.globalAlpha = 0.6)
	ctx.fillStyle = fillStyle

	if (snapToGridBool) {
		ctx.rect(
			axisPreviewRect.left,
			axisPreviewRect.top,
			axisPreviewRect.width,
			axisPreviewRect.height,
		)
	} else {
		ctx.rect(mouseBounds.left, mouseBounds.top, mouseBounds.width, mouseBounds.height)
	}

	ctx.fill()
	ctx.stroke()
	ctx.restore()
	ctx.save()
	const nearbyToComplete = getCompleteEntityBounds(closestEntity.bounds)
	const gridLines = getLinePointsBetweenTwoEntitiesV2(
		nearbyToComplete,
		mouseBounds,
		closestEntity.axis,
	)

	ctx.save()
	ctx.beginPath()
	ctx.globalAlpha = snapToGridBool ? 0.6 : 0.4
	ctx.strokeStyle = CANVAS_COLORS.NearbyPanelStrokeStyle
	ctx.fillStyle = CANVAS_COLORS.NearbyPanelFillStyle
	ctx.moveTo(gridLines[0], gridLines[1])
	ctx.lineTo(gridLines[2], gridLines[3])
	ctx.stroke()
	ctx.restore()

	// drawLineBetweenTwoEntities(closestEntity, axisPreviewRect, snapToGridBool).call(this, ctx)
	ctx.restore()
}
