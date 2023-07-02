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
import { CanvasElementService, injectAppStateStore, MODE_STATE } from '@canvas/app/data-access'
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
	injectEntityStore,
	isPointOverCurvedLineNoCtx,
	PanelLinksService,
} from '@entities/data-access'
import { ViewPositioningService } from '@canvas/view-positioning/data-access'
import { RenderService } from '@canvas/rendering/data-access'
import { CONTEXT_MENU_COMPONENT, injectUiStore } from '@overlays/ui-store/data-access'
import { KeyEventsService } from '@canvas/keys/data-access'
import {
	changeCanvasCursor,
	dragBoxKeysDown,
	draggingScreenKeysDown,
	eventToPointLocation,
	getBoundsFromCenterPoint,
	getCompleteBoundsFromMultipleEntitiesWithPadding,
	getDefaultBoundsBoxFromMultipleEntities,
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
	singleTouchEventEndToPointLocation,
	singleTouchEventToPointLocation,
} from '@canvas/utils'
import { isPanel, isPointInsideSelectedStringPanelsByStringIdNgrxWithPanels } from '@entities/utils'
import {
	ENTITY_TYPE,
	EntityBase,
	getEntitySize,
	PanelModel,
	SizeByType,
	UNDEFINED_STRING_ID,
} from '@entities/shared'
import { injectAppUser } from '@auth/data-access'

@Directive({
	selector: '[appDesignCanvas]',
	providers: [OnDestroyDirective],
	standalone: true,
})
export class DesignCanvasDirective implements OnInit {
	private _appStore = injectAppStateStore()
	// private _appStore = inject(AppStateStoreService)
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
	private _objRotating = inject(ObjectRotatingService)
	private _objPositioning = inject(ObjectPositioningService)
	private _entityFactory = inject(EntityFactoryService)
	private _view = inject(ViewPositioningService)
	private _render = inject(RenderService)
	private _entities = injectEntityStore()
	private _uiStore = injectUiStore()
	// private _entities = injectEntityStore()
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

	private get isLoggedIn() {
		return !!this.user()
	}

	private get allPanels() {
		return this._entities.panels.select.allPanels()
	}

	private get allStrings() {
		return this._entities.strings.select.allStrings()
	}

	user = injectAppUser()

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
		const pointers = this.gesture.pointers.values()
		for (const pointer of pointers) {
			console.log('pointer removed', pointer)
		}

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
			dragBoxOnMouseDownHandler(currentPoint, this._appStore)
			return
		}

		const multipleSelectedIds = this._selectedStore.select.multipleSelectedPanelIds()
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

		const multipleSelectedIds = this._selectedStore.select.multipleSelectedPanelIds()
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
			this._objPositioning.singleEntityToMoveMouseMove(event, currentPoint)
			return
		}

		if (this.panelPressed && isDraggingEntity(event, this.panelPressed.id)) {
			this._objPositioning.setSingleToMoveEntity(event, this.panelPressed.id)
			this.panelPressed = undefined
			return
		}

		const { view, dragBox, mode, pointer } = this._appStore.select.appState()

		if (view === 'ViewDraggingInProgress') {
			this._view.handleDragScreenMouseMove(event, currentPoint)
			return
		}

		if (dragBox.state === 'SelectionBoxInProgress') {
			const renderOptions = selectionBoxMouseMove(
				event,
				currentPoint,
				dragBox.start,
				this._appStore,
			)
			if (renderOptions) this._render.renderCanvasApp(renderOptions)
			return
		}

		if (dragBox.state === 'CreationBoxInProgress') {
			const renderOptions = creationBoxMouseMove(
				event,
				currentPoint,
				dragBox.start,
				this._entities.panels.select.allPanels(),
				this._appStore,
			)
			if (renderOptions) this._render.renderCanvasApp(renderOptions)
			return
		}

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
			this._appStore.dispatch.setHoveringOverEntityState(entityUnderMouse.id)
			this._render.renderCanvasApp()
			return
		}

		const selectedStringId = this._selectedStore.select.selectedStringId()
		if (selectedStringId) {
			const panelLinkUnderMouse = this.isMouseOverLinkPath(currentPoint)
			if (panelLinkUnderMouse) {
				const existingPanelLinkUnderMouse =
					this._entities.panelLinks.select.hoveringOverPanelLinkInApp()
				if (
					existingPanelLinkUnderMouse &&
					existingPanelLinkUnderMouse.id === panelLinkUnderMouse.id
				)
					return
				this._entities.panelLinks.dispatch.setHoveringOverPanelLinkInApp(panelLinkUnderMouse.id)
				this._render.renderCanvasApp({
					transformedPoint: currentPoint,
				})
				return
			}
			if (this._entities.panelLinks.select.hoveringOverPanelLinkInApp()) {
				this._entities.panelLinks.dispatch.clearHoveringOverPanelLinkInApp()
				this._render.renderCanvasApp()
				return
			}
		}

		if (pointer.hoverState === 'HoveringOverEntity') {
			changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
			this._appStore.dispatch.liftHoveringOverEntity()
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

		const { view, dragBox, mode } = this._appStore.select.appState()

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

		// const dragBoxState = this._appStore.state.dragBox

		if (dragBox.state === 'SelectionBoxInProgress') {
			selectionBoxMouseUp(
				currentPoint,
				dragBox.start,
				this._entities.panels.select.allPanels(),
				this._appStore,
				this._selectedStore,
			)
			return
		}

		if (dragBox.state === 'CreationBoxInProgress') {
			creationBoxMouseUp(
				currentPoint,
				dragBox.start,
				this._entities.panels.select.allPanels(),
				this._appStore,
				this._entities.panels,
				this.isLoggedIn,
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
		if (this._uiStore.select.currentContextMenu()) {
			// this._uiStore.dispatch.closeContextMenu()
			return
		}

		/*		const contextMenuState = this._appStore.state.contextMenu

		 if (contextMenuState.state === 'ContextMenuOpen') {
		 this._appStore.dispatch.setContextMenuState('NoContextMenu')
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
		const { mode } = this._appStore.select.appState()
		// const mode = this._appStore.state.mode
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
		 this._appStore.dispatch.setModeState('SelectMode')
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
				this._appStore.dispatch.setModeState('SelectMode')
				this._selected.handleEntityUnderMouse(event, entityUnderMouse)
				return
			}

			if (mode === 'LinkMode') {
				if (isPanel(entityUnderMouse)) {
					this._panelLinks.handlePanelLinksClick(entityUnderMouse, event.shiftKey)
					return
				}
				// this._appStore.dispatch.setModeState('SelectMode')
				this._panelLinks.clearPanelLinkRequest()
				return
			}

			/*	// todo move link mode method to strings or selected
			 if (this._selectedStore.select.selectedStringId()) {
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

		if (this._entities.panelLinks.select.requestingLink()) {
			this._panelLinks.clearPanelLinkRequest()
			return
		}

		const hoveringOverPanelLinkInApp = this._entities.panelLinks.select.hoveringOverPanelLinkInApp()
		if (hoveringOverPanelLinkInApp) {
			this._selectedStore.dispatch.selectPanelLink(hoveringOverPanelLinkInApp.id)
			return
		}

		// const selectedSnapshot = this._app.selectedSnapshot
		this._selected.handleNotClickedOnEntity()
		if (this.anyEntitiesNearAreaOfClick(event)) {
			return
		}

		this._entityFactory.createEntity(event, currentPoint)

		/*	const previewAxisState = this._appStore.state.previewAxis
		 if (previewAxisState === 'AxisCreatePreviewInProgress') {
		 if (!event.altKey || !this._nearby.axisPreviewRect) {
		 this._appStore.dispatch.setPreviewAxisState('None')
		 this._nearby.axisPreviewRect = undefined
		 this._render.renderCanvasApp()
		 return
		 }

		 const previewRectLocation = {
		 x: this._nearby.axisPreviewRect.left,
		 y: this._nearby.axisPreviewRect.top,
		 }

		 const selectedStringId = this._selectedStore.select.selectedStringId()
		 const entity = selectedStringId
		 ? createPanel(previewRectLocation, selectedStringId)
		 : createPanel(previewRectLocation)
		 this._entities.panels.dispatch.addPanel(entity)
		 this._nearby.axisPreviewRect = undefined
		 this._appStore.dispatch.setPreviewAxisState('None')

		 this._render.renderCanvasApp()
		 return
		 }

		 const location = getTopLeftPointFromTransformedPoint(
		 currentPoint,
		 SizeByType[ENTITY_TYPE.Panel],
		 )
		 const selectedStringId = this._selectedStore.select.selectedStringId()
		 const entity = selectedStringId
		 ? createPanel(location, selectedStringId)
		 : createPanel(location)
		 this._entities.panels.dispatch.addPanel(entity)

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

			if (
				entityUnderMouse.stringId === UNDEFINED_STRING_ID ||
				entityUnderMouse.stringId === this._entities.strings.select.undefinedStringId()
			)
				return
			const selectedStringId = this._selectedStore.select.selectedStringId()
			const belongsToString = this._entities.strings.select.getById(entityUnderMouse.stringId)

			if (!belongsToString) return
			this._selectedStore.dispatch.selectStringId(belongsToString.id)
			this._render.renderCanvasApp()
		}
	}

	/**
	 * Wheel Scroll handler
	 * @param event
	 * @private
	 */

	wheelScrollHandler(event: WheelEvent) {
		if (this._uiStore.select.currentContextMenu()) {
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
			const { width, height } = getEntitySize(entityUnderMouse)
			const x = event.offsetX + width / 2
			const y = event.offsetY + height / 2
			this._uiStore.dispatch.openContextMenu({
				component: CONTEXT_MENU_COMPONENT.SINGLE_PANEL_MENU,
				location: { x, y },
				data: {
					panelId: entityUnderMouse.id,
				},
			})
			return
		}

		// const { mode } = this._appStore.select.appState()
		// if (mode === 'LinkMode') {
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
		// }

		const selectedStringId = this._selectedStore.select.selectedStringId()
		if (selectedStringId) {
			const selectedStringPanels =
				this._entities.panels.select.getByStringId(selectedStringId) ?? []
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

		if (this._selectedStore.select.multipleSelectedPanelIds().length > 0) {
			const selectedPanels = this._entities.panels.select.getByIds(
				this._selectedStore.select.multipleSelectedPanelIds(),
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
		// * If there are two touches, handle as a gesture
		if (event.touches.length > 1) {
			this.handleMultiTouchStart(event)
			return
		}

		const moveEntityState = this._positioningStore.state.moveEntityState
		// const pointer = singleTouchEventToPointLocation(event)
		const currentPoint = this._domPoint.getTransformedPointFromSingleTouchEvent(event)
		// * Handle move multiple entities
		const multipleSelectedPanelIds = this._selectedStore.select.multipleSelectedPanelIds()
		if (
			moveEntityState === 'MovingMultipleEntities' &&
			this._selectedStore.select.isPointInsideSelectedPanelsBoxBounds(currentPoint) &&
			multipleSelectedPanelIds.length > 1
			// this.isPointInsideSelectedBox(pointer, currentPoint)
		) {
			this._objPositioning.multipleEntitiesToMoveMouseMove(event)
			return
		}

		// * Handle as a click

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
	}

	/**
	 * * Multi Touch Move handler
	 * @param event
	 */
	handleMultiTouchStart(event: TouchEvent) {
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

		if (gesture.pointers.size > 1) {
			console.error('Gesture not ready for pinch to zoom')
			return
		}
		// const moveEntityState = this._positioningStore.state.moveEntityState
		/*		// * Handle move multiple entities
		 if (moveEntityState === 'MovingMultipleEntities') {
		 this._objPositioning.multipleEntitiesToMoveMouseMove(event)
		 return
		 }

		 // const currentPoint = this._domPoint.getTransformedPointFromSingleTouchEvent(event)
		 // const rawPoint = singleTouchEventToPointLocation(event)
		 if (this._selectedStore.select.isPointInsideSelectedPanelsBoxBounds(this.currentPoint)) {
		 // if (this.isPointInsideSelectedBox(pointer, currentPoint)) {
		 this._objPositioning.setMultipleEntitiesToMoveTouchHold(
		 this.rawMousePos,
		 this._selectedStore.select.multipleSelectedPanelIds(),
		 )
		 this._objPositioning.multipleEntitiesToMoveMouseMove(event)
		 return
		 }*/

		// * Handle touch hold
		const touch = event.touches[0]
		const pointerId = touch.identifier
		const pointer = gesture.pointers.get(pointerId)
		if (!pointer) {
			this.touchHolding = false
			console.error('Pointer not found')
			return
		}
		if (this.touchHolding) {
			this.singleTouchHoldHandler(event, this.currentPoint, pointerId)
			return
		}
		/*			// If the pointer has moved more than 10px, cancel the touch hold
		 if (getDistance([pointer, { x: touch.clientX, y: touch.clientY }]) > 10) {
		 this.touchHolding = false
		 return
		 }*/
		// * If the pointer has lifted before the timeout, cancel the touch hold
		setTimeout(() => {
			if (this.gesture.pointers.get(pointerId)) {
				this.touchHolding = true
				this.singleTouchHoldHandler(event, this.currentPoint, pointerId)
			}
		}, 50)
	}

	/**
	 * * Single touch hold handler
	 */
	singleTouchHoldHandler(event: TouchEvent, currentPoint2: TransformedPoint, pointerId: number) {
		// console.log('Single touch hold')
		const currentPoint = this._domPoint.getTransformedPointFromSingleTouchEvent(event)
		const pointer = this.gesture.pointers.get(pointerId)
		if (!pointer) {
			console.error('Pointer not found')
			return
		}

		const dragBox = this._appStore.select.dragBox()

		// * Handle move single entity
		const moveEntityState = this._positioningStore.state.moveEntityState

		if (moveEntityState === 'MovingSingleEntity') {
			this._objPositioning.singleEntityToMoveMouseMove(event, currentPoint)
			return
		}

		// * Handle move multiple entities
		if (moveEntityState === 'MovingMultipleEntities') {
			this._objPositioning.multipleEntitiesToMoveMouseMove(event)
			return
		}

		if (
			this._selectedStore.select.isPointInsideSelectedPanelsBoxBounds(currentPoint) &&
			dragBox.state === 'NoDragBox'
		) {
			// if (this.isPointInsideSelectedBox(pointer, currentPoint)) {
			this._objPositioning.setMultipleEntitiesToMoveTouchHold(
				pointer,
				this._selectedStore.select.multipleSelectedPanelIds(),
			)
			this._objPositioning.multipleEntitiesToMoveMouseMove(event)
			return
		}

		const panelUnderMouse = this.getPanelUnderMouse(this.currentPoint)

		// * Handle drag box
		if (dragBox.state === 'NoDragBox' && !panelUnderMouse) {
			dragBoxOnMouseDownHandler(currentPoint, this._appStore)
		}

		if (dragBox.state !== 'NoDragBox') {
			const start = dragBox.start
			const renderOptions = dragBoxOnMouseMoveHandler(
				event,
				currentPoint,
				start,
				this._entities.panels.select.allPanels(),
				this._appStore,
			)
			if (renderOptions) {
				this._render.renderCanvasApp(renderOptions)
			}
			return
		}

		const mode = this._appStore.select.mode()

		if (panelUnderMouse && mode !== 'LinkMode') {
			this._objPositioning.setSingleToMoveEntity(event, panelUnderMouse.id)
			this._objPositioning.singleEntityToMoveMouseMove(event, currentPoint)
			return
		}
	}

	/**
	 * * Touch end handler
	 */

	onTouchEndHandler(event: TouchEvent) {
		console.log('Touch end')
		this.touchHolding = false
		this.rawMousePos = singleTouchEventEndToPointLocation(event)
		this.currentPoint = this._domPoint.getTransformedPointFromSingleTouchEndEvent(event)
		if (this.gesture.pointers.size === 0) {
			this.clearGesture()
			return
		}

		// * Handle touch drag box
		const dragBox = this._appStore.select.dragBox()
		const currentPoint = this.currentPoint
		if (dragBox.state !== 'NoDragBox') {
			dragBoxOnMouseUpHandler(
				currentPoint,
				dragBox.start,
				this._entities.panels.select.allPanels(),
				this._appStore,
				this._selectedStore,
				this._entities.panels,
				this.isLoggedIn,
			)
			this.clearGesture()
			this.touchHolding = false
			// * Calculate the size of the drag box to see if it is a click
			const dragBoxSize = getDistance([dragBox.start, currentPoint])
			if (dragBoxSize < 10) {
				return this.handleEndTouch(event)
			}
			return
		}

		// * Handle end move single entity
		const moveEntityState = this._positioningStore.state.moveEntityState
		if (moveEntityState === 'MovingSingleEntity') {
			const singleToMoveStart = this._objPositioning.singleToMoveStart
			if (!singleToMoveStart) {
				console.error('No singleToMoveStart')
				return
			}
			const distance = getDistance([singleToMoveStart, currentPoint])
			if (distance < 10) {
				this._objPositioning.cancelObjectPositioning()
				this.touchHolding = false
				this.clearGesture()
				return this.handleEndTouch(event)
			}
			this._objPositioning.singleEntityToMoveMouseUp(event, currentPoint)
			this.clearGesture()
			this.touchHolding = false
			return
		}

		// * Handle end move multiple entities
		if (moveEntityState === 'MovingMultipleEntities') {
			this._objPositioning.stopMultipleEntitiesToMove(this.rawMousePos)
			this.clearGesture()
			this.touchHolding = false
			return
		}

		// const mode = this._appStore.select.mode()

		// * If there is only one touch, handle as a click
		if (this.gesture.pointers.size === 1) {
			return this.handleEndTouch(event)
		}
		this.clearGesture()
	}

	onTouchCancelHandler(event: TouchEvent) {
		this.clearGesture()
		console.log('touch cancel -- clear gesture', event)
	}

	private handleEndTouch(event: TouchEvent) {
		const mode = this._appStore.select.mode()
		const entityUnderMouse = this.getPanelUnderMouse(this.currentPoint)
		if (entityUnderMouse) {
			if (mode === 'LinkMode') {
				this._panelLinks.handlePanelLinksClick(entityUnderMouse)
				return
			}
			this._selected.handleEntityUnderTouch(event, entityUnderMouse)
			this.clearGesture()
			return
		}
		if (this.anyEntitiesNearAreaOfTouch(event)) {
			this.clearGesture()
			return
		}
		this._entityFactory.createEntityFromTouch(event, this.currentPoint)
		this.clearGesture()
		// this.touchHolding = false
	}

	private setupCanvas() {
		const { canvas, ctx } = setupCanvas(this.canvas)
		this.canvas = canvas
		this.ctx = ctx
		this._canvasEl.init(this.canvas, this.ctx)
	}

	private isPointInsideSelectedBox(point: Point, currentPoint: TransformedPoint) {
		const multipleSelectedPanelIds = this._selectedStore.select.multipleSelectedPanelIds()
		if (multipleSelectedPanelIds.length > 0) {
			const multipleSelectedPanels = this._entities.panels.select.getByIds(multipleSelectedPanelIds)
			const selectionBoxBoundsBox = getDefaultBoundsBoxFromMultipleEntities(multipleSelectedPanels)
			return isPointInsideBounds(currentPoint, selectionBoxBoundsBox)
		}
		return false
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
					this._uiStore.dispatch.setScreenSize({
						width: window.innerWidth,
						height: window.innerHeight,
					})
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
				this._renderer.listen(this.canvas, EVENT_TYPE.POINTER_UP, (event: PointerEvent) => {
					event.stopPropagation()
					event.preventDefault()
					console.log('POINTER_UP start', event)
				})
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
				this._renderer.listen(this.canvas, EVENT_TYPE.TOUCH_CANCEL, (event: TouchEvent) => {
					event.stopPropagation()
					event.preventDefault()
					console.log('touch cancel', event)
					// this.onTouchCancelHandler(event)
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
			// this._appStore.mousePos = this.currentPoint
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
		 this._appStore.mousePos = this.currentPoint
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
		return entitiesUnderMouse[entitiesUnderMouse.length - 1] as EntityBase | undefined
	}

	private getPanelUnderMouse(event: PointerEvent | TransformedPoint) {
		const point =
			event instanceof PointerEvent ? this._domPoint.getTransformedPointFromEvent(event) : event
		return this.allPanels.find((entity) => isPointInsideEntity(point, entity))
		// const entitiesUnderMouse = this.allPanels.filter((entity) => isPointInsideEntity(point, entity))
		// return entitiesUnderMouse[entitiesUnderMouse.length - 1] as CanvasEntity | undefined
	}

	private isMouseOverLinkPath(currentPoint: TransformedPoint) {
		const selectedStringId = this._selectedStore.select.selectedStringId()
		if (!selectedStringId) {
			console.error('a string must be selected to be in link mode')
			return
		}

		const panelLinks = this._entities.panelLinks.select.getByStringId(selectedStringId)
		if (!panelLinks.length) {
			return
		}
		const panelLinkIdPointsTuple = this._entities.panelLinks.select.selectedStringCircuitLinkLines()
		assertNotNull(panelLinkIdPointsTuple)

		const panelLinkIdForPoint = isPointOverCurvedLineNoCtx(panelLinkIdPointsTuple, currentPoint)

		if (!panelLinkIdForPoint) {
			// setCanvasCursorToAuto(this._canvasElementStore.canvas)
			return
		}

		const panelLink = panelLinks.find((panelLink) => panelLink.id === panelLinkIdForPoint)
		assertNotNull(panelLink)

		/*		if (this._canvasEl.canvas.style.cursor !== 'pointer') {
		 changeCanvasCursor(this._canvasEl.canvas, 'pointer')
		 }*/

		return panelLink
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
		let size = SizeByType[ENTITY_TYPE.PANEL]
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
		let size = SizeByType[ENTITY_TYPE.PANEL]
		const midSpacing = 2
		size = {
			width: size.width + midSpacing,
			height: size.height + midSpacing,
		}

		const center = this._domPoint.getTransformedPointFromSingleTouchEndEvent(event)
		// const center = this._domPoint.getTransformedPointFromSingleTouchEvent(event)
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
