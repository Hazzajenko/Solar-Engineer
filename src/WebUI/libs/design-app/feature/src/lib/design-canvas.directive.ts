import { setupCanvas } from './setup-canvas'
import { Directive, ElementRef, inject, NgZone, OnInit, Renderer2 } from '@angular/core'
import {
	AppStateStoreService,
	CanvasElementService,
	CONTEXT_MENU_COMPONENT,
	DomPointService,
	DragBoxService,
	EntityStoreService,
	genStringNameV2,
	GraphicsStoreService,
	isPointInsideSelectedStringPanelsByStringIdNgrxWithPanels,
	KeyEventsService,
	MODE_STATE,
	MOVE_ENTITY_STATE,
	NearbyService,
	ObjectPositioningService,
	ObjectPositioningStoreService,
	ObjectRotatingService,
	RenderService,
	ROTATE_ENTITY_STATE,
	SelectedService,
	SelectedStoreService,
	UiStoreService,
	ViewPositioningService,
} from '@design-app/data-access'
import {
	CANVAS_COLORS,
	CanvasEntity,
	CanvasPanel,
	ENTITY_TYPE,
	SizeByType,
	TransformedPoint,
	UndefinedStringId,
} from '@design-app/shared'
import {
	changeCanvasCursor,
	createPanel,
	createString,
	dragBoxKeysDown,
	draggingScreenKeysDown,
	eventToPointLocation,
	getBoundsFromCenterPoint,
	getCompleteBoundsFromMultipleEntitiesWithPadding,
	getTopLeftPointFromTransformedPoint,
	isContextMenu,
	isDraggingEntity,
	isEntityOverlappingWithBounds,
	isPanel,
	isPointInsideBounds,
	isPointInsideEntity,
	isReadyToMultiDrag,
	isWheelButton,
	multiSelectDraggingKeysDownAndIdsNotEmpty,
	rotatingKeysDown,
	updateObjectByIdForStoreV3,
} from '@design-app/utils'
import {
	ContextMenuEvent,
	CURSOR_TYPE,
	DoubleClickEvent,
	EVENT_TYPE,
	KEYS,
	Point,
} from '@shared/data-access/models'
import { assertNotNull, OnDestroyDirective } from '@shared/utils'
import { VIEW_STATE } from 'deprecated/design-app/feature-design-canvas'

@Directive({
	selector: '[appDesignCanvas]',
	providers: [OnDestroyDirective],
	standalone: true,
})
export class DesignCanvasDirective implements OnInit {
	private _appState = inject(AppStateStoreService)
	private _graphicsState = inject(GraphicsStoreService)
	private _positioningStore = inject(ObjectPositioningStoreService)
	private _selectedStore = inject(SelectedStoreService)
	private canvas = inject(ElementRef<HTMLCanvasElement>).nativeElement
	private ctx!: CanvasRenderingContext2D
	private _ngZone = inject(NgZone)
	private _renderer = inject(Renderer2)
	private _canvasEl = inject(CanvasElementService)
	private _objRotating = inject(ObjectRotatingService)
	private _objPositioning = inject(ObjectPositioningService)
	private _view = inject(ViewPositioningService)
	private _drag = inject(DragBoxService)
	private _render = inject(RenderService)
	private _entities = inject(EntityStoreService)
	private _uiStore = inject(UiStoreService)
	// private _entities = inject(EntityStoreService)
	private _selected = inject(SelectedService)
	private _nearby = inject(NearbyService)
	private _domPoint = inject(DomPointService)
	private _keys = inject(KeyEventsService)

	private mouseDownTimeOut: ReturnType<typeof setTimeout> | undefined
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

	currentTransformedCursor!: TransformedPoint
	rawMousePos: Point = { x: 0, y: 0 }
	currentPoint: TransformedPoint = { x: 0, y: 0 } as TransformedPoint

	entityPressed: CanvasEntity | undefined

	private mouseDownTimeOutFn = () => {
		this.mouseDownTimeOut = setTimeout(() => {
			this.mouseDownTimeOut = undefined
		}, 300)
	}

	private mouseUpTimeOutFn = () => {
		this.mouseUpTimeOut = setTimeout(() => {
			this.mouseUpTimeOut = undefined
		}, 50)
	}

	private get panelEntities() {
		return this._entities.panels.entities
	}

	private get allPanels() {
		return this._entities.panels.allPanels
	}

	private get stringEntities() {
		return this._entities.strings.entities
	}

	private get allStrings() {
		return this._entities.strings.allStrings
	}

	/**
	 * ! Lifecycle Hooks
	 */

	ngOnInit() {
		this.setupCanvas()
		this.fpsEl = document.getElementById('fps') as HTMLDivElement
		this._ngZone.runOutsideAngular(() => {
			this.setupEventListeners()
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
		if (isContextMenu(event)) {
			return
		}
		this.mouseDownTimeOutFn()
		if (draggingScreenKeysDown(event)) {
			this._view.handleDragScreenMouseDown(event, currentPoint)
			return
		}

		if (dragBoxKeysDown(event)) {
			console.log('drag box keys down')
			this._drag.handleDragBoxMouseDown(event, currentPoint)
			return
		}

		const multipleSelectedIds = this._selectedStore.state.multipleSelectedEntityIds
		if (multiSelectDraggingKeysDownAndIdsNotEmpty(event, multipleSelectedIds)) {
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
			this._objPositioning.multiSelectDraggingMouseMove(event)
			return
		}

		const multipleSelectedIds = this._selectedStore.state.multipleSelectedEntityIds
		if (multiSelectDraggingKeysDownAndIdsNotEmpty(event, multipleSelectedIds)) {
			this._objPositioning.setMultiSelectDraggingMouseMove(event, multipleSelectedIds)
			this._objPositioning.multiSelectDraggingMouseMove(event)
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
			changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
			this._objPositioning.singleToMoveMouseMoveV2Ngrx(event, currentPoint)
			return
		}

		if (this.entityPressed && isDraggingEntity(event, this.entityPressed.id)) {
			this._objPositioning.setSingleToMoveEntity(event, this.entityPressed.id)
			this.entityPressed = undefined
			return
		}

		const appState = this._appState.state

		if (appState.view === 'ViewDraggingInProgress') {
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
		}

		// TODO - fix
		/*		const dragBoxAxisLineStart = this._app.appCtx.dragBox.axisLineBoxStart
		 if (dragBoxAxisLineStart) {
		 this._drag.dragAxisLineMouseMove(event, currentPoint, dragBoxAxisLineStart)
		 return
		 }*/

		const entityUnderMouse = this.getEntityUnderMouse(event)
		if (entityUnderMouse) {
			const hoveringEntityId = this._appState.state.pointer.hoveringOverEntityId
			if (hoveringEntityId === entityUnderMouse.id) return
			this._appState.dispatch.setHoveringOverEntityState(entityUnderMouse.id)
			this._render.renderCanvasApp()
			return
		}

		if (appState.pointer.hoverState === 'HoveringOverEntity') {
			changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
			this._appState.dispatch.liftHoveringOverEntity()
			this._render.renderCanvasApp()
			return
		}

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

		/**
		 * ! Object Positioning
		 */

		const moveEntityState = this._positioningStore.state.moveEntityState

		if (moveEntityState === 'MovingSingleEntity') {
			this._objPositioning.singleToMoveMouseUp(event, currentPoint)
			return
		}

		if (moveEntityState === 'MovingMultipleEntities') {
			this._objPositioning.stopMultiSelectDragging(event)
			return
		}

		const viewState = this._appState.state.view

		/**
		 * ! View Positioning
		 */
		if (viewState === 'ViewDraggingInProgress') {
			this._view.handleDragScreenMouseUp()
			return
		}

		/**
		 * ! Drag Box
		 */

		const dragBoxState = this._appState.state.dragBox

		if (dragBoxState === 'SelectionBoxInProgress') {
			this._drag.selectionBoxMouseUp(event, currentPoint)
			return
		}

		if (dragBoxState === 'CreationBoxInProgress') {
			this._drag.creationBoxMouseUp(event, currentPoint)
			return
		}

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
			this._uiStore.dispatch.closeContextMenu()
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

		const entityUnderMouse = this.getEntityUnderMouse(currentPoint)
		if (entityUnderMouse) {
			this._selected.handleEntityUnderMouse(event, entityUnderMouse)
			console.log('entityUnderMouse', entityUnderMouse)
			return
		}
		// const selectedSnapshot = this._app.selectedSnapshot
		this._selected.handleNotClickedOnEntity()
		if (this.anyEntitiesNearAreaOfClick(event)) {
			return
		}

		const previewAxisState = this._appState.state.previewAxis
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
			this._entities.panels.dispatch.addPanel(entity)
			// this._entities.panels.addEntity(entity)
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
		this._entities.panels.dispatch.addPanel(entity)
		// this._entities.panels.addEntity(entity)

		this._render.renderCanvasApp()
	}

	/**
	 * Double Click handler
	 * @param event
	 * @param currentPoint
	 * @private
	 */

	doubleClickHandler(event: PointerEvent, currentPoint: TransformedPoint) {
		console.log('double click', event)
		const entityUnderMouse = this.getEntityUnderMouse(currentPoint)
		if (entityUnderMouse) {
			if (!isPanel(entityUnderMouse)) return
			if (entityUnderMouse.stringId === UndefinedStringId) return
			const belongsToString = this._entities.strings.getById(entityUnderMouse.stringId)
			/*			const belongsToString = this._entities.strings
			 .getEntities()
			 .find((string) => string.id === entityUnderMouse.stringId)*/

			if (!belongsToString) return
			this._selectedStore.dispatch.selectString(belongsToString.id)
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
		/*		if (this._appState.state.contextMenu.state === 'ContextMenuOpen') {
		 this._appState.dispatch.setContextMenuState('NoContextMenu')
		 }*/

		const currentScaleX = this.ctx.getTransform().a

		const zoom = event.deltaY < 0 ? 1.1 : 0.9

		const currentTransformedCursor = this._domPoint.getTransformedPointFromEventOffsets(event)
		this.ctx.translate(currentTransformedCursor.x, currentTransformedCursor.y)
		this.ctx.scale(zoom, zoom)
		this.ctx.translate(-currentTransformedCursor.x, -currentTransformedCursor.y)
		this.scaleElement.innerText = `Scale: ${currentScaleX}`

		this._render.renderCanvasApp()
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
		/*		const selectedSnapshot = this._app.selectedSnapshot
		 const selectedCtx = this._app.selectedCtx*/

		const entityUnderMouse = this.getEntityUnderMouse(event)
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
			/*			this._appState.dispatch.openContextMenu({
			 type: 'SingleEntity',
			 id: entityUnderMouse.id,
			 x,
			 y,
			 })*/
			return
		}

		const selectedStringId = this._selectedStore.state.selectedStringId
		if (selectedStringId) {
			const selectedStringPanels =
				this._entities.panels.panelsByStringIdMap().get(selectedStringId) ?? []
			// const stringPanels = this._entities.panels.getEntitiesByStringId(selectedStringId)
			const pointInsideSelectedStringPanels =
				isPointInsideSelectedStringPanelsByStringIdNgrxWithPanels(
					selectedStringPanels,
					selectedStringId,
					currentPoint,
				)
			/*			const pointInsideSelectedStringPanels = isPointInsideSelectedStringPanelsByStringId(
			 this._entities,
			 selectedStringId,
			 currentPoint,
			 )*/
			if (pointInsideSelectedStringPanels) {
				// const selectedStringId = selectedCtx.selectedStringId
				assertNotNull(selectedStringId)
				// const stringPanels = this._entities.panels.getEntitiesByStringId(selectedStringId)
				// const stringPanels = this._entities.panels.getEntitiesByStringId(selectedStringId)
				// const stringPanelsIds = selectedStringPanels.map((panel) => panel.id)
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

		if (this._selectedStore.state.multipleSelectedEntityIds.length > 0) {
			const selectedPanels = this._entities.panels.getByIds(
				this._selectedStore.state.multipleSelectedEntityIds,
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
	 * Key Up handler
	 * @private
	 * @param event
	 */
	keyUpHandler(event: KeyboardEvent) {
		switch (event.key) {
			case KEYS.ESCAPE:
				this._selected.clearSelectedInOrder()
				this._render.renderCanvasApp()
				break
			case KEYS.X:
				{
					const multipleSelectedIds = this._selectedStore.state.multipleSelectedEntityIds
					// const multipleSelectedIds = this._app.selectedCtx.multipleSelectedIds
					// const multipleSelectedIds = this._app.selectedCtx.multipleSelectedIds
					if (multipleSelectedIds.length <= 1) return
					const name = genStringNameV2(this._entities.strings.allStrings)
					const string = createString(name)

					const entities = this._entities.panels.getByIds(multipleSelectedIds)
					const panels = entities.filter((entity) => entity.type === 'panel') as CanvasPanel[]
					/*				const panelUpdates = panels.map((panel) =>
				 updateObjectByIdForStore<CanvasPanel>(panel.id, { stringId: string.id }),
				 )*/
					const panelUpdates = panels.map(
						updateObjectByIdForStoreV3<CanvasPanel>({ stringId: string.id }),
					)
					this._entities.strings.dispatch.addString(string)
					this._entities.panels.dispatch.updateManyPanels(panelUpdates)

					this._selectedStore.dispatch.selectString(string.id)
					this._render.renderCanvasApp()
				}
				break
			case KEYS.R:
				{
					const rotateState = this._positioningStore.state.rotateEntityState
					if (rotateState === ROTATE_ENTITY_STATE.ROTATING_SINGLE_ENTITY) {
						this._objRotating.clearSingleToRotate()
						return
					}
					if (rotateState === ROTATE_ENTITY_STATE.ROTATING_MULTIPLE_ENTITIES) {
						this._objRotating.clearMultipleToRotate()
						return
					}
				}
				break
			case KEYS.C: {
				const mode = this._appState.state.mode
				const newMode =
					mode === MODE_STATE.CREATE_MODE ? MODE_STATE.SELECT_MODE : MODE_STATE.CREATE_MODE
				this._appState.dispatch.setModeState(newMode)
				return
			}
			case KEYS.M:
				break
			case KEYS.SHIFT: {
				const moveState = this._positioningStore.state.moveEntityState
				if (moveState === MOVE_ENTITY_STATE.MOVING_MULTIPLE_ENTITIES) {
					this._objPositioning.stopMultiSelectDragging(this.rawMousePos)
					return
				}
				if (moveState === MOVE_ENTITY_STATE.MOVING_SINGLE_ENTITY) {
					this._objPositioning.singleToMoveMouseUp(event.altKey, this.currentPoint)

					return
				}
				break
			}
			case KEYS.ALT: {
				const rotateState = this._positioningStore.state.rotateEntityState
				if (rotateState === ROTATE_ENTITY_STATE.ROTATING_SINGLE_ENTITY) {
					this._objRotating.clearSingleToRotate()
					return
				}
				if (rotateState === ROTATE_ENTITY_STATE.ROTATING_MULTIPLE_ENTITIES) {
					this._objRotating.clearMultipleToRotate()
					return
				}
				break
			}
			case KEYS.CTRL_OR_CMD: {
				const { moveEntityState, rotateEntityState } = this._positioningStore.state
				if (moveEntityState === MOVE_ENTITY_STATE.MOVING_MULTIPLE_ENTITIES) {
					this._objPositioning.stopMultiSelectDragging(this.rawMousePos)
				}
				if (moveEntityState === MOVE_ENTITY_STATE.MOVING_SINGLE_ENTITY) {
					this._objPositioning.singleToMoveMouseUp(event.altKey, this.currentPoint)
				}

				if (rotateEntityState === ROTATE_ENTITY_STATE.ROTATING_SINGLE_ENTITY) {
					this._objRotating.clearSingleToRotate()
				}

				if (rotateEntityState === ROTATE_ENTITY_STATE.ROTATING_MULTIPLE_ENTITIES) {
					this._objRotating.clearMultipleToRotate()
				}

				if (this._appState.state.view === VIEW_STATE.VIEW_DRAGGING_IN_PROGRESS) {
					this._view.handleDragScreenMouseUp()
				}
				break
			}
		}
	}

	private setupCanvas() {
		const { canvas, ctx } = setupCanvas(this.canvas)
		this.canvas = canvas
		this.ctx = ctx
		this._canvasEl.init(this.canvas, this.ctx)
	}

	private setupEventListeners() {
		this._renderer.listen(this.canvas, EVENT_TYPE.POINTER_UP, (event: PointerEvent) => {
			console.log('mouse up', event)
			this.rawMousePos = eventToPointLocation(event)
			this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
			if (isContextMenu(event)) return
			this.onMouseUpHandler(event, this.currentPoint)
			event.stopPropagation()
			event.preventDefault()
		})
		this._renderer.listen(this.canvas, EVENT_TYPE.POINTER_DOWN, (event: PointerEvent) => {
			console.log('mouse down', event)
			this.rawMousePos = eventToPointLocation(event)
			this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
			this.onMouseDownHandler(event, this.currentPoint)
			event.stopPropagation()
			event.preventDefault()
		})
		this._renderer.listen(this.canvas, EVENT_TYPE.POINTER_MOVE, (event: PointerEvent) => {
			this.rawMousePos = eventToPointLocation(event)
			this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
			this.onMouseMoveHandler(event, this.currentPoint)
			event.stopPropagation()
			event.preventDefault()
		})
		this._renderer.listen(this.canvas, ContextMenuEvent, (event: PointerEvent) => {
			this.rawMousePos = eventToPointLocation(event)
			console.log('context menu', event)
			this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
			this.contextMenuHandler(event, this.currentPoint)
			event.stopPropagation()
			event.preventDefault()
		})
		this._renderer.listen(this.canvas, DoubleClickEvent, (event: PointerEvent) => {
			this.rawMousePos = eventToPointLocation(event)
			this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
			this.doubleClickHandler(event, this.currentPoint)
			event.stopPropagation()
			event.preventDefault()
		})
		this._renderer.listen(this.canvas, EVENT_TYPE.WHEEL, (event: WheelEvent) => {
			this.wheelScrollHandler(event)
			event.stopPropagation()
			event.preventDefault()
		})
		this._renderer.listen(window, 'resize', (event: Event) => {
			this.ctx.canvas.width = window.innerWidth
			this.ctx.canvas.height = window.innerHeight
			this._renderer.setStyle(this.canvas, 'width', '100%')
			this._renderer.setStyle(this.canvas, 'height', '100%')
			event.stopPropagation()
			event.preventDefault()
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

	private getEntityUnderMouse(event: PointerEvent | TransformedPoint) {
		const point =
			event instanceof PointerEvent ? this._domPoint.getTransformedPointFromEvent(event) : event
		const entitiesUnderMouse = this.allPanels.filter((entity) => isPointInsideEntity(point, entity))
		return entitiesUnderMouse[entitiesUnderMouse.length - 1] as CanvasEntity | undefined
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

		const drawFunction = (ctx: CanvasRenderingContext2D) => {
			ctx.save()
			ctx.beginPath()
			ctx.globalAlpha = 0.4
			ctx.fillStyle = CANVAS_COLORS.TakenSpotFillStyle
			ctx.rect(mouseBoxBounds.left, mouseBoxBounds.top, size.width, size.height)
			ctx.fill()
			ctx.stroke()
			ctx.restore()
		}

		this._render.renderCanvasApp({
			drawFns: [drawFunction],
		})

		const interval = setInterval(() => {
			this._render.renderCanvasApp()
			clearInterval(interval)
		}, 1000)
		return true
	}
}
