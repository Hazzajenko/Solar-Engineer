import { Directive, OnInit } from '@angular/core'
import { CURSOR_TYPE, KEYS } from '@shared/data-access/models'
import { CanvasEntity, createPanel, isPanel, SizeByType, TransformedPoint, UndefinedStringId } from '../types'
import { ENTITY_TYPE } from '@design-app/shared'
import { assertNotNull, OnDestroyDirective } from '@shared/utils'
import { changeCanvasCursor, dragBoxKeysDown, draggingScreenKeysDown, isContextMenu, isDraggingEntity, isMenuOpen, isReadyToMultiDrag, multiSelectDraggingKeysDown, rotatingKeysDown } from '../utils'
import { DesignCanvasDirectiveExtension } from './design-canvas-directive.extension'
import { DRAG_BOX_STATE, getDrawPreviewEntityFnV2, GRID_STATE, POINTER_STATE, POINTER_STATE_KEY, PointerHoverOverEntity, PointerLeaveEntity, StartClickCreateMode, StartClickSelectMode, TO_MOVE_STATE, TO_MOVE_STATE_KEY, TO_ROTATE_STATE, TO_ROTATE_STATE_KEY, VIEW_STATE } from '../services'
import { createStringWithPanels } from '../utils/string-fns'

interface DesignCanvasEventHandlers {
	onMouseDownHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	onMouseMoveHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	onMouseUpHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	mouseClickHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	doubleClickHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	contextMenuHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	wheelScrollHandler(event: WheelEvent): void

	keyUpHandler(event: KeyboardEvent): void
}

@Directive({
	selector: '[appDesignCanvasXState]', providers: [OnDestroyDirective], standalone: true,
})
export class DesignCanvasWithXstateDirective
	extends DesignCanvasDirectiveExtension
	implements OnInit,
						 DesignCanvasEventHandlers {

	entityPressed: CanvasEntity | undefined

	public ngOnInit() {
		this.setupCanvas()
		this.fpsEl = document.getElementById('fps') as HTMLDivElement
		this._ngZone.runOutsideAngular(() => {
			this.setupMouseEventListeners()
			this.animate60Fps()
		})
		this.canvasMenu = document.getElementById('canvas-menu') as HTMLDivElement
		this.mousePos = document.getElementById('mouse-pos') as HTMLDivElement
		this.transformedMousePos = document.getElementById('transformed-mouse-pos') as HTMLDivElement
		this.scaleElement = document.getElementById('scale-element') as HTMLDivElement
		this.stringStats = document.getElementById('string-stats') as HTMLDivElement
		this.panelStats = document.getElementById('panel-stats') as HTMLDivElement
		this.menu = document.getElementById('menu') as HTMLDivElement
		this.keyMap = document.getElementById('key-map') as HTMLDivElement
	}

	/**
	 * ! Event Handlers
	 */

	/**
	 * Mouse Down handler
	 * @param event
	 * @param currentPoint
	 * @private
	 */

	onMouseDownHandler(event: PointerEvent, currentPoint: TransformedPoint) {
		// const currentPoint = this._domPoint.getTransformedPointFromEvent(event)

		const { GridState } = this._machine.state

		if (isContextMenu(event)) {
			return
		}
		this.mouseDownTimeOutFn()
		if (draggingScreenKeysDown(event)) {
			this._view.handleDragScreenMouseDown(event, currentPoint)
			return
		}

		if (dragBoxKeysDown(event)) {
			const { xAxisLineBounds, yAxisLineBounds } = this._state.grid
			if (xAxisLineBounds || yAxisLineBounds) {
				console.log('cannot drag box when axisLineBounds is visible', xAxisLineBounds, yAxisLineBounds)
				this._state.updateState({
					dragBox: {
						axisLineStart: currentPoint,
					},
				})
				return
			}
			const axisPreviewRect = this._state.grid.axisPreviewRect
			if (axisPreviewRect) {
				console.log('cannot drag box when axisPreviewRect is visible')
				return
			}
			console.log('drag box keys down')
			this._drag.handleDragBoxMouseDown(event, currentPoint, GridState)
			return
		}

		const multipleSelectedIds = this._machine.ctx.selected.multipleSelectedIds
		if (multiSelectDraggingKeysDown(event, multipleSelectedIds)) {
			this._objPositioning.multiSelectDraggingMouseDown(event, multipleSelectedIds, currentPoint)
			return
		}

		this.entityPressed = this.getEntityUnderMouse(event)
	}

	/**
	 * Mouse Move handler
	 * @param event
	 * @param currentPoint
	 * @private
	 */

	onMouseMoveHandler(event: PointerEvent, currentPoint: TransformedPoint) {
		this.currentTransformedCursor = currentPoint
		this.mousePos.innerText = `Original X: ${event.offsetX}, Y: ${event.offsetY}`
		this.transformedMousePos.innerText = `Transformed X: ${this.currentTransformedCursor.x}, Y: ${this.currentTransformedCursor.y}`

		const { ToRotateState, SelectedState, ToMoveState, DragBoxState, ViewState, PointerState } = this._machine.state

		const machineState = this._machine.state

		if (ToRotateState === TO_ROTATE_STATE.SINGLE_ROTATE_MODE_IN_PROGRESS) {
			this._objRotating.rotateEntityViaMouse(event, true, currentPoint)
			return
		}

		if (ToRotateState === TO_ROTATE_STATE.SINGLE_ROTATE_IN_PROGRESS) {
			this._objRotating.rotateEntityViaMouse(event, false, currentPoint)
			return
		}

		if (ToRotateState === TO_ROTATE_STATE.MULTIPLE_ROTATE_IN_PROGRESS) {
			this._objRotating.rotateMultipleEntitiesViaMouse(event, currentPoint)
			return
		}

		if (ToRotateState === TO_ROTATE_STATE.NO_ROTATE && rotatingKeysDown(event)) {
			this._objRotating.handleSetEntitiesToRotate(event, currentPoint)
			return
		}
		/*		if (!this._objRotating.areAnyEntitiesInRotate && rotatingKeysDown(event)) {
		 this._objRotating.handleSetEntitiesToRotate(event)
		 return
		 }*/

		/*		if (this._objRotating.areAnyEntitiesInRotate && !rotatingKeysDown(event)) {
		 this._objRotating.clearEntityToRotate()
		 return
		 }*/
		// const inViewDraggingState = machineState[VIEW_STATE_KEY] === VIEW_STATE.VIEW_DRAGGING_IN_PROGRESS
		if (ViewState === VIEW_STATE.VIEW_DRAGGING_IN_PROGRESS) {
			// if (inViewDraggingState) {
			this._view.handleDragScreenMouseMove(event, currentPoint)
			return
		}
		/*		if (this._view.screenDragStartPoint) {
		 this._view.handleDragScreenMouseMove(event)
		 return
		 }*/

		// const dragBoxStart = this._machine.ctx.dragBox.selectionBoxStart
		// const dragBoxStart = this._state.dragBox.dragBoxStart
		if (DragBoxState === DRAG_BOX_STATE.SELECTION_BOX_IN_PROGRESS) {
			this._drag.selectionBoxMouseMove(event, currentPoint)
			return
		}

		if (DragBoxState === DRAG_BOX_STATE.CREATION_BOX_IN_PROGRESS) {
			this._drag.creationBoxMouseMove(event, currentPoint)
			return
		}

		/*		if (DragBoxState === DRAG_BOX_STATE.SELECTION_BOX_IN_PROGRESS || DragBoxState === DRAG_BOX_STATE.CREATION_BOX_IN_PROGRESS) {
		 // if (dragBoxStart) {
		 this._drag.dragBoxMouseMove(event)
		 return
		 }*/

		const dragBoxAxisLineStart = this._machine.ctx.dragBox.axisLineBoxStart
		// const dragBoxAxisLineStart = this._state.dragBox.axisLineStart
		if (dragBoxAxisLineStart) {
			this._drag.dragAxisLineMouseMove(event, currentPoint, dragBoxAxisLineStart)
			return
		}

		/*		const singleToMoveState = machineState[TO_MOVE_STATE_KEY] === TO_MOVE_STATE.SINGLE_MOVE_IN_PROGRESS

		 if (singleToMoveState) {
		 this._objPositioning.singleSelectDraggingMouseMove(event)
		 return
		 }*/

		const multipleToMoveState = machineState[TO_MOVE_STATE_KEY] === TO_MOVE_STATE.MULTIPLE_MOVE_IN_PROGRESS
		// const singleToMoveState = machineState.ToMoveState === TO_MOVE_STATE.SINGLE_MOVE_IN_PROGRESS

		// const multipleSelectedIds = this._state.selected.multipleSelectedIds
		const multipleSelectedIds = this._machine.ctx.selected.multipleSelectedIds
		// const multipleSelectedIds = this._state.selected.multipleSelectedIds
		const multipleToMove = this._machine.ctx.toMove.multipleToMove
		// const multipleToMove = this._state.toMove.multipleToMove
		const multiSelectDraggingKeys = multiSelectDraggingKeysDown(event, multipleSelectedIds)

		if (multipleToMove) {
			if (multiSelectDraggingKeys) {
				// changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
				return this._objPositioning.multiSelectDraggingMouseMove(event)
			}
			this._objPositioning.stopMultiSelectDragging(event)
			return
		}

		if (multiSelectDraggingKeys && !multipleToMove) {

			this._objPositioning.setMultiSelectDraggingMouseMove(event, multipleSelectedIds, currentPoint)

			return
		}
		if (isReadyToMultiDrag(event, multipleSelectedIds)) {
			changeCanvasCursor(this.canvas, CURSOR_TYPE.GRAB)
			return
		}

		const singleToMoveState = machineState[TO_MOVE_STATE_KEY] === TO_MOVE_STATE.SINGLE_MOVE_IN_PROGRESS

		if (singleToMoveState) {
			this._objPositioning.singleToMoveMouseMove(event, currentPoint)
			return
		}

		if (this.entityPressed && isDraggingEntity(event, this.entityPressed.id)) {
			this._objPositioning.singleToMoveMouseDown(event, this.entityPressed.id)
			this.entityPressed = undefined
			return
		}

		const entityUnderMouse = this.getEntityUnderMouse(event)
		if (entityUnderMouse) {
			const hoveringEntityId = this._machine.ctx.pointer.hoveringEntityId
			if (hoveringEntityId === entityUnderMouse.id) return
			this._machine.sendEvent(new PointerHoverOverEntity({ id: entityUnderMouse.id, point: currentPoint }))
			this._render.drawCanvas()
			return
		}

		const hoveringOverEntityState = machineState[POINTER_STATE_KEY] === POINTER_STATE.HOVERING_OVER_ENTITY
		if (hoveringOverEntityState) {
			changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
			this._machine.sendEvent(new PointerLeaveEntity({ point: currentPoint }))
			this._render.drawCanvas()
			return
		}

		/*		if (this.entityPressed) {
		 if (isDraggingEntity(event, this.entityPressed.id)) {
		 this._objPositioning.singleToMoveMouseDown(event, this.entityPressed.id)
		 this.entityPressed = undefined
		 return
		 }
		 const hoveringEntityId = this._machine.ctx.pointer.hoveringEntityId
		 if (hoveringEntityId === this.entityPressed.id) return
		 this._machine.sendEvent(new PointerHoverOverEntity({ id: this.entityPressed.id, point: currentPoint }))
		 this._render.drawCanvas()
		 this.entityPressed = undefined
		 // changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		 return
		 }*/

		/*	// const entityUnderMouse = this.getEntityUnderMouse(event)
		 if (this.entityUnderMouse && isDraggingEntity(event, this.entityUnderMouse.id)) {
		 this._objPositioning.singleToMoveMouseDown(event, this.entityUnderMouse.id)
		 return
		 }

		 if (this.entityUnderMouse) {
		 // changeCanvasCursor(this.canvas, CURSOR_TYPE.POINTER)
		 const hoveringEntityId = this._machine.ctx.pointer.hoveringEntityId
		 if (hoveringEntityId === this.entityUnderMouse.id) return
		 this._machine.sendEvent(new PointerHoverOverEntity({ id: this.entityUnderMouse.id, point: currentPoint }))
		 this._render.drawCanvas()
		 // changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		 return
		 }*/

		/*		if (entityUnderMouse) {
		 if (isDraggingEntity(event, entityUnderMouse.id)) {
		 // if (hoveringOverEntityId && !singleToMove1) {
		 // const entity = this._state.entities.canvasEntities.getEntityById(hoveringOverEntityId)
		 // assertNotNull(entity)
		 this._objPositioning.singleToMoveMouseDown(event, entityUnderMouse.id)
		 // this._machine.sendEvent(new StartSingleMove({ id: entityUnderMouse.id, startPoint: currentPoint, angle: entityUnderMouse.angle }))
		 // sendStateEvent(new StartSingleMove({ id: entityUnderMouse.id, startPoint: currentPoint, angle: entityUnderMouse.angle }))
		 return
		 }
		 }*/
		/*		const singleToMove1 = getStateCtx().toMove.singleToMove
		 const hoveringOverEntityId = getStateCtx().pointer.hoveringEntityId
		 if (isDraggingEntity(event, entityUnderMouse.id)) {
		 // if (hoveringOverEntityId && !singleToMove1) {
		 const entity = this._state.entities.canvasEntities.getEntityById(hoveringOverEntityId)
		 assertNotNull(entity)
		 sendStateEvent(new StartSingleMove({ id: hoveringOverEntityId, startPoint: currentPoint, angle: entity.angle }))
		 return
		 }*/

		/*		const onMouseDownEntityId = this._state.hover.onMouseDownEntityId
		 if (isDraggingEntity(event, onMouseDownEntityId)) {
		 assertNotNull(onMouseDownEntityId)
		 const entity = this._state.entities.canvasEntities.getEntityById(onMouseDownEntityId)
		 assertNotNull(entity)
		 this._state.updateState({
		 hover: {
		 onMouseDownEntityId: undefined,
		 },

		 toMove: {
		 singleToMove: {
		 id: onMouseDownEntityId, type: entity.type, location: entity.location, angle: entity.angle,
		 },
		 },
		 })
		 // 	sendStateEvent(new PointerUpOnEntity({ point: currentPoint }))
		 }*/

		// const singleToMove2 = this._machine.ctx.toMove.singleToMove

		// const singleToMove2 = getStateCtx().toMove.singleToMove
		/*		if (this._machine.snapshot.matches('ToMoveState.SingleMoveInProgress')) {
		 // if (singleToMove2) {
		 /!*			const entity = this._state.entities.canvasEntities.getEntityById(singleToMove2.id)
		 assertNotNull(entity)*!/
		 this._objPositioning.singleToMoveMouseMove(event)
		 return
		 }*/

		/*	const singleToMove = this._state.toMove.singleToMove
		 if (isDraggingEntity(event, singleToMove?.id)) {
		 assertNotNull(singleToMove)
		 const type = this._state.entities.canvasEntities.getEntityById(singleToMove.id)?.type
		 assertNotNull(type)
		 this._objPositioning.singleToMoveMouseMove(event, {
		 id: singleToMove.id, type,
		 })
		 return
		 }*/

		// const multipleToMove = this._state.toMove.multipleToMove
		// const entityUnderMouse = this.getEntityUnderMouse(event)
		/*		if (this.entityUnderMouse) {
		 // changeCanvasCursor(this.canvas, CURSOR_TYPE.POINTER)
		 const hoveringEntityId = this._machine.ctx.pointer.hoveringEntityId
		 if (hoveringEntityId === this.entityUnderMouse.id) return
		 this._machine.sendEvent(new PointerHoverOverEntity({ id: this.entityUnderMouse.id, point: currentPoint }))
		 this._render.drawCanvas()
		 // changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		 return
		 }

		 const hoveringOverEntityState = machineState[POINTER_STATE_KEY] === POINTER_STATE.HOVERING_OVER_ENTITY
		 if (hoveringOverEntityState) {
		 changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		 this._machine.sendEvent(new PointerLeaveEntity({ point: currentPoint }))
		 this._render.drawCanvas()
		 return
		 }*/
		/*		if (entityUnderMouse) {
		 changeCanvasCursor(this.canvas, CURSOR_TYPE.POINTER)
		 const hoveringEntityId = getStateCtx().pointer.hoveringEntityId
		 if (hoveringEntityId === entityUnderMouse.id) return
		 this._machine.sendEvent(new PointerHoverOverEntity({ id: entityUnderMouse.id, point: currentPoint }))
		 // sendStateEvent(new PointerHoverOverEntity({ id: entityUnderMouse.id, point: currentPoint }))
		 this._render.drawCanvas()
		 changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		 return
		 }
		 if (this._machine.snapshot.matches('PointerState.HoveringOverEntity')) {
		 changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		 this._machine.sendEvent(new PointerLeaveEntity({ point: currentPoint }))
		 this._render.drawCanvas()
		 // sendStateEvent(new PointerLeaveEntity({ point: currentPoint }))
		 return
		 }*/
		/*		if (getState()
		 .matches('PointerState.HoveringOverEntity')) {
		 changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		 sendStateEvent({
		 type: 'PointerLeaveEntity', payload: {
		 point: currentPoint,
		 },
		 })
		 return
		 }*/

		/// TODO fix
		/*		if (entityUnderMouse) {
		 changeCanvasCursor(this.canvas, CURSOR_TYPE.POINTER)
		 const hoveringEntityId = this._state.hover.hoveringEntityId
		 if (hoveringEntityId === entityUnderMouse.id) return
		 this._state.updateState({
		 hover: {
		 hoveringEntityId: entityUnderMouse.id,
		 },
		 })
		 this._render.drawCanvas()
		 changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		 return
		 } else {
		 if (this._state.hover.hoveringEntityId) {
		 this._state.updateState({
		 hover: {
		 hoveringEntityId: undefined,
		 },
		 })
		 this._render.drawCanvas()
		 changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		 return
		 }

		 // changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		 }*/

		/*    const keyMapRect = this.keyMap.getBoundingClientRect()
		 const keyMapBounds = domRectToBounds(keyMapRect)

		 const nonTransformedCursor = eventToPointLocation(event)
		 console.log('nonTransformedCursor', nonTransformedCursor)
		 console.log('keyMapBounds', keyMapBounds)
		 if (isPointInsideBounds(nonTransformedCursor, keyMapBounds)) {
		 changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		 this._render.drawCanvas()
		 console.log('inside keymap')
		 return
		 }*/

		const { menu } = this._state.getState()

		if (menu.createPreview) {
			const size = SizeByType[ENTITY_TYPE.Panel]
			const fnReturns = getDrawPreviewEntityFnV2(currentPoint, size, this._state, event)
			if (fnReturns) {
				if (fnReturns.changes) {
					this._state.updateState(fnReturns.changes)
				}

				this._render.drawCanvasWithFunction(fnReturns.ctxFn)
				return
			}
		}
		// isPointInsideBounds(currentPoint, keyMapRect) ? changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO) : changeCanvasCursor(this.canvas, CURSOR_TYPE.GRAB

	}

	/**
	 * Mouse Up handler
	 * @param event
	 * @param currentPoint
	 * @private
	 */

	onMouseUpHandler(event: PointerEvent, currentPoint: TransformedPoint) {
		const { DragBoxState, ToMoveState, ViewState } = this._machine.state
		// if (isContextMenu(event)) return
		if (this.mouseDownTimeOut) {
			console.log('mouseDownTimeOut', this.mouseDownTimeOut)
			clearTimeout(this.mouseDownTimeOut)
			this.mouseDownTimeOut = undefined
			/*			this._state.updateState({
			 hover: {
			 onMouseDownEntityId: undefined,
			 },
			 })*/
			this.mouseClickHandler(event, currentPoint)
			return
		}

		// const machineState = this._machine.state
		/*    this.mouseUpTimeOut = setTimeout(() => {
		 this.mouseUpTimeOut = undefined
		 }, 50)*/
		// this.mouseUpTimeOutFn()

		if (ViewState === VIEW_STATE.VIEW_DRAGGING_IN_PROGRESS) {
			this._view.handleDragScreenMouseUp(event)
			return
		}
		/*
		 if (this._view.screenDragStartPoint) {
		 this._view.handleDragScreenMouseUp(event)
		 }*/

		if (DragBoxState === DRAG_BOX_STATE.SELECTION_BOX_IN_PROGRESS) {
			this._drag.selectionBoxMouseUp(event, currentPoint)
			return
		}

		if (DragBoxState === DRAG_BOX_STATE.CREATION_BOX_IN_PROGRESS) {
			this._drag.creationBoxMouseUp(event, currentPoint)
			return
		}
		/*
		 const dragBoxState = machineState[DRAG_BOX_STATE_KEY]
		 /!*	case CANVAS_MODE.CREATE:
		 this.creationBoxMouseUp(event)
		 break
		 case CANVAS_MODE.SELECT:
		 this.selectionBoxMouseUp(event)
		 break*!/
		 if (dragBoxState === DRAG_BOX_STATE.DRAG_BOX_IN_PROGRESS) {
		 this._drag.dragBoxMouseUp(event)
		 return
		 }*/

		/*		const dragStart = this._machine.ctx.dragBox.selectionBoxStart
		 // const dragStart = this._state.dragBox.dragBoxStart
		 if (dragStart) {
		 this._drag.dragBoxMouseUp(event)
		 return
		 }*/

		if (ToMoveState === TO_MOVE_STATE.SINGLE_MOVE_IN_PROGRESS) {
			this._objPositioning.singleToMoveMouseUp(event, currentPoint)
			return
		}

		if (ToMoveState === TO_MOVE_STATE.MULTIPLE_MOVE_IN_PROGRESS) {
			this._objPositioning.stopMultiSelectDragging(event)
			return
		}

		/*		const toMoveState = machineState[TO_MOVE_STATE_KEY]

		 if (toMoveState === TO_MOVE_STATE.SINGLE_MOVE_IN_PROGRESS) {
		 this._objPositioning.singleToMoveMouseUp(event)
		 return
		 }

		 if (toMoveState === TO_MOVE_STATE.MULTIPLE_MOVE_IN_PROGRESS) {
		 this._objPositioning.stopMultiSelectDragging(event)
		 return
		 }*/

		// const singleToMove = this._machine.ctx.toMove.singleToMove
		// const singleToMove = this._state.toMove.singleToMove
		/*		if (this._machine.snapshot.matches('ToMoveState.SingleMoveInProgress')) {
		 this._objPositioning.singleToMoveMouseUp(event)
		 return
		 }*/
		/*		if (singleToMove) {
		 this._objPositioning.singleToMoveMouseUp(event, singleToMove)
		 return
		 }*/

		/*		const multipleToMove = this._machine.ctx.toMove.multipleToMove
		 // const multipleToMove = this._state.toMove.multipleToMove
		 if (multipleToMove) {
		 this._objPositioning.stopMultiSelectDragging(event)
		 return
		 }*/

		this._render.drawCanvas()

		// this.mouseUpTimeOutFn()
	}

	/**
	 * Mouse Click handler
	 * @param event
	 * @param currentPoint
	 * @private
	 */

	mouseClickHandler(event: PointerEvent, currentPoint: TransformedPoint) {
		if (isMenuOpen(this.menu)) {
			this.menu.style.display = 'none'
			return
		}

		const machineState = this._machine.state

		const isMoving = machineState[TO_MOVE_STATE_KEY] !== TO_MOVE_STATE.NO_MOVE
		const isRotating = machineState[TO_ROTATE_STATE_KEY] !== TO_ROTATE_STATE.NO_ROTATE
		/*    if (this.mouseUpTimeOut) {
		 console.log('mouseUpTimeOut', this.mouseUpTimeOut)
		 clearTimeout(this.mouseUpTimeOut)

		 this.mouseUpTimeOut = undefined
		 return
		 }*/

		if (isRotating) {
			this._objRotating.clearEntityToRotate()
			return
		}

		if (isMoving) {
			this._objPositioning.resetObjectPositioning(event, currentPoint)
			return
		}
		/*		const singleRotateMode = this._state.toRotate.singleRotateMode
		 if (singleRotateMode) {
		 this._objRotating.clearEntityToRotate()
		 return
		 }*/

		const entityUnderMouse = this.getEntityUnderTransformedPoint(currentPoint)
		// const entityUnderMouse = this.getEntityUnderMouse(event)
		if (entityUnderMouse) {
			this._selected.handleEntityUnderMouse(event, entityUnderMouse)
			console.log('entityUnderMouse', entityUnderMouse)
			return
		}
		this._selected.clearSelectedState()
		if (this.anyEntitiesNearAreaOfClick(event)) {
			return
		}
		const location = this._domPoint.getTransformedPointToMiddleOfObjectFromEvent(event, ENTITY_TYPE.Panel)

		const axisPreviewRect = this._state.grid.axisPreviewRect
		if (axisPreviewRect && event.altKey) {
			// const entity = this._state.selected.selectedStringId
			const previewRectLocation = { x: axisPreviewRect.left, y: axisPreviewRect.top }
			const entity = this._state.selected.selectedStringId
				? createPanel(previewRectLocation, this._state.selected.selectedStringId)
				: createPanel(previewRectLocation)
			this._state.entities.canvasEntities.addEntity(entity)
			/*      const axisPreviewRectBounds = domRectToBounds(axisPreviewRect)
			 if (isPointInsideBounds(location, axisPreviewRectBounds)) {*/
			this._state.updateState({
				grid: {
					axisPreviewRect: undefined,
				},
			})
			this._render.drawCanvas()
			return
			/*      return
			 }*/
		}
		// const isStringSelected = !!this._state.selected.selectedStringId
		// const isStringSelected = !!this._selected.selectedStringId
		const entity = this._machine.ctx.selected.selectedStringId
			// const entity = this._state.selected.selectedStringId
			? createPanel(location, this._machine.ctx.selected.selectedStringId)
			: createPanel(location)
		this._state.entities.canvasEntities.addEntity(entity)

		this._render.drawCanvas()
	}

	/**
	 * Double Click handler
	 * @param event
	 * @param currentPoint
	 * @private
	 */

	doubleClickHandler(event: PointerEvent, currentPoint: TransformedPoint) {
		console.log('double click', event)
		const entityUnderMouse = this.getEntityUnderMouse(event)
		// const isPanel = this.getMouseOverPanel(event)
		if (entityUnderMouse) {
			if (!isPanel(entityUnderMouse)) return
			if (entityUnderMouse.stringId === UndefinedStringId) return
			const belongsToString = this._state.entities.canvasStrings.getEntities()
				.find(string => string.id === entityUnderMouse.stringId)

			assertNotNull(belongsToString, 'string not found')
			this._state.updateState({
				selected: {
					selectedStringId: belongsToString.id,
				},
			})
			// this._selected.setSelectedStringId(belongsToString.id)

			// this._selected.handleEntityDoubleClick(event, entityUnderMouse, this.strings)
			/*      if (!isPanel(entityUnderMouse)) return
			 if (entityUnderMouse.stringId === UndefinedStringId) return
			 const belongsToString = this.strings.find(string => string.id === entityUnderMouse.stringId)
			 assertNotNull(belongsToString, 'string not found')
			 this._selected.setSelectedStringId(belongsToString.id)*/
		}
		/*    const mouseOverPanel = this.getMouseOverPanel(event)
		 if (mouseOverPanel) {
		 if (!isPanel(mouseOverPanel)) return
		 if (mouseOverPanel.stringId === UndefinedStringId) return
		 const belongsToString = this.strings.find(string => string.id === mouseOverPanel.stringId)
		 assertNotNull(belongsToString, 'string not found')
		 this._selected.setSelectedStringId(belongsToString.id)
		 }*/
	}

	/**
	 * Wheel Scroll handler
	 * @param event
	 * @private
	 */

	wheelScrollHandler(event: WheelEvent) {
		const currentScaleX = this.ctx.getTransform().a

		const zoom = event.deltaY < 0
			? 1.1
			: 0.9

		const currentTransformedCursor = this._domPoint.getTransformedPointFromEventOffsets(event)
		this.ctx.translate(currentTransformedCursor.x, currentTransformedCursor.y)
		this.ctx.scale(zoom, zoom)
		this.ctx.translate(-currentTransformedCursor.x, -currentTransformedCursor.y)
		this.scaleElement.innerText = `Scale: ${currentScaleX}`

		// this.drawPanels()
		this._render.drawCanvas()
		// this.drawCanvas()
		event.preventDefault()
	}

	/**
	 * Context Menu handler
	 * @param event
	 * @private
	 */

	contextMenuHandler(event: PointerEvent) {
		const entityUnderMouse = this.getEntityUnderMouse(event)
		if (entityUnderMouse) {
			this._renderer.setStyle(this.menu, 'display', 'initial')
			this._renderer.setStyle(this.menu, 'top', `${event.offsetY + entityUnderMouse.height / 2}px`)
			this._renderer.setStyle(this.menu, 'left', `${event.offsetX + entityUnderMouse.width / 2}px`)
			this._renderer.setAttribute(this.menu, 'data-id', entityUnderMouse.id)
			this._renderer.setAttribute(this.menu, 'data-type', entityUnderMouse.type)
			this._renderer.setAttribute(this.menu, 'data-angle', entityUnderMouse.angle.toString())
			if (!isPanel(entityUnderMouse)) return
			this._renderer.setAttribute(this.menu, 'data-stringId', entityUnderMouse.stringId)
		}
	}

	/**
	 * Key Up handler
	 * @private
	 * @param event
	 */
	keyUpHandler(event: KeyboardEvent) {
		switch (event.key) {
			case KEYS.ESCAPE:
				this._selected.clearSelectedState()
				break
			case KEYS.X: {
				const multipleSelectedIds = this._state.selected.multipleSelectedIds
				if (multipleSelectedIds.length <= 1) return

				createStringWithPanels(this._state, multipleSelectedIds)

				// TODO: move to local store
				/*     if (this._selected.multiSelected.length > 0) {
				 this._stringsService.createStringWithPanels(this._selected.getMultiSelectedByType(ENTITY_TYPE.Panel), this.strings)

				 }*/
			}
				break
			case KEYS.R: {
				console.log('r key up')
				const singleToRotate = this._state.toRotate.singleToRotate

				if (singleToRotate) {
					/*          this._state.updateState({
					 toRotate: {
					 singleToRotate: undefined,
					 },
					 })
					 this._render.drawCanvas()*/

					this._objRotating.clearEntityToRotate()
					console.log('clear single to rotate')
					return
				}
				const multipleToRotate = this._state.toRotate.multipleToRotate

				if (multipleToRotate && multipleToRotate.ids.length > 0) {
					/*          this._state.updateState({
					 toRotate: {
					 multipleToRotate: undefined,
					 },
					 })
					 this._render.drawCanvas()*/
					this._objRotating.clearEntityToRotate()
					console.log('clear multiple to rotate')
					return
				}
				/*        if (this._objectPos.entityToRotateId) {
				 this._objectPos.clearEntityToRotate()
				 return
				 }
				 if (this._objectPos.multipleToRotateIds.length > 0 && !this._objectPos.entityToRotateId) {
				 this._objectPos.clearEntityToRotate()
				 return
				 }*/
				// const entity
				const entityToRotate = this._state.toRotate.singleToRotate
				const singleSelectedId = this._state.selected.singleSelectedId
				if (singleSelectedId && !entityToRotate) {
					// if (this._selected.selected && !this._objectPos.entityToRotateId) {
					this._objRotating.setEntityToRotate(singleSelectedId, this.currentTransformedCursor)
					console.log('set single to rotate')
					return
				}

				// const multipleToRotate = this._state.toRotate.multipleToRotate
				// const multipleSelectedIds = this._state.toRotate.multipleToRotate.ids

				/*   if (multipleToRotate && multipleToRotate.ids.length > 0) {
				 // const multiSelectedIds = this._selected.multiSelected.map(entity => entity.id)
				 this._objectPos.setMultipleToRotate(multipleSelectedIds, this.currentTransformedCursor)
				 console.log('set multiple to rotate')
				 return
				 }*/
			}
				break
			case KEYS.C: {
				const { GridState } = this._machine.state
				switch (GridState) {
					case GRID_STATE.IN_SELECT_MODE:
						this._machine.sendEvent(new StartClickCreateMode())
						break
					case GRID_STATE.IN_CREATE_MODE:
						this._machine.sendEvent(new StartClickSelectMode())
						break
					default:
						throw new Error('Unknown grid state')
					// this._machine.transition(GRID_STATE.IN_CREATE_MODE)

				}
				return

				/*				if (this._mode.mode === CANVAS_MODE.CREATE) {
				 this._mode.setMode(CANVAS_MODE.SELECT)
				 return
				 }
				 this._mode.setMode(CANVAS_MODE.CREATE)*/
			}
			// break
			case KEYS.M: {
				const newMenuState = !this._state.menu.optionsMenu
				this._state.updateState({
					menu: {
						optionsMenu: newMenuState,
					},
				})
				if (newMenuState) {
					this._renderer.setStyle(this.canvasMenu, 'display', 'initial')
					return
				}
				this._renderer.setStyle(this.canvasMenu, 'display', 'none')
				/*        if (this.canvasMenu.style.display === 'initial') {
				 this._renderer.setStyle(this.canvasMenu, 'display', 'none')
				 return
				 }
				 this._renderer.setStyle(this.canvasMenu, 'display', 'initial')
				 // this.canvasMenu.toggleMenu()*/
			}
				break

		}
	}
}
