import {
	creationBoxMouseMove,
	creationBoxMouseUp,
	dragBoxOnMouseDownHandler,
	dragBoxOnMouseMoveHandler,
	dragBoxOnMouseUpHandler,
	handlePinchToZoom,
	isReadyForPinchToZoom,
	selectionBoxMouseMove,
	selectionBoxMouseUp,
	setupCanvas,
} from '../utils'
import { Directive, ElementRef, inject, NgZone, OnInit, Renderer2 } from '@angular/core'
import {
	ContextMenuEvent,
	CURSOR_TYPE,
	DoubleClickEvent,
	EVENT_TYPE,
	Gesture,
	getCurrentPlatform,
	PLATFORM,
	Platform,
	Point,
	TransformedPoint,
} from '@shared/data-access/models'
import { assertNotNull, getCenter, getDistance, OnDestroyDirective } from '@shared/utils'
import {
	CanvasElementService,
	injectAppStateStore,
	isNoDragBoxState,
	MODE_STATE,
} from '@canvas/app/data-access'
import { GraphicsStoreService } from '@canvas/graphics/data-access'
import {
	DomPointService,
	NearbyService,
	ObjectPositioningService,
	ObjectPositioningStoreService,
	ObjectRotatingService,
} from '@canvas/object-positioning/data-access'
import { injectSelectedStore, SelectedService } from '@canvas/selected/data-access'
import {
	EntityFactoryService,
	EntityStoreService,
	PanelLinksService,
	PanelLinksStoreService,
} from '@entities/data-access'
import { ViewPositioningService } from '@canvas/view-positioning/data-access'
import { RenderService } from '@canvas/rendering/data-access'
import { CONTEXT_MENU_COMPONENT, UiStoreService } from '@overlays/ui-store/data-access'
import { KeyEventsService } from '@canvas/keys/data-access'
import {
	changeCanvasCursor,
	dragBoxKeysDown,
	draggingScreenKeysDown,
	eventToPointLocation,
	getBoundsFromCenterPoint,
	getCompleteBoundsFromMultipleEntitiesWithPadding,
	isContextMenu,
	isDraggingEntity,
	isEntityOverlappingWithBounds,
	isPointInsideBounds,
	isPointInsideEntity,
	isPointInsidePanelSymbols,
	isPointInsidePanelSymbolsV2,
	isPointInsideStretchedEntityByValue,
	isReadyToMultiDrag,
	isWheelButton,
	multiSelectDraggingKeysDownAndIdsNotEmpty,
	rotatingKeysDown,
	singleTouchEventToPointLocation,
} from '@canvas/utils'
import { isPanel, isPointInsideSelectedStringPanelsByStringIdNgrxWithPanels } from '@entities/utils'
import {
	CanvasEntity,
	ENTITY_TYPE,
	PanelModel,
	SizeByType,
	UndefinedStringId,
} from '@entities/shared'

@Directive({
	selector: '[appDesignCanvas]',
	providers: [OnDestroyDirective],
	standalone: true,
})
export class DesignCanvasDirective implements OnInit {
	private _appState = injectAppStateStore()
	// private _appState = inject(AppStateStoreService)
	private _graphicsState = inject(GraphicsStoreService)
	private _positioningStore = inject(ObjectPositioningStoreService)
	private _selectedStore = injectSelectedStore()
	// private _selectedStore = inject(SelectedStoreService)
	private canvas = inject(ElementRef<HTMLCanvasElement>).nativeElement
	private ctx!: CanvasRenderingContext2D
	private _ngZone = inject(NgZone)
	private _renderer = inject(Renderer2)
	private _canvasEl = inject(CanvasElementService)
	private _panelLinks = inject(PanelLinksService)
	private _panelLinksStore = inject(PanelLinksStoreService)
	private _objRotating = inject(ObjectRotatingService)
	private _objPositioning = inject(ObjectPositioningService)
	private _entityFactory = inject(EntityFactoryService)
	private _view = inject(ViewPositioningService)
	private _render = inject(RenderService)
	private _entities = inject(EntityStoreService)
	private _uiStore = inject(UiStoreService)
	// private _entities = inject(EntityStoreService)
	private _selected = inject(SelectedService)
	private _nearby = inject(NearbyService)
	private _domPoint = inject(DomPointService)
	private _keys = inject(KeyEventsService)

	private mouseDownTimeOut: ReturnType<typeof setTimeout> | undefined
	// private _divElements = inject(DivElementsService)
	private mouseDownTimeOutForMove: ReturnType<typeof setTimeout> | undefined
	private mouseUpTimeOut: ReturnType<typeof setTimeout> | undefined
	private fpsEl!: HTMLDivElement
	private canvasMenu!: HTMLDivElement
	private mousePos!: HTMLDivElement
	private transformedMousePos!: HTMLDivElement
	private scaleElement!: HTMLDivElement
	private stringStats!: HTMLDivElement
	private panelStats!: HTMLDivElement
	private menu!: HTMLDivElement
	private keyMap!: HTMLDivElement
	private mouseDownTimeOutFn = () => {
		this.mouseDownTimeOut = setTimeout(() => {
			clearTimeout(this.mouseDownTimeOut)
			this.mouseDownTimeOut = undefined
		}, 300)
		this.mouseDownTimeOutForMove = setTimeout(() => {
			clearTimeout(this.mouseDownTimeOutForMove)
			this.mouseDownTimeOutForMove = undefined
		}, 100)
	}
	private mouseUpTimeOutFn = () => {
		this.mouseUpTimeOut = setTimeout(() => {
			this.mouseUpTimeOut = undefined
		}, 50)
	}

	private get allPanels() {
		return this._entities.panels.allPanels
	}

	private get allStrings() {
		return this._entities.strings.allStrings
	}

	platform: Platform = getCurrentPlatform()
	currentTransformedCursor!: TransformedPoint
	rawMousePos: Point = { x: 0, y: 0 }
	currentPoint: TransformedPoint = { x: 0, y: 0 } as TransformedPoint
	panelPressed: PanelModel | undefined

	touchStartTimeOut: ReturnType<typeof setTimeout> | undefined
	touchStartTimeOutFn = () => {
		this.touchStartTimeOut = setTimeout(() => {
			clearTimeout(this.touchStartTimeOut)
			this.touchStartTimeOut = undefined
		}, 300)
	}
	touchHolding = false
	gesture: Gesture = {
		pointers: new Map(),
		lastCenter: null,
		initialCenter: null,
		initialDistance: null,
		initialScale: null,
		lastDistance: null,
	}

	clearGesture() {
		this.gesture = {
			pointers: new Map(),
			lastCenter: null,
			initialCenter: null,
			initialDistance: null,
			initialScale: null,
			lastDistance: null,
		}
	}

	/**
	 * ! Lifecycle Hooks
	 */

	ngOnInit() {
		this.setupCanvas()
		this.fpsEl = document.getElementById('fps') as HTMLDivElement
		this.scaleElement = document.getElementById('scale-element') as HTMLDivElement
		this._ngZone.runOutsideAngular(() => {
			this.setupEventListenersBasedOnPlatform()
			// this.setupEventListeners()
		})
		/*		this.canvasMenu = document.getElementById('canvas-menu') as HTMLDivElement
		 this.mousePos = document.getElementById('mouse-pos') as HTMLDivElement
		 this.transformedMousePos = document.getElementById('transformed-mouse-pos') as HTMLDivElement
		 this.stringStats = document.getElementById('string-stats') as HTMLDivElement
		 this.panelStats = document.getElementById('panel-stats') as HTMLDivElement
		 this.menu = document.getElementById('menu') as HTMLDivElement
		 this.keyMap = document.getElementById('key-map') as HTMLDivElement*/
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
		if (isContextMenu(event)) {
			return
		}
		this.mouseDownTimeOutFn()
		if (draggingScreenKeysDown(event)) {
			this._view.handleDragScreenMouseDown(event, currentPoint)
			return
		}

		if (dragBoxKeysDown(event)) {
			dragBoxOnMouseDownHandler(currentPoint, this._appState)
			return
		}

		const multipleSelectedIds = this._selectedStore.state.multipleSelectedPanelIds
		if (multiSelectDraggingKeysDownAndIdsNotEmpty(event, multipleSelectedIds)) {
			this._objPositioning.multipleEntitiesToMoveMouseDown(event, multipleSelectedIds)
			return
		}

		this.panelPressed = this.getPanelUnderMouse(event)
	}

	/**
	 * Mouse Move handler
	 * @param event
	 * @param currentPoint
	 */

	onMouseMoveHandler(event: PointerEvent, currentPoint: TransformedPoint) {
		if (this.mouseDownTimeOutForMove) {
			console.log('mouseDownTimeOutForMove', this.mouseDownTimeOutForMove)
			// clearTimeout(this.mouseDownTimeOut)
			// this.mouseDownTimeOut = undefined
			// this.mouseClickHandler(event, currentPoint)
			return
		}
		this.currentTransformedCursor = currentPoint

		/**
		 * ! Object Positioning
		 */

		const rotateEntityState = this._positioningStore.state.rotateEntityState

		if (rotateEntityState === 'RotatingSingleEntity') {
			this._objRotating.rotateEntityViaMouse(event, true, currentPoint)
			return
		}

		if (rotateEntityState === 'RotatingMultipleEntities') {
			this._objRotating.rotateMultipleEntitiesViaMouse(event, currentPoint)
			return
		}
		if (rotateEntityState === 'RotatingNone' && rotatingKeysDown(event)) {
			this._objRotating.handleSetEntitiesToRotate(event, currentPoint)
			return
		}

		const moveEntityState = this._positioningStore.state.moveEntityState

		if (moveEntityState === 'MovingMultipleEntities') {
			changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
			this._objPositioning.multipleEntitiesToMoveMouseMove(event)
			return
		}

		const multipleSelectedIds = this._selectedStore.state.multipleSelectedPanelIds
		if (multiSelectDraggingKeysDownAndIdsNotEmpty(event, multipleSelectedIds)) {
			this._objPositioning.setMultipleEntitiesToMove(event, multipleSelectedIds)
			this._objPositioning.multipleEntitiesToMoveMouseMove(event)
			return
		}

		if (isReadyToMultiDrag(event, multipleSelectedIds)) {
			changeCanvasCursor(this.canvas, CURSOR_TYPE.GRAB)
			this._render.renderCanvasApp()
			return
		} else if (this.canvas.style.cursor === CURSOR_TYPE.GRAB) {
			changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
			this._render.renderCanvasApp()
			return
		}

		if (moveEntityState === 'MovingSingleEntity') {
			// changeCanvasCursor(this.canvas, CURSOR_TYPE.NONE)
			this._objPositioning.singleEntityToMoveMouseMove(event, currentPoint)
			/*			this._renderer.removeStyle(this.canvas, 'cursor')
			 this._renderer.setStyle(this.canvas, 'cursor', CURSOR_TYPE.GRABBING)
			 // this._renderer.setStyle(document, 'cursor', CURSOR_TYPE.GRABBING)
			 /!*			changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
			 this.canvas.getBoundingClientRect()
			 this.canvas.getBoundingClientRect()
			 this.canvas.getBoundingClientRect()
			 this.canvas.getBoundingClientRect()
			 this.canvas.getBoundingClientRect()
			 this.canvas.getBoundingClientRect()
			 this.canvas.getBoundingClientRect()*!/
			 // this.canvas.offsetWidth*/
			return
		}

		if (this.panelPressed && isDraggingEntity(event, this.panelPressed.id)) {
			this._objPositioning.setSingleToMoveEntity(event, this.panelPressed.id)
			this.panelPressed = undefined
			return
		}

		const { view, dragBox, mode, pointer } = this._appState.appState()
		// const appState = this._appState.state

		if (view === 'ViewDraggingInProgress') {
			this._view.handleDragScreenMouseMove(event, currentPoint)
			return
		}

		if (dragBox.state === 'SelectionBoxInProgress') {
			// this._drag.selectionBoxMouseMove(event, currentPoint)
			const renderOptions = selectionBoxMouseMove(
				event,
				currentPoint,
				dragBox.start,
				this._appState, // this._entities.panels.allPanels,
			)
			if (renderOptions) this._render.renderCanvasApp(renderOptions)
			return
		}

		if (dragBox.state === 'CreationBoxInProgress') {
			// this._drag.creationBoxMouseMove(event, currentPoint)
			const renderOptions = creationBoxMouseMove(
				event,
				currentPoint,
				dragBox.start,
				this._entities.panels.allPanels,
				this._appState,
			)
			if (renderOptions) this._render.renderCanvasApp(renderOptions)
			return
		}

		/*		if (appState.view === 'ViewDraggingInProgress') {
		 this._view.handleDragScreenMouseMove(event, currentPoint)
		 return
		 }

		 if (appState.dragBox === 'SelectionBoxInProgress') {
		 this._drag.selectionBoxMouseMove(event, currentPoint)
		 return
		 }

		 if (appState.dragBox === 'CreationBoxInProgress') {
		 this._drag.creationBoxMouseMove(event, currentPoint)
		 return
		 }*/

		// TODO - fix
		/*		const dragBoxAxisLineStart = this._app.appCtx.dragBox.axisLineBoxStart
		 if (dragBoxAxisLineStart) {
		 this._drag.dragAxisLineMouseMove(event, currentPoint, dragBoxAxisLineStart)
		 return
		 }*/

		if (mode === MODE_STATE.LINK_MODE) {
			const renderOptions = this._panelLinks.handleLinkModeMouseMove(event, currentPoint, pointer)
			if (renderOptions) return this._render.renderCanvasApp(renderOptions)
		}

		const entityUnderMouse = this.getPanelUnderMouse(event)
		if (entityUnderMouse) {
			const hoveringEntityId = pointer.hoveringOverPanelId
			if (hoveringEntityId === entityUnderMouse.id) return
			this._appState.setHoveringOverEntityState(entityUnderMouse.id)
			this._render.renderCanvasApp()
			return
		}

		if (pointer.hoverState === 'HoveringOverEntity') {
			changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
			this._appState.liftHoveringOverEntity()
			this._render.renderCanvasApp()
			return
		}
		/*
		 this._render.renderCanvasApp({
		 transformedPoint: this.rawMousePos,
		 })
		 return*/

		const graphicsState = this._graphicsState.state

		if (graphicsState.createPreview) {
			// if (graphicsState.createPreview === 'CreatePreviewEnabled') {
			this._nearby.getDrawEntityPreviewV2Ngrx(event, currentPoint)
			return
		}
	}

	/**
	 * Mouse Up handler
	 * @param event
	 * @param currentPoint
	 */

	onMouseUpHandler(event: PointerEvent, currentPoint: TransformedPoint) {
		if (this.mouseDownTimeOut) {
			console.log('mouseDownTimeOut', this.mouseDownTimeOut)
			clearTimeout(this.mouseDownTimeOut)
			this.mouseDownTimeOut = undefined
			this.mouseClickHandler(event, currentPoint)
			return
		}
		console.log('onMouseUpHandler', this.mouseDownTimeOut)

		/**
		 * ! Object Positioning
		 */

		const moveEntityState = this._positioningStore.state.moveEntityState

		if (moveEntityState === 'MovingSingleEntity') {
			this._objPositioning.singleEntityToMoveMouseUp(event, currentPoint)
			return
		}

		if (moveEntityState === 'MovingMultipleEntities') {
			this._objPositioning.stopMultipleEntitiesToMove(event)
			return
		}

		const { view, dragBox, mode } = this._appState.appState()

		/**
		 * ! View Positioning
		 */
		if (view === 'ViewDraggingInProgress') {
			this._view.handleDragScreenMouseUp()
			return
		}

		/**
		 * ! Drag Box
		 */

		// const dragBoxState = this._appState.state.dragBox

		if (dragBox.state === 'SelectionBoxInProgress') {
			selectionBoxMouseUp(
				currentPoint,
				dragBox.start,
				this._entities.panels.allPanels,
				this._appState,
				this._selectedStore,
			)
			return
		}

		if (dragBox.state === 'CreationBoxInProgress') {
			creationBoxMouseUp(
				currentPoint,
				dragBox.start,
				this._entities.panels.allPanels,
				this._appState,
				this._entities.panels,
			)
			return
		}

		/*		if (mode === 'LinkMode') {
		 const mouseDownOnPanelPolaritySymbol =
		 this._entities.panelLinks.getMouseDownOnPanelPolaritySymbol
		 if (mouseDownOnPanelPolaritySymbol) {
		 this._panelLinks.handleMouseUpFromPanelPolaritySymbol(
		 event,
		 currentPoint,
		 mouseDownOnPanelPolaritySymbol,
		 )
		 }

		 // this._panelLinks.handleMouseUpInLinkMode(event, currentPoint)
		 return
		 }*/

		this._render.renderCanvasApp()
	}

	/**
	 * Mouse Click handler
	 * @param event
	 * @param currentPoint
	 */

	mouseClickHandler(event: PointerEvent, currentPoint: TransformedPoint) {
		if (isWheelButton(event)) return
		if (this._uiStore.contextMenu.contextMenuOpen) {
			// this._uiStore.dispatch.closeContextMenu()
			return
		}

		/*		const contextMenuState = this._appState.state.contextMenu

		 if (contextMenuState.state === 'ContextMenuOpen') {
		 this._appState.dispatch.setContextMenuState('NoContextMenu')
		 return
		 }*/

		if (this._positioningStore.state.rotateEntityState !== 'RotatingNone') {
			this._objRotating.clearEntityToRotate()
			return
		}

		if (this._positioningStore.state.moveEntityState !== 'MovingNone') {
			this._objPositioning.resetObjectPositioning(event, currentPoint)
			return
		}
		const { mode } = this._appState.appState()
		// const mode = this._appState.state.mode
		if (mode === 'LinkMode') {
			/*const currentDrawingSymbolLine = this._entities.panelLinks.drawingPanelPolaritySymbolLine
			 const symbolUnderMouse = this.getPanelSymbolUnderMouse(currentPoint)
			 if (symbolUnderMouse) {
			 if (currentDrawingSymbolLine) {
			 this._panelLinks.handleMouseUpFromPanelPolaritySymbol(
			 event,
			 currentPoint,
			 currentDrawingSymbolLine,
			 )
			 } else {
			 this._entities.panelLinks.setDrawingPanelPolaritySymbolLine(symbolUnderMouse)
			 }
			 return
			 } else if (currentDrawingSymbolLine) {
			 this._entities.panelLinks.clearDrawingPanelPolaritySymbolLine()
			 return
			 }*/
			/*			const symbolOrPanel = this.getPanelOrLinkSymbolUnderMouse(currentPoint)
			 if (symbolOrPanel) {
			 // console.log('symbolOrPanel', symbolOrPanel)
			 if (isPanelSymbol(symbolOrPanel)) {
			 const { panelId, symbol } = symbolOrPanel
			 this._entities.panelLinks.setHoveringOverPanelPolaritySymbol(panelId, symbol)
			 return
			 } else {
			 if (this._entities.panelLinks.hoveringOverPanelPolaritySymbol) {
			 this._entities.panelLinks.clearHoveringOverPanelPolaritySymbol()
			 return
			 }
			 }

			 // this._panelLinks.isMouseOverLinkPathV4(event, currentPoint, symbolOrPanel)
			 // return
			 }*/
		}
		// todo: move to mode handler
		/*		if (mode === 'LinkMode') {
		 if (isPanel(entityUnderMouse)) {
		 this._panelLinks.handlePanelLinksClick(event, entityUnderMouse)
		 return
		 }
		 this._appState.dispatch.setModeState('SelectMode')
		 // this._panelLinks.clearPanelLinkRequest()
		 return
		 }*/
		const entityUnderMouse = this.getPanelUnderMouse(currentPoint)
		if (entityUnderMouse) {
			if (mode === 'SelectMode') {
				this._selected.handleEntityUnderMouse(event, entityUnderMouse)
				return
			}
			if (mode == 'CreateMode') {
				this._appState.setModeState('SelectMode')
				this._selected.handleEntityUnderMouse(event, entityUnderMouse)
				return
			}

			if (mode === 'LinkMode') {
				if (isPanel(entityUnderMouse)) {
					this._panelLinks.handlePanelLinksClick(event, entityUnderMouse)
					return
				}
				this._appState.setModeState('SelectMode')
				// this._panelLinks.clearPanelLinkRequest()
				return
			}

			/*	// todo move link mode method to strings or selected
			 if (this._selectedStore.selectedStringId) {
			 // this._entities.panelLinks.set(entityUnderMouse.id)
			 return
			 }*/

			// }
			/*			this._selected.handleEntityUnderMouse(event, entityUnderMouse)
			 console.log('entityUnderMouse', entityUnderMouse)
			 return*/
		}

		if (mode === 'LinkMode') {
			this._panelLinks.handleLinkModeClickOnCanvas(event, currentPoint)
			return
			/*			const isMouseOverLinkPath = this._panelLinks.isMouseOverLinkPath(event, currentPoint)
			 if (isMouseOverLinkPath) {
			 // this._panelLinks.handleLinkPathClick(event, currentPoint)
			 return
			 }*/
		}

		if (this._panelLinksStore.state.requestingLink) {
			this._panelLinks.clearPanelLinkRequest()
			return
		}

		// const selectedSnapshot = this._app.selectedSnapshot
		this._selected.handleNotClickedOnEntity()
		if (this.anyEntitiesNearAreaOfClick(event)) {
			return
		}

		this._entityFactory.createEntity(event, currentPoint)

		/*	const previewAxisState = this._appState.state.previewAxis
		 if (previewAxisState === 'AxisCreatePreviewInProgress') {
		 if (!event.altKey || !this._nearby.axisPreviewRect) {
		 this._appState.dispatch.setPreviewAxisState('None')
		 this._nearby.axisPreviewRect = undefined
		 this._render.renderCanvasApp()
		 return
		 }

		 const previewRectLocation = {
		 x: this._nearby.axisPreviewRect.left,
		 y: this._nearby.axisPreviewRect.top,
		 }

		 const selectedStringId = this._selectedStore.state.selectedStringId
		 const entity = selectedStringId
		 ? createPanel(previewRectLocation, selectedStringId)
		 : createPanel(previewRectLocation)
		 this._entities.panels.addPanel(entity)
		 this._nearby.axisPreviewRect = undefined
		 this._appState.dispatch.setPreviewAxisState('None')

		 this._render.renderCanvasApp()
		 return
		 }

		 const location = getTopLeftPointFromTransformedPoint(
		 currentPoint,
		 SizeByType[ENTITY_TYPE.Panel],
		 )
		 const selectedStringId = this._selectedStore.state.selectedStringId
		 const entity = selectedStringId
		 ? createPanel(location, selectedStringId)
		 : createPanel(location)
		 this._entities.panels.addPanel(entity)

		 this._render.renderCanvasApp()*/
	}

	/**
	 * Double Click handler
	 * @param event
	 * @param currentPoint
	 * @private
	 */

	doubleClickHandler(event: PointerEvent, currentPoint: TransformedPoint) {
		console.log('double click', event)
		const entityUnderMouse = this.getPanelUnderMouse(currentPoint)
		if (entityUnderMouse) {
			// if (!isPanel(entityUnderMouse)) return

			if (entityUnderMouse.stringId === UndefinedStringId) return
			const selectedStringId = this._selectedStore.selectedStringId
			const belongsToString = this._entities.strings.getById(entityUnderMouse.stringId)

			if (!belongsToString) return
			this._selectedStore.selectString(belongsToString.id)
			this._render.renderCanvasApp()
		}
	}

	/**
	 * Wheel Scroll handler
	 * @param event
	 * @private
	 */

	wheelScrollHandler(event: WheelEvent) {
		if (this._uiStore.contextMenu.contextMenuOpen) {
			this._uiStore.dispatch.closeContextMenu()
			return
		}

		const currentScaleX = this.ctx.getTransform().a

		const zoom = event.deltaY < 0 ? 1.1 : 0.9

		const currentTransformedCursor = this._domPoint.getTransformedPointFromEventOffsets(event)
		this.ctx.translate(currentTransformedCursor.x, currentTransformedCursor.y)
		this.ctx.scale(zoom, zoom)
		this.ctx.translate(-currentTransformedCursor.x, -currentTransformedCursor.y)
		this.scaleElement.innerText = `Scale: ${currentScaleX.toFixed(1)}`

		this._render.renderCanvasApp()
		// event.preventDefault()
	}

	/**
	 * Context Menu handler
	 * @param event
	 * @param currentPoint
	 * @private
	 */

	contextMenuHandler(event: PointerEvent, currentPoint: TransformedPoint) {
		const entityUnderMouse = this.getPanelUnderMouse(event)
		if (entityUnderMouse) {
			const x = event.offsetX + entityUnderMouse.width / 2
			const y = event.offsetY + entityUnderMouse.height / 2
			this._uiStore.dispatch.openContextMenu({
				component: CONTEXT_MENU_COMPONENT.SINGLE_PANEL_MENU,
				location: { x, y },
				data: {
					panelId: entityUnderMouse.id,
				},
			})
			return
		}

		const { mode } = this._appState.appState()
		if (mode === 'LinkMode') {
			const panelLinkUnderMouse = this._panelLinks.isMouseOverLinkPath(event, currentPoint)
			if (panelLinkUnderMouse) {
				this._uiStore.dispatch.openContextMenu({
					component: CONTEXT_MENU_COMPONENT.PANEL_LINK_MENU,
					location: {
						x: event.offsetX,
						y: event.offsetY,
					},
					data: {
						panelLinkId: panelLinkUnderMouse.id,
					},
				})
				this._selected.clearSingleOrMultipleSelected()
				return
			}
		}

		const selectedStringId = this._selectedStore.state.selectedStringId
		if (selectedStringId) {
			const selectedStringPanels = this._entities.panels.getByStringId(selectedStringId) ?? []
			const pointInsideSelectedStringPanels =
				isPointInsideSelectedStringPanelsByStringIdNgrxWithPanels(
					selectedStringPanels,
					selectedStringId,
					currentPoint,
				)
			if (pointInsideSelectedStringPanels) {
				assertNotNull(selectedStringId)
				this._uiStore.dispatch.openContextMenu({
					component: CONTEXT_MENU_COMPONENT.STRING_MENU,
					location: {
						x: event.offsetX,
						y: event.offsetY,
					},
					data: {
						stringId: selectedStringId,
					},
				})
				return
			}
		}

		if (this._selectedStore.state.multipleSelectedPanelIds.length > 0) {
			const selectedPanels = this._entities.panels.getByIds(
				this._selectedStore.state.multipleSelectedPanelIds,
			)
			const selectionBoxBounds = getCompleteBoundsFromMultipleEntitiesWithPadding(
				selectedPanels,
				10,
			)
			const clickInBounds = isPointInsideBounds(currentPoint, selectionBoxBounds)
			if (clickInBounds) {
				const selectedPanelIds = selectedPanels.map((panel) => panel.id)
				this._uiStore.dispatch.openContextMenu({
					component: CONTEXT_MENU_COMPONENT.MULTIPLE_PANELS_MENU,
					location: {
						x: event.offsetX,
						y: event.offsetY,
					},
					data: {
						panelIds: selectedPanelIds,
					},
				})
			}
			return
		}
	}

	/**
	 * * Touch Start handler
	 */
	onTouchStartHandler(event: TouchEvent) {
		// * If there is only one touch, handle as a click
		if (event.touches.length === 1) {
			this.gesture.pointers.clear()
			const touch = event.touches[0]
			const pointerId = touch.identifier
			this.gesture.pointers.set(pointerId, {
				x: touch.clientX,
				y: touch.clientY,
			})
			this.rawMousePos = singleTouchEventToPointLocation(event)
			this.currentPoint = this._domPoint.getTransformedPointFromSingleTouchEvent(event)
			// this.touchStartTimeOutFn()
			return
		}

		// * If there are two touches, handle as a gesture
		for (let i = 0; i < event.touches.length; i++) {
			const touch = event.touches[i]
			const pointerId = touch.identifier
			this.gesture.pointers.set(pointerId, {
				x: touch.clientX,
				y: touch.clientY,
			})
		}

		if (this.gesture.pointers.size === 2) {
			this.gesture.initialCenter = getCenter(this.gesture.pointers)
			this.gesture.lastCenter = this.gesture.initialCenter
			this.gesture.initialScale = this.ctx.getTransform().a
			this.gesture.initialDistance = getDistance(Array.from(this.gesture.pointers.values()))
			this.gesture.lastDistance = this.gesture.initialDistance
		}
	}

	/**
	 * * Touch move handler
	 */
	onTouchMoveHandler(event: TouchEvent) {
		this.rawMousePos = singleTouchEventToPointLocation(event)
		this.currentPoint = this._domPoint.getTransformedPointFromSingleTouchEvent(event)

		// * Handle pinch to zoom
		const gesture = this.gesture
		if (isReadyForPinchToZoom(gesture)) {
			const zoomed = handlePinchToZoom(event, this.ctx, gesture)
			if (!zoomed) {
				this.clearGesture()
				return
			}

			this._render.renderCanvasApp()
			return
		}

		// * Handle touch hold
		if (gesture.pointers.size === 1) {
			const touch = event.touches[0]
			const pointerId = touch.identifier
			const pointer = gesture.pointers.get(pointerId)
			if (!pointer) {
				this.touchHolding = false
				console.error('Pointer not found')
				return
			}
			if (this.touchHolding) {
				this.singleTouchHoldHandler(event, this.currentPoint)
				return
			}
			setTimeout(() => {
				if (this.gesture.pointers.get(pointerId)) {
					this.touchHolding = true
					this.singleTouchHoldHandler(event, this.currentPoint)
				}
			}, 50)
		}
	}

	/**
	 * * Single touch hold handler
	 */
	singleTouchHoldHandler(event: TouchEvent, currentPoint: TransformedPoint) {
		const touch = event.touches[0]
		const pointerId = touch.identifier
		const pointer = this.gesture.pointers.get(pointerId)
		if (!pointer) {
			console.error('Pointer not found')
			return
		}
		// this.rawMousePos = singleTouchEventToPointLocation(event)
		// this.currentPoint = this._domPoint.getTransformedPointFromSingleTouchEvent(event)
		// const currentPoint = this.currentPoint

		// * Handle move single entity
		const moveEntityState = this._positioningStore.state.moveEntityState
		const panelUnderMouse = this.getPanelUnderMouse(this.currentPoint)
		if (panelUnderMouse && moveEntityState !== 'MovingSingleEntity') {
			this._objPositioning.setSingleToMoveEntity(event, panelUnderMouse.id)
			this._objPositioning.singleEntityToMoveMouseMove(event, currentPoint)
			return
		}
		if (moveEntityState === 'MovingSingleEntity') {
			this._objPositioning.singleEntityToMoveMouseMove(event, currentPoint)
			return
		}

		// * Handle drag box
		const dragBox = this._appState.dragBox()
		if (dragBox.state === 'NoDragBox') {
			dragBoxOnMouseDownHandler(currentPoint, this._appState)
		}
		if (isNoDragBoxState(dragBox)) return
		const start = dragBox.start
		const renderOptions = dragBoxOnMouseMoveHandler(
			event,
			currentPoint,
			start,
			this._entities.panels.allPanels,
			this._appState,
		)
		if (renderOptions) {
			this._render.renderCanvasApp(renderOptions)
		}
	}

	/**
	 * * Touch end handler
	 */

	onTouchEndHandler(event: TouchEvent) {
		if (this.gesture.pointers.size === 0) {
			this.clearGesture()
			return
		}

		// * Handle touch drag box
		const dragBox = this._appState.dragBox()
		const currentPoint = this.currentPoint
		if (dragBox.state !== 'NoDragBox') {
			dragBoxOnMouseUpHandler(
				currentPoint,
				dragBox.start,
				this._entities.panels.allPanels,
				this._appState,
				this._selectedStore,
				this._entities.panels,
			)
			this.clearGesture()
			this.touchHolding = false
			return
		}

		// * Handle end move single entity
		const moveEntityState = this._positioningStore.state.moveEntityState
		if (moveEntityState === 'MovingSingleEntity') {
			this._objPositioning.singleEntityToMoveMouseUp(event, currentPoint)
			this.clearGesture()
			this.touchHolding = false
			return
		}

		// * If there is only one touch, handle as a click
		if (this.gesture.pointers.size === 1) {
			const entityUnderMouse = this.getPanelUnderMouse(this.currentPoint)
			if (entityUnderMouse) {
				const mode = this._appState.mode()
				if (mode === 'SelectMode') {
					this._selected.handleEntityUnderTouch(event, entityUnderMouse)
					return
				}
				this._selected.handleNotClickedOnEntity()
				if (this.anyEntitiesNearAreaOfTouch(event)) {
					return
				}
			}
			this._entityFactory.createEntityFromTouch(event, this.currentPoint)
			this.clearGesture()
		}
	}

	onTouchCancelHandler(event: TouchEvent) {
		this.clearGesture()
		console.log('touch cancel -- clear gesture', event)
	}

	private setupCanvas() {
		const { canvas, ctx } = setupCanvas(this.canvas)
		this.canvas = canvas
		this.ctx = ctx
		this._canvasEl.init(this.canvas, this.ctx)
	}

	private setupEventListenersBasedOnPlatform() {
		switch (this.platform) {
			case PLATFORM.DARWIN:
			case PLATFORM.WINDOWS: {
				this._renderer.listen(this.canvas, EVENT_TYPE.POINTER_UP, (event: PointerEvent) => {
					event.stopPropagation()
					event.preventDefault()
					console.log('mouse up', event)
					this.rawMousePos = eventToPointLocation(event)
					this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
					if (isContextMenu(event)) return
					this.onMouseUpHandler(event, this.currentPoint)
				})
				this._renderer.listen(this.canvas, EVENT_TYPE.POINTER_DOWN, (event: PointerEvent) => {
					event.stopPropagation()
					event.preventDefault()
					console.log('mouse down', event)
					this.rawMousePos = eventToPointLocation(event)
					this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
					this.onMouseDownHandler(event, this.currentPoint)
				})
				this._renderer.listen(this.canvas, EVENT_TYPE.POINTER_MOVE, (event: PointerEvent) => {
					event.stopPropagation()
					event.preventDefault()
					this.rawMousePos = eventToPointLocation(event)
					this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
					this.onMouseMoveHandler(event, this.currentPoint)
				})
				this._renderer.listen(this.canvas, ContextMenuEvent, (event: PointerEvent) => {
					event.stopPropagation()
					event.preventDefault()
					this.rawMousePos = eventToPointLocation(event)
					console.log('context menu', event)
					this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
					this.contextMenuHandler(event, this.currentPoint)
				})
				this._renderer.listen(this.canvas, DoubleClickEvent, (event: PointerEvent) => {
					event.stopPropagation()
					event.preventDefault()
					this.rawMousePos = eventToPointLocation(event)
					this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
					this.doubleClickHandler(event, this.currentPoint)
				})
				this._renderer.listen(this.canvas, EVENT_TYPE.WHEEL, (event: WheelEvent) => {
					event.stopPropagation()
					event.preventDefault()
					this.wheelScrollHandler(event)
				}) // { passive: false } is required to prevent default
				this._renderer.listen(window, 'resize', (event: Event) => {
					event.stopPropagation()
					event.preventDefault()
					this.ctx.canvas.width = window.innerWidth
					this.ctx.canvas.height = window.innerHeight
					this._renderer.setStyle(this.canvas, 'width', '100%')
					this._renderer.setStyle(this.canvas, 'height', '100%')
					this._render.renderCanvasApp()
				})
				this._renderer.listen(window, EVENT_TYPE.KEY_UP, (event: KeyboardEvent) => {
					event.stopPropagation()
					event.preventDefault()
					console.log('keyup menu', event)
					this._keys.keyUpHandlerV4(event, this.rawMousePos, this.currentPoint)
				})
				break
			}
			case PLATFORM.ANDROID: {
				this._renderer.listen(this.canvas, EVENT_TYPE.TOUCH_START, (event: TouchEvent) => {
					event.stopPropagation()
					event.preventDefault()
					console.log('touch start', event)
					this.onTouchStartHandler(event)
				})
				this._renderer.listen(this.canvas, EVENT_TYPE.TOUCH_MOVE, (event: TouchEvent) => {
					event.stopPropagation()
					event.preventDefault()
					// console.log('touch move', event)
					this.onTouchMoveHandler(event)
				})
				this._renderer.listen(this.canvas, EVENT_TYPE.TOUCH_END, (event: TouchEvent) => {
					event.stopPropagation()
					event.preventDefault()
					console.log('touch end', event)
					this.onTouchEndHandler(event)
				})
				/*				this._renderer.listen(this.canvas, EVENT_TYPE.TOUCH_CANCEL, (event: TouchEvent) => {
				 event.stopPropagation()
				 event.preventDefault()
				 console.log('touch cancel', event)
				 this.onTouchCancelHandler(event)
				 })
				 this._renderer.listen(this.canvas, EVENT_TYPE.GESTURE_START, (event: TouchEvent) => {
				 event.stopPropagation()
				 event.preventDefault()
				 console.log('gesturestart', event)
				 this.onTouchStartHandler(event)
				 })*/
				break
			}
		}
	}

	private setupEventListeners() {
		this._renderer.listen(this.canvas, EVENT_TYPE.POINTER_UP, (event: PointerEvent) => {
			event.stopPropagation()
			event.preventDefault()
			console.log('mouse up', event)
			this.rawMousePos = eventToPointLocation(event)
			this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
			if (isContextMenu(event)) return
			this.onMouseUpHandler(event, this.currentPoint)
		})
		this._renderer.listen(this.canvas, EVENT_TYPE.POINTER_DOWN, (event: PointerEvent) => {
			event.stopPropagation()
			event.preventDefault()
			console.log('mouse down', event)
			this.rawMousePos = eventToPointLocation(event)
			this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
			this.onMouseDownHandler(event, this.currentPoint)
		})
		this._renderer.listen(this.canvas, EVENT_TYPE.POINTER_MOVE, (event: PointerEvent) => {
			event.stopPropagation()
			event.preventDefault()
			this.rawMousePos = eventToPointLocation(event)
			this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
			// this._appState.mousePos = this.currentPoint
			this.onMouseMoveHandler(event, this.currentPoint)
		})
		this._renderer.listen(this.canvas, 'touchstart', (event: TouchEvent) => {
			event.stopPropagation()
			event.preventDefault()
			console.log('touch start', event)
			this.onTouchStartHandler(event)
		})
		this._renderer.listen(this.canvas, 'gesturestart', (event: TouchEvent) => {
			event.stopPropagation()
			event.preventDefault()
			console.log('gesturestart', event)
			this.onTouchStartHandler(event)
		})
		this._renderer.listen(this.canvas, 'touchmove', (event: TouchEvent) => {
			event.stopPropagation()
			event.preventDefault()
			console.log('touch move', event)
			this.onTouchMoveHandler(event)
		})
		this._renderer.listen(this.canvas, 'touchend', (event: TouchEvent) => {
			event.stopPropagation()
			event.preventDefault()
			console.log('touch end', event)
			this.onTouchEndHandler(event)
		})
		this._renderer.listen(this.canvas, 'touchcancel', (event: TouchEvent) => {
			event.stopPropagation()
			event.preventDefault()
			console.log('touch cancel', event)
			this.onTouchCancelHandler(event)
		})

		/*		const throttledPointerMove = throttle((event: PointerEvent) => {
		 event.stopPropagation()
		 event.preventDefault()
		 this.rawMousePos = eventToPointLocation(event)
		 this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
		 this._appState.mousePos = this.currentPoint
		 this.onMouseMoveHandler(event, this.currentPoint)
		 event.stopPropagation()
		 event.preventDefault()
		 }, 1000 / 60)*/
		this._renderer.listen(this.canvas, ContextMenuEvent, (event: PointerEvent) => {
			event.stopPropagation()
			event.preventDefault()
			this.rawMousePos = eventToPointLocation(event)
			console.log('context menu', event)
			this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
			this.contextMenuHandler(event, this.currentPoint)
		})
		this._renderer.listen(this.canvas, DoubleClickEvent, (event: PointerEvent) => {
			event.stopPropagation()
			event.preventDefault()
			this.rawMousePos = eventToPointLocation(event)
			this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
			this.doubleClickHandler(event, this.currentPoint)
		})
		this._renderer.listen(this.canvas, EVENT_TYPE.WHEEL, (event: WheelEvent) => {
			event.stopPropagation()
			event.preventDefault()
			this.wheelScrollHandler(event)
		}) // { passive: false } is required to prevent default
		this._renderer.listen(window, 'resize', (event: Event) => {
			event.stopPropagation()
			event.preventDefault()
			this.ctx.canvas.width = window.innerWidth
			this.ctx.canvas.height = window.innerHeight
			this._renderer.setStyle(this.canvas, 'width', '100%')
			this._renderer.setStyle(this.canvas, 'height', '100%')
			this._render.renderCanvasApp()
		})
		this._renderer.listen(window, EVENT_TYPE.KEY_UP, (event: KeyboardEvent) => {
			event.stopPropagation()
			event.preventDefault()
			console.log('keyup menu', event)
			this._keys.keyUpHandlerV4(event, this.rawMousePos, this.currentPoint)
			// this._keys.keyUpHandlerV2(event, this.rawMousePos, this.currentPoint)
			// this.keyUpHandler(event)
		})
	}

	private getObjectUnderMouse(event: PointerEvent | TransformedPoint) {
		const point =
			event instanceof PointerEvent ? this._domPoint.getTransformedPointFromEvent(event) : event
		const entitiesUnderMouse = this.allPanels.filter((entity) => isPointInsideEntity(point, entity))
		return entitiesUnderMouse[entitiesUnderMouse.length - 1] as CanvasEntity | undefined
	}

	private getPanelUnderMouse(event: PointerEvent | TransformedPoint) {
		const point =
			event instanceof PointerEvent ? this._domPoint.getTransformedPointFromEvent(event) : event
		return this.allPanels.find((entity) => isPointInsideEntity(point, entity))
		// const entitiesUnderMouse = this.allPanels.filter((entity) => isPointInsideEntity(point, entity))
		// return entitiesUnderMouse[entitiesUnderMouse.length - 1] as CanvasEntity | undefined
	}

	private getPanelSymbolUnderMouse(point: TransformedPoint) {
		const entitiesUnderMouse = this.allPanels.filter((entity) =>
			isPointInsideStretchedEntityByValue(point, entity, 5),
		)
		if (entitiesUnderMouse.length === 0) return undefined
		const polaritySymbol = entitiesUnderMouse.find((entity) =>
			isPointInsidePanelSymbols(point, entity),
		)
		if (polaritySymbol) return isPointInsidePanelSymbolsV2(point, polaritySymbol)
		return
	}

	private getPanelOrLinkSymbolUnderMouse(point: TransformedPoint) {
		const entitiesUnderMouse = this.allPanels.filter((entity) =>
			isPointInsideStretchedEntityByValue(point, entity, 5),
		)
		if (entitiesUnderMouse.length === 0) return undefined
		const polaritySymbol = entitiesUnderMouse.find((entity) =>
			isPointInsidePanelSymbols(point, entity),
		)
		if (polaritySymbol) return isPointInsidePanelSymbols(point, polaritySymbol)
		return entitiesUnderMouse.find((entity) => isPointInsideEntity(point, entity))
	}

	private anyEntitiesNearAreaOfClick(event: PointerEvent) {
		let size = SizeByType[ENTITY_TYPE.Panel]
		const midSpacing = 2
		size = {
			width: size.width + midSpacing,
			height: size.height + midSpacing,
		}

		const center = this._domPoint.getTransformedPointFromEvent(event)
		const mouseBoxBounds = getBoundsFromCenterPoint(center, size)
		const anyNearClick = !!this.allPanels.find((entity) =>
			isEntityOverlappingWithBounds(entity, mouseBoxBounds),
		)
		if (!anyNearClick) {
			this._render.renderCanvasApp()
			return false
		}

		const clickNearEntityBounds = {
			top: mouseBoxBounds.top,
			left: mouseBoxBounds.left,
			width: size.width,
			height: size.height,
		}

		this._render.renderCanvasApp({
			clickNearEntityBounds,
		})
		return true
	}

	private anyEntitiesNearAreaOfTouch(event: TouchEvent) {
		let size = SizeByType[ENTITY_TYPE.Panel]
		const midSpacing = 2
		size = {
			width: size.width + midSpacing,
			height: size.height + midSpacing,
		}

		const center = this._domPoint.getTransformedPointFromSingleTouchEvent(event)
		const mouseBoxBounds = getBoundsFromCenterPoint(center, size)
		const anyNearClick = !!this.allPanels.find((entity) =>
			isEntityOverlappingWithBounds(entity, mouseBoxBounds),
		)
		if (!anyNearClick) {
			this._render.renderCanvasApp()
			return false
		}

		const clickNearEntityBounds = {
			top: mouseBoxBounds.top,
			left: mouseBoxBounds.left,
			width: size.width,
			height: size.height,
		}

		this._render.renderCanvasApp({
			clickNearEntityBounds,
		})
		return true
	}
}
