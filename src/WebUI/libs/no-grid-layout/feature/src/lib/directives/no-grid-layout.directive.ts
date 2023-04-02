import { ContentChildren, Directive, ElementRef, inject, NgZone, OnInit, QueryList, Renderer2 } from '@angular/core'
import { CanvasService, ClickService, ComponentElementService, MousePositionService, ScreenMoveService } from '@no-grid-layout/utils'
import { FreeBlockRectModel, FreeBlockType, FreePanelModel, FreePanelUtil, isFreeBlockType } from '@no-grid-layout/shared'
import { Point } from '@angular/cdk/drag-drop'
import { DynamicComponentDirective } from './dynamic-free-panel.directive'
import { FreePanelsService, SelectedService } from '@no-grid-layout/data-access'
import { MouseDownEvent, MouseMoveEvent, MouseUpEvent, ScrollWheelEvent } from '@shared/data-access/models'

@Directive({
  selector:   '[appNoGridLayoutDirective]',
  standalone: true,
})
export class NoGridLayoutDirective
  implements OnInit {
  private _element = inject(ElementRef<HTMLDivElement>).nativeElement
  private _screenMoveService = inject(ScreenMoveService)
  private _renderer = inject(Renderer2)
  private _freePanelsService = inject(FreePanelsService)
  private _clickService = inject(ClickService)
  private clickTimeout: NodeJS.Timeout | undefined
  private canvas!: HTMLCanvasElement
  private ctx!: CanvasRenderingContext2D
  private canvasService = inject(CanvasService)
  private _mousePositionService = inject(MousePositionService)
  private componentElementService = inject(ComponentElementService)
  private _selectedService = inject(SelectedService)
  private ngZone: NgZone = inject(NgZone)

  // private _freePanelsService = inject(NoGridLayoutService)

  private _dynamicComponents!: QueryList<DynamicComponentDirective>
  @ContentChildren(DynamicComponentDirective) set dynamicComponents(value: QueryList<DynamicComponentDirective>) {
    this.componentElementService.elements =
      value
        .toArray()
        .map((item) =>
          item.freePanelComponentComponentRef?.location.nativeElement as HTMLElement,
        )
        .map((item) => item.children[0])
    this._dynamicComponents = value
  }

  get dynamicComponents() {
    return this._dynamicComponents
  }

  get scaleOptions() {
    return {
      posX:  this.posX,
      posY:  this.posY,
      scale: this.scale,
    }
  }

  set scaleOptions(options: {
    posX: number;
    posY: number;
    scale: number
  }) {
    this.posX = options.posX
    this.posY = options.posY
    this.scale = options.scale
  }

  selectedPanelId?: string
  clickedPanelId?: string
  pageX = 0
  pageY = 0

  get pagePoint() {
    return {
      x: this.pageX,
      y: this.pageY,
    }
  }

  runEventsOutsideAngular = false
  isDragging = false
  isCtrlDragging = false
  isShiftDragging = false
  isAltDragging = false
  animationId?: number
  fillStyle = '#7585d8'
  private _scale = 1
  get scale() {
    return this._scale
  }

  set scale(value) {
    this._scale = value
    this._mousePositionService.scale = value
  }

  get size() {
    return {
      width:  this.width,
      height: this.height,
    }
  }

  posX = 0
  posY = 0
  startPoint?: Point
  canvasStartPoint?: Point
  height!: number
  negativeHeight!: number
  width!: number
  negativeWidth!: number
  maxScale = 2
  minScale = 1
  speed = 0.1

  ngOnInit() {
    if (this.runEventsOutsideAngular) {
      this.ngZone.runOutsideAngular(() => {
        this.setupMouseEventListeners()
      })
    } else {
      this.setupMouseEventListeners()
    }
    this.setupCanvas()
    this.setupElements()
    this._mousePositionService.gridLayoutElementRef = this._element
    this._screenMoveService.gridLayoutElement = this._element
    // this._screenMoveService.initElementRef(this._element)

    console.log('grid', this._element)
    console.log('canvas', this.canvas)
    // this._mousePositionService.initGridLayoutElementRef(this._element)
    // this.componentElementService.freePanelComponents = this._freePanelComponents
    // console.log('this.componentElementService.freePanelComponents', this.componentElementService.freePanelComponents)
    /*    console.log('.freePanelComponents', this.freePanelComponents.toArray())*/

  }

  private setupElements() {
    this.height = Number(this._element.style.height.split('p')[0])
    this.negativeHeight = Number(this._element.style.height.split('p')[0]) * -1
    this.width = Number(this._element.style.width.split('p')[0])
    this.negativeWidth = Number(this._element.style.width.split('p')[0]) * -1
  }

  private setupCanvas() {
    this.canvas = this._renderer.createElement('canvas')
    this._renderer.appendChild(this._element, this.canvas)
    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not get canvas context')
    }
    this.ctx = ctx
    this.canvas.style.position = 'absolute'
    this.canvas.style.top = '0'
    this.canvas.style.left = '0'
    this.canvas.style.zIndex = '100'
    this.canvas.style.pointerEvents = 'none'
    this.canvas.width = this._element.offsetWidth
    this.canvas.height = this._element.offsetHeight
    const offsetWidth = this._element.offsetWidth
    const offsetHeight = this._element.offsetHeight
    const left = (window.innerWidth - offsetWidth) / 2
    this._renderer.setStyle(this.canvas, 'left', `${left}px`)
    const top = (window.innerHeight - offsetHeight) / 2
    this._renderer.setStyle(this.canvas, 'top', `${top}px`)
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    // this.canvasService.setCanvas(this.canvas, this.ctx)
    this.canvasService.setCanvas(this.canvas, this.ctx)
  }

  private setupMouseEventListeners() {
    this._renderer.listen(this._element, MouseUpEvent, (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseUpHandler(event)
    })
    this._renderer.listen(this._element, MouseDownEvent, (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseDownHandler(event)
    })
    this._renderer.listen(this._element, MouseMoveEvent, (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseMoveHandler(event)
    })
    this._renderer.listen(this._element, ScrollWheelEvent, (event: WheelEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onScrollHandler(event)
    })
  }

  private onMouseUpHandler(event: MouseEvent) {
    // console.log('mouseup', event)
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    this.selectedPanelId = undefined
    this.isDragging = false
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout)
      // console.log('Button clicked')
      this._clickService.handleClickEvent(event)
      // this.handleClickEvent(event)
    } else {
      console.log('Button dragged')
    }
    return
  }

  private onMouseDownHandler(event: MouseEvent) {
    this.isDragging = true
    if (event.ctrlKey || event.button === 1) {
      this.startPoint = this._mousePositionService.getMousePositionFromPageXY(event)
      this.isDragging = false
      this.isCtrlDragging = true
      /*     if (event.button === 1) {
       this.middleClickDown = true
       }*/
      return
    }
    if (event.altKey) {
      const rect = this.canvas.getBoundingClientRect()
      const x = (event.pageX - rect.left) / this._scale
      const y = (event.pageY - rect.top) / this._scale
      this.canvasStartPoint = { x, y }
      this.isDragging = false
      this.isAltDragging = true
      return
    }

    const panelId = (event.composedPath()[0] as HTMLDivElement).getAttribute('panelId')
    if (panelId) {
      this.selectedPanelId = panelId
    }
    this.clickTimeout = setTimeout(() => {
      this.clickTimeout = undefined
    }, 300)
    return
  }

  private handleClickEvent(event: MouseEvent) {
    const type = (event.composedPath()[0] as HTMLDivElement).getAttribute('type') as FreeBlockType | undefined
    if (type && isFreeBlockType(type)) {
      switch (type) {
        case FreeBlockType.Panel:
          this.handleClickPanelEvent(event)
          break
        default:
          console.error('unknown type', type)
          break
      }
      return
    }

    if (event.ctrlKey) return

    const mouse = this._mousePositionService.getMousePositionFromPageXY(event)

    const size = FreePanelUtil.size('portrait')
    const locationX = mouse.x - size.width / 2
    const locationY = mouse.y - size.height / 2

    const freePanel = new FreePanelModel({
      x: locationX,
      y: locationY,
    })

    this._freePanelsService.addFreePanel(freePanel)
    return
  }

  private handleClickPanelEvent(event: MouseEvent) {
    const panelId = (event.composedPath()[0] as HTMLDivElement).getAttribute('panelId')
    if (!panelId) {
      console.error('panelId not found')
      return
    }
    this.clickedPanelId = panelId
    this._selectedService.setSelected(panelId)
    return
  }

  private onMouseMoveHandler(event: MouseEvent) {
    if (this.isCtrlDragging) {
      if (!event.ctrlKey) {
        this.isCtrlDragging = false
        this.startPoint = undefined
        return
      }
      this.handleCtrlMouseMove(event)
      return
    }
    if (this.isAltDragging) {
      if (!event.altKey) {
        this.isAltDragging = false
        this.startPoint = undefined
        this.canvasStartPoint = undefined
        return
      }
      console.log('altKey', event)
      if (!this.canvasStartPoint || !event.altKey) {
        console.error('animateSelectionBox', this.startPoint, this.pageX, this.pageY)
        return
      } else {
        this.pageX = event.pageX
        this.pageY = event.pageY
      }
      this.ngZone.runOutsideAngular(() => {
        this.animateSelectionBox()
      })
      return
    }
    if (this.isDragging && !event.altKey) {
      const panelId = (
        event.composedPath()[0] as HTMLDivElement
      ).getAttribute('panelId')
      if (panelId) {
        this.selectedPanelId = panelId
        this.pageX = event.pageX
        this.pageY = event.pageY
        this.ngZone.runOutsideAngular(() => {
          this.animateLinesFromBlockMoving()
        })
      }
    }
    return
  }

  private animateSelectionBox() {
    if (!this.canvasStartPoint || !this.pageX || !this.pageY) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      return
    }
    const rect = this.canvas.getBoundingClientRect()

    const mouseX = this.pageX - rect.left
    const mouseY = this.pageY - rect.top
    const mousePoint = { x: mouseX, y: mouseY }
    const mousePointToScale = this._mousePositionService.applyScaleToPoint(mousePoint)

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const width = mousePointToScale.x - this.canvasStartPoint.x
    const height = mousePointToScale.y - this.canvasStartPoint.y

    this.ctx.globalAlpha = 0.4

    this.ctx.fillStyle = this.fillStyle

    this.ctx.fillRect(this.canvasStartPoint.x, this.canvasStartPoint.y, width, height)

    this.ctx.globalAlpha = 1.0

    requestAnimationFrame(() => this.animateSelectionBox())
  }

  private handleCtrlMouseMove(event: MouseEvent) {
    if (!this.startPoint) return

    const res = this._screenMoveService.handleCtrlMouseMove(event, this.startPoint, this._scale, this.size)
    if (!res) return
    const { top, left } = res

    this._renderer.setStyle(this._element, 'top', top + 'px')
    this._renderer.setStyle(this._element, 'left', left + 'px')
  }

  private onScrollHandler(event: WheelEvent) {
    this.scaleOptions = this._screenMoveService.onScrollHelper(event, this.posX, this.posY, this.scale)
    this._renderer.setStyle(
      this._element,
      'transform',
      `translate(${this.posX}px,${this.posY}px) scale(${this.scale})`,
    )
  }

  private animateLinesFromBlockMoving() {
    if (!this.pageX || !this.pageY || !this.isDragging || !this.selectedPanelId) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      return
    }

    const panelDimensions = this.canvasService.getBlockRect(this.selectedPanelId)
    if (!panelDimensions) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      console.error('no panelDimensions')
      return
    }
    this.drawLinesAllDirectionsForBlock(panelDimensions)
    this.animationId = requestAnimationFrame(() => this.animateLinesFromBlockMoving())
  }

  private drawLinesAllDirectionsForBlock(blockRectModel: FreeBlockRectModel) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = 'red'
    this.ctx.fillStyle = 'red'
    this.ctx.font = '15px Arial'

    this.canvasService.drawLinesForBlocks(blockRectModel)
  }
}
