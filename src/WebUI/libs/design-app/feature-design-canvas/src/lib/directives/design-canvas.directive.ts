import { Directive, ElementRef, inject, Input, NgZone, OnInit, Renderer2 } from '@angular/core'
import { ContextMenuEvent, EventName, KEYS, MouseDownEvent, MouseMoveEvent, MouseUpEvent, POINTER_BUTTON, XyLocation } from '@shared/data-access/models'
import { CanvasPanel, TransformedPoint } from '../types'
import { adjustEventToMiddleOfObjectByType, adjustLocationToMiddleOfObjectByType, eventToXyLocation, getTransformedPointFromEvent } from '../functions'
import { EntityType } from '@design-app/shared'
import { getEntitySizeOffset } from '../functions/object-sizing'
import { getAllElementsBetweenTwoPoints } from '../functions/object-positioning'
import { CanvasSelectedService } from '../services'
import { DomPointService } from '../services/dom-point.service'
import { setupCanvas } from '../functions/setup-canvas'
import { assertNotNull } from '@shared/utils'

@Directive({
  selector:   '[appDesignCanvas]',
  standalone: true,
})
export class DesignCanvasDirective
  implements OnInit {

  private _canvas = inject(ElementRef<HTMLCanvasElement>).nativeElement
  private _ctx!: CanvasRenderingContext2D
  private _ngZone = inject(NgZone)
  private _renderer = inject(Renderer2)
  // private _selected = new CanvasSelectedService()
  private _selected = inject(CanvasSelectedService)
  private _domPointService!: DomPointService
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private clickTimeout?: NodeJS.Timeout | undefined
  private _panels: CanvasPanel[] = []
  private _selectedPanel?: CanvasPanel
  private _animateScreenMoveId?: number

  mousePos!: HTMLDivElement
  transformedMousePos!: HTMLDivElement
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

  public set panels(value: CanvasPanel[]) {
    this._panels = value
    console.log('set panels', value)
  }

  public get panels(): CanvasPanel[] {
    return this._panels
  }

  isDraggingEntity = false
  isDraggingScreen = false
  entityOnMouseDown?: CanvasPanel

  screenDragStartPoint: XyLocation = { x: 0, y: 0 }
  _scale = 1
  get scale(): number {
    return this._scale
  }

  set scale(value: number) {
    this._scale = value
    console.log('set scale', value)
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

  public ngOnInit() {
    this.setupCanvas()
    this._ngZone.runOutsideAngular(() => {
      this.setupMouseEventListeners()
    })
    this.mousePos = document.getElementById('mouse-pos') as HTMLDivElement
    this.transformedMousePos = document.getElementById('transformed-mouse-pos') as HTMLDivElement
    console.log(this.mousePos, this.transformedMousePos)
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
    this._domPointService = new DomPointService(this._ctx)
    // const ctx = this._canvas.getContext('2d')
    /*    if (!ctx) {
     throw new Error('Could not get canvas context')
     }
     this._ctx = ctx
     this._canvas.style.position = 'absolute'
     this._canvas.style.top = '0'
     this._canvas.style.left = '0'
     this._canvas.style.bottom = '0'
     this._canvas.style.right = '0'
     this._canvas.style.zIndex = '10'
     this._canvas.width = window.innerWidth
     this._canvas.height = window.innerHeight
     this._canvas.style.width = `${window.innerWidth}px`
     this._canvas.style.height = `${window.innerHeight}px`
     this._ctx.fillStyle = '#8ED6FF'
     this._ctx.lineWidth = 1
     this._ctx.strokeStyle = 'black'
     this._ctx.lineJoin = 'round'
     this._ctx.lineCap = 'round'
     this._ctx.font = '12px Arial'*/

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
      // console.log('mouse move', event)
    })
    this._renderer.listen(this._canvas, ContextMenuEvent, (event: PointerEvent) => {
      event.stopPropagation()
      event.preventDefault()
      console.log('context menu', event)
    })
    this._renderer.listen(this._canvas, EventName.Wheel, (event: WheelEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onScrollHandler(event)
      // console.log('wheel', event)
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
        this.panels = [...this.panels, CanvasPanel.create({ x: 100, y: 100 })]
      }
      if (event.key === KEYS.G) {
        this.drawPanels()
      }
    })
  }

  /* getTransformedPoint(x: number, y: number) {
   const originalPoint = new DOMPoint(x, y)
   return this._ctx.getTransform()
   .invertSelf()
   .transformPoint(originalPoint)
   }

   getTransformedPointFromXy(point: XyLocation) {
   const originalPoint = new DOMPoint(point.x, point.y)
   return this._ctx.getTransform()
   .invertSelf()
   .transformPoint(originalPoint) as TransformedPoint
   }

   getTransformedPointFromEvent(event: MouseEvent) {
   const point = eventToXyLocation(event)
   const originalPoint = new DOMPoint(point.x, point.y)
   return this._ctx.getTransform()
   .invertSelf()
   .transformPoint(originalPoint) as TransformedPoint
   }

   getTransformedPointFromXyToDragOffset(point: XyLocation) {
   /!*    const x = point.x + this.entityDragOffset.x
   const y = point.y + this.entityDragOffset.y*!/
   const x = point.x
   const y = point.y
   const originalPoint = new DOMPoint(x, y)
   const res = this._ctx.getTransform()
   .invertSelf()
   .transformPoint(originalPoint) as TransformedPointToDragOffset
   console.log('getTransformedPointFromXyToDragOffset', point)
   res.x += this.entityDragOffset.x
   res.y += this.entityDragOffset.y

   console.log('getTransformedPointFromXyToDragOffset', this.entityDragOffset)
   return res

   }

   getTransformedPointToMiddleOfObject(x: number, y: number, width: number, height: number) {
   const originalPoint = new DOMPoint(x - width / 2, y - height / 2)
   return this._ctx.getTransform()
   .invertSelf()
   .transformPoint(originalPoint)
   }

   getTransformedPointToMiddleOfObjectFromEvent(event: MouseEvent, type: EntityType) {
   const { x, y } = eventToXyLocation(event)
   const middlePoint = adjustLocationToMiddleOfObjectByType({ x, y }, type)
   const originalPoint = new DOMPoint(middlePoint.middleX, middlePoint.middleY)
   return this._ctx.getTransform()
   .invertSelf()
   .transformPoint(originalPoint)
   }*/

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
        /*   this._selected.multiSelected.forEach(entity => {
         entity.isMultiSelectDragging = true
         })*/
        this._selected.isMultiSelectDragging = true
        this._selected.multiSelectStart = getTransformedPointFromEvent(this._ctx, event)
        /*       this._selected.multiSelected.forEach(entity => {
         entity.isMultiSelectDragging = true
         })*/
        this._selected.offsetsFromMultiSelectCenter = this._selected.multiSelected.map(entity => {
          assertNotNull(this._selected.multiSelectStart)
          const location = this._domPointService.getTransformedPointFromXy(entity.location)
          return {
            id: entity.id,
            x:  location.x - this._selected.multiSelectStart.x,
            y:  location.y - this._selected.multiSelectStart.y,
          }
        })
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

  private onMouseUpHandler(event: MouseEvent) {
    if (event.button === POINTER_BUTTON.SECONDARY) return
    console.log('mouse up', event)
    if (this.isDraggingScreen) {
      this.isDraggingScreen = false
      if (this.animateScreenMoveId) {
        cancelAnimationFrame(this.animateScreenMoveId)
        this.animateScreenMoveId = undefined
      }
      console.log('screenPosition', this.screenPosition)
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
        this.entityOnMouseDown = CanvasPanel.updateLocation(this.entityOnMouseDown, location)
        // this.entityOnMouseDown = CanvasPanel.updateLocationFromEventToScale(this.entityOnMouseDown, event, this.screenPosition, this.scale)
        this.updatePanel(this.entityOnMouseDown)
        this.entityOnMouseDown = undefined
      }
      return
    }
    if (this._selected.isMultiSelectDragging) {
      this._selected.isMultiSelectDragging = false
      if (this._selected.multiSelectStart) {
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
          this.updatePanel(CanvasPanel.updateLocation(entity, newLocation))
        })
      }
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
      this.handleClick(event)
    }
  }

  private handleClick(event: MouseEvent) {
    console.log('click', event)
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
      console.log('near click')
      return
    }
    const adjustedPoint = adjustEventToMiddleOfObjectByType(event, EntityType.Panel)
    const location = this._domPointService.getTransformedPointFromXy(adjustedPoint)
    const panel = CanvasPanel.create(location)

    this.panels = [...this.panels, panel]

    this.drawPanels()
  }

  private areAnyPanelRectsNearClick(point: XyLocation) {
    const panelsNearClick = this.panels.filter(panel => {
      const transformedPoint = this._domPointService.getTransformedPointFromXy(point)
      const transformedEntityLocation = this._domPointService.getTransformedPointFromXy(panel.location)
      const { middleX, middleY } = adjustLocationToMiddleOfObjectByType(transformedEntityLocation, EntityType.Panel)
      const { heightOffset, widthOffset } = getEntitySizeOffset(panel)
      const nearLeft = middleX - widthOffset <= transformedPoint.x + 10
      const nearRight = middleX + widthOffset >= transformedPoint.x - 10
      const nearTop = middleY - heightOffset <= transformedPoint.y + 10
      const nearBottom = middleY + heightOffset >= transformedPoint.y - 10
      return nearLeft && nearRight && nearTop && nearBottom
    })
    return panelsNearClick.length > 0
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

  private onScrollHandler(event: WheelEvent) {
    const currentTransformedCursor = this._domPointService.getTransformedPoint(event.offsetX, event.offsetY)

    const zoom = event.deltaY < 0
      ? 1.1
      : 0.9

    this._ctx.translate(currentTransformedCursor.x, currentTransformedCursor.y)
    this._ctx.scale(zoom, zoom)
    this._ctx.translate(-currentTransformedCursor.x, -currentTransformedCursor.y)

    this.scale *= zoom

    this.drawPanels()

    event.preventDefault()
  }

  private selectPanel(panel: CanvasPanel) {
    this._selectedPanel = panel
    console.log('selected panel', panel)
    this.drawPanels()
  }

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
      if (this._selected.multiSelectStart) {
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
          this.updatePanel(CanvasPanel.updateLocation(entity, newLocation))
        })
      }
    }
    if (this.entityOnMouseDown) {
      this.isDraggingEntity = true
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
      // const transformedLocation = this.getTransformedPointFromXyToDragOffset(eventToXyLocation(event))
      // const location = this.getTransformedPointFromXyToDragOffset(eventToXyLocation(event))
      // const location = this.getTransformedPointToMiddleOfObject(event.offsetX, event.offsetY, this.entityOnMouseDown.width, this.entityOnMouseDown.height)
      const location = this._domPointService.getTransformedPointToMiddleOfObjectFromEvent(event, this.entityOnMouseDown.type)
      this.entityOnMouseDown = {
        ...this.entityOnMouseDown,
        location,
      }

      this.pushObjectToEndOfArray(this.entityOnMouseDown)
      this.updatePanel(this.entityOnMouseDown)
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

  private pushObjectToEndOfArray(object: CanvasPanel) {
    // this._panels.push(this._panels.splice(this._panels.indexOf(object), 1)[0])
    this._panels = [...this._panels.filter(panel => panel.id !== object.id), object]
  }

  private animateScreenMove() {
    this.drawPanels()
    this.animateScreenMoveId = requestAnimationFrame(() => this.animateScreenMove())
  }

  private getMouseOverPanel(event: MouseEvent) {
    const mouseOverPanels = this._panels.filter(panel => this.isMouseOverPanel(event, panel))
    return mouseOverPanels[mouseOverPanels.length - 1]
  }

  private isMouseOverPanel(event: MouseEvent, panel: CanvasPanel) {
    // const { x, y } = getXyPointFromEvent(event, this.screenPosition, this.scale)
    const { x, y } = this._domPointService.getTransformedPoint(event.offsetX, event.offsetY)
    const { location, width, height } = panel
    return x >= location.x && x <= location.x + width && y >= location.y && y <= location.y + height
  }

  private drawPanel(panel: CanvasPanel) {

    if (this.hoveringEntityId === panel.id) {
      this._ctx.closePath()
      this._ctx.fillStyle = '#17fff3'
    }

    /*    if (this._selectedPanel && this._selectedPanel.id === panel.id) {
     this._ctx.closePath()
     this._ctx.fillStyle = '#ff6e78'
     }*/
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

    // this._ctx.

    // const { x, y } = getXyPointFromLocationV2(panel.location, this.screenPosition, this.scale)
    // this._ctx.rect(x, y, panel.width * this.scale, panel.height * this.scale)
    this._ctx.rect(panel.location.x, panel.location.y, panel.width, panel.height)

    this._ctx.fill()
    this._ctx.stroke()
    this._ctx.beginPath()
    this._ctx.fillStyle = '#8ED6FF'

  }

  private drawPanels() {
    console.log('draw panels')
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

  private updatePanel(panel: CanvasPanel) {
    /*    const findIndex = this._panels.findIndex(p => p.id === panel.id)
     this._panels[findIndex] = panel*/
    this._panels = [...this._panels.filter(p => p.id !== panel.id), panel]
    this.drawPanels()
  }

  private scaleCalculation() {
    switch (true) {
      case this.scale < 0.5:
        this.scale = 0.5
        break
      case this.scale > 0.5 && this.scale < 1:
        this.scale = 2
        break
      case this.scale > 1 && this.scale < 2:
        this.scale = 2
        break
      case this.scale > 2 && this.scale < 3:
        this.scale = 3
        break
      case this.scale > 3 && this.scale < 4:
        this.scale = 4
        break
      case this.scale > 4 && this.scale < 5:
        this.scale = 5
        break
      case this.scale > 5 && this.scale < 6:
        this.scale = 6
        break

    }
  }
}
