import { AppSnapshot, AppStoreService } from '../app'
import { EntityStoreService } from '../entities'
import { GraphicsStateSnapshot } from '../graphics'
import { GraphicsSettings } from '../graphics/graphics.settings'
import { RenderService } from '../render'
import { getDefaultDrawPreviewCtxFn } from './ctx-fns'
import { getNearbyLineDrawCtxFnFromGraphicsSnapshot } from './utils'
import { inject, Injectable } from '@angular/core'
import {
	Axis,
	CANVAS_COLORS,
	CompleteEntityBounds,
	ENTITY_TYPE,
	EntityBounds,
	NearbyEntity,
	SizeByType,
	TransformedPoint,
} from '@design-app/shared'
import {
	findNearbyBoundOverlapOnBothAxis,
	getBoundsFromArrPoints,
	getCompleteBoundsFromCenterTransformedPoint,
	getCtxRectBoundsByAxisV2,
	getEntityAxisGridLinesByAxisV2,
	isEntityOverlappingWithBounds,
} from '@design-app/utils'
import { groupInto2dArray } from '@shared/utils'
import { sortBy } from 'lodash'


@Injectable({
	providedIn: 'root',
})
export class NearbyService {
	private _render = inject(RenderService)
	// private _render = inject(CanvasRenderService)
	private _entities = inject(EntityStoreService)
	private _app = inject(AppStoreService)

	// nearbyDrawMode: NearbyDrawMode = NEARBY_DRAW_MODE.CENTER_LINE_SCREEN_SIZE
	// nearbyDrawMode: NearbyDrawMode = NEARBY_DRAW_MODE.CENTER_LINE_BETWEEN_TWO_ENTITIES
	holdAltToSnapToGrid = GraphicsSettings.HoldAltToSnapToGrid

	nearbyIds: string[] = []
	nearbyEntities: NearbyEntity[] = []
	currentAxis: Axis | undefined
	xAxisLineBounds: EntityBounds | undefined
	yAxisLineBounds: EntityBounds | undefined
	axisPreviewRect: CompleteEntityBounds | undefined

	getDrawEntityPreview(
		event: PointerEvent,
		currentPoint: TransformedPoint,
		appSnapshot: AppSnapshot,
		graphicsSnapshot: GraphicsStateSnapshot,
	) {
		const size = SizeByType[ENTITY_TYPE.Panel]
		const mouseBoxBounds = getCompleteBoundsFromCenterTransformedPoint(currentPoint, size)
		const entities = this._entities.panels.getEntities()
		const nearbyEntitiesOnAxis = findNearbyBoundOverlapOnBothAxis(mouseBoxBounds, entities)

		if (!nearbyEntitiesOnAxis.length) {
			// console.log('no nearbyEntities')
			const drawPreviewFn = getDefaultDrawPreviewCtxFn(mouseBoxBounds)

			this.clearNearbyState()

			this._render.renderCanvasApp({
				drawFns: [drawPreviewFn],
			})
			// this._render.drawCanvasWithFunction(drawPreviewFn)
			return
		}
		this.nearbyIds = nearbyEntitiesOnAxis.map((entity) => entity.id)
		this.nearbyEntities = nearbyEntitiesOnAxis

		const anyNearClick = !!entities.find((entity) =>
			isEntityOverlappingWithBounds(entity, mouseBoxBounds),
		)

		// const nearbyLinesEnabled = isNearbyLinesEnabled(NearbyLinesState)
		// const nearbyAxisLinesEnabled = this._state.menu.nearbyAxisLines
		if (graphicsSnapshot.matches('NearbyLinesState.NearbyLinesDisabled')) {
			// if (!nearbyLinesEnabled) {
			console.log('no nearbyAxisLinesEnabled')
			const drawPreviewFn = getDefaultDrawPreviewCtxFn(mouseBoxBounds)
			this._render.renderCanvasApp({
				drawFns: [drawPreviewFn],
			})
			// this._render.drawCanvasWithFunction(drawPreviewFn)
			return
		}
		// assertIsObject(NearbyLinesState)
		/*	if (typeof NearbyLinesState === 'string') {
		 throw new Error('NearbyLinesState is a string')
		 }*/
		// assertNotNull()
		// NearbyLinesStat
		// e.
		// const nearbyEnabledMode

		const nearbySortedByDistance = sortBy(nearbyEntitiesOnAxis, (entity) =>
			Math.abs(entity.distance),
		)
		const nearby2dArray = groupInto2dArray(nearbySortedByDistance, 'axis')

		const closestNearby2dArray = nearby2dArray.map((arr) => arr[0])
		const closestEnt = closestNearby2dArray[0]

		const gridLines = getEntityAxisGridLinesByAxisV2(closestEnt.bounds, closestEnt.axis)
		const gridLineBounds = getBoundsFromArrPoints(gridLines)

		const axisPreviewRect = getCtxRectBoundsByAxisV2(
			closestEnt.bounds,
			closestEnt.axis,
			mouseBoxBounds,
		)
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

		const altKey = event.altKey

		if (altKey && appSnapshot.matches('GridState.PreviewAxisState.None')) {
			this._app.sendEvent({ type: 'StartAxisCreatePreview' })
		} else if (
			!altKey &&
			appSnapshot.matches('GridState.PreviewAxisState.AxisCreatePreviewInProgress')
		) {
			this._app.sendEvent({ type: 'StopAxisPreview' })
		}

		const drawGridLinesWithEntityPreview = getNearbyLineDrawCtxFnFromGraphicsSnapshot(
			graphicsSnapshot,
			axisPreviewRect,
			mouseBoxBounds,
			closestEnt,
			fillStyle,
			altKey,
			this.holdAltToSnapToGrid,
			false,
		)

		this._render.renderCanvasApp({
			drawFns: [drawGridLinesWithEntityPreview],
		})
		// this._render.drawCanvasWithFunction(drawGridLinesWithEntityPreview)

		return
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