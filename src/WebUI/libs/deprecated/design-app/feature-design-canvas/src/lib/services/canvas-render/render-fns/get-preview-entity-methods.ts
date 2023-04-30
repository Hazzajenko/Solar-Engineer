import { AXIS, Axis, CANVAS_COLORS, ObjectSize, TransformedPoint } from '../../../types'
import {
	CompleteEntityBounds,
	EntityBounds,
	getBoundsFromArrPoints,
	getBoundsFromCenterPoint,
	getCornerPointsFromAxisPosition,
	getEntityAxisGridLinesByAxisV2,
	getOppositeSameAxisPosition,
	getSameAxisPosition,
	isEntityOverlappingWithBounds,
} from '../../../utils'
import {
	CanvasClientStateService,
	NearbyEntityDeprecated,
	StateUpdate,
} from '../../canvas-client-state'
import { findNearbyBoundOverlapOnBothAxis } from '../../object-positioning/utils'
import { groupInto2dArray, mapToDictionary } from '@shared/utils'
import { sortBy } from 'lodash'

export const getDrawPreviewEntityFnV2 = (
	point: TransformedPoint,
	size: ObjectSize,
	state: CanvasClientStateService,
	event: MouseEvent,
) => {
	const mouseBoxBounds = getBoundsFromCenterPoint(point, size)
	const entities = state.entities.panels.getEntities()
	const anyNearClick = !!entities.find((entity) =>
		isEntityOverlappingWithBounds(entity, mouseBoxBounds),
	)

	const nearbyEntitiesOnAxis = findNearbyBoundOverlapOnBothAxis(mouseBoxBounds, entities)

	if (!nearbyEntitiesOnAxis.length) {
		const ctxFn = (ctx: CanvasRenderingContext2D) => {
			ctx.save()
			ctx.beginPath()
			ctx.globalAlpha = 0.4
			ctx.fillStyle = CANVAS_COLORS.PreviewPanelFillStyle
			ctx.rect(mouseBoxBounds.left, mouseBoxBounds.top, size.width, size.height)
			ctx.fill()
			ctx.stroke()
			ctx.restore()
		}
		return {
			ctxFn,
			changes: {
				nearby: {
					ids: [],
					entities: {},
				},
				grid: {
					currentAxis: undefined,
					axisPreviewRect: undefined,
					xAxisLineBounds: undefined,
					yAxisLineBounds: undefined,
				},
			},
		}
	}
	let changes: StateUpdate = {
		nearby: {
			ids: nearbyEntitiesOnAxis.map((entity) => entity.id),
			entities: mapToDictionary(nearbyEntitiesOnAxis),
		},
	}

	const fillStyle = anyNearClick
		? CANVAS_COLORS.TakenSpotFillStyle
		: CANVAS_COLORS.PreviewPanelFillStyle

	const nearbyAxisLinesEnabled = state.menu.nearbyAxisLines
	if (!nearbyAxisLinesEnabled) {
		const ctxFn = (ctx: CanvasRenderingContext2D) => {
			ctx.save()
			ctx.beginPath()
			ctx.globalAlpha = 0.4
			ctx.fillStyle = fillStyle
			ctx.rect(mouseBoxBounds.left, mouseBoxBounds.top, size.width, size.height)
			ctx.fill()
			ctx.stroke()
			ctx.restore()
		}
		return {
			ctxFn,
			changes,
		}
	}

	// const ctxFns: ((ctx: CanvasRenderingContext2D) => void)[] = []
	const nearbySortedByDistance = sortBy(nearbyEntitiesOnAxis, (entity) => Math.abs(entity.distance))
	const nearby2dArray = groupInto2dArray(nearbySortedByDistance, 'axis')

	const closestNearby2dArray = nearby2dArray.map((arr) => arr[0])
	const closestEnt = closestNearby2dArray[0]
	// const entGridLineCtxFn = drawMiddleOfEntityAxisLine(closestEnt, snapToGridBool)
	const entGridLineCtxFn = (ctx: CanvasRenderingContext2D) => {
		ctx.save()
	}

	const gridLines = getEntityAxisGridLinesByAxisV2(closestEnt.bounds, closestEnt.axis)
	const gridLineBounds = getBoundsFromArrPoints(gridLines)

	const axisPreviewRect = getCtxRectBoundsByAxisV2(
		closestEnt.bounds,
		closestEnt.axis,
		mouseBoxBounds,
	)
	// const axisPreviewRect = getCtxRectBoundsByAxis(closestEnt.bounds, closestEnt.axis, mouseBoxBounds)
	changes = {
		...changes,
		grid: {
			...changes.grid,
			currentAxis: closestEnt.axis,
			axisPreviewRect,
			[`${closestEnt.axis}AxisLineBounds`]: gridLineBounds,
		},
	}

	const ctxFn = (ctx: CanvasRenderingContext2D) => {
		ctx.save()
		ctx.beginPath()
		ctx.globalAlpha = 0.4
		ctx.fillStyle = fillStyle

		const altKey = event.altKey
		if (altKey) {
			ctx.globalAlpha = 0.6
			// const axisPos = getCtxRectBoundsByAxis(closestEnt.bounds, closestEnt.axis, mouseBoxBounds)
			ctx.rect(
				axisPreviewRect.left,
				axisPreviewRect.top,
				axisPreviewRect.width,
				axisPreviewRect.height,
			)
		} else {
			ctx.rect(mouseBoxBounds.left, mouseBoxBounds.top, size.width, size.height)
		}
		ctx.fill()
		ctx.stroke()
		ctx.restore()
		entGridLineCtxFn(ctx)
	}

	return {
		ctxFn,
		changes,
	}
}

export const drawEntityGridLinesDeprecated = (
	ctx: CanvasRenderingContext2D,
	nearbyEntity: NearbyEntityDeprecated,
	mouseBoxBounds: EntityBounds,
) => {
	const ctxFns: ((ctx: CanvasRenderingContext2D) => void)[] = []
	const axisPos = getSameAxisPosition(mouseBoxBounds, nearbyEntity.bounds, AXIS.Y)
	if (!axisPos) {
		return []
	}
	const points1 = getCornerPointsFromAxisPosition(axisPos, nearbyEntity.bounds)
	const oppositeAxisPos = getOppositeSameAxisPosition(axisPos)
	const points2 = getCornerPointsFromAxisPosition(oppositeAxisPos, mouseBoxBounds)
	ctxFns.push((ctx: CanvasRenderingContext2D) => {
		ctx.save()
		ctx.beginPath()
		ctx.globalAlpha = 0.4
		ctx.fillStyle = CANVAS_COLORS.NearbyPanelFillStyle
		ctx.moveTo(points1[0].x, points1[0].y)
		ctx.lineTo(points1[1].x, points1[1].y)
		ctx.lineTo(points2[1].x, points2[1].y)
		ctx.lineTo(points2[0].x, points2[0].y)
		ctx.fill()
		ctx.stroke()
		ctx.restore()
	})
	return ctxFns
}

export const getCtxRectBoundsByAxis = (
	bounds: EntityBounds,
	axis: Axis,
	mouseBoxBounds: EntityBounds,
) => {
	const { left, top } = bounds
	const width = bounds.right - bounds.left
	const height = bounds.bottom - bounds.top
	let x = 0
	let y = 0
	if (axis === AXIS.X) {
		x = left
		y = mouseBoxBounds.top
	}
	if (axis === AXIS.Y) {
		x = mouseBoxBounds.left
		y = top
	}
	// const w = width
	// const h = height
	return {
		x,
		y,
		width,
		height,
	}
}

export const getCtxRectBoundsByAxisV2 = (
	bounds: EntityBounds,
	axis: Axis,
	mouseBoxBounds: EntityBounds,
): CompleteEntityBounds => {
	const { left, top } = bounds
	const width = bounds.right - bounds.left
	const height = bounds.bottom - bounds.top
	let x = 0
	let y = 0
	if (axis === AXIS.X) {
		x = left
		y = mouseBoxBounds.top
	}
	if (axis === AXIS.Y) {
		x = mouseBoxBounds.left
		y = top
	}
	// const w = width
	// const h = height
	return {
		left: x,
		top: y,
		right: x + width,
		bottom: y + height,
		centerX: x + width / 2,
		centerY: y + height / 2,
		width,
		height,
	}
}
export const getAxisRectBoundsByAxis = (bounds: EntityBounds, axis: Axis) => {
	const { left, top } = bounds
	const width = bounds.right - bounds.left
	const height = bounds.bottom - bounds.top
	const x = axis === AXIS.X ? left : left + width / 2
	const y = axis === AXIS.Y ? top : top + height / 2
	const w = axis === AXIS.X ? width : 0
	const h = axis === AXIS.Y ? height : 0
	return {
		x,
		y,
		w,
		h,
	}
}

/*
 export const getCtxRectFn = (bounds: EntityBounds, fillStyle: string) => {
 return (ctx: CanvasRenderingContext2D) => {
 ctx.save()
 ctx.beginPath()
 ctx.globalAlpha = 0.4
 ctx.fillStyle = fillStyle
 ctx.rect(bounds.left, bounds.top, bounds.width, bounds.height)
 ctx.fill()
 ctx.stroke()
 ctx.restore()
 }
 }*/
