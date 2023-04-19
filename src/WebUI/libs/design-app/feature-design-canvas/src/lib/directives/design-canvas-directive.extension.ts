import { setupCanvas } from '../functions/setup-canvas'
import {
  CanvasAppStateStore,
  CanvasClientState,
  CanvasClientStateService,
  CanvasElementService,
  CanvasModeService,
  CanvasObjectPositioningService,
  CanvasRenderService,
  CanvasSelectedService,
  CanvasViewPositioningService,
  DomPointService,
  DragBoxService,
} from '../services'
import { CanvasAppState, initialCanvasAppState } from '../store'
import { CanvasEntity, SizeByType, TransformedPoint } from '../types'
import {
  getBoundsFromMouseEvent,
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
  MouseDownEvent,
  MouseMoveEvent,
  MouseUpEvent,
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
  protected _objectPos = inject(CanvasObjectPositioningService)
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

  protected mousePos!: HTMLDivElement
  protected transformedMousePos!: HTMLDivElement
  protected scaleElement!: HTMLDivElement
  protected stringStats!: HTMLDivElement
  protected panelStats!: HTMLDivElement
  protected menu!: HTMLDivElement
  // protected entityOnMouseDownId?: string
  // protected entityOnMouseDown?: CanvasEntity
  // protected entityOnMouseDownType?: Ent
  // protected entityOnMouseDownLocation?: Point
  protected currentTransformedCursor!: TransformedPoint
  protected _appStateStore = inject(CanvasAppStateStore)
  private _appState: CanvasAppState = initialCanvasAppState
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
    return this._state.entity.getEntities()
  }

  protected height = this.canvas.height
  protected width = this.canvas.width
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

  protected setupCanvas() {
    const { canvas, ctx } = setupCanvas(this.canvas)
    this.canvas = canvas
    this.ctx = ctx
    this._canvasEl.init(this.canvas, this.ctx)
  }

  protected setupMouseEventListeners() {
    this._renderer.listen(this.canvas, MouseUpEvent, (event: MouseEvent) => {
      console.log('mouse up', event)
      this.onMouseUpHandler(event)
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(this.canvas, MouseDownEvent, (event: MouseEvent) => {
      console.log('mouse down', event)
      this.onMouseDownHandler(event)
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(this.canvas, MouseMoveEvent, (event: MouseEvent) => {
      this.onMouseMoveHandler(event)
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(this.canvas, ContextMenuEvent, (event: PointerEvent) => {
      console.log('context menu', event)
      this.contextMenuHandler(event)
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(this.canvas, ClickEvent, (event: PointerEvent) => {
      this.mouseClickHandler(event)
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
    const size = SizeByType[ENTITY_TYPE.Panel]
    const mouseBoxBounds = getBoundsFromMouseEvent(event, size)
    return !!this.entities.find((entity) => isEntityOverlappingWithBounds(entity, mouseBoxBounds))
  }

  protected getEntityUnderMouse(event: MouseEvent) {
    const entitiesUnderMouse = this.entities.filter((entity) =>
      this.isMouseOverEntityBounds(event, entity),
    )
    return entitiesUnderMouse[entitiesUnderMouse.length - 1]
  }

  protected getEntityUnderMouseV2(event: MouseEvent) {
    const entitiesUnderMouse = this._state.entity
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