import { CREATE_PREVIEW_STATE } from '../components'
import {
	AppStateMatchesModel,
	AppStateSnapshot,
	POINTER_STATE,
	PointerHoverOverEntity,
	PointerLeaveEntity,
	STATE_MACHINE,
	TO_MOVE_STATE,
	TO_ROTATE_STATE,
} from '../services'
import {
	CanvasEntity,
	CanvasPanel,
	createPanel,
	createString,
	genStringNameV2,
	isPanel,
	SizeByType,
	TransformedPoint,
	UndefinedStringId,
	updateObjectByIdForStore,
} from '../types'
import {
	changeCanvasCursor,
	dragBoxKeysDown,
	draggingScreenKeysDown,
	getCompleteBoundsFromMultipleEntitiesWithPadding,
	getTopLeftPointFromTransformedPoint,
	isContextMenu,
	isDraggingEntity,
	isPointInsideBounds,
	isReadyToMultiDrag,
	isWheelButton,
	multiSelectDraggingKeysDown,
	rotatingKeysDown,
} from '../utils'
import { DesignCanvasDirectiveExtension } from './design-canvas-directive.extension'
import { Directive, OnInit } from '@angular/core'
import { ENTITY_TYPE } from '@design-app/shared'
import { CURSOR_TYPE, KEYS } from '@shared/data-access/models'
import { assertNotNull, OnDestroyDirective } from '@shared/utils'


@Directive({
	selector: '[appDesignCanvasXState]',
	providers: [OnDestroyDirective],
	standalone: true,
}) /*,
 DesignCanvasEventHandlers */
export class DesignCanvasWithXstateDirective
	extends DesignCanvasDirectiveExtension
	implements OnInit
{
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
		const appSnapshot = this._machine.appSnapshot

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
				console.log(
					'cannot drag box when axisLineBounds is visible',
					xAxisLineBounds,
					yAxisLineBounds,
				)
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
			this._drag.handleDragBoxMouseDown(event, currentPoint, appSnapshot)
			return
		}

		const multipleSelectedIds = this._machine.selectedCtx.multipleSelectedIds
		// const multipleSelectedIds = this._machine.appCtx.selected.multipleSelectedIds
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
		// this.mousePos.innerText = `Original X: ${event.offsetX}, Y: ${event.offsetY}`
		// this.transformedMousePos.innerText = `Transformed X: ${this.currentTransformedCursor.x}, Y: ${this.currentTransformedCursor.y}`

		const { ToRotateState, SelectedState, ToMoveState, DragBoxState, ViewState, PointerState } =
			this._machine.state
		const { NearbyLinesState, CreatePreviewState } = this._graphics.state
		const appSnapshot = this._machine.appSnapshot
		const graphicsSnapshot = this._graphics.snapshot

		// const machineState = this._machine.state

		/*		if (ToRotateState === TO_ROTATE_STATE.SINGLE_ROTATE_MODE_IN_PROGRESS) {
		 this._objRotating.rotateEntityViaMouse(event, true, currentPoint)
		 return
		 }*/

		if (appSnapshot.matches('ToRotateState.SingleRotateModeInProgress')) {
			this._objRotating.rotateEntityViaMouse(event, true, currentPoint)
			return
		}

		/*		if (ToRotateState === TO_ROTATE_STATE.SINGLE_ROTATE_IN_PROGRESS) {
		 this._objRotating.rotateEntityViaMouse(event, false, currentPoint)
		 return
		 }*/

		if (appSnapshot.matches('ToRotateState.SingleRotateInProgress')) {
			this._objRotating.rotateEntityViaMouse(event, false, currentPoint)
			return
		}

		/*		if (ToRotateState === TO_ROTATE_STATE.MULTIPLE_ROTATE_IN_PROGRESS) {
		 this._objRotating.rotateMultipleEntitiesViaMouse(event, currentPoint)
		 return
		 }*/

		if (appSnapshot.matches('ToRotateState.MultipleRotateInProgress')) {
			this._objRotating.rotateMultipleEntitiesViaMouse(event, currentPoint)
			return
		}

		/*		if (ToRotateState === TO_ROTATE_STATE.NO_ROTATE && rotatingKeysDown(event)) {
		 this._objRotating.handleSetEntitiesToRotate(event, currentPoint)
		 return
		 }*/

		if (appSnapshot.matches('ToRotateState.NoRotate') && rotatingKeysDown(event)) {
			this._objRotating.handleSetEntitiesToRotate(event, currentPoint)
			return
		}

		if (appSnapshot.matches('ViewState.ViewPositioningState.ViewDraggingInProgress')) {
			// if (ViewState === VIEW_STATE.VIEW_DRAGGING_IN_PROGRESS) {
			this._view.handleDragScreenMouseMove(event, currentPoint)
			return
		}

		if (appSnapshot.matches('DragBoxState.SelectionBoxInProgress')) {
			this._drag.selectionBoxMouseMove(event, currentPoint)
			return
		}

		/*		if (DragBoxState === DRAG_BOX_STATE.SELECTION_BOX_IN_PROGRESS) {
		 this._drag.selectionBoxMouseMove(event, currentPoint)
		 return
		 }*/

		/*		if (DragBoxState === DRAG_BOX_STATE.CREATION_BOX_IN_PROGRESS) {
		 this._drag.creationBoxMouseMove(event, currentPoint)
		 return
		 }*/

		if (appSnapshot.matches('DragBoxState.CreationBoxInProgress')) {
			this._drag.creationBoxMouseMove(event, currentPoint)
			return
		}

		const dragBoxAxisLineStart = this._machine.appCtx.dragBox.axisLineBoxStart
		if (dragBoxAxisLineStart) {
			this._drag.dragAxisLineMouseMove(event, currentPoint, dragBoxAxisLineStart)
			return
		}

		/*		if (ToMoveState === TO_MOVE_STATE.MULTIPLE_MOVE_IN_PROGRESS) {
		 this._objPositioning.multiSelectDraggingMouseMove(event)
		 return
		 }*/

		if (appSnapshot.matches('ToMoveState.MultipleMoveInProgress')) {
			this._objPositioning.multiSelectDraggingMouseMove(event)
			return
		}

		const multipleSelectedIds = this._machine.selectedCtx.multipleSelectedIds
		// const multipleSelectedIds = this._machine.appCtx.selected.multipleSelectedIds
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

		/*		if (ToMoveState === TO_MOVE_STATE.SINGLE_MOVE_IN_PROGRESS) {
		 this._objPositioning.singleToMoveMouseMove(event, currentPoint, appSnapshot, graphicsSnapshot)
		 return
		 }*/

		if (appSnapshot.matches('ToMoveState.SingleMoveInProgress')) {
			this._objPositioning.singleToMoveMouseMove(event, currentPoint, appSnapshot, graphicsSnapshot)
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
			const hoveringEntityId = this._machine.appCtx.pointer.hoveringEntityId
			if (hoveringEntityId === entityUnderMouse.id) return
			this._machine.sendEvent(
				new PointerHoverOverEntity({ id: entityUnderMouse.id, point: currentPoint }),
			)
			this._render.renderCanvasApp()
			// this._render.drawCanvas()
			return
		}

		if (PointerState === POINTER_STATE.HOVERING_OVER_ENTITY) {
			changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
			this._machine.sendEvent(new PointerLeaveEntity({ point: currentPoint }))
			this._render.renderCanvasApp()
			// this._render.drawCanvas()
			return
		}

		if (CreatePreviewState === CREATE_PREVIEW_STATE.CREATE_PREVIEW_ENABLED) {
			this._nearby.getDrawEntityPreview(
				event,
				currentPoint,
				NearbyLinesState,
				appSnapshot,
				graphicsSnapshot,
			)
			return
		}
	}

	/**
	 * Mouse Up handler
	 * @param event
	 * @param currentPoint
	 */

	onMouseUpHandler(event: PointerEvent, currentPoint: TransformedPoint) {
		const state = this._machine.state
		/*		state = {
		 DragBoxState: 'CreationBoxInProgress',
		 }*/
		// const state = state
		// state
		const { DragBoxState, ToMoveState, ViewState } = state
		const snapshot = this._machine.appSnapshot
		const matches = snapshot.matches
		// const matches = this._machine.matches

		/*		if (matches('ToMoveState')) {

		 }*/
		// const matches = snapshot.matches

		/*		if (matches('GridState.PreviewAxisState.None.ViewDraggingInProgress')) {

		 }*/

		if (this.mouseDownTimeOut) {
			console.log('mouseDownTimeOut', this.mouseDownTimeOut)
			clearTimeout(this.mouseDownTimeOut)
			this.mouseDownTimeOut = undefined
			this.mouseClickHandler(event, currentPoint, state, snapshot)
			return
		}

		// if (snapshot.matches(VIEW_STATE.VIEW_DRAGGING_IN_PROGRESS)) {
		if (snapshot.matches('ViewState.ViewPositioningState.ViewDraggingInProgress')) {
			// if (snapshot.matches('ViewState.ViewDraggingInProgress')) {
			console.log('snapshot.matches(ViewState.ViewDraggingInProgress)')
			this._view.handleDragScreenMouseUp(event)
			return
		}
		/*
		 if (this._machine.matches('ViewState.ViewDraggingInProgress')) {
		 this._view.handleDragScreenMouseUp(event)
		 return
		 }*/
		/*
		 if (ViewState === VIEW_STATE.VIEW_DRAGGING_IN_PROGRESS) {
		 this._view.handleDragScreenMouseUp(event)
		 return
		 }*/

		if (snapshot.matches('DragBoxState.SelectionBoxInProgress')) {
			this._drag.selectionBoxMouseUp(event, currentPoint)
			return
		}

		if (snapshot.matches('DragBoxState.CreationBoxInProgress')) {
			this._drag.creationBoxMouseUp(event, currentPoint)
			return
		}

		/*		if (DragBoxState === DRAG_BOX_STATE.SELECTION_BOX_IN_PROGRESS) {
		 this._drag.selectionBoxMouseUp(event, currentPoint)
		 return
		 }

		 if (DragBoxState === DRAG_BOX_STATE.CREATION_BOX_IN_PROGRESS) {
		 this._drag.creationBoxMouseUp(event, currentPoint)
		 return
		 }*/

		if (snapshot.matches('ToMoveState.SingleMoveInProgress')) {
			this._objPositioning.singleToMoveMouseUp(event, currentPoint)
			return
		}

		/*		if (ToMoveState === TO_MOVE_STATE.SINGLE_MOVE_IN_PROGRESS) {
		 this._objPositioning.singleToMoveMouseUp(event, currentPoint)
		 return
		 }*/

		if (snapshot.matches('ToMoveState.MultipleMoveInProgress')) {
			this._objPositioning.stopMultiSelectDragging(event)
			return
		}
		/*		if (ToMoveState === TO_MOVE_STATE.MULTIPLE_MOVE_IN_PROGRESS) {
		 this._objPositioning.stopMultiSelectDragging(event)
		 return
		 }*/

		this._render.renderCanvasApp()
		// this._render.drawCanvas()
	}

	/**
	 * Mouse Click handler
	 * @param event
	 * @param currentPoint
	 * @param state
	 * @param appSnapshot
	 * @private
	 */

	mouseClickHandler(
		event: PointerEvent,
		currentPoint: TransformedPoint,
		state: AppStateMatchesModel,
		appSnapshot: AppStateSnapshot,
	) {
		// console.log('mouseClickHandler', event)
		if (isWheelButton(event)) return

		if (appSnapshot.matches('ViewState.ContextMenuState.ContextMenuOpen')) {
			this._machine.sendEvent({ type: 'CloseContextMenu' })
			return
		}

		/*		if (isMenuOpen(this.menu)) {
		 this.menu.style.display = 'none'
		 return
		 }*/

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

		if (appSnapshot.matches('GridState.PreviewAxisState.AxisCreatePreviewInProgress')) {
			if (!event.altKey || !this._nearby.axisPreviewRect) {
				this._machine.sendEvent({ type: 'StopAxisPreview' })
				this._nearby.axisPreviewRect = undefined
				this._render.renderCanvasApp()
				// this._render.drawCanvas()
				return
			}

			const previewRectLocation = {
				x: this._nearby.axisPreviewRect.left,
				y: this._nearby.axisPreviewRect.top,
			}

			const entity = this._state.selected.selectedStringId
				? createPanel(previewRectLocation, this._state.selected.selectedStringId)
				: createPanel(previewRectLocation)
			this._state.entities.panels.addEntity(entity)
			this._nearby.axisPreviewRect = undefined
			this._machine.sendEvent({ type: 'StopAxisPreview' })

			this._render.renderCanvasApp()
			// this._render.drawCanvas()
			return
		}

		const location = getTopLeftPointFromTransformedPoint(
			currentPoint,
			SizeByType[ENTITY_TYPE.Panel],
		)
		// const isStringSelected = !!this._state.selected.selectedStringId
		// const isStringSelected = !!this._selected.selectedStringId
		const selectedStringId = this._machine.selectedCtx.selectedStringId
		const entity = selectedStringId
			? // const entity = this._machine.appCtx.selected.selectedStringId
			  // const entity = this._state.selected.selectedStringId
			  createPanel(location, selectedStringId)
			: createPanel(location)
		this._state.entities.panels.addEntity(entity)

		this._render.renderCanvasApp()
		// this._render.drawCanvas()
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
		if (entityUnderMouse) {
			if (!isPanel(entityUnderMouse)) return
			if (entityUnderMouse.stringId === UndefinedStringId) return
			const belongsToString = this._state.entities.strings
				.getEntities()
				.find((string) => string.id === entityUnderMouse.stringId)

			assertNotNull(belongsToString, 'string not found')
			this._machine.sendStateEvent(STATE_MACHINE.SELECTED, {
				type: 'SetSelectedString',
				payload: { stringId: belongsToString.id },
			})
			/*			this._machine.sendEvent({
			 type: 'SetSelectedString',
			 payload: { stringId: belongsToString.id },
			 })*/
		}
	}

	/**
	 * Wheel Scroll handler
	 * @param event
	 * @private
	 */

	wheelScrollHandler(event: WheelEvent) {
		const appSnapshot = this._machine.appSnapshot
		if (appSnapshot.matches('ViewState.ContextMenuState.ContextMenuOpen')) {
			this._machine.sendEvent({ type: 'CloseContextMenu' })
		}

		const currentScaleX = this.ctx.getTransform().a

		const zoom = event.deltaY < 0 ? 1.1 : 0.9

		const currentTransformedCursor = this._domPoint.getTransformedPointFromEventOffsets(event)
		this.ctx.translate(currentTransformedCursor.x, currentTransformedCursor.y)
		this.ctx.scale(zoom, zoom)
		this.ctx.translate(-currentTransformedCursor.x, -currentTransformedCursor.y)
		this.scaleElement.innerText = `Scale: ${currentScaleX}`

		this._render.renderCanvasApp()
		// this._render.drawCanvas()
		event.preventDefault()
	}

	/**
	 * Context Menu handler
	 * @param event
	 * @param currentPoint
	 * @private
	 */

	contextMenuHandler(event: PointerEvent, currentPoint: TransformedPoint) {
		// const appSnapshot = this._machine.appSnapshot
		const selectedSnapshot = this._machine.selectedSnapshot

		const entityUnderMouse = this.getEntityUnderMouse(event)
		if (entityUnderMouse) {
			const x = event.offsetX + entityUnderMouse.width / 2
			const y = event.offsetY + entityUnderMouse.height / 2
			this._machine.sendEvent({
				type: 'OpenContextMenu',
				payload: {
					id: entityUnderMouse.id,
					type: 'SingleEntity',
					x,
					y,
				},
			})
		}

		if (selectedSnapshot.matches('EntitySelectedState.EntitiesSelected')) {
			const panelsInArea = this._state.entities.panels.getEntitiesByIds(
				this._machine.selectedCtx.multipleSelectedIds, // this._machine.appCtx.selected.multipleSelectedIds,
			)
			const selectionBoxBounds = getCompleteBoundsFromMultipleEntitiesWithPadding(panelsInArea, 10)
			const clickInBounds = isPointInsideBounds(currentPoint, selectionBoxBounds)
			if (clickInBounds) {
				this._machine.sendEvent({
					type: 'OpenContextMenu',
					payload: {
						id: 'multiple',
						type: 'MultipleEntities',
						x: event.offsetX,
						y: event.offsetY,
					},
				})
			}
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
				this._selected.clearSelectedInOrder()
				this._render.renderCanvasApp()
				// this._render.drawCanvas()
				// this._selected.clearSelectedState()
				break
			case KEYS.X:
				{
					const multipleSelectedIds = this._machine.selectedCtx.multipleSelectedIds
					// const multipleSelectedIds = this._machine.appCtx.selected.multipleSelectedIds
					// const multipleSelectedIds = this._state.selected.multipleSelectedIds
					if (multipleSelectedIds.length <= 1) return
					const name = genStringNameV2(this._state.entities.strings.getEntities())
					const string = createString(name)

					const entities = this._state.entities.panels.getEntitiesByIds(multipleSelectedIds)
					const panels = entities.filter((entity) => entity.type === 'panel') as CanvasPanel[]
					const panelUpdates = panels.map((panel) =>
						updateObjectByIdForStore<CanvasPanel>(panel.id, { stringId: string.id }),
					)
					// const { string, panelUpdates } = createStringWithPanels(this._state, multipleSelectedIds)
					this._state.entities.strings.addEntity(string)
					this._state.entities.panels.updateManyEntities(panelUpdates)

					// this._machine.sendEvent({ type: 'ClearSelectedState' })
					this._machine.sendEvent({ type: 'SetSelectedString', payload: { stringId: string.id } })
					this._render.renderCanvasApp()
					// this._render.drawCanvas()
				}
				break
			case KEYS.R:
				{
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
				// const { GridState } = this._machine.state
				// GridState
				this._machine.sendEvent({ type: 'ToggleClickMode' })
				/*				switch (GridState.ModeState) {
				 case MODE_STATE.IN_SELECT_MODE:
				 this._machine.sendEvent(new StartClickCreateMode())
				 break
				 case MODE_STATE.IN_CREATE_MODE:
				 this._machine.sendEvent(new StartClickSelectMode())
				 break
				 default:
				 throw new Error('Unknown grid state')
				 }*/
				return
			}
			case KEYS.M:
				{
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