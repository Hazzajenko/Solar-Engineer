import { Directive, ElementRef, inject, OnInit } from '@angular/core'
import { CANVAS, FreeBlockRectModel } from '@no-grid-layout/shared'
import { MouseDownEvent, MouseMoveEvent, MouseUpEvent } from '@shared/data-access/models'
import { InitCanvas } from './canvas.config'
import { NoGridLayoutService } from './no-grid-layout.service'

@Directive({
  selector:   '[appNoGridLayoutDirective]',
  standalone: true,
})
export class NoGridLayoutDirective
  extends NoGridLayoutService
  implements OnInit {

  private _element = inject(ElementRef<HTMLDivElement>).nativeElement
  private _parentElement: HTMLDivElement = this._element.parentElement as HTMLDivElement
  private _scrollElement: HTMLDivElement = this._element.children[0] as HTMLDivElement
  // @ContentChildren(DynamicComponentDirective) _dynamicComponents!: QueryList<DynamicComponentDirective>
  height = 0
  width = 0
  negativeHeight = 0
  negativeWidth = 0
  toggleCheck = false

  /*  @ContentChildren(DynamicComponentDirective) set dynamicComponents(value: QueryList<DynamicComponentDirective>) {
   const elements = value
   .toArray()
   .map((item) =>
   item.freePanelComponentComponentRef?.location.nativeElement as HTMLElement,
   )
   .map((item) => item.children[0] as HTMLDivElement)
   console.log('elements', elements)
   // this._dynamicComponents = elements
   }*/

  /*  get dynamicComponents(): QueryList<DynamicComponentDirective> {
   return this._dynamicComponents as any
   }*/

  ngOnInit() {
    // console.log(this._parentElement)
    if (this.runEventsOutsideAngular) {
      this._ngZone.runOutsideAngular(() => {
        this.setupMouseEventListeners()
      })
    } else {
      this.setupMouseEventListeners()
    }
    this.initElements()
    /*    this.setupParentElement()
     this.setupGridElement()
     this.setupCanvas()
     this.distributeElement()
     this.setupElements()
     this.setupChildElement()*/
    /*    const childDiv = this._element.children[0]
     console.log('this._element', this._element)
     console.log('this._element.children', this._element.children)
     console.log('this._canvas', this.canvas)
     console.log('childDiv', childDiv)
     this._scrollElement = childDiv*/
    /*    this._renderer.setStyle(childDiv, 'position', 'absolute')
     this._renderer.setStyle(childDiv, 'width', '100%')
     this._renderer.setStyle(childDiv, 'height', '100%')*/
  }

  private initElements() {
    const { layoutHeight, layoutWidth } = this.calculateStandardGridSize()
    this.setupParentElement()
    this.setupGridElement(layoutWidth, layoutHeight)
    this.setupCanvas(layoutWidth, layoutHeight)
    this.setupElements()
    // console.log(this._scrollElement)
    this.setupChildElement(layoutWidth, layoutHeight)
    this.distributeElement()
  }

  private calculateStandardGridSize() {
    const blockHeight = 32
    const blockWidth = 32
    const rows = Math.floor((window.innerHeight - 100) / blockHeight)
    const cols = Math.floor((window.innerWidth - 100) / blockWidth)
    const layoutHeight = rows * blockHeight
    const layoutWidth = cols * blockWidth
    return { layoutHeight, layoutWidth }
  }

  private setupParentElement() {
    // this._renderer.setStyle(this._element, 'position', 'absolute')
    // this._renderer.setStyle(this._element.parentElement, 'width', '90%')
    // this._renderer.setStyle(this._element.parentElement, 'height', '90%')
    // this._renderer.setStyle(this._element.parentElement, 'position', 'relative')
    // this._renderer.setStyle(this._element.parentElement, 'zIndex', 10)
    /*    this._renderer.setStyle(this._element.parentElement, 'height', window.innerHeight)
     this._renderer.setStyle(this._element.parentElement, 'minHeight', window.innerHeight)
     this._renderer.setStyle(this._element.parentElement, 'width', window.innerWidth)
     this._renderer.setStyle(this._element.parentElement, 'minWidth', window.innerWidth)*/
    this._renderer.setStyle(this._element.parentElement, 'height', '100%')
    this._renderer.setStyle(this._element.parentElement, 'minHeight', '100%')
    this._renderer.setStyle(this._element.parentElement, 'width', '100%')
    this._renderer.setStyle(this._element.parentElement, 'minWidth', '100%')
    this._renderer.setStyle(this._element.parentElement, 'top', 0)
    this._renderer.setStyle(this._element.parentElement, 'left', 0)
    this._renderer.setStyle(this._element.parentElement, 'bottom', 0)
    this._renderer.setStyle(this._element.parentElement, 'right', 0)
    this._renderer.setStyle(this._element.parentElement, 'position', 'absolute')

    console.log('parentElement', this._element.parentElement)
  }

  private setupGridElement(layoutWidth: number, layoutHeight: number) {
    // this._renderer.setStyle(this._element, 'position', 'absolute')
    // this._renderer.setStyle(this._element, 'width', '100%')
    // this._renderer.setStyle(this._element, 'height', '100%')
    /*    const blockHeight = 32
     const blockWidth = 32
     const rows = Math.floor((window.innerHeight - 100) / blockHeight)
     const cols = Math.floor((window.innerWidth - 100) / blockWidth)
     const layoutHeight = rows * blockHeight
     const layoutWidth = cols * blockWidth*/
    this._renderer.setStyle(this._element, 'width', `${layoutWidth}px`)
    this._renderer.setStyle(this._element, 'height', `${layoutHeight}px`)
    /*    const left = (window.innerWidth - layoutWidth) / 2
     const top = (window.innerHeight - layoutHeight) / 2
     this._renderer.setStyle(this._element, 'left', `${left}px`)
     this._renderer.setStyle(this._element, 'top', `${top}px`)
     this._renderer.setStyle(this._element, 'position', 'absolute')
     this._renderer.setStyle(this._element, 'zIndex', 10)*/

  }

  private distributeElement() {
    this._mousePositionService.gridLayoutElement = this._element
    this._screenMoveService.gridLayoutElement = this._element
    this._screenMoveService.scrollElement = this._scrollElement
    this._mousePositionService.scrollElement = this._scrollElement
    this._componentElementService.parentElement = this._parentElement
    this._componentElementService.gridLayoutElement = this._element
    this._componentElementService.scrollElement = this._scrollElement
    this._componentElementService.canvasElement = this.canvas
  }

  private setupCanvas(layoutWidth: number, layoutHeight: number) {
    const canvasEle = this._renderer.createElement(CANVAS)
    this._renderer.appendChild(this._element, canvasEle)
    const { canvas, ctx } = InitCanvas(canvasEle, layoutWidth, layoutHeight)
    this.canvas = canvas
    this.ctx = ctx
    this._renderer.setStyle(this.canvas, 'height', `${window.innerHeight}px`)
    this._renderer.setStyle(this.canvas, 'width', `${window.innerWidth}px`)
    this._renderer.setStyle(this.canvas, 'position', 'absolute')
    this._renderer.setStyle(this.canvas, 'zIndex', 10)
    this._renderer.setStyle(this.canvas, 'top', 0)
    this._renderer.setStyle(this.canvas, 'left', 0)
    this._renderer.setStyle(this.canvas, 'bottom', 0)
    this._renderer.setStyle(this.canvas, 'right', 0)
  }

  private setupChildElement(layoutWidth: number, layoutHeight: number) {
    /*    const blockHeight = 32
     const blockWidth = 32
     const rows = Math.floor((window.innerHeight - 100) / blockHeight)
     const cols = Math.floor((window.innerWidth - 100) / blockWidth)
     const layoutHeight = rows * blockHeight
     const layoutWidth = cols * blockWidth*/
    this._scrollElement = this._element.children[0]
    this._renderer.setStyle(this._scrollElement, 'width', `${layoutWidth}px`)
    this._renderer.setStyle(this._scrollElement, 'height', `${layoutHeight}px`)
    const left = (window.innerWidth - layoutWidth) / 2
    const top = (window.innerHeight - layoutHeight) / 2
    this._renderer.setStyle(this._scrollElement, 'left', `${left}px`)
    this._renderer.setStyle(this._scrollElement, 'top', `${top}px`)
  }

  private setupElements() {
    this.height = Number(this._element.style.height.split('p')[0])
    this.negativeHeight = Number(this._element.style.height.split('p')[0]) * -1
    this.width = Number(this._element.style.width.split('p')[0])
    this.negativeWidth = Number(this._element.style.width.split('p')[0]) * -1
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
  }

  private onMouseDownHandler(event: MouseEvent) {
    this.isDragging = true
    /**
     * If the user is holding down the ctrl key, then we want to start a drag
     */
    if (event.ctrlKey || event.button === 1) {
      // this.startPoint = this._mousePositionService.getMousePositionFromPageXYV2(event)
      /*      const rect = this._scrollElement.getBoundingClientRect()
       const x = (event.pageX - rect.left) / this.scale
       const y = (event.pageY - rect.top) / this.scale
       this.startPoint = { x, y }*/
      this._screenMoveService.onMouseDownHelper(event)
      this.toggleCheck = true
      /*
       this.startPoint = {
       x: event.pageX,
       y: event.pageY,
       }*/
      this.isDragging = false
      this.isCtrlDragging = true
      // TODO add middle click

      /*     if (event.button === 1) {
       this.middleClickDown = true
       }*/
      return
    }
    if (event.altKey) {
      const rect = this.canvas.getBoundingClientRect()
      const x = (event.pageX - rect.left) / this.scale
      const y = (event.pageY - rect.top) / this.scale
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

  private onMouseUpHandler(event: MouseEvent) {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    this.selectedPanelId = undefined
    this.isDragging = false

    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.clearCtxRect()
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout)
      this._clickService.handleClickEvent(event)
      // console.log(this._dynamicComponents)
    } else {
      this._screenMoveService.ctrlMouseDownStartPoint = undefined
    }
    return
  }

  private onMouseMoveHandler(event: MouseEvent) {
    if (this.isCtrlDragging) {
      if (!event.ctrlKey) {
        this.isCtrlDragging = false
        this.startPoint = undefined
        return
      }
      this._screenMoveService.onCtrlMouseMoveHelper(event)
      return
    }
    if (this.isAltDragging) {
      if (!event.altKey || !this.canvasStartPoint) {
        this.isAltDragging = false
        // this.startPoint = undefined
        this.canvasStartPoint = undefined
        return
      } else {
        // this.pageX = event.pageX
        // this.pageY = event.pageY
        this.pagePoint = {
          x: event.pageX,
          y: event.pageY,
        }
      }
      this._ngZone.runOutsideAngular(() => {
        this.animateSelectionBox()
      })
      return
    }
    if (!this.isDragging || !this.selectedPanelId) {
      return
    }
    const panelId = (event.composedPath()[0] as HTMLDivElement).getAttribute('panelId')
    if (!panelId) return

    this.selectedPanelId = panelId
    this.pagePoint = {
      x: event.pageX,
      y: event.pageY,
    }
    this._ngZone.runOutsideAngular(() => {
      this.animateLinesFromBlockMoving()
    })

    return
  }

  private animateSelectionBox() {
    this.clearCtxRect()
    if (!this.canvasStartPoint || !this.pagePoint) {
      return
    }

    const rect = this.canvas.getBoundingClientRect()

    const mouseX = this.pagePoint.x - rect.left
    const mouseY = this.pagePoint.y - rect.top
    const mousePoint = { x: mouseX, y: mouseY }
    const mousePointToScale = this._mousePositionService.applyScaleToPoint(mousePoint)

    const width = mousePointToScale.x - this.canvasStartPoint.x
    const height = mousePointToScale.y - this.canvasStartPoint.y

    this.ctx.globalAlpha = 0.4
    this.ctx.fillStyle = this.fillStyle
    this.ctx.fillRect(this.canvasStartPoint.x, this.canvasStartPoint.y, width, height)
    this.ctx.globalAlpha = 1.0

    requestAnimationFrame(() => this.animateSelectionBox())
  }

  private animateLinesFromBlockMoving() {
    this.clearCtxRect()
    if (!this.isDragging || !this.selectedPanelId) {
      return
    }

    const panelDimensions = this._canvasService.getBlockRect(this.selectedPanelId)
    if (!panelDimensions) {
      console.error('no panelDimensions')
      return
    }
    this.drawLinesAllDirectionsForBlock(panelDimensions)
    this.animationId = requestAnimationFrame(() => this.animateLinesFromBlockMoving())
  }

  private drawLinesAllDirectionsForBlock(blockRectModel: FreeBlockRectModel) {
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = 'red'
    this.ctx.fillStyle = 'red'
    this.ctx.font = '15px Arial'

    this._canvasService.drawLinesForBlocks(blockRectModel)
  }

  private clearCtxRect() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
