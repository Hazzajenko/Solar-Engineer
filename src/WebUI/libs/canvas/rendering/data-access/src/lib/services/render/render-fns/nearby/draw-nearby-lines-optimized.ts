import { GraphicsState, NEARBY_LINES_STATE } from '@canvas/graphics/data-access'
import { CanvasColor } from '@entities/shared'
import {
	drawEntityGridLines,
	drawLineBetweenTwoEntitiesV2,
	drawMiddleOfEntityAxisLine,
	handleSnapToGridWhenNearby,
} from '@canvas/object-positioning/data-access'
import { CanvasRenderOptions } from '../../../../types'

export const drawNearbyLineDrawCtxFnFromNearbyLinesStateOptimisedV2 = (
	ctx: CanvasRenderingContext2D,
	nearbyLinesState: GraphicsState['nearbyLinesState'],
	nearbyOptions: NonNullable<CanvasRenderOptions['nearby']>,
	fillStyle: CanvasColor,
) => {
	switch (nearbyLinesState) {
		case NEARBY_LINES_STATE.TWO_SIDE_AXIS_LINES:
			return drawEntityGridLineWithEntityPreviewFnV3(ctx, nearbyOptions, fillStyle)
		case NEARBY_LINES_STATE.CENTER_LINE_SCREEN_SIZE:
			return drawEntityAxisCenterWithEntityPreviewFnV2(ctx, nearbyOptions, fillStyle)
		case NEARBY_LINES_STATE.CENTER_LINE_BETWEEN_TWO_ENTITIES:
			return drawCenterLineBetweenTwoEntitiesWithPreviewFnV3(ctx, nearbyOptions, fillStyle)
		default:
			throw new Error(`${nearbyLinesState} is not implemented`)
	}
}

export const drawEntityGridLineWithEntityPreviewFnV3 = (
	ctx: CanvasRenderingContext2D,
	nearbyOptions: NonNullable<CanvasRenderOptions['nearby']>,
	fillStyle: CanvasColor,
) => {
	const {
		axisPreviewRect,
		mouseBounds,
		closestEntity: closestEntity,
		snapToGridBool,
		entityToMove,
	} = nearbyOptions

	ctx.save()
	ctx.beginPath()
	entityToMove ? (ctx.globalAlpha = 1) : (ctx.globalAlpha = 0.6)
	ctx.fillStyle = fillStyle

	handleSnapToGridWhenNearby(
		ctx,
		axisPreviewRect,
		mouseBounds,
		closestEntity,
		snapToGridBool,
		entityToMove,
	)

	ctx.fill()
	ctx.stroke()
	ctx.restore()
	ctx.save()
	drawEntityGridLines(ctx, closestEntity, snapToGridBool)
	ctx.restore()
}

export const drawEntityAxisCenterWithEntityPreviewFnV2 = (
	ctx: CanvasRenderingContext2D,
	nearbyOptions: NonNullable<CanvasRenderOptions['nearby']>,
	fillStyle: CanvasColor,
) => {
	const { axisPreviewRect, mouseBounds, closestEntity, snapToGridBool, entityToMove } =
		nearbyOptions
	ctx.save()
	ctx.beginPath()
	entityToMove ? (ctx.globalAlpha = 1) : (ctx.globalAlpha = 0.6)
	ctx.fillStyle = fillStyle

	handleSnapToGridWhenNearby(
		ctx,
		axisPreviewRect,
		mouseBounds,
		closestEntity,
		snapToGridBool,
		entityToMove,
	)

	ctx.fill()
	ctx.stroke()
	ctx.restore()
	ctx.save()
	drawMiddleOfEntityAxisLine(ctx, closestEntity, snapToGridBool)
	ctx.restore()
}
export const drawCenterLineBetweenTwoEntitiesWithPreviewFnV3 = (
	ctx: CanvasRenderingContext2D,
	nearbyOptions: NonNullable<CanvasRenderOptions['nearby']>,
	fillStyle: CanvasColor,
) => {
	const { axisPreviewRect, mouseBounds, closestEntity, snapToGridBool, entityToMove } =
		nearbyOptions
	ctx.save()
	ctx.beginPath()
	entityToMove ? (ctx.globalAlpha = 1) : (ctx.globalAlpha = 0.6)
	ctx.fillStyle = fillStyle

	handleSnapToGridWhenNearby(
		ctx,
		axisPreviewRect,
		mouseBounds,
		closestEntity,
		snapToGridBool,
		entityToMove,
	)

	ctx.fill()
	ctx.stroke()
	ctx.restore()
	ctx.save()
	drawLineBetweenTwoEntitiesV2(ctx, closestEntity, axisPreviewRect, snapToGridBool)
	ctx.restore()
}
