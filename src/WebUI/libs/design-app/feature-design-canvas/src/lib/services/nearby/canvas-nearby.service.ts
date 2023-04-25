import { inject, Injectable } from '@angular/core'
import { CompleteEntityBounds, EntityBounds, getBoundsFromArrPoints, getCompleteBoundsFromCenterTransformedPoint, getEntityAxisGridLinesByAxisV2, isEntityOverlappingWithBounds } from '../../utils'
import { findNearbyBoundOverlapOnBothAxis } from '../object-positioning/utils'
import { Axis, CANVAS_COLORS, SizeByType, TransformedPoint } from '../../types'
import { CanvasClientStateService } from '../canvas-client-state'
import { groupInto2dArray } from '@shared/utils'
import { sortBy } from 'lodash'
import { CanvasRenderService, getCtxRectBoundsByAxisV2 } from '../canvas-render'
import { ENTITY_TYPE } from '@design-app/shared'
import { NearbyEntity } from './nearby-entity'
import { getDrawPreviewCtxFn, getEntityGridLineWithEntityPreviewFn } from './ctx-fns'

@Injectable({
	providedIn: 'root',
})
export class CanvasNearbyService {
	private _render = inject(CanvasRenderService)
	private _state = inject(CanvasClientStateService)

	nearbyIds: string[] = []
	nearbyEntities: NearbyEntity[] = []
	currentAxis: Axis | undefined
	xAxisLineBounds: EntityBounds | undefined
	yAxisLineBounds: EntityBounds | undefined
	axisPreviewRect: CompleteEntityBounds | undefined

	getDrawEntityPreview(event: PointerEvent, currentPoint: TransformedPoint) {
		const size = SizeByType[ENTITY_TYPE.Panel]
		const mouseBoxBounds = getCompleteBoundsFromCenterTransformedPoint(currentPoint, size)
		const entities = this._state.entities.canvasEntities.getEntities()
		const nearbyEntitiesOnAxis = findNearbyBoundOverlapOnBothAxis(mouseBoxBounds, entities)

		if (!nearbyEntitiesOnAxis.length) {
			console.log('no nearbyEntities')
			const drawPreviewFn = getDrawPreviewCtxFn(mouseBoxBounds)

			this.clearNearbyState()

			this._render.drawCanvasWithFunction(drawPreviewFn)
			return
		}
		this.nearbyIds = nearbyEntitiesOnAxis.map((entity) => entity.id)
		this.nearbyEntities = nearbyEntitiesOnAxis

		const anyNearClick = !!entities.find((entity) => isEntityOverlappingWithBounds(entity, mouseBoxBounds))

		const nearbyAxisLinesEnabled = this._state.menu.nearbyAxisLines
		if (!nearbyAxisLinesEnabled) {
			console.log('no nearbyAxisLinesEnabled')
			const drawPreviewFn = getDrawPreviewCtxFn(mouseBoxBounds)
			this._render.drawCanvasWithFunction(drawPreviewFn)
			return
		}

		const nearbySortedByDistance = sortBy(nearbyEntitiesOnAxis, (entity) => Math.abs(entity.distance))
		const nearby2dArray = groupInto2dArray(nearbySortedByDistance, 'axis')

		const closestNearby2dArray = nearby2dArray.map((arr) => arr[0])
		const closestEnt = closestNearby2dArray[0]

		const gridLines = getEntityAxisGridLinesByAxisV2(closestEnt.bounds, closestEnt.axis)
		const gridLineBounds = getBoundsFromArrPoints(gridLines)

		const axisPreviewRect = getCtxRectBoundsByAxisV2(closestEnt.bounds, closestEnt.axis, mouseBoxBounds)
		this.currentAxis = closestEnt.axis
		this.axisPreviewRect = axisPreviewRect
		switch (closestEnt.axis) {
			case 'x':
				this.xAxisLineBounds = gridLineBounds
				break
			case 'y':
				this.yAxisLineBounds = gridLineBounds
				break
			default:
				throw new Error(`${closestEnt.axis} is not an axis`)
		}

		const fillStyle = anyNearClick
			? CANVAS_COLORS.TakenSpotFillStyle
			: CANVAS_COLORS.PreviewPanelFillStyle

		const drawGridLinesWithEntityPreview = getEntityGridLineWithEntityPreviewFn(event, axisPreviewRect, mouseBoxBounds, closestEnt, fillStyle)
		this._render.drawCanvasWithFunction(drawGridLinesWithEntityPreview)
	}

	clearNearbyState() {
		this.nearbyIds = []
		this.nearbyEntities = []
		this.currentAxis = undefined
		this.axisPreviewRect = undefined
		this.xAxisLineBounds = undefined
		this.yAxisLineBounds = undefined
	}
}