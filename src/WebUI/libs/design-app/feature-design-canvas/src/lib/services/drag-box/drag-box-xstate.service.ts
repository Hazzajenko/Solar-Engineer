import { AXIS, CANVAS_COLORS, createPanel, SizeByType, TransformedPoint } from '../../types'
import {
	changeCanvasCursor,
	dragBoxKeysDown,
	getAllAvailableEntitySpotsBetweenTwoPoints,
	getAllEntitiesBetweenTwoPoints,
	getCompleteBoundsFromMultipleEntitiesWithPadding,
} from '../../utils'
import {
	AppStateSnapshot,
	CANVAS_MODE,
	CanvasClientStateService,
	CreationBoxStarted,
	CURRENT_DRAG_BOX,
	MachineService,
	SelectionBoxCompleted,
	SelectionBoxStarted,
	StopDragBox,
} from '../canvas-client-state'
import { CanvasElementService } from '../canvas-element.service'
import { CanvasRenderService } from '../canvas-render'
import { DomPointService } from '../dom-point.service'
import { getStartAndEndForAxisLineDragBox } from './utils'
import { inject, Injectable } from '@angular/core'
import { ENTITY_TYPE } from '@design-app/shared'
import { CURSOR_TYPE } from '@shared/data-access/models'
import { assertNotNull } from '@shared/utils'


@Injectable({
	providedIn: 'root',
})
export class DragBoxXstateService {
	private _canvasElementService = inject(CanvasElementService)
	private _domPointService = inject(DomPointService)
	private _state = inject(CanvasClientStateService)
	private _render = inject(CanvasRenderService)
	private _machine = inject(MachineService)

	dragBoxStart: TransformedPoint | undefined

	get ctx() {
		return this._canvasElementService.ctx
	}

	get canvas() {
		return this._canvasElementService.canvas
	}

	get scale() {
		return this.ctx.getTransform().a
	}

	handleDragBoxMouseDown(
		event: PointerEvent,
		currentPoint: TransformedPoint,
		appStateSnapshot: AppStateSnapshot,
	) {
		// const clickMode = this._machine.state[GRID_STATE_KEY]

		switch (true) {
			case appStateSnapshot.matches('GridState.ModeState.SelectMode'):
				this._machine.sendEvent(new SelectionBoxStarted({ point: currentPoint }))
				break
			case appStateSnapshot.matches('GridState.ModeState.CreateMode'):
				this._machine.sendEvent(new CreationBoxStarted())
				break
		}
		/*		if (appStateSnapshot.matches('GridState.ModeState.CreateMode')) {
		 this._machine.sendEvent(new CreationBoxStarted())
		 }

		 if (appStateSnapshot.matches('GridState.ModeState.SelectMode')) {
		 this._machine.sendEvent(new SelectionBoxStarted({ point: currentPoint }))
		 }*/
		/*		switch (GridState.ModeState) {
		 case MODE_STATE.IN_SELECT_MODE:
		 this._machine.sendEvent(new SelectionBoxStarted({ point: currentPoint }))
		 break
		 case MODE_STATE.IN_CREATE_MODE:
		 this._machine.sendEvent(new CreationBoxStarted())
		 break
		 default:
		 throw new Error(`GridState ${GridState} not handled`)
		 }*/
		this.dragBoxStart = currentPoint
		/*

		 if (GridState === GRID_STATE.IN_SELECT_MODE) {
		 this._machine.sendEvent(new SelectionBoxStarted({ point: currentPoint }))
		 }
		 if (GridState === 'CreateMode') {
		 this._machine.sendEvent(new CreationBoxStarted())
		 }
		 const currentDragBox = this._machine.ctx.dragBox.currentDragBox
		 if (currentDragBox === CURRENT_DRAG_BOX.SELECTION) {
		 this._machine.sendEvent(new SelectionBoxStarted({ point: this._domPointService.getTransformedPointFromEvent(event) }))
		 }
		 this.dragBoxStart = this._domPointService.getTransformedPointFromEvent(event)*/
	}

	selectionBoxMouseUp(event: PointerEvent, currentPoint: TransformedPoint) {
		const start = this.dragBoxStart
		assertNotNull(start)
		// const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
		const panelsInArea = getAllEntitiesBetweenTwoPoints(
			start,
			currentPoint,
			this._state.entities.canvasEntities.getEntities(),
		)
		if (panelsInArea) {
			const entitiesInAreaIds = panelsInArea.map((panel) => panel.id)
			/*			const panelPoints = panelsInArea.map((panel) => ({
			 x: panel.location.x,
			 y: panel.location.y,
			 }))*/
			const boundsFromPoints = getCompleteBoundsFromMultipleEntitiesWithPadding(panelsInArea, 10)
			// const boundsFromPoints = getCompleteBoundsFromMultipleEntities(panelsInArea)
			// const boundsFromPoints = getCompleteBoundsFromBoundsArray(panelPoints)
			// const boundsFromPoints = getCompleteBoundsFromPoints(panelPoints)
			this._machine.sendEvent(
				new SelectionBoxCompleted({ ids: entitiesInAreaIds, selectionBoxBounds: boundsFromPoints }),
			)

			/*			this._render.drawCanvasWithFunctionInAnimationFrame((ctx) => {
			 // this._render.drawCanvasWithFunctionInAForLoop((ctx) => {
			 // this._render.drawCanvasWithFunction((ctx) => {
			 ctx.beginPath()
			 ctx.rect(
			 boundsFromPoints.left,
			 boundsFromPoints.top,
			 boundsFromPoints.width,
			 boundsFromPoints.height,
			 )
			 ctx.strokeStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
			 ctx.lineWidth = 1
			 ctx.stroke()
			 })*/
			console.log('boundsFromPoints', boundsFromPoints)
		} else {
			this._machine.sendEvent(new StopDragBox())
		}
		this.dragBoxStart = undefined
	}

	creationBoxMouseUp(event: PointerEvent, currentPoint: TransformedPoint) {
		// const { dragBoxStart } = this._state.dragBox
		// assertNotNull(dragBoxStart)
		const dragBoxStart = this.dragBoxStart
		assertNotNull(dragBoxStart)
		// const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
		const spots = getAllAvailableEntitySpotsBetweenTwoPoints(
			dragBoxStart,
			currentPoint,
			this._state.entities.canvasEntities.getEntities(),
		)
		// const spots = this._objectPositioning.getAllAvailableEntitySpotsBetweenTwoPoints(dragBoxStart, currentPoint)
		if (!spots || !spots.length) return
		const takenSpots = spots.filter((spot) => !spot.vacant)
		if (takenSpots.length) {
			console.log('taken spots', takenSpots)
			return
		}
		const newPanels = spots.map((spot) => createPanel({ x: spot.x, y: spot.y }))
		/*		this._state.updateState({
		 dragBox: {
		 dragBoxStart: undefined,
		 },
		 })*/
		this._state.entities.canvasEntities.addManyEntities(newPanels)
		this._machine.sendEvent(new StopDragBox())
	}

	selectionBoxMouseMove(event: PointerEvent, currentPoint: TransformedPoint) {
		if (!dragBoxKeysDown(event)) {
			this._machine.sendEvent(new StopDragBox())
			changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
			this._render.drawCanvas()
			return
		}
		const dragBoxStart = this.dragBoxStart
		assertNotNull(dragBoxStart)

		const drawDragBox = (ctx: CanvasRenderingContext2D) => {
			const width = currentPoint.x - dragBoxStart.x
			const height = currentPoint.y - dragBoxStart.y
			ctx.save()
			ctx.beginPath()
			ctx.globalAlpha = 0.4
			ctx.strokeStyle = CANVAS_COLORS.SelectionBoxFillStyle
			ctx.lineWidth = 1
			ctx.rect(dragBoxStart.x, dragBoxStart.y, width, height)
			ctx.fill()
			ctx.stroke()
			ctx.closePath()
			ctx.restore()
		}

		this._render.drawCanvasWithFunction(drawDragBox)
	}

	creationBoxMouseMove(event: PointerEvent, currentPoint: TransformedPoint) {
		if (!dragBoxKeysDown(event)) {
			this._machine.sendEvent(new StopDragBox())
			changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
			this._render.drawCanvas()
			return
		}
		const dragBoxStart = this.dragBoxStart
		assertNotNull(dragBoxStart)

		const drawCreationBox = (ctx: CanvasRenderingContext2D) => {
			const width = currentPoint.x - dragBoxStart.x
			const height = currentPoint.y - dragBoxStart.y
			ctx.save()
			ctx.beginPath()
			ctx.globalAlpha = 0.4
			ctx.strokeStyle = CANVAS_COLORS.CreationBoxFillStyle
			ctx.lineWidth = 1
			ctx.rect(dragBoxStart.x, dragBoxStart.y, width, height)
			ctx.fill()
			ctx.stroke()
			ctx.closePath()
			ctx.restore()

			const spots = getAllAvailableEntitySpotsBetweenTwoPoints(
				dragBoxStart,
				currentPoint,
				this._state.entities.canvasEntities.getEntities(),
			)
			if (!spots) return

			const { type } = this._state.mode
			const entitySize = SizeByType[type]

			ctx.save()
			spots.forEach((spot) => {
				ctx.save()
				ctx.beginPath()
				ctx.globalAlpha = 0.4
				ctx.fillStyle = spot.vacant
					? CANVAS_COLORS.PreviewPanelFillStyle
					: CANVAS_COLORS.TakenSpotFillStyle
				ctx.rect(spot.x, spot.y, entitySize.width, entitySize.height)
				ctx.fill()
				ctx.stroke()
				ctx.restore()
			})
			ctx.restore()
		}

		this._render.drawCanvasWithFunction(drawCreationBox)
	}

	dragBoxMouseMove(event: PointerEvent, currentPoint: TransformedPoint) {
		if (!dragBoxKeysDown(event)) {
			this._machine.sendEvent(new StopDragBox())
			changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
			this._render.drawCanvas()
			return
		}

		const dragBoxStart = this.dragBoxStart
		if (!dragBoxStart) {
			return
		}

		const drawDragBox = (ctx: CanvasRenderingContext2D) => {
			const currentDragBox = this._machine.ctx.dragBox.currentDragBox

			// const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
			const width = currentPoint.x - dragBoxStart.x
			const height = currentPoint.y - dragBoxStart.y
			ctx.save()
			ctx.beginPath()
			ctx.globalAlpha = 0.4
			ctx.strokeStyle =
				currentDragBox === CURRENT_DRAG_BOX.SELECTION
					? CANVAS_COLORS.SelectionBoxFillStyle
					: CANVAS_COLORS.CreationBoxFillStyle
			ctx.lineWidth = 1
			ctx.rect(dragBoxStart.x, dragBoxStart.y, width, height)
			ctx.fill()
			ctx.stroke()
			ctx.closePath()
			ctx.restore()

			if (currentDragBox !== CURRENT_DRAG_BOX.CREATION) return
			const spots = getAllAvailableEntitySpotsBetweenTwoPoints(
				dragBoxStart,
				currentPoint,
				this._state.entities.canvasEntities.getEntities(),
			)
			if (!spots) return

			const { type } = this._state.mode
			const entitySize = SizeByType[type]

			ctx.save()
			spots.forEach((spot) => {
				ctx.save()
				ctx.beginPath()
				ctx.globalAlpha = 0.4
				ctx.fillStyle = spot.vacant
					? CANVAS_COLORS.PreviewPanelFillStyle
					: CANVAS_COLORS.TakenSpotFillStyle
				ctx.rect(spot.x, spot.y, entitySize.width, entitySize.height)
				ctx.fill()
				ctx.stroke()
				ctx.restore()
			})
			ctx.restore()
		}

		this._render.drawCanvasWithFunction(drawDragBox)
	}

	dragBoxMouseUp(event: PointerEvent, currentPoint: TransformedPoint) {
		const { mode } = this._state.mode
		switch (mode) {
			case CANVAS_MODE.CREATE:
				this.creationBoxMouseUp(event, currentPoint)
				break
			case CANVAS_MODE.SELECT:
				this.selectionBoxMouseUp(event, currentPoint)
				break
		}

		/*		this._state.updateState({
		 dragBox: {
		 dragBoxStart: undefined,
		 },
		 })*/
		this.dragBoxStart = undefined
		this._render.drawCanvas()
	}

	dragAxisLineMouseMove(
		event: PointerEvent,
		currentPoint: TransformedPoint,
		dragBoxAxisLineStart: TransformedPoint,
	) {
		if (!dragBoxKeysDown(event)) {
			console.log('drag box mouse move ALT KEY LIFTED')
			this._state.updateState({
				grid: {
					currentAxis: undefined,
				},
				dragBox: {
					axisLineStart: undefined,
				},
			})
			changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
			this._render.drawCanvas()
			return
		}
		const currentAxis = this._state.grid.currentAxis
		if (!currentAxis) {
			throw new Error('dragAxisLineMouseMove: currentAxis is undefined')
		}

		const axisLineBounds =
			currentAxis === AXIS.X ? this._state.grid.xAxisLineBounds : this._state.grid.yAxisLineBounds
		if (!axisLineBounds) {
			throw new Error('dragAxisLineMouseMove: axisLineBounds is undefined')
		}
		const entitySize = SizeByType[ENTITY_TYPE.Panel]
		const [startX, startY, endX, endY] = getStartAndEndForAxisLineDragBox(
			dragBoxAxisLineStart,
			currentPoint,
			currentAxis,
			axisLineBounds,
		)

		const start = { x: startX, y: startY } as TransformedPoint
		const end = { x: endX, y: endY } as TransformedPoint
		const spots = getAllAvailableEntitySpotsBetweenTwoPoints(
			start,
			end,
			this._state.entities.canvasEntities.getEntities(),
		)
		console.log('spots', spots)
		if (!spots || !spots.length) {
			console.log('start', start)
			console.log('end', end)
			return
		}

		const axisLineDragBoxCtxFn = (ctx: CanvasRenderingContext2D) => {
			ctx.save()
			spots.forEach((spot) => {
				ctx.save()
				ctx.beginPath()
				ctx.globalAlpha = 0.6
				ctx.fillStyle = spot.vacant
					? CANVAS_COLORS.PreviewPanelFillStyle
					: CANVAS_COLORS.TakenSpotFillStyle
				ctx.rect(spot.x, spot.y, entitySize.width, entitySize.height)
				ctx.fill()
				ctx.stroke()
				ctx.restore()
			})
			ctx.restore()
		}

		this._render.drawCanvasWithFunction(axisLineDragBoxCtxFn)
	}
}