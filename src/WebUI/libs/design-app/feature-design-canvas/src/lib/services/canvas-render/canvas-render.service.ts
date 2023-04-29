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
import { SelectedStateSnapshot } from '../canvas-client-state/+xstate/selected-state.machine'
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
		const { selectedSnapshot } = this._machine.allSnapshots
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
				this.drawEntityV2(entity, selectedSnapshot)
			})
			ctx.restore()

			if (selectedSnapshot.matches('EntitySelectedState.EntitiesSelected')) {
				this.drawSelectedBox()
			}
			if (selectedSnapshot.matches('StringSelectedState.StringSelected')) {
				this.drawSelectedStringBox()
				this.drawSelectedBox()
			}
			/*			if (this._machine.matches('SelectedState.MultipleEntitiesSelected')) {
			 this.drawSelectedBox()
			 }
			 if (this._machine.matches('SelectedState.StringSelected')) {
			 this.drawSelectedStringBox()
			 this.drawSelectedBox()
			 }*/
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
			this._machine.selectedCtx.multipleSelectedIds, // this._machine.appCtx.selected.multipleSelectedIds,
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
		const selectedStringId = this._machine.selectedCtx.selectedStringId
		// const selectedStringId = this._machine.appCtx.selected.selectedStringId
		assertNotNull(selectedStringId)
		const string = this._state.entities.canvasStrings.getEntityById(selectedStringId)
		assertNotNull(string)

		const selectedStringPanels = this._state.entities.canvasEntities
			.getEntities()
			.filter((entity) => isPanel(entity) && entity.stringId === selectedStringId)
		const selectionBoxBounds = getCompleteBoundsFromMultipleEntitiesWithPadding(
			selectedStringPanels,
			10,
		)

		this.ctx.save()
		const { left, top, width, height, right } = selectionBoxBounds
		this.ctx.strokeStyle = CANVAS_COLORS.StringSelectedPanelFillStyle
		this.ctx.lineWidth = 1
		this.ctx.strokeRect(left, top, width, height)
		// this.ctx.font = '10px Roboto, sans-serif'
		// this.ctx.font = '10px Helvetica, sans-serif'
		// this.ctx.font = '10px Cascadia Code, sans-serif'
		this.ctx.font = '10px Consolas, sans-serif'
		const text = `${string.name} || ${selectedStringPanels.length} panels`
		// const text = `String ${string.name} || ${selectedStringPanels.length} panels`
		// const measure = this.ctx.measureText(text)
		// console.log(measure)
		this.ctx.fillStyle = 'black'
		this.ctx.fillText(text, left, top - 2)
		this.ctx.restore()
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
		const start = this._machine.appCtx.dragBox.selectionBoxStart
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
		/*if (!isPanel(entity)) return
		 let fillStyle: string = CANVAS_COLORS.DefaultPanelFillStyle
		 let strokeStyle: string = PANEL_STROKE_STYLE.DEFAULT
		 const { toRotate } = this._state.state
		 const { toMove, selected, pointer } = this._machine.appCtx
		 // const isBeingHovered = canvasAppXStateService.getSnapshot().context.selected
		 // const isBeingHovered = canvasAppXStateService.getSnapshot().matches('DragBoxState.DragBoxInProgress')

		 /!*			const inSingleSelectedState = canvasAppXStateService
		 .getSnapshot()
		 .matches('SelectedState.EntitySelected')*!/
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

		 /!*		if (isSingleDragging(entity, toMove.singleToMove)) {
		 this.handleDraggingEntityDraw(entity, toMove.singleToMove)
		 return
		 }

		 if (this._machine.snapshot.matches('ToMoveState.SingleMoveInProgress')) {
		 this.handleDraggingEntityDraw(entity, toMove.singleToMove)
		 return
		 }*!/
		 /!*		if (currentState === 'DragBoxState.DragBoxInProgress') {
		 this.handleMultipleMoveDraw(entity, toMove.multipleToMove)
		 return
		 }*!/

		 /!*		if (isMultipleDragging(entity, toMove.multipleToMove)) {
		 this.handleMultipleMoveDraw(entity, toMove.multipleToMove)
		 return
		 }*!/

		 const isBeingHovered = !!pointer.hoveringEntityId && pointer.hoveringEntityId === entity.id
		 // const isBeingHovered = !!hover.hoveringEntityId && hover.hoveringEntityId === entity.id
		 if (isBeingHovered) {
		 fillStyle = '#17fff3'
		 if (isStringSelected) {
		 fillStyle = shadeColor(CANVAS_COLORS.StringSelectedPanelFillStyle, 50)
		 }
		 }

		 /!*		const nearbyEntityIds = this._state.nearby.ids
		 const isNearby = nearbyEntityIds.includes(entity.id)
		 if (isNearby) {
		 fillStyle = CANVAS_COLORS.NearbyPanelFillStyle
		 }*!/

		 this.ctx.save()
		 this.ctx.fillStyle = fillStyle
		 this.ctx.strokeStyle = strokeStyle
		 this.ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
		 this.ctx.rotate(entity.angle)
		 this.ctx.beginPath()
		 this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
		 this.ctx.fill()
		 this.ctx.stroke()
		 this.ctx.restore()*/
	}

	private drawEntityV2(entity: CanvasEntity, selectedSnapshot: SelectedStateSnapshot) {
		if (!isPanel(entity)) return
		let fillStyle: string = CANVAS_COLORS.DefaultPanelFillStyle
		const strokeStyle: string = PANEL_STROKE_STYLE.DEFAULT
		const { toRotate } = this._state.state
		const { toMove, pointer } = this._machine.appCtx
		// const isBeingHovered = canvasAppXStateService.getSnapshot().context.selected
		// const isBeingHovered = canvasAppXStateService.getSnapshot().matches('DragBoxState.DragBoxInProgress')

		/*			const inSingleSelectedState = canvasAppXStateService
		 .getSnapshot()
		 .matches('SelectedState.EntitySelected')*/
		/*		const isSingleSelected = selected.singleSelectedId === entity.id

		 // const isSingleSelected = !!selected.singleSelectedId && selected.singleSelectedId === entity.id

		 // if (isSingleSelected) {
		 if (isSingleSelected) {
		 fillStyle = CANVAS_COLORS.SelectedPanelFillStyle
		 }*/

		const isSelected =
			selectedSnapshot.matches('EntitySelectedState.EntitiesSelected') &&
			selectedSnapshot.context.multipleSelectedIds.includes(entity.id)
		if (isSelected) {
			fillStyle = CANVAS_COLORS.SelectedPanelFillStyle
		}
		/*		isSelected ? fillStyle = CANVAS_COLORS.SelectedPanelFillStyle : fillStyle = CANVAS_COLORS.DefaultPanelFillStyle
		 if (selectedSnapshot.matches('EntitySelectedState.EntitiesSelected')) {
		 const isSelected = selectedSnapshot.context.multipleSelectedIds.includes(entity.id)
		 if (isSelected) {
		 fillStyle = CANVAS_COLORS.SelectedPanelFillStyle
		 }
		 }*/ /* else if (selectedSnapshot.matches('EntitySelectedState.EntitySelected')) {
		 if (selectedSnapshot.context.selectedId === entity.id) {
		 fillStyle = CANVAS_COLORS.SelectedPanelFillStyle
		 }
		 }*/

		/*		const isMultiSelected = selected.multipleSelectedIds.includes(entity.id)

		 if (isMultiSelected) {
		 fillStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
		 }*/

		// if (isPanel(entity)) {
		const isStringSelected =
			selectedSnapshot.matches('StringSelectedState.StringSelected') &&
			selectedSnapshot.context.selectedStringId === entity.stringId
		if (isStringSelected) {
			fillStyle = CANVAS_COLORS.StringSelectedPanelFillStyle
			// TODO - looks weird
			/*			if (isSelected) {
			 strokeStyle = PANEL_STROKE_STYLE.SINGLE_SELECTED_STRING_SELECTED
			 }*/
		}
		/*		if (selectedSnapshot.matches('StringSelectedState.StringSelected')) {
		 const isStringSelected = selectedSnapshot.context.selectedStringId === entity.stringId
		 if (isStringSelected && selectedSnapshot.context.selectedStringId && entity.stringId) {
		 fillStyle = CANVAS_COLORS.StringSelectedPanelFillStyle
		 if (isSelected) {
		 strokeStyle = PANEL_STROKE_STYLE.SINGLE_SELECTED_STRING_SELECTED
		 }
		 }
		 }*/
		/*		const isStringSelected = selected.selectedStringId === entity.stringId
		 if (isStringSelected && selected.selectedStringId && entity.stringId) {
		 fillStyle = CANVAS_COLORS.StringSelectedPanelFillStyle
		 if (isSingleSelected) {
		 strokeStyle = PANEL_STROKE_STYLE.SINGLE_SELECTED_STRING_SELECTED
		 }
		 }*/
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
		const { selectedSnapshot } = this._machine.allSnapshots
		return (ctx: CanvasRenderingContext2D) => {
			ctx.save()
			ctx.setTransform(1, 0, 0, 1, 0, 0)
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			ctx.restore()
			ctx.save()
			ctx.beginPath()
			entities = entities || this._state.entities.canvasEntities.getEntities()
			entities.forEach((entity) => {
				this.drawEntityV2(entity, selectedSnapshot)
				// this.drawEntity(entity)
			})
			ctx.restore()
			ctx.save()
			if (selectedSnapshot.matches('EntitySelectedState.EntitiesSelected')) {
				this.drawSelectedBox()
			}

			if (selectedSnapshot.matches('StringSelectedState.StringSelected')) {
				this.drawSelectedStringBox()
				this.drawSelectedBox()
			}
			/*			if (this._machine.selectedSnapshot.matches('EntitySelectedState.EntitiesSelected')) {
			 this.drawSelectedBox()
			 }*/
			/*			if (this._machine.matches('SelectedState.MultipleEntitiesSelected')) {
			 console.log('multiple entities selected')
			 this.drawSelectedBox()
			 }*/
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

/*const isSingleDragging = (
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
 }*/
/*const isSingleDragging = (entity: CanvasEntity, singleToMove: SingleToMove | undefined): singleToMove is SingleToMove => {
 return !!singleToMove && singleToMove.id === entity.id
 }

 const isMultipleDragging = (entity: CanvasEntity, multipleToMove: MultipleToMove | undefined): multipleToMove is MultipleToMove => {
 return !!multipleToMove && multipleToMove.entities.find((e) => e.id === entity.id) !== undefined
 }*/