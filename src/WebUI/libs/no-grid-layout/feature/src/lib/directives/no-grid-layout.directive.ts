import { ContentChildren, Directive, ElementRef, inject, NgZone, OnInit, QueryList, Renderer2 } from '@angular/core'
import { CanvasService, ComponentElementService, MousePositionService } from '@no-grid-layout/utils'
import { FreeBlockRectModel, FreeBlockType, FreePanelUtil, isFreeBlockType } from '@no-grid-layout/shared'
import { FreePanelModel } from '@no-grid-layout/feature'
import { Logger } from 'tslog'
import { Point } from '@angular/cdk/drag-drop'
import { DynamicComponentDirective } from './dynamic-free-panel.directive'
import { NoGridLayoutService, SelectedService } from '@no-grid-layout/data-access'

@Directive({
  selector:   '[appNoGridLayoutDirective]',
  standalone: true,
})
export class NoGridLayoutDirective
  implements OnInit {
  private _elementRef = inject(ElementRef<HTMLDivElement>)
  private renderer = inject(Renderer2)
  private _noGridLayoutService = inject(NoGridLayoutService)
  private clickTimeout: NodeJS.Timeout | undefined
  private canvas!: HTMLCanvasElement
  private ctx!: CanvasRenderingContext2D
  private canvasService = inject(CanvasService)
  private logger = new Logger({ name: 'no-grid-layout.directive' })
  private mousePositionService = inject(MousePositionService)
  private componentElementService = inject(ComponentElementService)
  private _logger = new Logger({ name: 'no-grid-layout.directive', stylePrettyLogs: true, type: 'pretty' })
  private _selectedService = inject(SelectedService)
  private readonly ngZone: NgZone = inject(NgZone)
  // private _noGridLayoutService = inject(NoGridLayoutService)

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

  selectedPanelId?: string
  clickedPanelId?: string
  pageX = 0
  pageY = 0
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
    this.mousePositionService.scale = value
  }

  posX = 0
  posY = 0
  startX?: number
  startY?: number
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
    this.mousePositionService.gridLayoutElementRef = this._elementRef.nativeElement
    console.log('grid', this._elementRef.nativeElement)
    console.log('canvas', this.canvas)
    // this.mousePositionService.initGridLayoutElementRef(this._elementRef.nativeElement)
    // this.componentElementService.freePanelComponents = this._freePanelComponents
    // console.log('this.componentElementService.freePanelComponents', this.componentElementService.freePanelComponents)
    /*    console.log('.freePanelComponents', this.freePanelComponents.toArray())*/

  }

  private setupElements() {
    this.height = Number(this._elementRef.nativeElement.style.height.split('p')[0])
    this.negativeHeight = Number(this._elementRef.nativeElement.style.height.split('p')[0]) * -1
    this.width = Number(this._elementRef.nativeElement.style.width.split('p')[0])
    this.negativeWidth = Number(this._elementRef.nativeElement.style.width.split('p')[0]) * -1
  }

  private setupCanvas() {
    this.canvas = this.renderer.createElement('canvas')
    this.renderer.appendChild(this._elementRef.nativeElement, this.canvas)
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
    this.canvas.width = this._elementRef.nativeElement.offsetWidth
    this.canvas.height = this._elementRef.nativeElement.offsetHeight
    const offsetWidth = this._elementRef.nativeElement.offsetWidth
    const offsetHeight = this._elementRef.nativeElement.offsetHeight
    const left = (
                   window.innerWidth - offsetWidth
                 ) / 2
    this.renderer.setStyle(this.canvas, 'left', `${left}px`)
    const top = (
                  window.innerHeight - offsetHeight
                ) / 2
    this.renderer.setStyle(this.canvas, 'top', `${top}px`)
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    // this.canvasService.setCanvas(this.canvas, this.ctx)
    this.canvasService.setCanvas(this.canvas, this.ctx)
  }

  private setupMouseEventListeners() {
    this.renderer.listen(this._elementRef.nativeElement, 'mouseup', (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseUpHandler(event)
    })
    this.renderer.listen(this._elementRef.nativeElement, 'mousedown', (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseDownHandler(event)
    })
    this.renderer.listen(this._elementRef.nativeElement, 'mousemove', (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseMoveHandler(event)
    })
    this.renderer.listen(this._elementRef.nativeElement, 'wheel', (event: WheelEvent) => {
      // console.log('scroll', event)
      event.stopPropagation()
      event.preventDefault()
      this.onScrollHandler(event)
    })
    /*   this.renderer.listen(this.elementRef.nativeElement, 'dblclick', (event: MouseEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this.handleDoubleClickEvent(event)
     })
     })*/
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
      this.handleClickEvent(event)
    } else {
      console.log('Button dragged')
    }
    return
  }

  /**
   * Handles the click event
   * @param event
   * @private
   */
  private onMouseDownHandler(event: MouseEvent) {
    this.isDragging = true
    if (event.ctrlKey || event.button === 1) {
      const { x, y } = this.mousePositionService.getMousePositionFromPageXY(event)
      this.startX = x
      this.startY = y
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

    const mouse = this.mousePositionService.getMousePositionFromPageXY(event)

    const size = FreePanelUtil.size('portrait')
    const locationX = mouse.x - size.width / 2
    const locationY = mouse.y - size.height / 2

    const freePanel = new FreePanelModel({
      x: locationX,
      y: locationY,
    })

    this._noGridLayoutService.addFreePanel(freePanel)
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
        this.startX = undefined
        this.startY = undefined
        return
      }
      this.handleCtrlMouseMove(event)
      return
    }
    if (this.isAltDragging) {
      if (!event.altKey) {
        this.isAltDragging = false
        this.startX = undefined
        this.startY = undefined
        this.canvasStartPoint = undefined
        return
      }
      console.log('altKey', event)
      if (/*!this.startX || !this.startY*/!this.canvasStartPoint || !event.altKey) {
        console.error('animateSelectionBox', this.startX, this.startY, this.pageX, this.pageY)
        return
      } else {
        /*        const rect = this.canvas.getBoundingClientRect()
         const mouseX = this.pageX - rect.left
         const mouseY = this.pageY - rect.top
         const { x, y } = this.mousePositionService.applyScaleToPoint({
         x: mouseX,
         y: mouseY,
         })
         this.pageX = x
         this.pageY = y*/
        /*        this.pageX = event.pageX
         this.pageY = event.pageY*/
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
    if (/*!this.startX || !this.startY*/!this.canvasStartPoint || !this.pageX || !this.pageY) {
      // console.error('animateSelectionBox', this.canvasStartPoint, this.pageX, this.pageY)
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      return
    }
    // console.log('animateSelectionBox', this.startX, this.startY, this.pageX, this.pageY)
    const rect = this.canvas.getBoundingClientRect()

    // const { x, y } = this.mousePositionService.applyScaleToPoint({ x: this.pageX, y: this.pageY })

    // const mouseX = x - rect.left
    // const mouseY = y - rect.top
    const mouseX = this.pageX - rect.left
    const mouseY = this.pageY - rect.top
    const { x, y } = this.mousePositionService.applyScaleToPoint({
      x: mouseX,
      y: mouseY,
    })
    /*    const x = this.pageX - rect.left
     const y = this.pageY - rect.top*/

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const width = x - this.canvasStartPoint.x
    const height = y - this.canvasStartPoint.y
    /*    const width = mouseX - this.startX
     const height = mouseY - this.startY*/

    this.ctx.globalAlpha = 0.4

    this.ctx.fillStyle = this.fillStyle

    this.ctx.fillRect(this.canvasStartPoint.x, this.canvasStartPoint.y, width, height)
    // this.ctx.fillRect(this.startX, this.startY, width, height)

    this.ctx.globalAlpha = 1.0

    requestAnimationFrame(() => this.animateSelectionBox())
  }

  private handleCtrlMouseMove(event: MouseEvent) {
    if (!this.startX || !this.startY) return
    const {
            x,
            y,
          } = this.mousePositionService.getMousePositionFromPageXY(event)

    const newStartY = this.startY
    const newStartX = this.startX
    console.log('newStartX', newStartX)
    console.log('newStartY', newStartY)

    const top = y - newStartY
    const left = x - newStartX
    console.log('top', top)
    console.log('left', left)

    if (
      top > (this.height * this.scale) / 2 ||
      top < this.negativeHeight / 2 - this.scale * 200 + this.height / 4.485
    ) {
      return
    }

    if (
      left > (this.width * this.scale) / 2 ||
      left < this.negativeWidth / 2 - this.scale * 200 + this.width / 5.925
    ) {
      return
    }

    this.renderer.setStyle(this._elementRef.nativeElement, 'top', top + 'px')
    this.renderer.setStyle(this._elementRef.nativeElement, 'left', left + 'px')

    /*    this.elementRef.nativeElement.style.top = top + 'px'
     this.elementRef.nativeElement.style.left = left + 'px'
     this.elementRef.nativeElement.style.cursor = 'grab'*/
    return
  }

  private onScrollHandler(event: WheelEvent) {

    const sizeH = this._elementRef.nativeElement.offsetHeight
    const sizeW = this._elementRef.nativeElement.offsetWidth

    const pointerX = event.pageX - this._elementRef.nativeElement.offsetLeft
    const pointerY = event.pageY - this._elementRef.nativeElement.offsetTop
    const targetX = (
                      pointerX - this.posX
                    ) / this.scale
    const targetY = (
                      pointerY - this.posY
                    ) / this.scale

    this.scale += -1 * Math.max(-1, Math.min(1, event.deltaY)) * this.speed * this.scale

    this.scale = Math.max(this.minScale, Math.min(this.maxScale, this.scale))

    this.posX = -targetX * this.scale + pointerX
    this.posY = -targetY * this.scale + pointerY

    if (this.posX > 0) this.posX = 0
    if (this.posX + sizeW * this.scale < sizeW) this.posX = -sizeW * (
      this.scale - 1
    )
    if (this.posY > 0) this.posY = 0
    if (this.posY + sizeH * this.scale < sizeH) this.posY = -sizeH * (
      this.scale - 1
    )

    this.renderer.setStyle(
      this._elementRef.nativeElement,
      'transform',
      `translate(${this.posX}px,${this.posY}px) scale(${this.scale})`,
    )
  }

  private animateLinesFromBlockMoving() {
    if (!this.pageX || !this.pageY) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      console.error('no pageX or pageY')
      return
    }
    if (!this.isDragging) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      return
    }
    if (!this.selectedPanelId) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      return
    }
    /*    const panelComponent = this.componentElementService.getFreePanelComponentsById(this.selectedPanelId)
     console.log('panelComponent', panelComponent)*/

    /*    const panelComponentElement = this.componentElementService.getFreePanelComponentElementById(this.selectedPanelId)
     console.log('panelComponentElement', panelComponentElement)*/

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

    /*    this.canvasService.drawLineForAboveBlock(blockRectModel)
     this.canvasService.drawLineForBelowBlock(blockRectModel)
     this.canvasService.drawLineForLeftBlock(blockRectModel)
     this.canvasService.drawLineForRightBlock(blockRectModel)*/
  }
}
