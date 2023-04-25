import { CANVAS_COLORS, CanvasColor } from '../../../types'
import { CompleteEntityBounds, getEntityAxisGridLinesByAxisV2 } from '../../../utils'
import { NearbyEntityDeprecated } from '../../canvas-client-state'
import { NearbyEntity } from '../nearby-entity'
// import { fn } from '@angular/compiler'
import { nonNullish } from '@shared/utils'


export const getEntityGridLineWithEntityPreviewFn = (
	event: PointerEvent,
	axisPreviewRect: CompleteEntityBounds,
	completeBounds: CompleteEntityBounds,
	closestEntity: NearbyEntity,
	fillStyle: CanvasColor,
) => {
	return (ctx: CanvasRenderingContext2D) => {
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
			ctx.rect(completeBounds.left, completeBounds.top, completeBounds.width, completeBounds.height)
		}
		ctx.fill()
		ctx.stroke()
		ctx.restore()
		ctx.save()
		drawEntityGridLines(closestEntity).call(this, ctx)
		ctx.restore()
	}
}
export const drawEntityGridLines = (nearbyEntity: NearbyEntity) => {
	const gridLines = getEntityAxisGridLinesByAxisV2(nearbyEntity.bounds, nearbyEntity.axis)
	console.log('gridLines', gridLines)
	return (ctx: CanvasRenderingContext2D) => {
		ctx.save()
		ctx.beginPath()
		ctx.globalAlpha = 0.4
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

export const drawManyEntityGridLines = (nearbyEntities: NearbyEntityDeprecated[]) => {
	return nearbyEntities.map((ent) => drawEntityGridLines(ent))
}

export const drawAxisGridLines = (nearbyEntitiesOnAxis: NearbyEntityDeprecated[][]) => {
	return nearbyEntitiesOnAxis
		.map((axisEntities) => {
			if (!axisEntities || !axisEntities.length) return
			const closestEnt = axisEntities[0]
			if (!closestEnt) return
			const gridLines = getEntityAxisGridLinesByAxisV2(closestEnt.bounds, closestEnt.axis)
			return (ctx: CanvasRenderingContext2D) => {
				ctx.save()
				ctx.beginPath()
				ctx.globalAlpha = 0.4
				ctx.strokeStyle = CANVAS_COLORS.NearbyPanelStrokeStyle
				ctx.fillStyle = CANVAS_COLORS.NearbyPanelFillStyle
				ctx.moveTo(gridLines[0][0], gridLines[0][1])
				ctx.lineTo(gridLines[0][2], gridLines[0][3])
				ctx.moveTo(gridLines[1][0], gridLines[1][1])
				ctx.lineTo(gridLines[1][2], gridLines[1][3])
				ctx.stroke()
				ctx.restore()
			}
		})
		.filter(nonNullish)
	/*  return (ctx: CanvasRenderingContext2D) => {
	 ctxFns.forEach((fn) => fn(ctx))
	 }*/
	/*  return {
	 ctxFn,
	 changes: [],
	 }*/
}