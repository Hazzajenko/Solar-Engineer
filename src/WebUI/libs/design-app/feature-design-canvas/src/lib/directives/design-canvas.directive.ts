import { Directive, ElementRef, inject, Input, NgZone, OnInit, Renderer2 } from '@angular/core'
import { ContextMenuEvent, EventName, KEYS, MouseDownEvent, MouseMoveEvent, MouseUpEvent, POINTER_BUTTON, XyLocation } from '@shared/data-access/models'
import { CanvasEntity, TransformedPoint } from '../types'
import { eventToXyLocation, getDifference, getTransformedPointFromEvent } from '../functions'
import { EntityType } from '@design-app/shared'
import { getAllElementsBetweenTwoPoints } from '../functions/object-positioning'
import { CanvasElementService, CanvasEntitiesService, CanvasSelectedService, DomPointService } from '../services'
import { setupCanvas } from '../functions/setup-canvas'
import { assertNotNull, OnDestroyDirective } from '@shared/utils'
import { roundToTwoDecimals } from 'design-app/utils'
import { Store } from '@ngrx/store'
import { takeUntil, tap } from 'rxjs'
import { DelayedLogger } from '@shared/logger'

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
  private clickTimeout?: NodeJS.Timeout | undefined
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
        this.panels = entities.filter(entity => entity.type === EntityType.Panel)

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
    // this._selected.draw = this.drawPanels.bind(this)
    // this._selected.
    // this._selected.
    /*    this._selected.on(CanvasEvent.Draw, () => {
     this.drawPanels()
     })*/
  }

  private setupCanvas() {
    const { canvas, ctx } = setupCanvas(this._canvas)
    this._canvas = canvas
    this._ctx = ctx
    // this._domPointService = new DomPointService(this._ctx)
    this._canvasElementService.init(this._canvas, this._ctx)
  }

  private setupMouseEventListeners() {
    this._renderer.listen(this._canvas, MouseUpEvent, (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseUpHandler(event)
      console.log('mouse up', event)
    })
    this._renderer.listen(this._canvas, MouseDownEvent, (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseDownHandler(event)
      console.log('mouse down', event)
    })
    this._renderer.listen(this._canvas, MouseMoveEvent, (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseMoveHandler(event)
    })
    this._renderer.listen(this._canvas, ContextMenuEvent, (event: PointerEvent) => {
      event.stopPropagation()
      event.preventDefault()
      console.log('context menu', event)
    })
    this._renderer.listen(this._canvas, EventName.Wheel, (event: WheelEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.wheelScrollHandler(event)
    })
    this._renderer.listen(window, 'resize', (event: Event) => {
      event.stopPropagation()
      event.preventDefault()
      console.log('resize', event)
      this._canvas.style.width = window.innerWidth
      this._canvas.style.height = window.innerHeight
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
      if (event.key === 'Enter') {
        this.panels = [...this.panels, CanvasEntity.create({ x: 100, y: 100 })]
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
    if (event.ctrlKey || event.button === POINTER_BUTTON.WHEEL) {
      this.isDraggingScreen = true
      console.log('dragging screen')
      this.screenDragStartPoint = this._domPointService.getTransformedPoint(event.offsetX, event.offsetY)
      return
    }
    if (event.altKey) {
      this.isSelectionBoxDragging = true
      this.selectionBoxStartPoint = getTransformedPointFromEvent(this._ctx, event)
    }
    if (event.shiftKey) {
      if (this._selected.multiSelected.length > 0) {
        this._selected.startMultiSelectDragging(event)
        /*   this._selected.multiSelected.forEach(entity => {
         entity.isMultiSelectDragging = true
         })*/
        /*        this._selected.isMultiSelectDragging = true
         // this._selected.multiSelectStart = getTransformedPointFromEvent(this._ctx, event)
         this._selected.multiSelectStart = this._domPointService.getTransformedPointFromEvent(event)
         /!*       this._selected.multiSelected.forEach(entity => {
         entity.isMultiSelectDragging = true
         })*!/
         this._selected.offsetsFromMultiSelectCenter = this._selected.multiSelected.map(entity => {
         assertNotNull(this._selected.multiSelectStart)
         const location = this._domPointService.getTransformedPointFromXy(entity.location)
         // const location = this._domPointService.getTransformedPointFromXy(entity.location)
         const xDistance = Math.abs(this._selected.multiSelectStart.x - (location.x + entity.width / 2))
         const yDistance = Math.abs(this._selected.multiSelectStart.y - (location.y + entity.height / 2))
         // const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2)
         return {
         id: entity.id,
         x:  xDistance,
         y:  yDistance,
         }
         /!*        return {
         id: entity.id,
         x:  location.x - this._selected.multiSelectStart.x,
         y:  location.y - this._selected.multiSelectStart.y,
         }*!/
         })*/
        return

      }

    }
    // const clickedOnEntity = this._panels.find(panel => this.isMouseOverPanel(event, panel))
    const clickedOnEntity = this.getMouseOverPanel(event)
    if (clickedOnEntity) {
      console.log('clicked on entity', clickedOnEntity)
      this.entityOnMouseDown = clickedOnEntity
      if (this._selected.selected?.id !== clickedOnEntity.id) {
        this._selected.clearSelected()
      }
    }
    this.clickTimeout = setTimeout(() => {
      this.clickTimeout = undefined
    }, 300)
  }

  /**
   * Mouse Up handler
   * @param event
   * @private
   */

  private onMouseUpHandler(event: MouseEvent) {
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
        const panelsInArea = getAllElementsBetweenTwoPoints(this.panels, this.selectionBoxStartPoint, this._domPointService.getTransformedPointFromEvent(event))
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
        // const location = this.getTransformedPointToMiddleOfObject(event.offsetX, event.offsetY, this.entityOnMouseDown.width, this.entityOnMouseDown.height)
        const location = this._domPointService.getTransformedPointToMiddleOfObjectFromEvent(event, this.entityOnMouseDown.type)
        this.entityOnMouseDown = CanvasEntity.updateLocation(this.entityOnMouseDown, location)
        const updatedEntity = CanvasEntity.updateForStore(this.entityOnMouseDown, { location })
        this._entitiesStore.dispatch.updateCanvasEntity(updatedEntity)
        // this.entityOnMouseDown = CanvasPanel.updateLocationFromEventToScale(this.entityOnMouseDown, event, this.screenPosition, this.scale)
        // this.updatePanel(this.entityOnMouseDown)

        this.entityOnMouseDown = undefined
      }
      return
    }
    if (this._selected.isMultiSelectDragging) {
      this._selected.isMultiSelectDragging = false
      if (this._selected.multiSelectStart) {
        const location = this._domPointService.getTransformedPointFromEvent(event)
        // const transformedMultiSelectStart = this._domPointService.getTransformedPointFromXy(this._selected.multiSelectStart)
        const offset = {
          x: location.x - this._selected.multiSelectStart.x,
          y: location.y - this._selected.multiSelectStart.y,
        }
        /*        const offset = {
         x: location.x - transformedMultiSelectStart.x,
         y: location.y - transformedMultiSelectStart.y,
         }*/
        const multiSelectedUpdated = this._selected.multiSelected.map(entity => {
          const location = this._domPointService.getTransformedPointFromXy(entity.location)
          const newLocation = {
            x: location.x + offset.x,
            y: location.y + offset.y,
          }
          // const updatedEntity = CanvasEntity.updateLocation(entity, newLocation)
          // this.updatePanel(updatedEntity)
          const updatedEntity = CanvasEntity.updateForStore(entity, { location: newLocation })
          this._entitiesStore.dispatch.updateCanvasEntity(updatedEntity)
          entity.location = newLocation
          return entity
          // return updatedEntity
        })
        this._selected.setMultiSelected(multiSelectedUpdated)
      }
      // this._selected.startMultiSelectDragging(event)
      this._selected.multiSelectStart = undefined
      this._selected.offsetsFromMultiSelectCenter = []
      return
    }
    this.isDraggingEntity = false
    this.isDraggingScreen = false
    this.entityOnMouseDown = undefined
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout)
      this.clickTimeout = undefined
      this.mouseClickHandler(event)
    }
  }

  /**
   * Mouse Click handler
   * @param event
   * @private
   */

  private mouseClickHandler(event: MouseEvent) {
    console.log('click', event)
    event.preventDefault()
    event.stopPropagation()
    const isPanel = this.getMouseOverPanel(event)
    // const isPanel = this._panels.find(panel => this.isMouseOverPanel(event, panel))
    if (isPanel) {
      // this.selectPanel(isPanel)
      this._selected.setSelected(isPanel)
      return
    }
    this._selected.clearSelected()
    // this._selectedPanel = undefined
    /*
     if (areAnyEntitiesNearClick(this._ctx, this._panels, eventToXyLocation(event))) {
     console.log('near click')
     return
     }*/
    if (this.areAnyPanelRectsNearClick(eventToXyLocation(event))) {
      // console.log('near click')
      return
    }
    /*    const adjustedPoint = adjustEventToMiddleOfObjectByType(event, EntityType.Panel)
     const location = this._domPointService.getTransformedPointFromXy(adjustedPoint)*/
    const location = this._domPointService.getTransformedPointToMiddleOfObjectFromEvent(event, EntityType.Panel)
    const panel = CanvasEntity.create(location)

    this._entitiesStore.dispatch.addCanvasEntity(panel)
    // this.panels = [...this.panels, panel]

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
        this._ctx.translate(this.currentTransformedCursor.x - this.screenDragStartPoint.x, this.currentTransformedCursor.y - this.screenDragStartPoint.y)
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
    if (this._selected.isMultiSelectDragging) {
      assertNotNull(this._selected.multiSelectStart)

      // if (this._selected.multiSelectStart) {
      const location = this._domPointService.getTransformedPointFromEvent(event)
      const offset = {
        x: location.x - this._selected.multiSelectStart.x,
        y: location.y - this._selected.multiSelectStart.y,
      }
      this._selected.multiSelected.forEach(entity => {
        const location = this._domPointService.getTransformedPointFromXy(entity.location)
        const newLocation = {
          x: location.x + offset.x,
          y: location.y + offset.y,
        }
        const entityUpdate = CanvasEntity.updateForStore(entity, { location: newLocation })
        this._entitiesStore.dispatch.updateCanvasEntity(entityUpdate)
        // this.updatePanel(CanvasEntity.updateLocation(entity, newLocation))
      })
      if (!event.shiftKey) {
        this._selected.isMultiSelectDragging = false
        this._selected.multiSelectStart = undefined
        this._selected.offsetsFromMultiSelectCenter = []
        this.drawPanels()
        return
      }
      // }
    }
    if (this.entityOnMouseDown) {
      this.isDraggingEntity = true
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
      // const transformedLocation = this.getTransformedPointFromXyToDragOffset(eventToXyLocation(event))
      // const location = this.getTransformedPointFromXyToDragOffset(eventToXyLocation(event))
      // const location = this.getTransformedPointToMiddleOfObject(event.offsetX, event.offsetY, this.entityOnMouseDown.width, this.entityOnMouseDown.height)
      const location = this._domPointService.getTransformedPointToMiddleOfObjectFromEvent(event, this.entityOnMouseDown.type)
      // location.x = location.x - this.scale
      // location.y = location.y - this.scale
      /*      if (this.scale > 1) {
       location.x = location.x - this.scale
       location.y = location.y - this.scale
       }
       if (this.scale < 1) {
       location.x = location.x + (this.scale * 2)
       location.y = location.y + (this.scale * 2)
       }*/
      /* else {
       location.x = location.x + this.scale
       location.y = location.y + this.scale
       }*/
      this.entityOnMouseDown = {
        ...this.entityOnMouseDown,
        location,
      }

      const entityUpdate = CanvasEntity.updateForStore(this.entityOnMouseDown, { location })
      this._entitiesStore.dispatch.updateCanvasEntity(entityUpdate)
      // this.pushObjectToEndOfArray(this.entityOnMouseDown)
      // this.updatePanel(this.entityOnMouseDown)
      return
    }

    const isPanel = this.getMouseOverPanel(event)
    // const isPanel = this._panels.find(panel => this.isMouseOverPanel(event, panel))
    if (isPanel) {

      this._canvas.style.cursor = 'pointer'
      if (this.hoveringEntityId === isPanel.id) return
      this.hoveringEntityId = isPanel.id
      this.drawPanels()
      return
    } else {
      if (this.hoveringEntityId) {
        this.hoveringEntityId = undefined
        this.drawPanels()
      }
      this._canvas.style.cursor = 'default'

    }

  }

  /**
   * Wheel Scroll handler
   * @param event
   * @private
   */

  private wheelScrollHandler(event: WheelEvent) {
    if (this.scale <= 0.1 && event.deltaY > 0) {
      this.scale = 0.1
      return
    }

    if (this.scale >= 2 && event.deltaY < 0) {
      this.scale = 2
      return
    }

    const currentTransformedCursor = this._domPointService.getTransformedPoint(event.offsetX, event.offsetY)

    const zoom = event.deltaY < 0
      ? 1.1
      : 0.9

    this._ctx.translate(currentTransformedCursor.x, currentTransformedCursor.y)
    this._ctx.scale(zoom, zoom)
    this._ctx.translate(-currentTransformedCursor.x, -currentTransformedCursor.y)

    this.scale = zoom === 1.1
      ? this.scale + 0.1
      : this.scale - 0.1

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
}
