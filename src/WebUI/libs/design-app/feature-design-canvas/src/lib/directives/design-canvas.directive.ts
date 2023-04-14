import { Directive, ElementRef, inject, Input, NgZone, OnInit, Renderer2 } from '@angular/core'
import { ClickEvent, ContextMenuEvent, CURSOR_TYPE, DoubleClickEvent, EventName, KEYS, MouseDownEvent, MouseMoveEvent, MouseUpEvent, POINTER_BUTTON, XyLocation } from '@shared/data-access/models'
import { assertIsPanel, CanvasEntity, CanvasPanel, CanvasString, createPanel, EntityFactory, isPanel, TransformedPoint, UndefinedStringId } from '../types'
import { compareArrays, eventToXyLocation } from '../functions'
import { ENTITY_TYPE } from '@design-app/shared'
import { CanvasElementService, CanvasEntitiesStore, CanvasSelectedService, CanvasStringsService, CanvasStringsStore, DomPointService } from '../services'
import { setupCanvas } from '../functions/setup-canvas'
import { assertNotNull, OnDestroyDirective } from '@shared/utils'
import { roundToTwoDecimals } from 'design-app/utils'
import { Store } from '@ngrx/store'
import { takeUntil, tap } from 'rxjs'
import { DelayedLogger } from '@shared/logger'
import { CanvasScale } from '../models/scale'
import { getEntitySizeOffset } from '../functions/object-sizing'
import { CanvasObjectPositioningService } from '../services/canvas-object-positioning.service'

@Directive({
  selector:   '[appDesignCanvas]',
  providers:  [OnDestroyDirective],
  standalone: true,
})
export class DesignCanvasDirective
  implements OnInit {

  private _store = inject(Store)
  private _onDestroy = inject(OnDestroyDirective)
  private _entitiesStore = inject(CanvasEntitiesStore)
  private _stringsStore = inject(CanvasStringsStore)
  private _stringsService = inject(CanvasStringsService)
  private _canvas = inject(ElementRef<HTMLCanvasElement>).nativeElement
  private _ctx!: CanvasRenderingContext2D
  private _ngZone = inject(NgZone)
  private _renderer = inject(Renderer2)
  private _canvasElementService = inject(CanvasElementService)
  private _objectPositioning = inject(CanvasObjectPositioningService)
  // private _selected = new CanvasSelectedService()
  private _selected = inject(CanvasSelectedService)
  private _domPointService = inject(DomPointService)
  private _delayedLogger = new DelayedLogger()
  // private _logger = new Logger
  // private _domPointService!: DomPointService
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private mouseDownTimeOut: ReturnType<typeof setTimeout> | undefined
  private mouseUpTimeOut: ReturnType<typeof setTimeout> | undefined

  // private clickTimeout?: NodeJS.Timeout | undefined
  private _panels: CanvasPanel[] = []
  private _strings: CanvasString[] = []
  private _selectedPanel?: CanvasEntity
  private _animateScreenMoveId?: number

  mousePos!: HTMLDivElement
  transformedMousePos!: HTMLDivElement
  scaleElement!: HTMLDivElement
  stringStats!: HTMLDivElement
  panelStats!: HTMLDivElement
  menu!: HTMLDivElement

  currentTransformedCursor!: TransformedPoint

  public get animateScreenMoveId(): number | undefined {
    return this._animateScreenMoveId
  }

  public set animateScreenMoveId(value: number | undefined) {
    this._animateScreenMoveId = value
    if (value) {
      console.log('set animateScreenMoveId', value)
    } else {
      console.log('animateScreenMoveId cancelled')
    }
  }

  get strings(): CanvasString[] {
    return this._strings
  }

  set strings(value: CanvasString[]) {
    this._strings = value
    this._delayedLogger.log('set strings', value)
    this.stringStats.innerText = `Strings: ${this._strings.length}`
    this.drawPanels()
  }

  public set panels(value: CanvasEntity[]) {
    this._panels = value as CanvasPanel[]
    this._delayedLogger.log('set panels', value)
    this.panelStats.innerText = `Panels: ${this._panels.length}`
    this.drawPanels()
  }

  public get panels(): CanvasEntity[] {
    return this._panels
  }

  isDraggingEntity = false
  isDraggingScreen = false
  entityOnMouseDown?: CanvasEntity

  screenDragStartPoint: XyLocation = { x: 0, y: 0 }
  _scale = 1
  get scale(): number {
    return this._scale
  }

  set scale(value: number) {
    this._scale = roundToTwoDecimals(value)
    console.log('set scale', this._scale)
    this.scaleElement.innerText = `Scale: ${this._scale}`
  }

  canvasScale = new CanvasScale(1, 1)

  _screenPosition: XyLocation = { x: 0, y: 0 }
  get screenPosition(): XyLocation {
    return this._screenPosition
  }

  set screenPosition(value: XyLocation) {
    this._screenPosition = value
    console.log('set screenPosition', value)
  }

  @Input() set drawTime(value: string) {
    console.log('set drawTime', value)
    this.drawPanels()
  }

  height = this._canvas.height
  width = this._canvas.width
  image: HTMLImageElement | undefined

  isHoveringEntity = false
  hoveringEntityId?: string
  entityDragOffset: XyLocation = { x: 0, y: 0 }
  selectionBoxStartPoint?: TransformedPoint
  isSelectionBoxDragging = false
  selectionBoxFillStyle = '#7585d8'
  defaultPanelFillStyle = '#8ED6FF'
  multiSelectionDragging = false

  entities$ = this._entitiesStore.select.entities$.pipe(
    takeUntil(this._onDestroy.destroy$),
    tap(entities => {
      const theSame = compareArrays(entities, this.panels)
      if (!theSame) {
        this._delayedLogger.log('entities$ difference', theSame)
        this.panels = entities.filter(entity => entity.type === ENTITY_TYPE.Panel)
      }
    }),
  )

  strings$ = this._stringsStore.select.allStrings$.pipe(
    takeUntil(this._onDestroy.destroy$),
    tap(strings => {
        const theSame = compareArrays(strings, this.strings)
        if (!theSame) {
          this._delayedLogger.log('strings$ difference', strings)
          this.strings = strings
        }
      },
    ),
  )

  public ngOnInit() {
    this.setupCanvas()
    this._ngZone.runOutsideAngular(() => {
      this.setupMouseEventListeners()
    })
    this.mousePos = document.getElementById('mouse-pos') as HTMLDivElement
    this.transformedMousePos = document.getElementById('transformed-mouse-pos') as HTMLDivElement
    this.scaleElement = document.getElementById('scale-element') as HTMLDivElement
    this.stringStats = document.getElementById('string-stats') as HTMLDivElement
    this.panelStats = document.getElementById('panel-stats') as HTMLDivElement
    this.menu = document.getElementById('menu') as HTMLDivElement
    console.log(this.mousePos, this.transformedMousePos)
    this.entities$.subscribe()
    this.strings$.subscribe()
  }

  private setupCanvas() {
    const { canvas, ctx } = setupCanvas(this._canvas)
    this._canvas = canvas
    this._ctx = ctx
    this._canvasElementService.init(this._canvas, this._ctx)
  }

  private setupMouseEventListeners() {
    this._renderer.listen(this._canvas, MouseUpEvent, (event: MouseEvent) => {

      console.log('mouse up', event)
      this.onMouseUpHandler(event)
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(this._canvas, MouseDownEvent, (event: MouseEvent) => {

      console.log('mouse down', event)
      this.onMouseDownHandler(event)
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(this._canvas, MouseMoveEvent, (event: MouseEvent) => {

      this.onMouseMoveHandler(event)
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(this._canvas, ContextMenuEvent, (event: PointerEvent) => {

      console.log('context menu', event)
      this.contextMenuHandler(event)
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(this._canvas, ClickEvent, (event: PointerEvent) => {

      this.mouseClickHandler(event)
      event.stopPropagation()
      event.preventDefault()
      // console.log('context menu', event)
    })
    this._renderer.listen(this._canvas, DoubleClickEvent, (event: PointerEvent) => {

      this.doubleClickHandler(event)
      event.stopPropagation()
      event.preventDefault()
      // console.log('context menu', event)
    })
    this._renderer.listen(this._canvas, EventName.Wheel, (event: WheelEvent) => {

      this.wheelScrollHandler(event)
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(window, 'resize', (event: Event) => {

      console.log('resize', event)
      this._canvas.style.width = window.innerWidth
      this._canvas.style.height = window.innerHeight
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(window, EventName.KeyUp, (event: KeyboardEvent) => {
      event.stopPropagation()
      event.preventDefault()
      console.log('keyup menu', event)
      if (event.key === 'Delete') {
        this.panels = this.panels.filter(panel => panel !== this.entityOnMouseDown)
      }
      if (event.key === 'Escape') {
        this._selected.clearSelectedState()
      }
      if (event.shiftKey) {
        console.log('shift key up')
        // this._selected.isMultiSelectDragging = false
      }
      if (event.key === KEYS.R) {
        console.log('r key up')
        if (this._objectPositioning.entityToRotateId) {
          this._objectPositioning.clearEntityToRotate()
          return
        }
        if (this._selected.selected && !this._objectPositioning.entityToRotateId) {
          this._objectPositioning.setEntityToRotate(this.getLiveSelectedPanel(), this.currentTransformedCursor)
          // this._selected.selected.rotation += 90
          // const storeUpdate = Factory.Panel.updateForStore(this._selected.selected.id as PanelId, { angle: 90 })
          // const storeUpdate = updateObjectForStore(this._selected.selected, { rotation: this._selected.selected.rotation + 90 })
          // this._entitiesStore.dispatch.updateCanvasEntity(storeUpdate)
          // this.updateToLocalArray(this._selected.selected.id, { angle: 90 })
          // this._stringsService.removeStringWithPanels(this._selected.getMultiSelectedByType(ENTITY_TYPE.Panel), this.strings)
        }
      }
      if (event.key === KEYS.G) {
        this.drawPanels()
      }
      if (event.key === KEYS.X) {
        if (this._selected.multiSelected.length > 0) {
          this._stringsService.createStringWithPanels(this._selected.getMultiSelectedByType(ENTITY_TYPE.Panel), this.strings)

        }
        // this.drawPanels()
      }
    })
  }

  /**
   * ! Event Handlers
   */

  /**
   * Mouse Down handler
   * @param event
   * @private
   */

  private onMouseDownHandler(event: MouseEvent) {
    if (event.button === POINTER_BUTTON.SECONDARY) {
      return
    }
    this.mouseDownTimeOut = setTimeout(() => {
      this.mouseDownTimeOut = undefined
    }, 100)
    const isDraggingScreen = (event.ctrlKey || event.button === POINTER_BUTTON.WHEEL) && !event.shiftKey
    if (isDraggingScreen) {
      this.isDraggingScreen = true
      console.log('dragging screen')
      this.screenDragStartPoint = this._domPointService.getTransformedPointFromEvent(event)
      return
    }
    if (event.altKey) {
      this.isSelectionBoxDragging = true
      this.selectionBoxStartPoint = this._domPointService.getTransformedPointFromEvent(event)
    }
    const isMultiSelectDragging = event.shiftKey && event.ctrlKey && this._selected.multiSelected.length > 0
    if (isMultiSelectDragging) {
      this._selected.startMultiSelectDragging(event)
      return
    }
    const clickedOnEntity = this.getMouseOverPanel(event)
    if (clickedOnEntity) {
      console.log('clicked on entity', clickedOnEntity)
      this.entityOnMouseDown = clickedOnEntity
      if (this._selected.selected?.id !== clickedOnEntity.id && !event.shiftKey) {
        this._selected.clearSingleSelected()
      }
    }

  }

  /**
   * Mouse Up handler
   * @param event
   * @private
   */

  private onMouseUpHandler(event: MouseEvent) {
    if (event.button === POINTER_BUTTON.SECONDARY) return
    if (this.mouseDownTimeOut) {
      clearTimeout(this.mouseDownTimeOut)
      this.mouseDownTimeOut = undefined
      this.entityOnMouseDown = undefined
      return
    }
    this.mouseUpTimeOut = setTimeout(() => {
      this.mouseUpTimeOut = undefined
    }, 100)
    if (event.button === POINTER_BUTTON.SECONDARY) return
    console.log('mouse up', event)
    if (this.isDraggingScreen) {
      this.isDraggingScreen = false
      return
    }
    if (this.isSelectionBoxDragging) {
      this.isSelectionBoxDragging = false
      if (
        this.selectionBoxStartPoint) {
        // const panelsInArea = this.areAnyPanelsInArea(getTransformedPointFromEvent(this._ctx, event))
        const panelsInArea = this.getAllElementsBetweenTwoPoints(this.selectionBoxStartPoint, this._domPointService.getTransformedPointFromEvent(event))
        // const panelsInArea = getAllElementsBetweenTwoPoints(this.panels, this.selectionBoxStartPoint, this._domPointService.getTransformedPointFromEvent(event))
        if (panelsInArea) {
          this._selected.setMultiSelected(panelsInArea)
          console.log('panelsInArea', panelsInArea)
        }
      }
      this.selectionBoxStartPoint = undefined
      this.drawPanels()
      return
    }
    if (this.isDraggingEntity) {
      this.isDraggingEntity = false
      console.log('entityOnMouseDown', this.entityOnMouseDown)
      if (this.entityOnMouseDown) {
        const location = this._domPointService.getTransformedPointToMiddleOfObjectFromEvent(event, this.entityOnMouseDown.type)
        const updatedEntity = EntityFactory.updateForStore(this.entityOnMouseDown, { location })
        this._entitiesStore.dispatch.updateCanvasEntity(updatedEntity)
        this.entityOnMouseDown = undefined
      }
      return
    }
    if (this._selected.isMultiSelectDragging) {
      this._selected.stopMultiSelectDragging(event)
      return
    }
    this.isDraggingEntity = false
    this.isDraggingScreen = false
    this.entityOnMouseDown = undefined
  }

  /**
   * Mouse Click handler
   * @param event
   * @private
   */

  private mouseClickHandler(event: PointerEvent) {
    if (this.menu.style.display === 'initial') {
      this.menu.style.display = 'none'
      return
    }
    if (this.mouseUpTimeOut) {
      clearTimeout(this.mouseUpTimeOut)
      this.mouseUpTimeOut = undefined
      return
    }
    console.log('click', event)
    const isPanel = this.getMouseOverPanel(event)
    if (isPanel) {
      if (event.shiftKey) {
        this._selected.addToMultiSelected(isPanel)
        return
      }
      this._selected.setSelected(isPanel)
      return
    }
    this._selected.clearSelectedState()
    // this._selected.clearSingleSelected()
    if (this.areAnyPanelRectsNearClick(eventToXyLocation(event))) {
      return
    }
    const location = this._domPointService.getTransformedPointToMiddleOfObjectFromEvent(event, ENTITY_TYPE.Panel)
    const isStringSelected = !!this._selected.selectedStringId
    const entity = isStringSelected
      ? createPanel(location, this._selected.selectedStringId)
      : createPanel(location)
    this._entitiesStore.dispatch.addCanvasEntity(entity)
    /*  let entity: CanvasEntity

     if (!isStringSelected) {
     const entity = createPanel(location)
     this._entitiesStore.dispatch.addCanvasEntity(entity)
     }*/

    this.drawPanels()
  }

  /**
   * Double Click handler
   * @param event
   * @private
   */

  private doubleClickHandler(event: PointerEvent) {
    console.log('double click', event)
    const mouseOverPanel = this.getMouseOverPanel(event)
    if (mouseOverPanel) {
      if (!isPanel(mouseOverPanel)) return
      if (mouseOverPanel.stringId === UndefinedStringId) return
      const belongsToString = this.strings.find(string => string.id === mouseOverPanel.stringId)
      assertNotNull(belongsToString, 'string not found')
      this._selected.setSelectedStringId(belongsToString.id)
    }
  }

  /**
   * Mouse Move handler
   * @param event
   * @private
   */

  private onMouseMoveHandler(event: MouseEvent) {
    this.currentTransformedCursor = this._domPointService.getTransformedPointFromEvent(event)
    this.mousePos.innerText = `Original X: ${event.offsetX}, Y: ${event.offsetY}`
    this.transformedMousePos.innerText = `Transformed X: ${this.currentTransformedCursor.x}, Y: ${this.currentTransformedCursor.y}`
    if (this._objectPositioning.entityToRotateId) {
      const entityToRotate = this.getLiveSelectedPanelById(this._objectPositioning.entityToRotateId)
      if (!entityToRotate) return
      const transformedPoint = this._domPointService.getTransformedPointFromXy(entityToRotate.location)
      this._objectPositioning.rotateEntityViaMouse(event, transformedPoint, { width: entityToRotate.width, height: entityToRotate.height })
      this.drawPanels()
      return
    }
    if (this.isDraggingScreen) {
      if (event.ctrlKey || event.buttons === 4) {
        this._canvas.style.cursor = CURSOR_TYPE.MOVE
        const transformX = this.currentTransformedCursor.x - this.screenDragStartPoint.x
        const transformY = this.currentTransformedCursor.y - this.screenDragStartPoint.y
        this._ctx.translate(transformX, transformY)
        this.drawPanels()
      }
      return
    }
    if (this.isSelectionBoxDragging) {
      if (!event.altKey) {
        this.isSelectionBoxDragging = false
        this.selectionBoxStartPoint = undefined
        this.drawPanels()
        return
      }
      this.animateSelectionBox(event)
      return
    }
    const isReadyToMultiDrag = this._selected.multiSelected.length > 0 && event.shiftKey && event.ctrlKey && !this._selected.isMultiSelectDragging
    if (isReadyToMultiDrag) {
      this._canvas.style.cursor = CURSOR_TYPE.GRAB
      return
    }
    if (this._selected.isMultiSelectDragging) {
      if (!event.shiftKey || !event.ctrlKey) {
        this._selected.stopMultiSelectDragging(event)
        return
      }
      this._canvas.style.cursor = CURSOR_TYPE.GRABBING
      this._selected.onMultiDragging(event)
      this.drawPanels()
      return
    }
    if (this.entityOnMouseDown) {
      this._canvas.style.cursor = CURSOR_TYPE.GRABBING
      this.isDraggingEntity = true
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
      const location = this._domPointService.getTransformedPointToMiddleOfObjectFromEvent(event, this.entityOnMouseDown.type)
      const isSpotTaken = this.anyObjectsNearLocationExcludingGrabbed(location, this.entityOnMouseDown)
      if (isSpotTaken) {
        this._canvas.style.cursor = CURSOR_TYPE.CROSSHAIR
        // return
      }
      this.entityOnMouseDown = EntityFactory.update(this.entityOnMouseDown, { location })
      this.updateToBackOfArray(this.entityOnMouseDown, { location })
      /*    const entityUpdate = EntityFactory.updateForStore(this.entityOnMouseDown, { location })
       this._entitiesStore.dispatch.updateCanvasEntity(entityUpdate)*/
      // this.
      return
    }

    const isPanel = this.getMouseOverPanel(event)
    if (isPanel) {

      this._canvas.style.cursor = CURSOR_TYPE.POINTER
      if (this.hoveringEntityId === isPanel.id) return
      this.hoveringEntityId = isPanel.id
      this.drawPanels()
      return
    } else {
      if (this.hoveringEntityId) {
        this.hoveringEntityId = undefined
        this.drawPanels()
      }
      this._canvas.style.cursor = CURSOR_TYPE.AUTO
    }
  }

  /**
   * Wheel Scroll handler
   * @param event
   * @private
   */

  private wheelScrollHandler(event: WheelEvent) {
    if (this._objectPositioning.entityToRotate) {
      this._objectPositioning.rotateEntityViaWheel(event)
      return
    }

    const currentTransform = this._ctx.getTransform()
    const currentScaleX = currentTransform.a
    // const currentScaleY = currentTransform.d
    this.canvasScale.setScale(currentScaleX)

    const zoom = event.deltaY < 0
      ? 1.1
      : 0.9

    const currentTransformedCursor = this._domPointService.getTransformedPointFromEvent(event)
    this._ctx.translate(currentTransformedCursor.x, currentTransformedCursor.y)
    this._ctx.scale(zoom, zoom)
    this._ctx.translate(-currentTransformedCursor.x, -currentTransformedCursor.y)
    this.scaleElement.innerText = `Scale: ${currentScaleX}`

    this.drawPanels()
    event.preventDefault()
  }

  /**
   * Context Menu handler
   * @param event
   * @private
   */

  private contextMenuHandler(event: PointerEvent) {
    const mouseOverPanel = this.getMouseOverPanel(event)
    if (mouseOverPanel) {
      if (!isPanel(mouseOverPanel)) return
      const panel = mouseOverPanel
      this._renderer.setStyle(this.menu, 'display', 'initial')
      this._renderer.setStyle(this.menu, 'top', `${event.offsetY + panel.height / 2}px`)
      this._renderer.setStyle(this.menu, 'left', `${event.offsetX + panel.width / 2}px`)
      this._renderer.setAttribute(this.menu, 'data-id', panel.id)
      this._renderer.setAttribute(this.menu, 'data-type', panel.type)
      this._renderer.setAttribute(this.menu, 'data-stringId', panel.stringId)
      this._renderer.setAttribute(this.menu, 'data-angle', panel.angle.toString())

      // this._renderer.setAttribute(this.menu, 'data-type', panel)

      console.log('contextMenuHandler', this.menu)
      /*      this.menu.style.display = 'initial'
       this.menu.style.top = event.offsetY + panel.height / 2 + 'px'
       this.menu.style.left = event.offsetX + panel.width / 2 + 'px'*/
      /*      this.menu.style.top = transformedPoint.y + 'px'
       this.menu.style.left = transformedPoint.x + 'px'*/
      /*      this.menu.style.top =
       mouseOverPanel.location.x + 4 + 'px'
       this.menu.style.left =
       mouseOverPanel.location.y + 4 + 'px'*/
      /*      const containerRect = stage.container()
       .getBoundingClientRect()
       this.menu.style.top =
       containerRect.top + stage.getPointerPosition().y + 4 + 'px'
       this.menu.style.left =
       containerRect.left + stage.getPointerPosition().x + 4 + 'px'*/
      /*      const belongsToString = this.strings.find(string => string.id === mouseOverPanel.stringId)
       assertNotNull(belongsToString, 'string not found')
       this._selected.setSelectedStringId(belongsToString.id)*/
    }
  }

  private areAnyPanelRectsNearClick(point: XyLocation) {
    const transformedPoint = this._domPointService.getTransformedPointFromXy(point)
    for (const object of this.panels) {
      const { location, width, height } = object
      const { x, y } = location
      const xDistance = Math.abs(transformedPoint.x - (x + width / 2))
      const yDistance = Math.abs(transformedPoint.y - (y + height / 2))
      const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2)
      const threshold = xDistance > yDistance
        ? object.width
        : object.height
      if (distance <= threshold) {
        console.log('isNearClick: ____ near click')
        return true
      }
    }
    return false
  }

  private anyObjectsNearLocationExcludingGrabbed(point: XyLocation, grabbed: CanvasEntity) {
    const transformedPoint = this._domPointService.getTransformedPointFromXy(point)
    const scale = this._domPointService.scale
    for (const object of this.panels) {
      if (object.id === grabbed.id) continue
      const { location, width, height } = object
      const transformedLocation = this._domPointService.getTransformedPointFromXy(location)
      const { x, y } = transformedLocation
      const xDistance = Math.abs(transformedPoint.x - (x + width / 2) + 10)
      const yDistance = Math.abs(transformedPoint.y - (y + height / 2) + 10)
      const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2)
      const threshold = xDistance > yDistance
        ? object.width
        : object.height
      if (distance <= threshold) {
        console.log('isNearClick: ____ near click')
        return true
      }
    }
    return false
  }

  private animateSelectionBox(event: MouseEvent) {
    if (!this.selectionBoxStartPoint || !this.isSelectionBoxDragging || !event.altKey) {
      throw new Error('selection box not started')
    }
    const mousePointToScale = this._domPointService.getTransformedPointFromXy(eventToXyLocation(event))
    const width = mousePointToScale.x - this.selectionBoxStartPoint.x
    const height = mousePointToScale.y - this.selectionBoxStartPoint.y

    this.drawPanels()
    this._ctx.beginPath()
    this._ctx.globalAlpha = 0.4
    this._ctx.fillStyle = this.selectionBoxFillStyle
    this._ctx.rect(this.selectionBoxStartPoint.x, this.selectionBoxStartPoint.y, width, height)
    this._ctx.fill()
    this._ctx.stroke()
    this._ctx.closePath()
    this._ctx.globalAlpha = 1.0
    this._ctx.fillStyle = this.defaultPanelFillStyle
  }

  private getMouseOverPanel(event: MouseEvent) {
    const mouseOverPanels = this._panels.filter(panel => this.isMouseOverPanel(event, panel))
    return mouseOverPanels[mouseOverPanels.length - 1]
  }

  private isMouseOverPanel(event: MouseEvent, panel: CanvasEntity) {
    const { x, y } = this._domPointService.getTransformedPointFromEvent(event)
    const { location, width, height } = panel
    return x >= location.x && x <= location.x + width && y >= location.y && y <= location.y + height
  }

  private drawPanel(panel: CanvasEntity) {
    assertIsPanel(panel)

    let fillStyle = this.defaultPanelFillStyle

    const isBeingHovered = this.hoveringEntityId === panel.id
    if (isBeingHovered) {
      fillStyle = '#17fff3'
    }

    const isSingleSelected = this._selected.selected && this._selected.selected.id === panel.id
    const isMultiSelected = this._selected.multiSelected && this._selected.multiSelected.find(selected => selected.id === panel.id)

    if (isSingleSelected) {
      fillStyle = '#ff6e78'
    }

    if (isMultiSelected) {
      fillStyle = '#ff6e78'
    }

    const stringIsSelected = !!this._selected.selectedStringId
    const panelStringIsSelected = this._selected.selectedStringId === panel.stringId
    if (panelStringIsSelected) {
      const panelString = this._strings.find(string => string.id === panel.stringId)
      assertNotNull(panelString, 'panelString should not be null')
      if (this._selected.selectedStringId === panelString.id) {
        fillStyle = panelString.color
      }
    }
    const otherPanelStringIsSelected = stringIsSelected && !panelStringIsSelected
    if (otherPanelStringIsSelected) {
      fillStyle = '#afb8d8'
    }
    this._ctx.beginPath()
    // const fillStyleIsDefault = fillStyle === this.defaultPanelFillStyle
    /*    if (!fillStyleIsDefault) {
     this._ctx.closePath()
     }
     this._ctx.closePath()*/
    this._ctx.save()
    this._ctx.fillStyle = fillStyle
    // const transformedPoint = this._domPointService.getTransformedPointFromXy(panel.location)
    // this._ctx.translate(transformedPoint.x, transformedPoint.y)
    // this._ctx.translate(transformedPoint.x, transformedPoint.y)
    // this._ctx.translate(panel.width, panel.height)
    // get randomNumber

    // const randomNumber = Math.floor(Math.random() * 4)
    // this._ctx.translate(this._ctx.canvas.width * 0.5, this._ctx.canvas.height * 0.5)    // center
    // this._ctx.rotate(Math.PI * 0.5)
    // this._ctx.rotate(randomNumber * Math.PI / 180)
    // this._ctx.translate(panel.location.x * 0.5, panel.location.y * 0.5)
    // this._ctx.translate(this._ctx.canvas.width * 0.5, this._ctx.canvas.height * 0.5)
    this._ctx.translate(panel.location.x + panel.width / 2, panel.location.y + panel.height / 2)

    if (this._objectPositioning.entityToRotateId === panel.id) {
      assertNotNull(this._objectPositioning.entityToRotateAngle, 'entityToRotateAngle should not be null')
      this._ctx.rotate(this._objectPositioning.entityToRotateAngle * Math.PI / 180)
    } else {
      this._ctx.rotate(panel.angle * Math.PI / 180)
    }

    // this._ctx.translate(-panel.location.x * 0.5, -panel.location.y * 0.5)
    // this._ctx.translate(-this._ctx.canvas.width * 0.5, -this._ctx.canvas.height * 0.5)
    // ctx.fillRect(-width / 2, -height / 2, width, height);
    this._ctx.rect(-panel.width / 2, -panel.height / 2, panel.width, panel.height)
    // this._ctx.rect(panel.location.x, panel.location.y, panel.width, panel.height)
    this._ctx.fill()
    this._ctx.stroke()
    /*    this._ctx.translate(panel.location.x + panel.width / 2, panel.location.y + panel.height / 2)
     this._ctx.rotate(randomNumber * Math.PI / 180)*/
    // this._ctx.rotate(randomNumber * Math.PI / 180)
    // this._ctx.rect(panel.location.x, panel.location.y, panel.width, panel.height)
    // this._ctx.strokeRect(panel.location.x, panel.location.y, panel.width, panel.height)
    // this._ctx.fillRect(panel.location.x, panel.location.y, panel.width, panel.height)
    // this._ctx.fill()
    // this._ctx.stroke()
    // this._ctx
    // this._ctx.translate(-panel.width, -panel.height)
    // this._ctx.beginPath()
    // this._ctx.translate(-(panel.location.x + panel.width / 2), -(panel.location.y + panel.height / 2))
    // this._ctx.fillStyle = this.defaultPanelFillStyle
    this._ctx.restore()
    /*    if (isSingleSelected) {
     this._ctx.closePath()
     this._ctx.save()

     const rad = 40 * Math.PI / 180

     this._ctx.translate(panel.location.x + panel.width / 2, panel.location.y + panel.height / 2)

     this._ctx.rotate(rad)

     //draw the image
     this._ctx.rect(panel.location.x, panel.location.y, panel.width, panel.height)
     this._ctx.fill()
     this._ctx.stroke()

     this._ctx.restore()
     this._ctx.beginPath()

     this._ctx.rotate((45 * Math.PI) / 180)
     this._ctx.fillStyle = 'red'
     this._ctx.fillRect(100, 0, 80, 20)
     }*/

  }

  private drawPanels() {
    this._delayedLogger.log('draw panels')
    this.resetCanvas()
    this._ctx.beginPath()
    this._panels.forEach(panel => {
      this.drawPanel(panel)
    })
    this._ctx.closePath()
  }

  private resetCanvas() {
    this._ctx.save()
    this._ctx.setTransform(1, 0, 0, 1, 0, 0)
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
    this._ctx.restore()
  }

  private drawPanelsNoClear() {
    console.log('draw panels no clear')
    this._ctx.beginPath()
    this._panels.forEach(panel => {
      this.drawPanel(panel)
    })
    this._ctx.closePath()
  }

  getAllElementsBetweenTwoPoints(
    point1: TransformedPoint,
    point2: TransformedPoint,
  ) {
    // const objectRects = this._componentElementsService.getComponentElementRectsWithId()
    const elementsBetweenPoints = this.panels.filter((objectRect) => {
      // const widthOffset
      const { widthOffset, heightOffset } = getEntitySizeOffset(objectRect)
      // Bottom Left To Top Right
      if (point1.x < point2.x && point1.y > point2.y) {
        // Left To Right
        if (point1.x < objectRect.location.x && point2.x > objectRect.location.x + widthOffset) {
          // Bottom To Top
          if (point2.y < objectRect.location.y && point1.y > objectRect.location.y + heightOffset) {
            console.log('Bottom Left To Top Right')
            return true
          }
        }
      }
      // Top Left To Bottom Right
      if (point1.x < point2.x && point1.y < point2.y) {
        // Left To Right
        if (point1.x < objectRect.location.x && point2.x > objectRect.location.x + widthOffset) {
          // Top To Bottom
          if (point1.y < objectRect.location.y && point2.y > objectRect.location.y + heightOffset) {
            console.log('Top Left To Bottom Right')
            return true
          }
        }
      }

      // Top Right To Bottom Left
      if (point1.x > point2.x && point1.y < point2.y) {
        // Right To Left
        if (point1.x > objectRect.location.x + widthOffset && point2.x < objectRect.location.x) {
          // Top To Bottom
          if (point1.y < objectRect.location.y + heightOffset && point2.y > objectRect.location.y) {
            console.log('Top Right To Bottom Left')
            return true
          }
        }
      }

      // Bottom Right To Top Left
      if (point1.x > point2.x && point1.y > point2.y) {
        // Right To Left
        if (point1.x > objectRect.location.x + widthOffset && point2.x < objectRect.location.x) {
          // Bottom To Top
          if (point2.y < objectRect.location.y + heightOffset && point1.y > objectRect.location.y) {
            console.log('Bottom Right To Top Left')
            return true
          }
        }
      }

      return false
    })
    console.log('elementsBetweenPoints', elementsBetweenPoints)
    return elementsBetweenPoints
    /*  return elementsBetweenPoints.map((element) => ({
     id: element.id,
     type: element.type,
     }))*/
  }

  private updateToBackOfArray(entity: CanvasEntity, changes: Partial<CanvasEntity>) {
    const index = this._panels.findIndex((panel) => panel.id === entity.id)
    const newPanel = { ...entity, ...changes }
    this._panels.splice(index, 1)
    this._panels.push(newPanel as CanvasPanel)
    this.drawPanels()
  }

  private updateToLocalArray(entityId: string, changes: Partial<CanvasPanel>) {
    const panel = this._panels.find((panel) => panel.id === entityId)
    const index = this._panels.findIndex((panel) => panel.id === panel.id)
    const newPanel = { ...panel, ...changes }
    this._panels.splice(index, 1)
    this._panels.push(newPanel as CanvasPanel)
    console.log('updated local array', newPanel)
    this.drawPanels()
    /*    const panel = this._panels.find((panel) => panel.id === entityId)
     const index = this._panels.findIndex((panel) => panel.id === panel.id)
     const newPanel = { ...panel, ...changes }
     // update at current index
     this._panels.splice(index, 1, newPanel as CanvasPanel)
     // this._panels.splice(index, 1, newPanel as CanvasPanel)
     this.drawPanels()*/
  }

  private getLiveSelectedPanel() {
    const selectedId = this._selected.selected?.id
    assertNotNull(selectedId)
    return this._panels.find((panel) => panel.id === selectedId) as CanvasEntity
  }

  private getLiveSelectedPanelById(id: string) {
    return this._panels.find((panel) => panel.id === id) as CanvasEntity
  }
}
