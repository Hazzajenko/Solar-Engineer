import { AppStateStoreService } from '@canvas/app/data-access'
import { GraphicsStoreService } from '@canvas/graphics/data-access'
import { RenderService } from '@canvas/rendering/data-access'
import {
	getClosedEntityOnAxis,
	getNearbyLineDrawCtxFnFromNearbyLinesState,
	getSnapToGridBoolean,
} from './utils'
import { inject, Injectable } from '@angular/core'
import { injectEntityStore } from '@entities/data-access'
import {
	Axis,
	CompleteEntityBounds,
	EntityBounds,
	NearbyEntity,
	TransformedPoint,
} from '@shared/data-access/models'
import {
	findNearbyBoundOverlapOnBothAxis,
	getBoundsFromArrPoints,
	getCompleteBoundsFromCenterTransformedPoint,
	getCtxRectBoundsByAxisV2,
	getEntityAxisGridLinesByAxisV2,
	isEntityOverlappingWithBounds,
} from '@canvas/utils'
import { CANVAS_COLORS, ENTITY_TYPE, SizeByType } from '@entities/shared'

@Injectable({
	providedIn: 'root',
})
export class NearbyService {
	private _render = inject(RenderService)
	// private _render = inject(CanvasRenderService)
	private _entities = injectEntityStore()
	// private _entities = injectEntityStore()
	// private _app = inject(AppStoreService)
	// private _appStore = inject(AppNgrxStateStore)
	private _graphicsStore = inject(GraphicsStoreService)
	private _appStore = inject(AppStateStoreService)

	// nearbyDrawMode: NearbyDrawMode = NEARBY_DRAW_MODE.CENTER_LINE_SCREEN_SIZE
	// nearbyDrawMode: NearbyDrawMode = NEARBY_DRAW_MODE.CENTER_LINE_BETWEEN_TWO_ENTITIES
	holdAltToSnapToGrid = true
	// holdAltToSnapToGrid = GraphicsSettings.HoldAltToSnapToGrid

	nearbyIds: string[] = []
	nearbyEntities: NearbyEntity[] = []
	currentAxis: Axis | undefined
	xAxisLineBounds: EntityBounds | undefined
	yAxisLineBounds: EntityBounds | undefined
	axisPreviewRect: CompleteEntityBounds | undefined

	getDrawEntityPreviewV2Ngrx(event: PointerEvent, currentPoint: TransformedPoint) {
		const size = SizeByType[ENTITY_TYPE.PANEL]
		const mouseBounds = getCompleteBoundsFromCenterTransformedPoint(currentPoint, size)
		const entities = this._entities.panels.allPanels
		const nearbyEntitiesOnAxis = findNearbyBoundOverlapOnBothAxis(mouseBounds, entities)

		if (!nearbyEntitiesOnAxis.length) {
			this.clearNearbyState()

			this._render.renderCanvasApp({
				creationPreviewBounds: mouseBounds,
			})
			return
		}
		this.nearbyIds = nearbyEntitiesOnAxis.map((entity) => entity.id)
		this.nearbyEntities = nearbyEntitiesOnAxis

		const anyNearClick = !!entities.find((entity) =>
			isEntityOverlappingWithBounds(entity, mouseBounds),
		)

		const nearbyLinesState = this._graphicsStore.state.nearbyLinesState
		const nearbyLinesDisabled = nearbyLinesState === 'NearbyLinesDisabled'
		if (nearbyLinesDisabled) {
			this.clearNearbyState()
			this._render.renderCanvasApp({
				creationPreviewBounds: mouseBounds,
			})
			return
		}

		const closestEntity = getClosedEntityOnAxis(nearbyEntitiesOnAxis)

		const gridLines = getEntityAxisGridLinesByAxisV2(closestEntity.bounds, closestEntity.axis)
		const gridLineBounds = getBoundsFromArrPoints(gridLines)

		const axisPreviewRect = getCtxRectBoundsByAxisV2(
			closestEntity.bounds,
			closestEntity.axis,
			mouseBounds,
		)
		this.currentAxis = closestEntity.axis
		this.axisPreviewRect = axisPreviewRect
		switch (closestEntity.axis) {
			case 'x':
				this.xAxisLineBounds = gridLineBounds
				break
			case 'y':
				this.yAxisLineBounds = gridLineBounds
				break
			default:
				throw new Error(`${closestEntity.axis} is not an axis`)
		}

		const fillStyle = anyNearClick
			? CANVAS_COLORS.TakenSpotFillStyle
			: CANVAS_COLORS.PreviewPanelFillStyle

		const altKey = event.altKey
		const previewAxisState = this._appStore.state.previewAxis

		if (altKey && previewAxisState === 'None') {
			this._appStore.dispatch.setPreviewAxisState('AxisCreatePreviewInProgress')
		} else if (!altKey && previewAxisState === 'AxisCreatePreviewInProgress') {
			this._appStore.dispatch.setPreviewAxisState('None')
		}
		/*		if (altKey && this._appStore.matches.previewAxis('None')) {
		 this._app.sendEvent({ type: 'StartAxisCreatePreview' })
		 this._appStore.dispatch.setPreviewAxisState('AxisCreatePreviewInProgress')
		 } else if (!altKey && this._appStore.matches.previewAxis('AxisCreatePreviewInProgress')) {
		 this._app.sendEvent({ type: 'StopAxisPreview' })
		 this._appStore.dispatch.setPreviewAxisState('None')
		 }*/
		/*
		 if (altKey && appSnapshot.matches('GridState.PreviewAxisState.None')) {
		 this._app.sendEvent({ type: 'StartAxisCreatePreview' })
		 } else if (
		 !altKey &&
		 appSnapshot.matches('GridState.PreviewAxisState.AxisCreatePreviewInProgress')
		 ) {
		 this._app.sendEvent({ type: 'StopAxisPreview' })
		 }*/

		const drawGridLinesWithEntityPreview = getNearbyLineDrawCtxFnFromNearbyLinesState(
			this._graphicsStore.state.nearbyLinesState,
			axisPreviewRect,
			mouseBounds,
			closestEntity,
			fillStyle,
			altKey,
			this.holdAltToSnapToGrid,
			false,
		)

		const holdAltToSnapToGrid = true

		const snapToGridBool = getSnapToGridBoolean(
			altKey,
			mouseBounds,
			closestEntity.axis,
			axisPreviewRect,
			holdAltToSnapToGrid,
		)

		this._render.renderCanvasApp({
			nearby: {
				axisPreviewRect,
				mouseBounds,
				closestEntity,
				snapToGridBool,
			}, // drawFns: [drawGridLinesWithEntityPreview],
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
