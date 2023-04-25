import { Directive, OnInit } from '@angular/core'
import { CURSOR_TYPE, KEYS } from '@shared/data-access/models'
import { CanvasEntity, createPanel, isPanel, SizeByType, TransformedPoint, UndefinedStringId } from '../types'
import { ENTITY_TYPE } from '@design-app/shared'
import { assertNotNull, OnDestroyDirective } from '@shared/utils'
import { changeCanvasCursor, dragBoxKeysDown, draggingScreenKeysDown, getTopLeftPointFromTransformedPoint, isContextMenu, isDraggingEntity, isMenuOpen, isReadyToMultiDrag, multiSelectDraggingKeysDown, rotatingKeysDown } from '../utils'
import { DesignCanvasDirectiveExtension } from './design-canvas-directive.extension'
import { AppStateValue, DRAG_BOX_STATE, GRID_STATE, POINTER_STATE, PointerHoverOverEntity, PointerLeaveEntity, StartClickCreateMode, StartClickSelectMode, TO_MOVE_STATE, TO_ROTATE_STATE, VIEW_STATE } from '../services'
import { createStringWithPanels } from '../utils/string-fns'

interface DesignCanvasEventHandlers {
	onMouseDownHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	onMouseMoveHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	onMouseUpHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	mouseClickHandler(event: PointerEvent, currentPoint: TransformedPoint, state: AppStateValue): void

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
			this._objPositioning.multiSelectDraggingMouseDown(event, multipleSelectedIds)
			return
		}

		this.entityPressed = this.getEntityUnderMouse(event)
	}

	/**
	 * Mouse Move handler
	 * @param event
	 * @param currentPoint
	 */

	onMouseMoveHandler(event: PointerEvent, currentPoint: TransformedPoint) {
		this.currentTransformedCursor = currentPoint
		this.mousePos.innerText = `Original X: ${event.offsetX}, Y: ${event.offsetY}`
		this.transformedMousePos.innerText = `Transformed X: ${this.currentTransformedCursor.x}, Y: ${this.currentTransformedCursor.y}`

		const { ToRotateState, SelectedState, ToMoveState, DragBoxState, ViewState, PointerState } = this._machine.state

		// const machineState = this._machine.state

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

		if (ViewState === VIEW_STATE.VIEW_DRAGGING_IN_PROGRESS) {
			this._view.handleDragScreenMouseMove(event, currentPoint)
			return
		}

		if (DragBoxState === DRAG_BOX_STATE.SELECTION_BOX_IN_PROGRESS) {
			this._drag.selectionBoxMouseMove(event, currentPoint)
			return
		}

		if (DragBoxState === DRAG_BOX_STATE.CREATION_BOX_IN_PROGRESS) {
			this._drag.creationBoxMouseMove(event, currentPoint)
			return
		}

		const dragBoxAxisLineStart = this._machine.ctx.dragBox.axisLineBoxStart
		if (dragBoxAxisLineStart) {
			this._drag.dragAxisLineMouseMove(event, currentPoint, dragBoxAxisLineStart)
			return
		}

		if (ToMoveState === TO_MOVE_STATE.MULTIPLE_MOVE_IN_PROGRESS) {
			this._objPositioning.multiSelectDraggingMouseMove(event)
			return
		}

		const multipleSelectedIds = this._machine.ctx.selected.multipleSelectedIds
		if (multiSelectDraggingKeysDown(event, multipleSelectedIds)) {
			this._objPositioning.setMultiSelectDraggingMouseMove(event, multipleSelectedIds)
			return
		}

		/*		const multipleToMoveState = machineState[TO_MOVE_STATE_KEY] === TO_MOVE_STATE.MULTIPLE_MOVE_IN_PROGRESS
		 // const singleToMoveState = machineState.ToMoveState === TO_MOVE_STATE.SINGLE_MOVE_IN_PROGRESS

		 // const multipleSelectedIds = this._state.selected.multipleSelectedIds

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
		 }*/
		if (isReadyToMultiDrag(event, multipleSelectedIds)) {
			changeCanvasCursor(this.canvas, CURSOR_TYPE.GRAB)
			return
		}

		if (ToMoveState === TO_MOVE_STATE.SINGLE_MOVE_IN_PROGRESS) {
			this._objPositioning.singleToMoveMouseMove(event, currentPoint)
			return
		}

		/*const singleToMoveState = machineState[TO_MOVE_STATE_KEY] === TO_MOVE_STATE.SINGLE_MOVE_IN_PROGRESS

		 if (singleToMoveState) {
		 this._objPositioning.singleToMoveMouseMove(event, currentPoint)
		 return
		 }*/

		if (this.entityPressed && isDraggingEntity(event, this.entityPressed.id)) {
			this._objPositioning.setSingleToMoveEntity(event, this.entityPressed.id)
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

		if (PointerState === POINTER_STATE.HOVERING_OVER_ENTITY) {
			changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
			this._machine.sendEvent(new PointerLeaveEntity({ point: currentPoint }))
			this._render.drawCanvas()
			return
		}

		const { menu } = this._state.getState()
		if (menu.createPreview) {
			// const size = SizeByType[ENTITY_TYPE.Panel]
			// const fnReturns = getDrawPreviewEntityFnV2(currentPoint, size, this._state, event)
			this._nearby.getDrawEntityPreview(event, currentPoint)
			return

			/*			const fnReturns = getDrawPreviewEntityFnV2(currentPoint, size, this._state, event)
			 if (fnReturns) {
			 if (fnReturns.changes) {
			 this._state.updateState(fnReturns.changes)
			 }

			 this._render.drawCanvasWithFunction(fnReturns.ctxFn)
			 return
			 }*/
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
		const state = this._machine.state
		const { DragBoxState, ToMoveState, ViewState } = state
		if (this.mouseDownTimeOut) {
			console.log('mouseDownTimeOut', this.mouseDownTimeOut)
			clearTimeout(this.mouseDownTimeOut)
			this.mouseDownTimeOut = undefined
			this.mouseClickHandler(event, currentPoint, state)
			return
		}

		if (ViewState === VIEW_STATE.VIEW_DRAGGING_IN_PROGRESS) {
			this._view.handleDragScreenMouseUp(event)
			return
		}

		if (DragBoxState === DRAG_BOX_STATE.SELECTION_BOX_IN_PROGRESS) {
			this._drag.selectionBoxMouseUp(event, currentPoint)
			return
		}

		if (DragBoxState === DRAG_BOX_STATE.CREATION_BOX_IN_PROGRESS) {
			this._drag.creationBoxMouseUp(event, currentPoint)
			return
		}

		if (ToMoveState === TO_MOVE_STATE.SINGLE_MOVE_IN_PROGRESS) {
			this._objPositioning.singleToMoveMouseUp(event, currentPoint)
			return
		}

		if (ToMoveState === TO_MOVE_STATE.MULTIPLE_MOVE_IN_PROGRESS) {
			this._objPositioning.stopMultiSelectDragging(event)
			return
		}

		this._render.drawCanvas()
	}

	/**
	 * Mouse Click handler
	 * @param event
	 * @param currentPoint
	 * @param state
	 * @private
	 */

	mouseClickHandler(event: PointerEvent, currentPoint: TransformedPoint, state: AppStateValue) {
		if (isMenuOpen(this.menu)) {
			this.menu.style.display = 'none'
			return
		}

		const { ToMoveState, ToRotateState } = state

		if (ToRotateState !== TO_ROTATE_STATE.NO_ROTATE) {
			this._objRotating.clearEntityToRotate()
			return
		}

		if (ToMoveState !== TO_MOVE_STATE.NO_MOVE) {
			this._objPositioning.resetObjectPositioning(event, currentPoint)
			return
		}

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

		// const location = this._domPoint.getTransformedPointToMiddleOfObjectFromEvent(event, ENTITY_TYPE.Panel)

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

		const location = getTopLeftPointFromTransformedPoint(currentPoint, SizeByType[ENTITY_TYPE.Panel])
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
		const entityUnderMouse = this.getEntityUnderTransformedPoint(currentPoint)
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
		// TODO add double click on panel

		// const entityUnderMouse = this.getEntityUnderTransformedPoint(currentPoint)
		/*		if (entityUnderMouse) {
		 console.log('entityUnderMouse', entityUnderMouse)
		 }*/

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

		this._render.drawCanvas()
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

					this._objRotating.clearEntityToRotate()
					console.log('clear single to rotate')
					return
				}
				const multipleToRotate = this._state.toRotate.multipleToRotate

				if (multipleToRotate && multipleToRotate.ids.length > 0) {
					this._objRotating.clearEntityToRotate()
					console.log('clear multiple to rotate')
					return
				}
				const entityToRotate = this._state.toRotate.singleToRotate
				const singleSelectedId = this._state.selected.singleSelectedId
				if (singleSelectedId && !entityToRotate) {
					this._objRotating.setEntityToRotate(singleSelectedId, this.currentTransformedCursor)
					console.log('set single to rotate')
					return
				}
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
				}
				return
			}
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
			}
				break

		}
	}
}
