import { Directive, ElementRef, inject, Input, NgZone, OnInit, Renderer2 } from '@angular/core'
import { ClickEvent, ContextMenuEvent, CURSOR_TYPE, EventName, KEYS, MouseDownEvent, MouseMoveEvent, MouseUpEvent, POINTER_BUTTON, XyLocation } from '@shared/data-access/models'
import { CanvasEntity, EntityFactory, TransformedPoint } from '../types'
import { eventToXyLocation, getDifference } from '../functions'
import { ENTITY_TYPE } from '@design-app/shared'
import { CanvasElementService, CanvasEntitiesService, CanvasSelectedService, CanvasStringsService, DomPointService } from '../services'
import { setupCanvas } from '../functions/setup-canvas'
import { OnDestroyDirective } from '@shared/utils'
import { roundToTwoDecimals } from 'design-app/utils'
import { Store } from '@ngrx/store'
import { takeUntil, tap } from 'rxjs'
import { DelayedLogger } from '@shared/logger'
import { CanvasScale } from '../models/scale'
import { getEntitySizeOffset } from '../functions/object-sizing'

@Directive({
  selector:   '[appDesignCanvas]',
  providers:  [OnDestroyDirective],
  standalone: true,
})
export class DesignCanvasDirective
  implements OnInit {

  private _store = inject(Store)
  private _onDestroy = inject(OnDestroyDirective)
  private _entitiesStore = inject(CanvasEntitiesService)
  private _stringsStore = inject(CanvasStringsService)
  private _canvas = inject(ElementRef<HTMLCanvasElement>).nativeElement
  private _ctx!: CanvasRenderingContext2D
  private _ngZone = inject(NgZone)
  private _renderer = inject(Renderer2)
  private _canvasElementService = inject(CanvasElementService)
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
  private _panels: CanvasEntity[] = []
  private _selectedPanel?: CanvasEntity
  private _animateScreenMoveId?: number

  mousePos!: HTMLDivElement
  transformedMousePos!: HTMLDivElement
  scaleElement!: HTMLDivElement
  currentTransformedCursor: DOMPoint | undefined

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

  public set panels(value: CanvasEntity[]) {
    this._panels = value
    this._delayedLogger.log('set panels', value)
    // console.log('set panels', value)
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
      const difference = getDifference(entities, this.panels)
      if (difference.length > 0) {
        this._delayedLogger.log('entities$ difference', difference)
        this.panels = entities.filter(entity => entity.type === ENTITY_TYPE.Panel)
      }
    }),
  )

  public ngOnInit() {
    this.setupCanvas()
    this._ngZone.runOutsideAngular(() => {
      this.setupMouseEventListeners()
    })
    this.mousePos = document.getElementById('mouse-pos') as HTMLDivElement
    this.transformedMousePos = document.getElementById('transformed-mouse-pos') as HTMLDivElement
    this.scaleElement = document.getElementById('scale-element') as HTMLDivElement
    console.log(this.mousePos, this.transformedMousePos)
    this.entities$.subscribe()
  }

  private setupCanvas() {
    const { canvas, ctx } = setupCanvas(this._canvas)
    this._canvas = canvas
    this._ctx = ctx
    this._canvasElementService.init(this._canvas, this._ctx)
  }

  private setupMouseEventListeners() {
    this._renderer.listen(this._canvas, MouseUpEvent, (event: MouseEvent) => {

      this.onMouseUpHandler(event)
      console.log('mouse up', event)
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(this._canvas, MouseDownEvent, (event: MouseEvent) => {

      this.onMouseDownHandler(event)
      console.log('mouse down', event)
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
      event.stopPropagation()
      event.preventDefault()
    })
    this._renderer.listen(this._canvas, ClickEvent, (event: PointerEvent) => {

      this.mouseClickHandler(event)
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
        this.panels = []
      }
      if (event.shiftKey) {
        console.log('shift key up')
        // this._selected.isMultiSelectDragging = false
      }
      if (event.key === KEYS.G) {
        this.drawPanels()
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
    console.log('mouse down', event)
    if ((event.ctrlKey || event.button === POINTER_BUTTON.WHEEL) && !event.shiftKey) {
      this.isDraggingScreen = true
      console.log('dragging screen')
      this.screenDragStartPoint = this._domPointService.getTransformedPointFromEvent(event)
      return
    }
    if (event.altKey) {
      this.isSelectionBoxDragging = true
      this.selectionBoxStartPoint = this._domPointService.getTransformedPointFromEvent(event)
    }
    if (event.shiftKey && event.ctrlKey && this._selected.multiSelected.length > 0) {
      this._selected.startMultiSelectDragging(event)
      return
    }
    const clickedOnEntity = this.getMouseOverPanel(event)
    if (clickedOnEntity) {
      console.log('clicked on entity', clickedOnEntity)
      this.entityOnMouseDown = clickedOnEntity
      if (this._selected.selected?.id !== clickedOnEntity.id) {
        this._selected.clearSingleSelected()
      }
    }
    this.mouseDownTimeOut = setTimeout(() => {
      this.mouseDownTimeOut = undefined
    }, 100)
  }

  /**
   * Mouse Up handler
   * @param event
   * @private
   */

  private onMouseUpHandler(event: MouseEvent) {
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
    /*    if (this.clickTimeout) {
     clearTimeout(this.clickTimeout)
     this.clickTimeout = undefined
     this.mouseClickHandler(event)
     }*/
  }

  /**
   * Mouse Click handler
   * @param event
   * @private
   */

  private mouseClickHandler(event: PointerEvent) {
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
    this._selected.clearSelected()
    if (this.areAnyPanelRectsNearClick(eventToXyLocation(event))) {
      return
    }
    const location = this._domPointService.getTransformedPointToMiddleOfObjectFromEvent(event, ENTITY_TYPE.Panel)
    const entity = EntityFactory.create(ENTITY_TYPE.Panel, location)

    this._entitiesStore.dispatch.addCanvasEntity(entity)
    this.drawPanels()
  }

  /**
   * Mouse Move handler
   * @param event
   * @private
   */

  private onMouseMoveHandler(event: MouseEvent) {
    this.currentTransformedCursor = this._domPointService.getTransformedPoint(event.offsetX, event.offsetY)
    this.mousePos.innerText = `Original X: ${event.offsetX}, Y: ${event.offsetY}`
    this.transformedMousePos.innerText = `Transformed X: ${this.currentTransformedCursor.x}, Y: ${this.currentTransformedCursor.y}`
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
      this.entityOnMouseDown = EntityFactory.update(this.entityOnMouseDown, { location })
      const entityUpdate = EntityFactory.updateForStore(this.entityOnMouseDown, { location })
      this._entitiesStore.dispatch.updateCanvasEntity(entityUpdate)
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
    const currentTransform = this._ctx.getTransform()
    const currentScaleX = currentTransform.a
    const currentScaleY = currentTransform.d
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
    const { x, y } = this._domPointService.getTransformedPoint(event.offsetX, event.offsetY)
    const { location, width, height } = panel
    return x >= location.x && x <= location.x + width && y >= location.y && y <= location.y + height
  }

  private drawPanel(panel: CanvasEntity) {
    if (this.hoveringEntityId === panel.id) {
      this._ctx.closePath()
      this._ctx.fillStyle = '#17fff3'
    }

    const isSingleSelected = this._selected.selected && this._selected.selected.id === panel.id
    const isMultiSelected = this._selected.multiSelected && this._selected.multiSelected.find(selected => selected.id === panel.id)

    if (isSingleSelected) {
      this._ctx.closePath()
      this._ctx.fillStyle = '#ff6e78'
    }

    if (isMultiSelected) {
      this._ctx.closePath()
      this._ctx.fillStyle = '#ff6e78'
    }

    this._ctx.rect(panel.location.x, panel.location.y, panel.width, panel.height)

    this._ctx.fill()
    this._ctx.stroke()
    this._ctx.beginPath()
    this._ctx.fillStyle = '#8ED6FF'

  }

  private drawPanels() {
    // console.log('draw panels')
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

  private updatePanel(panel: CanvasEntity) {
    console.log('update panel', panel)
    // this.panels = [...this.panels.filter(p => p.id !== panel.id), panel]
    // this._entitiesStore.dispatch.updateCanvasEntity()
    this.drawPanels()
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
}
