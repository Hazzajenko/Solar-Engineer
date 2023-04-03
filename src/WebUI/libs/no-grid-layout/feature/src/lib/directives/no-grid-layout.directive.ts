import { ContentChildren, Directive, ElementRef, inject, OnInit, QueryList } from '@angular/core'
import { CANVAS, FreeBlockRectModel } from '@no-grid-layout/shared'
import { DynamicComponentDirective } from './dynamic-free-panel.directive'
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
  private _childElement!: HTMLDivElement

  height = 0
  width = 0
  negativeHeight = 0
  negativeWidth = 0
  toggleCheck = false

  @ContentChildren(DynamicComponentDirective) set dynamicComponents(value: QueryList<DynamicComponentDirective>) {
    this._componentElementService.elements =
      value
        .toArray()
        .map((item) =>
          item.freePanelComponentComponentRef?.location.nativeElement as HTMLElement,
        )
        .map((item) => item.children[0])
  }

  ngOnInit() {
    if (this.runEventsOutsideAngular) {
      this._ngZone.runOutsideAngular(() => {
        this.setupMouseEventListeners()
      })
    } else {
      this.setupMouseEventListeners()
    }
    this.setupCanvas()
    this.distributeElement()
    this.setupElements()
    const childDiv = this._element.children[0]
    console.log('this._element', this._element)
    console.log('this._element.children', this._element.children)
    console.log('this._canvas', this.canvas)
    console.log('childDiv', childDiv)
    this._childElement = childDiv
    this.setupChildElement()
    /*    this._renderer.setStyle(childDiv, 'position', 'absolute')
     this._renderer.setStyle(childDiv, 'width', '100%')
     this._renderer.setStyle(childDiv, 'height', '100%')*/
  }

  private distributeElement() {
    this._mousePositionService.gridLayoutElementRef = this._element
    this._screenMoveService.gridLayoutElement = this._element
  }

  private setupCanvas() {
    const canvasEle = this._renderer.createElement(CANVAS)
    this._renderer.appendChild(this._element, canvasEle)
    const { canvas, ctx, left, top } = InitCanvas(canvasEle)
    this.canvas = canvas
    this.ctx = ctx
    this._renderer.setStyle(this.canvas, 'left', `${left}px`)
    this._renderer.setStyle(this.canvas, 'top', `${top}px`)
    // this._canvasService.setCanvas(this._canvas, this.ctx)
  }

  private setupChildElement() {
    // this._renderer.setStyle(this._childElement, 'position', 'absolute')
    // this._renderer.setStyle(this._childElement, 'left', '0px')
    // this._renderer.setStyle(this._childElement, 'top', '0px')
    // this._renderer.setStyle(this._childElement, 'width', `${window.innerWidth}px`)
    // this._renderer.setStyle(this._childElement, 'height', `${window.innerHeight}px`)
    /*    this._renderer.setStyle(this._childElement, 'width', '100%')
     this._renderer.setStyle(this._childElement, 'height', '100%')*/
    // canvas.width = window.innerWidth
    // canvas.height = window.innerHeight

    // this._renderer.setStyle(this._childElement, 'width', '100%')
    // this._renderer.setStyle(this._childElement, 'height', '100%')
    const blockHeight = 32
    const blockWidth = 32
    const rows = Math.floor((window.innerHeight - 100) / blockHeight)
    const cols = Math.floor((window.innerWidth - 100) / blockWidth)
    const layoutHeight = rows * blockHeight
    const layoutWidth = cols * blockWidth
    /*    console.log('layoutHeight', layoutHeight)
     console.log('layoutWidth', layoutWidth)*/
    this._renderer.setStyle(this._childElement, 'width', `${layoutWidth}px`)
    this._renderer.setStyle(this._childElement, 'height', `${layoutHeight}px`)
    /*    this.layoutWidthString = `${this.layoutWidth}px`
     this.layoutHeightString = `${this.layoutHeight}px`
     this.backgroundHeight = `${this.layoutHeight + 1}px`
     this.backgroundWidth = `${this.layoutWidth + 1}px`*/
    /*    this.layoutWidthString = this.screenSizeToPxString(this.layoutWidth)
     this.layoutHeightString = this.screenSizeToPxString(this.layoutHeight)*/
    /*    const boundingRect = this._childElement.getBoundingClientRect()
     console.log('boundingRect', boundingRect)
     const offsetWidth = this._childElement.style.width
     console.log('offsetWidth', offsetWidth)
     const widthToNumber = Number(offsetWidth.split('p')[0])
     console.log('widthToNumber', widthToNumber)
     const offsetHeight = this._childElement.style.height
     console.log('offsetHeight', offsetHeight)
     const heightToNumber = Number(offsetHeight.split('p')[0])
     console.log('heightToNumber', heightToNumber)*/
    // const left = (window.innerWidth - layoutWidth) / 2
    // const top = (window.innerHeight - layoutHeight) / 2
    // const left = window.innerWidth - (layoutWidth / 2)
    // const top = window.innerHeight - (layoutHeight / 2)
    // const innerWidth = window.innerWidth
    /*    console.log('innerWidth', innerWidth)
     console.log('layoutWidth', layoutWidth)
     console.log('difference', innerWidth - layoutWidth)*/
    const left = (window.innerWidth - layoutWidth) / 2
    const top = (window.innerHeight - layoutHeight) / 2
    /*    console.log('left', left)
     console.log('top', top)*/
    this._renderer.setStyle(this._childElement, 'left', `${left}px`)
    this._renderer.setStyle(this._childElement, 'top', `${top}px`)
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
    /*    this._renderer.listen(this._element, ScrollWheelEvent, (event: WheelEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this.onScrollHandler(event)
     })*/
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
    }
    return
  }

  private onMouseDownHandler(event: MouseEvent) {
    this.isDragging = true
    /**
     * If the user is holding down the ctrl key, then we want to start a drag
     */
    if (event.ctrlKey || event.button === 1) {
      // this.startPoint = this._mousePositionService.getMousePositionFromPageXYV2(event)
      const rect = this._childElement.getBoundingClientRect()
      const x = (event.pageX - rect.left) / this.scale
      const y = (event.pageY - rect.top) / this.scale
      this.startPoint = { x, y }
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

  private onMouseMoveHandler(event: MouseEvent) {
    if (this.isCtrlDragging) {
      if (!event.ctrlKey) {
        this.isCtrlDragging = false
        this.startPoint = undefined
        return
      }
      // this.pagePoint = this._mousePositionService.getMousePositionFromPageXY(event)
      // const {}
      /*      const childRect = this._childElement.getBoundingClientRect()
       const x = event.pageX - childRect.left
       const y = event.pageY - childRect.top*/
      // this.startPoint = { x, y }
      /*     this.pagePoint = {
       x: event.pageX / this.scale,
       y: event.pageY / this.scale,
       }*/

      this.handleCtrlMouseMove(event)
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

    /*    if (this.isDragging && !event.altKey) {
     const panelId = (event.composedPath()[0] as HTMLDivElement).getAttribute('panelId')
     if (panelId) {
     this.selectedPanelId = panelId
     this.pagePoint = {
     x: event.pageX,
     y: event.pageY,
     }
     this._ngZone.runOutsideAngular(() => {
     this.animateLinesFromBlockMoving()
     })
     }
     }*/
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

  private handleCtrlMouseMove(event: MouseEvent) {
    // if (!this.startPoint) return

    this.onCtrlMouseMoveHelper(event)
    /*    this._ngZone.runOutsideAngular(() => {
     })*/

    /*    const res = this._screenMoveService.onCtrlMouseMoveHelper(event, this.startPoint, this.scale)
     if (!res) return
     const { top, left } = res

     this._renderer.setStyle(this._element, 'top', top + 'px')
     this._renderer.setStyle(this._element, 'left', left + 'px')*/
  }

  private animateCtrlMouseMove(event: MouseEvent) {
    if (!this.startPoint) return
    const res = this._screenMoveService.onCtrlMouseMoveHelper(event, this.startPoint, this.scale)
    if (!res) return
    const { top, left } = res

    this._renderer.setStyle(this._element, 'top', top + 'px')
    this._renderer.setStyle(this._element, 'left', left + 'px')
    requestAnimationFrame(() => this.animateCtrlMouseMove(event))
  }

  private onCtrlMouseMoveHelper(event: MouseEvent) {
    if (!this.startPoint) return
    // console.log('startPoint', this.startPoint)
    const parentRect = this._element.parentNode.getBoundingClientRect()
    const mouseX =
            event.pageX -
            (parentRect.width - this.width) / 2 -
            this._element.parentNode.offsetLeft

    const mouseY =
            event.pageY -
            (parentRect.height - this.height) / 2 -
            this._element.parentNode.offsetTop
    const newStartY = this.startPoint.y
    const newStartX = this.startPoint.x
    let top = mouseY - newStartY
    let left = mouseX - newStartX
    if (this.toggleCheck) {
      top = 0
      left = 0
      this.startPoint = {
        x: mouseX,
        y: mouseY,
      }

      // top = this.screenPosition.y + top
      // left = this.screenPosition.x + left
      /*      const toLog = {
       top,
       left,
       }*/
      // console.log('toLog', toLog)
      this.toggleCheck = false
    }

    this._renderer.setStyle(this._element, 'top', top + 'px')
    this._renderer.setStyle(this._element, 'left', left + 'px')
    // return { top, left }
  }

  private onScrollHandler(event: WheelEvent) {
    this.screenProperties = this._screenMoveService.onScrollHelper(event, this.screenPosition, this.scale)
    this._renderer.setStyle(
      this._childElement,
      'transform',
      `translate(${this.screenPosition.x}px,${this.screenPosition.y}px) scale(${this.scale})`,
    )
    /*    this._renderer.setStyle(
     this._element,
     'transform',
     `translate(${this.screenPosition.x}px,${this.screenPosition.y}px) scale(${this.scale})`,
     )*/
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
