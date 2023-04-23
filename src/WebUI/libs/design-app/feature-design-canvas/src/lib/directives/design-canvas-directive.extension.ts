import { setupCanvas } from '../functions/setup-canvas'
import {
  CanvasAppStateStore,
  CanvasClientState,
  CanvasClientStateService,
  CanvasElementService,
  CanvasModeService,
  CanvasRenderService,
  CanvasSelectedService,
  CanvasViewPositioningService,
  DomPointService,
  DragBoxService,
  ObjectPositioningService,
  ObjectRotatingService,
} from '../services'
import { CanvasAppState, initialCanvasAppState } from '../store'
import { CANVAS_COLORS, CanvasEntity, SizeByType, TransformedPoint } from '../types'
import {
  getBoundsFromCenterPoint,
  getEntityBounds,
  isEntityOverlappingWithBounds,
  isPointInsideBounds,
} from '../utils'
import { ElementRef, inject, NgZone, Renderer2 } from '@angular/core'
import { ENTITY_TYPE } from '@design-app/shared'
import {
  ClickEvent,
  ContextMenuEvent,
  DoubleClickEvent,
  EVENT_TYPE,
} from '@shared/data-access/models'
import { DelayedLogger } from '@shared/logger'
import { OnDestroyDirective } from '@shared/utils'


export abstract class DesignCanvasDirectiveExtension {
  protected _onDestroy = inject(OnDestroyDirective)
  // protected _entitiesStore = inject(CanvasEntitiesStore)
  // protected _stringsStore = inject(CanvasStringsStore)
  // protected _stringsService = inject(CanvasStringsService)
  protected canvas = inject(ElementRef<HTMLCanvasElement>).nativeElement
  protected ctx!: CanvasRenderingContext2D
  protected _ngZone = inject(NgZone)
  protected _renderer = inject(Renderer2)
  protected _canvasEl = inject(CanvasElementService)
  // protected _objectPos = inject(CanvasObjectPositioningService)
  protected _objRotating = inject(ObjectRotatingService)
  protected _objPositioning = inject(ObjectPositioningService)
  protected _view = inject(CanvasViewPositioningService)
  protected _mode = inject(CanvasModeService)
  protected _drag = inject(DragBoxService)
  protected _render = inject(CanvasRenderService)
  protected _state = inject(CanvasClientStateService)
  protected _selected = inject(CanvasSelectedService)
  protected _domPoint = inject(DomPointService)
  protected delayedLogger = new DelayedLogger()
  protected mouseDownTimeOut: ReturnType<typeof setTimeout> | undefined
  protected mouseUpTimeOut: ReturnType<typeof setTimeout> | undefined

  /*  protected mouseUpTimeOutFn = setTimeout(() => {
   this.mouseUpTimeOut = undefined
   }, 50)*/

  protected fpsEl!: HTMLDivElement
  protected canvasMenu!: HTMLDivElement
  protected mousePos!: HTMLDivElement
  protected transformedMousePos!: HTMLDivElement
  protected scaleElement!: HTMLDivElement
  protected stringStats!: HTMLDivElement
  protected panelStats!: HTMLDivElement
  protected menu!: HTMLDivElement
  protected keyMap!: HTMLDivElement
  // protected entityOnMouseDownId?: string
  // protected entityOnMouseDown?: CanvasEntity
  // protected entityOnMouseDownType?: Ent
  // protected entityOnMouseDownLocation?: Point
  protected currentTransformedCursor!: TransformedPoint
  protected _appStateStore = inject(CanvasAppStateStore)
  private _appState: CanvasAppState = initialCanvasAppState

  amountOfMouseEventFires = 0
  mouseEventFiresTimeOut: ReturnType<typeof setTimeout> | undefined
  /*  mouseEventFiresTimeOutFn = () => {
   this.amountOfMouseEventFires = 0
   this.mouseEventFiresTimeOut = undefined
   }*/
  mouseEventFireStartTime = 0
  // mouseEventFireEndTime = 0
  // private _entities: CanvasEntity[] = []
  // private _strings: CanvasString[] = []

  /*  protected get appState(): CanvasAppState {
   return this._appState
   }

   protected get rotateState() {
   return {
   singleToRotateId: this._objectPos.entityToRotateId,
   singleToRotateAngle: this._objectPos.entityToRotateAngle,
   multipleToRotateIds: this._objectPos.multipleToRotateIds,
   multipleToRotateAngleMap: this._objectPos.multipleToRotateAdjustedAngle,
   multipleToRotateLocationMap: this._objectPos.multipleToRotateAdjustedLocation,
   } as RotateState
   }*/

  /*  protected get strings(): CanvasString[] {
   return this._strings
   }

   protected set strings(value: CanvasString[]) {
   this._strings = value
   this.delayedLogger.log('set strings', value)
   this.stringStats.innerText = `Strings: ${this._strings.length}`
   this.drawCanvas()
   }

   protected set entities(value: CanvasEntity[]) {
   /!*    const diff = compareArraysGetNew(value, this._entities)
   if (diff) {
   this._objectPositioning.setPerformanceEnd(diff[0].location)
   // this.delayedLogger.log('set entities', diff)
   }*!/
   this._entities = value as CanvasPanel[]
   this.delayedLogger.log('set panels', value)
   this.panelStats.innerText = `Panels: ${this._entities.length}`
   // this._objectPositioning.setPerformanceEnd()
   this.drawCanvas()
   }

   protected get entities(): CanvasEntity[] {
   return this._entities
   }*/

  protected get entities(): CanvasEntity[] {
    // return this._entities
    return this._state.entities.canvasEntities.getEntities()
  }

  protected height = this.canvas.height
  protected width = this.canvas.width

  protected mouse: TransformedPoint = { x: 0, y: 0 } as TransformedPoint
  /*
   protected appState$ = this._appStateStore.select.state$.pipe(
   takeUntil(this._onDestroy.destroy$),
   tap((state) => {
   this._appState = state
   console.log('appState$', state)
   }),
   )*/

  /*

   protected entities$ = this._entitiesStore.select.entities$.pipe(
   takeUntil(this._onDestroy.destroy$),
   tap((entities) => {
   // this.entities = entities
   // this.delayedLogger.log('entities$ difference', theSame)
   const theSame = compareArrays(entities, this.entities)
   if (!theSame) {
   this.delayedLogger.log('entities$ difference', theSame)
   this.entities = entities.filter((entity) => entity.type === ENTITY_TYPE.Panel)
   // this._objectPositioning.setPerformanceEnd()
   }
   }),
   )

   protected strings$ = this._stringsStore.select.allStrings$.pipe(
   takeUntil(this._onDestroy.destroy$),
   tap((strings) => {
   const theSame = compareArrays(strings, this.strings)
   if (!theSame) {
   this.delayedLogger.log('strings$ difference', strings)
   this.strings = strings
   }
   }),
   )
   */

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

    // const elapsed = 0
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
      /*      this._render.drawCanvas()
       if (this._state.dragBox.start) {
       this._render.drawIndependentDragBoxWithMouse(this.mouse)
       }*/
      // requestAnimationFrame(fpsRender)
    }
    requestAnimationFrame(fpsRender)
    /*    renderer(() => {
     const time = performance.now()
     frames++
     if (time >= prevTime + 1000) {
     const fps = (frames * 1000) / (time - prevTime)
     text = `${fps.toFixed(1)} FPS`
     prevTime = time
     frames = 0
     }
     this.fpsEl.innerText = text
     })*/
    /*    const fps = 60
     const interval = 1000 / fps
     let then = Date.now()
     let now = then
     const delta = now - then
     const step = () => {
     requestAnimationFrame(step)
     now = Date.now()
     const delta = now - then
     if (delta > interval) {
     then = now - (delta % interval)
     // this.draw()
     this._render.drawCanvas()
     }
     }
     requestAnimationFrame(step)*/
  }

  protected setupMouseEventListeners() {
    this._renderer.listen(this.canvas, EVENT_TYPE.POINTER_UP, (event: PointerEvent) => {
      // this._renderer.listen(this.canvas, MouseUpEvent, (event: MouseEvent) => {
      console.log('mouse up', event)
      this._state.updateState({
        mouse: {
          mouseDown: false,
        },
      })
      this.onMouseUpHandler(event)
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(this.canvas, EVENT_TYPE.POINTER_DOWN, (event: PointerEvent) => {
      // this._renderer.listen(this.canvas, MouseDownEvent, (event: MouseEvent) => {
      console.log('mouse down', event)
      this._state.updateState({
        mouse: {
          mouseDown: true,
        },
      })
      this.onMouseDownHandler(event)
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(this.canvas, EVENT_TYPE.POINTER_MOVE, (event: PointerEvent) => {
      /*      if (!this.mouseEventFiresTimeOut) {
       this.mouseEventFiresTimeOut = setTimeout(() => {
       const fps = this.amountOfMouseEventFires
       this.fpsEl.innerText = `${fps.toFixed(1)} FPS`

       this.mouseEventFiresTimeOut = undefined
       this.amountOfMouseEventFires = 0
       }, 1000)
       }
       this.amountOfMouseEventFires++*/
      this.mouse = this._domPoint.getTransformedPointFromEvent(event)
      this._state.updateState({
        mouse: {
          point: this._domPoint.getTransformedPointFromEvent(event),
        },
      })
      this.onMouseMoveHandler(event)
      event.stopPropagation()
      event.preventDefault()
    })
    /*    this._renderer.listen(this.canvas, MouseMoveEvent, (event: MouseEvent) => {
     this.mouse = this._domPoint.getTransformedPointFromEvent(event)
     this._state.updateState({
     mouse: {
     point: this._domPoint.getTransformedPointFromEvent(event),
     },
     })
     this.onMouseMoveHandler(event)
     event.stopPropagation()
     event.preventDefault()
     })*/
    this._renderer.listen(this.canvas, ContextMenuEvent, (event: PointerEvent) => {
      console.log('context menu', event)
      this.contextMenuHandler(event)
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(this.canvas, ClickEvent, (event: PointerEvent) => {
      console.log('mouseClickHandler', event)
      // this.mouseClickHandler(event)
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(this.canvas, DoubleClickEvent, (event: PointerEvent) => {
      this.doubleClickHandler(event)
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(this.canvas, EVENT_TYPE.WHEEL, (event: WheelEvent) => {
      this.wheelScrollHandler(event)
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(window, 'resize', (event: Event) => {
      console.log('resize', event)
      this.canvas.style.width = window.innerWidth
      this.canvas.style.height = window.innerHeight
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

  abstract onMouseUpHandler(event: MouseEvent): void

  abstract onMouseDownHandler(event: MouseEvent): void

  abstract onMouseMoveHandler(event: MouseEvent): void

  abstract contextMenuHandler(event: PointerEvent): void

  abstract mouseClickHandler(event: PointerEvent): void

  abstract doubleClickHandler(event: PointerEvent): void

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

  protected anyEntitiesNearAreaOfClick(event: MouseEvent) {
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

      let animationId: number
      const reply = () => {
        this._render.drawCanvasWithFunction(drawFunction)
        animationId = requestAnimationFrame(reply)
      }

      reply()
      /*
       const animationId = requestAnimationFrame((fn) => {
       this._render.drawCanvasWithFunction(drawFunction)
       // fn
       console.log('requestAnimationFrame', animationId)
       })*/

      const interval = setInterval(() => {
        cancelAnimationFrame(animationId)
        this._render.drawCanvas()
        clearInterval(interval)
        console.log('cancelAnimationFrame', animationId)
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
    this._render.drawCanvas()
    return false
  }

  protected getEntityUnderMouse(event: MouseEvent) {
    const entitiesUnderMouse = this.entities.filter((entity) =>
      this.isMouseOverEntityBounds(event, entity),
    )
    return entitiesUnderMouse[entitiesUnderMouse.length - 1]
  }

  protected seeClashesFromMouse(event: MouseEvent) {
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

      this._render.drawCanvasWithFunction((ctx: CanvasRenderingContext2D) => {
        ctx.save()
        ctx.beginPath()
        ctx.globalAlpha = 0.4
        ctx.fillStyle = CANVAS_COLORS.TakenSpotFillStyle
        ctx.rect(mouseBoxBounds.left, mouseBoxBounds.top, size.width, size.height)
        ctx.fill()
        ctx.stroke()
        ctx.restore()
      })
      return true
    }
    this.canvas.style.cursor = 'default'
    this._render.drawCanvas()
    return false
    /*    const entitiesUnderMouse = this.entities.filter((entity) =>
     this.isMouseOverEntityBounds(event, entity),
     )

     return entitiesUnderMouse*/
  }

  protected getEntityUnderMouseV2(event: MouseEvent) {
    const entitiesUnderMouse = this._state.entities.canvasEntities
      .getEntities()
      .filter((entity) => this.isMouseOverEntityBounds(event, entity))
    return entitiesUnderMouse[entitiesUnderMouse.length - 1]
  }

  protected isMouseOverEntityBounds(event: MouseEvent, entity: CanvasEntity) {
    const point = this._domPoint.getTransformedPointFromEvent(event)
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

  protected updateClientState(changes: Partial<CanvasClientState>) {
    this._state.updateState(changes)
  }

  protected updateClientStateCallback() {
    return (changes: Partial<CanvasClientState>) => {
      this.updateClientState(changes)
    }
  }
}