import { CANVAS_COLORS, CanvasEntity, isPanel, PANEL_STROKE_STYLE, SizeByType } from '../../types'
import {
	getAllAvailableEntitySpotsBetweenTwoPoints,
	getCompleteBoundsFromMultipleEntitiesWithPadding,
} from '../../utils'
import { CanvasAppStateStore } from '../canvas-app-state'
import {
	AdjustedMultipleToMove,
	AdjustedSingleToMove,
	CANVAS_MODE,
	CanvasClientStateService,
	MachineService,
} from '../canvas-client-state'
import { CanvasElementService } from '../canvas-element.service'
import { DIV_ELEMENT, DivElementsService } from '../div-elements'
import { DomPointService } from '../dom-point.service'
import { CtxTask } from './types'
import { inject, Injectable } from '@angular/core'
import { assertNotNull, shadeColor } from '@shared/utils'


@Injectable({
	providedIn: 'root',
})
export class CanvasRenderService {
	private _canvasElementService = inject(CanvasElementService)
	private _domPointService = inject(DomPointService)
	private _appState = inject(CanvasAppStateStore)
	private _divElements = inject(DivElementsService)
	private _state = inject(CanvasClientStateService)
	private _machine = inject(MachineService)

	private lastRenderTime = performance.now()

	private framesThisSecond = 0

	private _previousFpsStats = [0, 0, 0]

	private set fpsStats(value: number) {
		this._previousFpsStats.shift()
		this._previousFpsStats.push(value)
	}

	private get averageFps() {
		if (this._previousFpsStats[this._previousFpsStats.length - 1] === 0) {
			return 0
		}
		return this._previousFpsStats.reduce((a, b) => a + b) / this._previousFpsStats.length
	}

	constructor() {
		this.checkFps()
	}

	get ctx() {
		return this._canvasElementService.ctx
	}

	get canvas() {
		return this._canvasElementService.canvas
	}

	get entities() {
		return this._state.entities.canvasEntities.getEntities()
	}

	get fpsEl() {
		return this._divElements.getElementById(DIV_ELEMENT.FPS)
	}

	checkFps() {
		const currentTime = performance.now()
		const deltaTime = currentTime - this.lastRenderTime

		if (deltaTime) {
			this.fpsEl.innerText = `${this.averageFps.toFixed(1)} FPS`
		}

		if (deltaTime >= 1000) {
			this.fpsStats = this.framesThisSecond / (deltaTime / 1000)
			this.framesThisSecond = 0
			this.lastRenderTime = currentTime
		}
		requestAnimationFrame(() => this.checkFps())
	}

	render(fn: (ctx: CanvasRenderingContext2D) => void) {
		this.framesThisSecond++
		this.ctx.save()
		fn(this.ctx)
		this.ctx.restore()
	}

	drawCanvas(entities?: CanvasEntity[]) {
		this.render((ctx) => {
			ctx.save()
			ctx.setTransform(1, 0, 0, 1, 0, 0)
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			ctx.restore()
			ctx.save()
			ctx.beginPath()
			entities = entities || this._state.entities.canvasEntities.getEntities()
			// const entities = this._state.entities.canvasEntities.getEntities()
			entities.forEach((entity) => {
				this.drawEntity(entity)
			})
			ctx.restore()
			if (this._machine.matches('SelectedState.MultipleEntitiesSelected')) {
				this.drawSelectedBox()
			}
			if (this._machine.matches('SelectedState.StringSelected')) {
				this.drawSelectedStringBox()
			}
		})
	}

	drawSelectedBox() {
		/*		const selectionBoxBounds = this._machine.ctx.selected.selectionBoxBounds
		 if (!selectionBoxBounds) {
		 this._machine.sendEvent({ type: 'CancelSelected', payload: null })
		 console.log('selectionBoxBounds is null')
		 return
		 }*/

		const panelsInArea = this._state.entities.canvasEntities.getEntitiesByIds(
			this._machine.ctx.selected.multipleSelectedIds,
		)
		const selectionBoxBounds = getCompleteBoundsFromMultipleEntitiesWithPadding(panelsInArea, 10)

		// if (selectionBoxBounds) {
		this.ctx.save()
		const { left, top, width, height } = selectionBoxBounds
		this.ctx.strokeStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
		this.ctx.lineWidth = 1
		this.ctx.strokeRect(left, top, width, height)
		this.ctx.restore()

		// }
	}

	drawSelectedStringBox() {
		/*		const selectionBoxBounds = this._machine.ctx.selected.selectionBoxBounds
		 if (!selectionBoxBounds) {
		 this._machine.sendEvent({ type: 'CancelSelected', payload: null })
		 console.log('selectionBoxBounds is null')
		 return
		 }*/

		const selectedStringId = this._machine.ctx.selected.selectedStringId

		const selectedStringPanels = this._state.entities.canvasEntities
			.getEntities()
			.filter((entity) => isPanel(entity) && entity.stringId === selectedStringId)
		const selectionBoxBounds = getCompleteBoundsFromMultipleEntitiesWithPadding(
			selectedStringPanels,
			10,
		)

		// if (selectionBoxBounds) {
		this.ctx.save()
		const { left, top, width, height } = selectionBoxBounds
		this.ctx.strokeStyle = CANVAS_COLORS.StringSelectedPanelFillStyle
		this.ctx.lineWidth = 1
		this.ctx.strokeRect(left, top, width, height)
		this.ctx.restore()

		// }
	}

	drawCanvasExcludeIdsWithFn(ids: string[], fn: (ctx: CanvasRenderingContext2D) => void) {
		this.render((ctx) => {
			ctx.save()
			this.drawCanvasExcludeIds(ids)(ctx)
			fn(ctx)
			ctx.restore()
		})
	}

	drawCanvasExcludeIdsWithFnEditSelectBox(
		ids: string[],
		fn: (ctx: CanvasRenderingContext2D) => void,
	) {
		const entities = this._state.entities.canvasEntities
			.getEntities()
			.filter((entity) => !ids.includes(entity.id))
		this.render((ctx) => {
			ctx.save()
			// this.drawCanvasExcludeIds(ids)
			this.defaultDrawCanvasFnNoSelectBox(entities)(ctx)

			fn(ctx)
			ctx.restore()
		})
	}

	drawCanvasExcludeIdsWithFnExcludeCtxTask(
		ids: string[],
		fn: (ctx: CanvasRenderingContext2D) => void,
		tasks?: CtxTask[],
	) {
		const entities = this._state.entities.canvasEntities
			.getEntities()
			.filter((entity) => !ids.includes(entity.id))
		this.render((ctx) => {
			ctx.save()
			// this.drawCanvasExcludeIds(ids)
			this.defaultDrawCanvasFnNoSelectBox(entities)(ctx)

			fn(ctx)
			ctx.restore()
		})
	}

	drawCanvasExcludeIds(ids: string[]) {
		const entities = this._state.entities.canvasEntities
			.getEntities()
			.filter((entity) => !ids.includes(entity.id))
		return this.defaultDrawCanvasFn(entities)
		// const excludeIdsFn = this.defaultDrawCanvasFn(entities)
		// excludeIdsFn(this.ctx)
		// this.render(excludeIdsFn)
	}

	drawCanvasWithFunction(fn: (ctx: CanvasRenderingContext2D) => void) {
		this.render((ctx) => {
			ctx.save()
			this.drawCanvas()
			fn(ctx)
			ctx.restore()
		})
	}

	drawCanvasWithFunctionInATimerLoop(fn: (ctx: CanvasRenderingContext2D) => void, time: number) {
		setInterval(() => {
			this.drawCanvasWithFunction(fn)
		}, time)
	}

	drawCanvasWithFunctionInAForLoop(fn: (ctx: CanvasRenderingContext2D) => void, times: number) {
		for (let i = 0; i < times; i++) {
			this.drawCanvasWithFunction(fn)
		}
	}

	drawCanvasWithFunctionInAnimationFrame(fn: (ctx: CanvasRenderingContext2D) => void) {
		requestAnimationFrame(() => {
			this.drawCanvasWithFunction(fn)
		})
	}

	drawDragBox(event: PointerEvent) {
		const start = this._machine.ctx.dragBox.selectionBoxStart
		// const start = this._state.state.dragBox.dragBoxStart
		if (!start) {
			console.log('drawDragBox', 'no start')
			return
		}

		const { mode } = this._state.mode
		const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
		const width = currentPoint.x - start.x
		const height = currentPoint.y - start.y
		this.drawCanvas()
		this.ctx.save()
		this.ctx.beginPath()
		this.ctx.globalAlpha = 0.4
		this.ctx.strokeStyle =
			mode === CANVAS_MODE.SELECT
				? CANVAS_COLORS.SelectionBoxFillStyle
				: CANVAS_COLORS.CreationBoxFillStyle
		this.ctx.lineWidth = 1
		this.ctx.rect(start.x, start.y, width, height)
		this.ctx.fill()
		this.ctx.stroke()
		this.ctx.closePath()
		this.ctx.restore()

		if (mode !== CANVAS_MODE.CREATE) return
		const spots = getAllAvailableEntitySpotsBetweenTwoPoints(start, currentPoint, this.entities)
		if (!spots) return

		const { type } = this._state.mode
		const entitySize = SizeByType[type]

		this.ctx.save()
		spots.forEach((spot) => {
			this.ctx.save()
			this.ctx.beginPath()
			this.ctx.globalAlpha = 0.4
			this.ctx.fillStyle = spot.vacant
				? CANVAS_COLORS.PreviewPanelFillStyle
				: CANVAS_COLORS.TakenSpotFillStyle
			this.ctx.rect(spot.x, spot.y, entitySize.width, entitySize.height)
			this.ctx.fill()
			this.ctx.stroke()
			this.ctx.restore()
		})
		this.ctx.restore()
	}

	private drawEntity(entity: CanvasEntity) {
		if (!isPanel(entity)) return
		let fillStyle: string = CANVAS_COLORS.DefaultPanelFillStyle
		let strokeStyle: string = PANEL_STROKE_STYLE.DEFAULT
		const { toRotate } = this._state.state
		const { toMove, selected, pointer } = this._machine.ctx
		// const isBeingHovered = canvasAppXStateService.getSnapshot().context.selected
		// const isBeingHovered = canvasAppXStateService.getSnapshot().matches('DragBoxState.DragBoxInProgress')

		/*			const inSingleSelectedState = canvasAppXStateService
		 .getSnapshot()
		 .matches('SelectedState.EntitySelected')*/
		const isSingleSelected = selected.singleSelectedId === entity.id

		// const isSingleSelected = !!selected.singleSelectedId && selected.singleSelectedId === entity.id

		// if (isSingleSelected) {
		if (isSingleSelected) {
			fillStyle = CANVAS_COLORS.SelectedPanelFillStyle
		}

		const isMultiSelected = selected.multipleSelectedIds.includes(entity.id)

		if (isMultiSelected) {
			fillStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
		}

		// if (isPanel(entity)) {
		const isStringSelected = selected.selectedStringId === entity.stringId
		if (isStringSelected && selected.selectedStringId && entity.stringId) {
			fillStyle = CANVAS_COLORS.StringSelectedPanelFillStyle
			if (isSingleSelected) {
				strokeStyle = PANEL_STROKE_STYLE.SINGLE_SELECTED_STRING_SELECTED
			}
		}
		// }

		const multipleToRotate = toRotate.multipleToRotate
		const isInMultiRotate = !!multipleToRotate && multipleToRotate.ids.includes(entity.id)
		if (isInMultiRotate) {
			this.handleMultipleRotationDraw(entity)
			return
		}

		const isInSingleRotate = !!toRotate.singleToRotate && toRotate.singleToRotate.id === entity.id
		if (isInSingleRotate) {
			this.handleSingleRotationDraw(entity)
			return
		}

		// const currentState = this._machine.snapshot.value

		/*		if (isSingleDragging(entity, toMove.singleToMove)) {
		 this.handleDraggingEntityDraw(entity, toMove.singleToMove)
		 return
		 }

		 if (this._machine.snapshot.matches('ToMoveState.SingleMoveInProgress')) {
		 this.handleDraggingEntityDraw(entity, toMove.singleToMove)
		 return
		 }*/
		/*		if (currentState === 'DragBoxState.DragBoxInProgress') {
		 this.handleMultipleMoveDraw(entity, toMove.multipleToMove)
		 return
		 }*/

		/*		if (isMultipleDragging(entity, toMove.multipleToMove)) {
		 this.handleMultipleMoveDraw(entity, toMove.multipleToMove)
		 return
		 }*/

		const isBeingHovered = !!pointer.hoveringEntityId && pointer.hoveringEntityId === entity.id
		// const isBeingHovered = !!hover.hoveringEntityId && hover.hoveringEntityId === entity.id
		if (isBeingHovered) {
			fillStyle = '#17fff3'
			if (isStringSelected) {
				fillStyle = shadeColor(CANVAS_COLORS.StringSelectedPanelFillStyle, 50)
			}
		}

		/*		const nearbyEntityIds = this._state.nearby.ids
		 const isNearby = nearbyEntityIds.includes(entity.id)
		 if (isNearby) {
		 fillStyle = CANVAS_COLORS.NearbyPanelFillStyle
		 }*/

		this.ctx.save()
		this.ctx.fillStyle = fillStyle
		this.ctx.strokeStyle = strokeStyle
		this.ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
		this.ctx.rotate(entity.angle)
		this.ctx.beginPath()
		this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
		this.ctx.fill()
		this.ctx.stroke()
		this.ctx.restore()
	}

	private handleDraggingEntityDraw(entity: CanvasEntity, singleToMove: AdjustedSingleToMove) {
		// private handleDraggingEntityDraw(entity: CanvasEntity, singleToMove: EntityLocation) {
		this.ctx.save()
		this.ctx.fillStyle = CANVAS_COLORS.HoveredPanelFillStyle
		this.ctx.translate(
			singleToMove.location.x + entity.width / 2,
			singleToMove.location.y + entity.height / 2,
		)
		this.ctx.rotate(entity.angle)

		this.ctx.beginPath()
		this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
		this.ctx.fill()
		this.ctx.stroke()
		this.ctx.restore()
	}

	private handleMultipleMoveDraw(entity: CanvasEntity, multipleToMove: AdjustedMultipleToMove) {
		const offset = multipleToMove.offset
		this.ctx.save()
		this.ctx.translate(
			entity.location.x + entity.width / 2 + offset.x,
			entity.location.y + entity.height / 2 + offset.y,
		)
		this.ctx.rotate(entity.angle)

		this.ctx.beginPath()
		this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
		this.ctx.fill()
		this.ctx.stroke()
		this.ctx.restore()
	}

	private handleSingleRotationDraw(entity: CanvasEntity) {
		const singleToRotate = this._state.toRotate.singleToRotate
		assertNotNull(singleToRotate)
		const angle = singleToRotate.adjustedAngle

		assertNotNull(angle, 'angle should not be null')

		this.ctx.save()
		this.ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
		this.ctx.rotate(angle)
		this.ctx.beginPath()
		this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
		this.ctx.fill()
		this.ctx.stroke()
		this.ctx.restore()
	}

	private handleMultipleRotationDraw(entity: CanvasEntity) {
		const multipleToRotate = this._state.toRotate.multipleToRotate
		assertNotNull(multipleToRotate)
		const angle = multipleToRotate.adjustedAngle
		const location = multipleToRotate.entities.find((e) => e.id === entity.id)?.adjustedLocation
		assertNotNull(angle)
		assertNotNull(location)

		this.ctx.save()
		this.ctx.translate(location.x + entity.width / 2, location.y + entity.height / 2)
		this.ctx.rotate(angle)

		this.ctx.beginPath()
		this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
		this.ctx.fill()
		this.ctx.stroke()
		this.ctx.restore()
	}

	private defaultDrawCanvasFn(entities?: CanvasEntity[]) {
		return (ctx: CanvasRenderingContext2D) => {
			ctx.save()
			ctx.setTransform(1, 0, 0, 1, 0, 0)
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			ctx.restore()
			ctx.save()
			ctx.beginPath()
			entities = entities || this._state.entities.canvasEntities.getEntities()
			entities.forEach((entity) => {
				this.drawEntity(entity)
			})
			ctx.restore()
			ctx.save()
			if (this._machine.matches('SelectedState.MultipleEntitiesSelected')) {
				console.log('multiple entities selected')
				this.drawSelectedBox()
			}
			ctx.restore()
		}
	}

	private defaultDrawCanvasFnNoSelectBox(entities?: CanvasEntity[]) {
		return (ctx: CanvasRenderingContext2D) => {
			ctx.save()
			ctx.setTransform(1, 0, 0, 1, 0, 0)
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			ctx.restore()
			ctx.save()
			ctx.beginPath()
			entities = entities || this._state.entities.canvasEntities.getEntities()
			entities.forEach((entity) => {
				this.drawEntity(entity)
			})
			ctx.restore()
		}
	}
}

const isSingleDragging = (
	entity: CanvasEntity,
	singleToMove: AdjustedSingleToMove | undefined,
): singleToMove is AdjustedSingleToMove => {
	return !!singleToMove && singleToMove.id === entity.id
}

const isMultipleDragging = (
	entity: CanvasEntity,
	multipleToMove: AdjustedMultipleToMove | undefined,
): multipleToMove is AdjustedMultipleToMove => {
	return !!multipleToMove && multipleToMove.entities.find((e) => e.id === entity.id) !== undefined
}
/*const isSingleDragging = (entity: CanvasEntity, singleToMove: SingleToMove | undefined): singleToMove is SingleToMove => {
 return !!singleToMove && singleToMove.id === entity.id
 }

 const isMultipleDragging = (entity: CanvasEntity, multipleToMove: MultipleToMove | undefined): multipleToMove is MultipleToMove => {
 return !!multipleToMove && multipleToMove.entities.find((e) => e.id === entity.id) !== undefined
 }*/