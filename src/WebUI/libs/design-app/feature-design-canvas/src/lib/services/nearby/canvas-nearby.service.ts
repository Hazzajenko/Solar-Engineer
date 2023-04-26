import {
	GraphicsSettings,
	GraphicsStateSnapshot,
	isNearbyLinesEnabled,
	NearbyGraphicsState,
} from '../../components'
import { Axis, CANVAS_COLORS, SizeByType, TransformedPoint } from '../../types'
import {
	CompleteEntityBounds,
	EntityBounds,
	getBoundsFromArrPoints,
	getCompleteBoundsFromCenterTransformedPoint,
	getEntityAxisGridLinesByAxisV2,
	isEntityOverlappingWithBounds,
} from '../../utils'
import { getNearbyLineDrawCtxFnFromGraphicsSnapshot } from '../../utils-ctx'
import { AppStateSnapshot, CanvasClientStateService, MachineService } from '../canvas-client-state'
import { CanvasRenderService, getCtxRectBoundsByAxisV2 } from '../canvas-render'
import { findNearbyBoundOverlapOnBothAxis } from '../object-positioning'
import { getDefaultDrawPreviewCtxFn } from './ctx-fns'
import { NEARBY_DRAW_MODE, NearbyDrawMode } from './nearby-draw-mode'
import { NearbyEntity } from './nearby-entity'
import { inject, Injectable } from '@angular/core'
import { ENTITY_TYPE } from '@design-app/shared'
import { groupInto2dArray } from '@shared/utils'
import { sortBy } from 'lodash'


@Injectable({
	providedIn: 'root',
})
export class CanvasNearbyService {
	private _render = inject(CanvasRenderService)
	private _state = inject(CanvasClientStateService)
	private _machine = inject(MachineService)

	// nearbyDrawMode: NearbyDrawMode = NEARBY_DRAW_MODE.CENTER_LINE_SCREEN_SIZE
	nearbyDrawMode: NearbyDrawMode = NEARBY_DRAW_MODE.CENTER_LINE_BETWEEN_TWO_ENTITIES
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
		NearbyLinesState: NearbyGraphicsState,
		appSnapshot: AppStateSnapshot,
		graphicsSnapshot: GraphicsStateSnapshot,
	) {
		const size = SizeByType[ENTITY_TYPE.Panel]
		const mouseBoxBounds = getCompleteBoundsFromCenterTransformedPoint(currentPoint, size)
		const entities = this._state.entities.canvasEntities.getEntities()
		const nearbyEntitiesOnAxis = findNearbyBoundOverlapOnBothAxis(mouseBoxBounds, entities)

		if (!nearbyEntitiesOnAxis.length) {
			// console.log('no nearbyEntities')
			const drawPreviewFn = getDefaultDrawPreviewCtxFn(mouseBoxBounds)

			this.clearNearbyState()

			this._render.drawCanvasWithFunction(drawPreviewFn)
			return
		}
		this.nearbyIds = nearbyEntitiesOnAxis.map((entity) => entity.id)
		this.nearbyEntities = nearbyEntitiesOnAxis

		const anyNearClick = !!entities.find((entity) =>
			isEntityOverlappingWithBounds(entity, mouseBoxBounds),
		)

		const nearbyLinesEnabled = isNearbyLinesEnabled(NearbyLinesState)
		// const nearbyAxisLinesEnabled = this._state.menu.nearbyAxisLines
		if (!nearbyLinesEnabled) {
			console.log('no nearbyAxisLinesEnabled')
			const drawPreviewFn = getDefaultDrawPreviewCtxFn(mouseBoxBounds)
			this._render.drawCanvasWithFunction(drawPreviewFn)
			return
		}
		// assertIsObject(NearbyLinesState)
		if (typeof NearbyLinesState === 'string') {
			throw new Error('NearbyLinesState is a string')
		}
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

		if (altKey && appSnapshot.matches('GridState.PreviewAxisState.PreviewAxisDrawDisabled')) {
			this._machine.sendEvent({ type: 'TogglePreviewAxisDraw' })
		} else if (
			!altKey &&
			appSnapshot.matches('GridState.PreviewAxisState.PreviewAxisDrawEnabled')
		) {
			this._machine.sendEvent({ type: 'TogglePreviewAxisDraw' })
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

		this._render.drawCanvasWithFunction(drawGridLinesWithEntityPreview)

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