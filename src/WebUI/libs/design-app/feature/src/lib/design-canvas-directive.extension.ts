import { setupCanvas } from './setup-canvas'
import { ElementRef, inject, NgZone, Renderer2 } from '@angular/core'
import {
	AppStoreService,
	CanvasElementService,
	DomPointService,
	DragBoxService,
	EntityStoreService,
	NearbyService,
	ObjectPositioningService,
	ObjectRotatingService,
	RenderService,
	SelectedService,
	ViewPositioningService,
} from '@design-app/data-access'
import {
	CANVAS_COLORS,
	CanvasEntity,
	ENTITY_TYPE,
	SizeByType,
	TransformedPoint,
} from '@design-app/shared'
import {
	eventToPointLocation,
	getBoundsFromCenterPoint,
	getEntityBounds,
	isContextMenu,
	isEntityOverlappingWithBounds,
	isPointInsideBounds,
} from '@design-app/utils'
import { ContextMenuEvent, DoubleClickEvent, EVENT_TYPE, Point } from '@shared/data-access/models'
import { OnDestroyDirective } from '@shared/utils'
import { GraphicsSettingsMachineService } from 'deprecated/design-app/feature-design-canvas'


export abstract class DesignCanvasDirectiveExtension {
	protected _onDestroy = inject(OnDestroyDirective)
	protected canvas = inject(ElementRef<HTMLCanvasElement>).nativeElement
	protected ctx!: CanvasRenderingContext2D
	protected _ngZone = inject(NgZone)
	protected _renderer = inject(Renderer2)
	protected _canvasEl = inject(CanvasElementService)
	protected _objRotating = inject(ObjectRotatingService)
	protected _objPositioning = inject(ObjectPositioningService)
	protected _view = inject(ViewPositioningService)
	// protected _mode = inject(CanvasModeService)
	protected _drag = inject(DragBoxService)
	// protected _drag = inject(DragBoxService)
	// protected _render = inject(RenderV2Service)
	protected _render = inject(RenderService)
	// protected _render = inject(CanvasRenderService)
	protected _entities = inject(EntityStoreService)
	protected _selected = inject(SelectedService)
	protected _nearby = inject(NearbyService)
	protected _app = inject(AppStoreService)
	protected _domPoint = inject(DomPointService)
	protected _graphics = inject(GraphicsSettingsMachineService)
	// protected _entityStore = inject(CanvasEntityStore)
	// protected _selected = inject(CanvasSelectedService)
	protected mouseDownTimeOut: ReturnType<typeof setTimeout> | undefined
	protected mouseUpTimeOut: ReturnType<typeof setTimeout> | undefined

	protected fpsEl!: HTMLDivElement
	protected canvasMenu!: HTMLDivElement
	protected mousePos!: HTMLDivElement
	protected transformedMousePos!: HTMLDivElement
	protected scaleElement!: HTMLDivElement
	protected stringStats!: HTMLDivElement
	protected panelStats!: HTMLDivElement
	protected menu!: HTMLDivElement
	protected keyMap!: HTMLDivElement
	protected currentTransformedCursor!: TransformedPoint
	// private _appState: CanvasAppState = initialCanvasAppState

	amountOfMouseEventFires = 0
	mouseEventFiresTimeOut: ReturnType<typeof setTimeout> | undefined
	mouseEventFireStartTime = 0

	protected get entities() {
		return this._entities.panels.getEntities()
	}

	protected height = this.canvas.height
	protected width = this.canvas.width

	protected rawMousePos: Point = { x: 0, y: 0 }
	protected currentPoint: TransformedPoint = { x: 0, y: 0 } as TransformedPoint

	protected mouseDownTimeOutFn = () => {
		this.mouseDownTimeOut = setTimeout(() => {
			this.mouseDownTimeOut = undefined
		}, 300)
	}

	protected mouseUpTimeOutFn = () => {
		this.mouseUpTimeOut = setTimeout(() => {
			this.mouseUpTimeOut = undefined
		}, 50)
	}

	protected setupCanvas() {
		const { canvas, ctx } = setupCanvas(this.canvas)
		this.canvas = canvas
		this.ctx = ctx
		this._canvasEl.init(this.canvas, this.ctx)
	}

	protected animate60Fps() {
		let text = ''

		let frames = 0
		let prevTime = performance.now()
		const fpsRender = () => {
			const time = performance.now()
			frames++
			if (time >= prevTime + 1000) {
				const fps = (frames * 1000) / (time - prevTime)
				text = `${fps.toFixed(1)} FPS`
				prevTime = time
				frames = 0
			}
			this.fpsEl.innerText = text
		}
		requestAnimationFrame(fpsRender)
	}

	protected setupMouseEventListeners() {
		this._renderer.listen(this.canvas, EVENT_TYPE.POINTER_UP, (event: PointerEvent) => {
			console.log('mouse up', event)
			this.rawMousePos = eventToPointLocation(event)
			this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
			if (isContextMenu(event)) return
			/*			this._app.sendEvent(
			 new PointerUp({ point: this._domPoint.getTransformedPointFromEvent(event) }),
			 )*/
			this.onMouseUpHandler(event, this.currentPoint)
			event.stopPropagation()
			event.preventDefault()
		})
		this._renderer.listen(this.canvas, EVENT_TYPE.POINTER_DOWN, (event: PointerEvent) => {
			console.log('mouse down', event)
			this.rawMousePos = eventToPointLocation(event)
			this.currentPoint = this._domPoint.getTransformedPointFromEvent(event)
			/*			this._app.sendEvent(
			 new PointerDown({ point: this._domPoint.getTransformedPointFromEvent(event) }),
			 )*/
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
		/*		this._renderer.listen(this.canvas, ClickEvent, (event: PointerEvent) => {
		 console.log('mouseClickHandler', event)
		 // this.mouseClickHandler(event)
		 event.stopPropagation()
		 event.preventDefault()
		 })*/
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
			// console.log('resize', event)
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
			this.keyUpHandler(event)
		})
	}

	abstract onMouseUpHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	abstract onMouseDownHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	abstract onMouseMoveHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	abstract contextMenuHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	/*	abstract mouseClickHandler(
	 event: PointerEvent,
	 currentPoint: TransformedPoint,
	 state: AppStateValue,
	 ): void*/

	abstract doubleClickHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	abstract wheelScrollHandler(event: WheelEvent): void

	abstract keyUpHandler(event: KeyboardEvent): void

	protected anyObjectsNearLocationExcludingGrabbed(point: TransformedPoint, grabbedId: string) {
		for (const entity of this.entities) {
			if (entity.id === grabbedId) continue
			const entityBounds = getEntityBounds(entity)
			return isPointInsideBounds(point, entityBounds)
		}
		return false
	}

	protected anyEntitiesNearAreaOfClick(event: PointerEvent) {
		let size = SizeByType[ENTITY_TYPE.Panel]
		const midSpacing = 2
		size = {
			width: size.width + midSpacing,
			height: size.height + midSpacing,
		}

		const center = this._domPoint.getTransformedPointFromEvent(event)
		const mouseBoxBounds = getBoundsFromCenterPoint(center, size)
		// return !!this.entities.find((entity) => isEntityOverlappingWithBounds(entity, mouseBoxBounds))
		// const mouseBoxBounds = getBoundsFromMouseEvent(event, size)
		const anyNearClick = !!this.entities.find((entity) =>
			isEntityOverlappingWithBounds(entity, mouseBoxBounds),
		)
		if (anyNearClick) {
			/*      requestAnimationFrame(() => {
			 this._render.drawCanvas()
			 })*/

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

			// const fn = this._render.drawCanvasWithFunction(drawFunction)

			// let animationId: number
			/*	const reply = () => {
			 this._render.drawCanvasWithFunction(drawFunction)
			 animationId = requestAnimationFrame(reply)
			 }*/

			// reply()
			this._render.renderCanvasApp({
				drawFns: [drawFunction],
			})
			// renderCanvasApp
			/*
			 const animationId = requestAnimationFrame((fn) => {
			 this._render.drawCanvasWithFunction(drawFunction)
			 // fn
			 console.log('requestAnimationFrame', animationId)
			 })*/

			const interval = setInterval(() => {
				// cancelAnimationFrame(animationId)
				this._render.renderCanvasApp()
				// this._render.drawCanvas()
				clearInterval(interval)
				// console.log('cancelAnimationFrame', animationId)
			}, 1000)

			// clearInterval(interval)

			// animationId.

			/*  setInterval(() => {

			 }*/
			// this.canvas.style.cursor = 'not-allowed'
			/*      this._render.drawCanvasWithFunction((ctx: CanvasRenderingContext2D) => {
			 ctx.save()
			 ctx.beginPath()
			 ctx.globalAlpha = 0.4
			 ctx.fillStyle = CANVAS_COLORS.TakenSpotFillStyle
			 ctx.rect(mouseBoxBounds.left, mouseBoxBounds.top, size.width, size.height)
			 ctx.fill()
			 ctx.stroke()
			 ctx.restore()
			 })*/
			return true
		}
		// this.canvas.style.cursor = 'default'
		this._render.renderCanvasApp()
		// this._render.drawCanvas()
		return false
	}

	protected getEntityUnderMouse(event: PointerEvent) {
		const entitiesUnderMouse = this.entities.filter((entity) =>
			this.isMouseOverEntityBounds(event, entity),
		)
		return entitiesUnderMouse[entitiesUnderMouse.length - 1] as CanvasEntity | undefined
	}

	protected getEntityUnderTransformedPoint(point: TransformedPoint) {
		const entitiesUnderMouse = this.entities.filter((entity) =>
			this.isTransformedPointOverEntityBounds(point, entity),
		)
		return entitiesUnderMouse[entitiesUnderMouse.length - 1] as CanvasEntity | undefined
	}

	protected seeClashesFromMouse(event: PointerEvent) {
		const size = SizeByType[ENTITY_TYPE.Panel]
		const center = this._domPoint.getTransformedPointFromEvent(event)
		const mouseBoxBounds = getBoundsFromCenterPoint(center, size)
		// const mouseBoxBounds = getBoundsFromMouseEvent(event, size)
		const anyNearClick = !!this.entities.find((entity) =>
			isEntityOverlappingWithBounds(entity, mouseBoxBounds),
		)
		// const anyNearClick = this.anyEntitiesNearAreaOfClick(event)
		if (anyNearClick) {
			// const bounds = getBoundsFromMouseEvent(event, size)
			this.canvas.style.cursor = 'not-allowed'
			// this.ctx.
			/*      this.ctx.save()
			 this.ctx.beginPath()
			 this.ctx.globalAlpha = 0.4
			 this.ctx.fillStyle = CANVAS_COLORS.TakenSpotFillStyle
			 this.ctx.rect(bounds.left, bounds.top, size.width, size.height)
			 this.ctx.fill()
			 this.ctx.stroke()
			 this.ctx.restore()*/

			/*			this._render.drawCanvasWithFunction((ctx: CanvasRenderingContext2D) => {
			 ctx.save()
			 ctx.beginPath()
			 ctx.globalAlpha = 0.4
			 ctx.fillStyle = CANVAS_COLORS.TakenSpotFillStyle
			 ctx.rect(mouseBoxBounds.left, mouseBoxBounds.top, size.width, size.height)
			 ctx.fill()
			 ctx.stroke()
			 ctx.restore()
			 })*/
			this._render.renderCanvasApp({
				drawFns: [
					(ctx: CanvasRenderingContext2D) => {
						ctx.save()
						ctx.beginPath()
						ctx.globalAlpha = 0.4
						ctx.fillStyle = CANVAS_COLORS.TakenSpotFillStyle
						ctx.rect(mouseBoxBounds.left, mouseBoxBounds.top, size.width, size.height)
						ctx.fill()
						ctx.stroke()
						ctx.restore()
					},
				],
			})
			return true
		}
		this.canvas.style.cursor = 'default'
		this._render.renderCanvasApp()
		// this._render.drawCanvas()
		return false
		/*    const entitiesUnderMouse = this.entities.filter((entity) =>
		 this.isMouseOverEntityBounds(event, entity),
		 )

		 return entitiesUnderMouse*/
	}

	protected getEntityUnderMouseV2(event: PointerEvent) {
		const entitiesUnderMouse = this._entities.panels
			.getEntities()
			.filter((entity) => this.isMouseOverEntityBounds(event, entity))
		return entitiesUnderMouse[entitiesUnderMouse.length - 1]
	}

	protected isMouseOverEntityBounds(event: PointerEvent, entity: CanvasEntity) {
		const point = this._domPoint.getTransformedPointFromEvent(event)
		const entityBounds = getEntityBounds(entity)
		return isPointInsideBounds(point, entityBounds)
	}

	protected isTransformedPointOverEntityBounds(point: TransformedPoint, entity: CanvasEntity) {
		const entityBounds = getEntityBounds(entity)
		return isPointInsideBounds(point, entityBounds)
	}

	/*  protected drawCanvas() {
	 this.resetCanvas()
	 this.ctx.beginPath()
	 this._state.entity.getEntities().forEach((entity) => {
	 this.drawEntity(entity)
	 })
	 /!*    this.entities.forEach((entity) => {
	 this.drawEntity(entity)
	 })*!/
	 this.ctx.closePath()
	 }*/

	/*  protected drawCanvasCallback() {
	 return () => {
	 this.drawCanvas()
	 }
	 }*/

	/* private drawEntity(entity: CanvasEntity) {
	 let fillStyle: string = CANVAS_COLORS.DefaultPanelFillStyle
	 const { hoveringEntityId, selectedId, selectedIds } = this.appState
	 const { singleToRotateId, multipleToRotateIds } = this.rotateState

	 const isBeingHovered = hoveringEntityId === entity.id
	 if (isBeingHovered) {
	 fillStyle = '#17fff3'
	 }

	 const isSingleSelected = selectedId === entity.id
	 const isMultiSelected = selectedIds && selectedIds.find((id) => id === entity.id)

	 if (isSingleSelected) {
	 fillStyle = '#ff6e78'
	 }

	 if (isMultiSelected) {
	 fillStyle = '#ff6e78'
	 }

	 const isInMultiRotate = multipleToRotateIds.includes(entity.id)
	 const isInSingleRotate = singleToRotateId === entity.id

	 if (isInMultiRotate) {
	 this.handleMultipleRotationDraw(entity)
	 return
	 }
	 if (isInSingleRotate) {
	 this.handleSingleRotationDraw(entity)
	 return
	 }

	 /!*    const isDragging =
	 this._objectPositioning.singleToMoveId === entity.id &&
	 !!this._objectPositioning.singleToMoveLocation*!/
	 /!*    const isDragging2 =
	 !!this._clientState.singleToMoveEntity &&
	 this._clientState.singleToMoveEntity.id === entity.id*!/
	 const singleToMoveEntity = this._state.toMove.singleToMoveEntity
	 const isDragging2 = !!singleToMoveEntity && singleToMoveEntity.id === entity.id
	 if (isDragging2) {
	 assertNotNull(singleToMoveEntity)
	 this.handleDraggingEntityDraw(entity, singleToMoveEntity)
	 return
	 }
	 /!*    const isDragging =
	 !!this._objectPositioning.singleToMove &&
	 this._objectPositioning.singleToMove.id === entity.id
	 if (isDragging) {
	 assertNotNull(this._objectPositioning.singleToMove)
	 this.handleDraggingEntityDraw(entity, this._objectPositioning.singleToMove)
	 return
	 }*!/

	 this.ctx.save()
	 this.ctx.fillStyle = fillStyle
	 this.ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
	 this.ctx.rotate(entity.angle)
	 this.ctx.beginPath()
	 this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
	 this.ctx.fill()
	 this.ctx.stroke()
	 this.ctx.restore()
	 }

	 private handleDraggingEntityDraw(entity: CanvasEntity, singleToMove: EntityLocation) {
	 // const { singleToMoveId, singleToMoveLocation } = this._objectPositioning
	 // assertNotNull(singleToMoveLocation)
	 // if (singleToMoveId !== entity.id) return
	 this.ctx.save()
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

	 private handleSingleRotationDraw(entity: CanvasEntity) {
	 const { singleToRotateAngle } = this.rotateState
	 assertNotNull(singleToRotateAngle)
	 this.ctx.save()
	 this.ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
	 this.ctx.rotate(singleToRotateAngle)

	 this.ctx.beginPath()
	 this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
	 this.ctx.fill()
	 this.ctx.stroke()
	 this.ctx.restore()
	 }

	 private handleMultipleRotationDraw(entity: CanvasEntity) {
	 const { multipleToRotateAngleMap, multipleToRotateLocationMap } = this.rotateState
	 const angle = multipleToRotateAngleMap.get(entity.id)
	 const location = multipleToRotateLocationMap.get(entity.id)
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
	 }*/

	protected resetCanvas() {
		this.ctx.save()
		this.ctx.setTransform(1, 0, 0, 1, 0, 0)
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.restore()
	}

	protected updateToEndOfLocalArray(entityId: string, changes: Partial<CanvasEntity>) {
		const panel = this.entities.find((panel) => panel.id === entityId)
		const newPanel = { ...panel, ...changes } as CanvasEntity
		// this.entities = [...this.entities.filter((panel) => panel.id !== entityId), newPanel]
		// this._objectPositioning.setPerformanceEnd()
	}

	protected updateLocalArrayCallback() {
		return (entityId: string, changes: Partial<CanvasEntity>) => {
			this.updateToEndOfLocalArray(entityId, changes)
		}
	}
}