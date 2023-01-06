import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject, Input,
  Output, Renderer2,
} from '@angular/core'
import { ElementOffsets, GridLayoutXY } from '@grid-layout/shared/models'
import { UiRepository } from '@project-id/data-access/repositories'
import { PanelPathModel, SoftColor } from '@shared/data-access/models'
import { firstValueFrom, fromEvent, mergeMap, Observable, takeUntil, tap } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'

@Directive({
  selector: '[appGrid]',
  standalone: true,
})
export class GridDirective implements AfterViewInit {
  private elementRef = inject(ElementRef<HTMLDivElement>)
  private renderer = inject(Renderer2)
  private uiRepository = inject(UiRepository)
  private _zoomLevel = 1
  private _componentX?: number
  private _componentY?: number
  // private speed = 0.5
  public getScreenWidth: any
  public getScreenHeight: any
  private mouseClick!: { x: number, y: number, left: number, top: number }
  private posX = 0
  private posY = 0
  private scale = 1
  private speed = 0.1
  private max_scale = 2
  private min_scale = 1
  top = 0
  left = 0
  isMoving = false // Flag to indicate
  // whether the component is being moved
  mouseX = 0 // X coordinate of the mouse
  mouseY = 0 // Y coordinate of the mouse
  componentX = 0 // X coordinate of the component
  componentY = 0 // Y coordinate of the component
  startX?: number
  startY?: number

  isDragging = false
  isZoomed = false

  /*
    mouseDownSub$ = fromEvent<MouseEvent>(document, 'mousedown').pipe(
      map(event => {
        if (!this.isZoomed) {
          return event
        }
        return undefined
      }),
      tap(event => {
        if (!event) return
        if (!event.ctrlKey) {
          this.isDragging = false
        }
        if (event.ctrlKey) {
          const rect = this.elementRef.nativeElement.getBoundingClientRect()
          this.startX = event.clientX - rect.left
          this.startY = event.clientY - rect.top
          this.isDragging = true
        }
      }),
    ).subscribe()

    mouseMoveSub$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(
      map(event => {
        if (!this.isZoomed) {
          return event
        }
        return undefined
      }),
      tap(event => {
        if (!event) return

        if (!event.ctrlKey || !this.startX || !this.startY || !this.isDragging) {
          return
        }
        if (event.ctrlKey && this.startX && this.startY && this.isDragging) {
          /!*        const sizeH = this.elementRef.nativeElement.offsetHeight
                  const sizeW = this.elementRef.nativeElement.offsetWidth

                  const pointerX = event.pageX - this.elementRef.nativeElement.offsetLeft
                  const pointerY = event.pageY - this.elementRef.nativeElement.offsetTop
                  const targetX = (pointerX - this.posX) / this.scale
                  const targetY = (pointerY - this.posY) / this.scale

                  this.scale += -1 * Math.max(-1, Math.min(1, (event as any).deltaY)) * this.speed * this.scale


                  this.scale = Math.max(this.min_scale, Math.min(this.max_scale, this.scale))

                  this.posX = -targetX * this.scale + pointerX
                  this.posY = -targetY * this.scale + pointerY

                  if (this.posX > 0) this.posX = 0
                  if (this.posX + sizeW * this.scale < sizeW) this.posX = -sizeW * (this.scale - 1)
                  if (this.posY > 0) this.posY = 0
                  if (this.posY + sizeH * this.scale < sizeH) this.posY = -sizeH * (this.scale - 1)*!/

          const mouseX = event.pageX - this.elementRef.nativeElement.parentNode.offsetLeft
          const mouseY = event.pageY - this.elementRef.nativeElement.parentNode.offsetTop

          /!*       var relativeXPosition = (e.pageX - dragDiv.offsetLeft);
                 var relativeYPosition = (e.pageY - dragDiv.offsetTop);*!/

          const newStartY = this.startY / this.scale
          const newStartX = this.startX / this.scale
          const top = mouseY - newStartY
          const left = mouseX - newStartX
          console.log('mouseY', mouseY)
          console.log('mouseX', mouseX)
          console.log('newStartY', newStartY)
          console.log('newStartX', newStartX)
          console.log('this.startX', this.startX)
          console.log('this.startY', this.startY)
          console.log('this.scale', this.scale)
          this.elementRef.nativeElement.style.top = top + 'px'
          this.elementRef.nativeElement.style.left = left + 'px'
          // console.log(this.elementRef.nativeElement)
          event.preventDefault()
          event.stopPropagation()
          /!*        this.renderer.setStyle(
                    this.elementRef.nativeElement,
                    'transform',
                    `translate(${this.posX - res.clientX}px,${this.posY - res.clientY}px) scale(${this.scale})`,
                    // `scale(${this._zoomLevel}) translate3d(${this.left}px, ${this.top}px, 0px)`,
                  )*!/
          // this.gridlayoutComponentXy = ({ componentX: res.clientX + this.posX, componentY: res.clientY + this.posY })
        }
      }),
      /!*    map(event => {
            if (!event.ctrlKey || !this.startX || !this.startY || !this.isDragging) {
              return
            }
            if (event.ctrlKey && this.startX && this.startY && this.isDragging) {

              const mouseX = event.pageX - this.elementRef.nativeElement.parentNode.offsetLeft
              const mouseY = event.pageY - this.elementRef.nativeElement.parentNode.offsetTop

              const top = mouseY - this.startY
              const left = mouseX - this.startX

              this.elementRef.nativeElement.style.top = top + 'px'
              this.elementRef.nativeElement.style.left = left + 'px'
              console.log(this.elementRef.nativeElement)
              event.preventDefault()
              event.stopPropagation()
              /!*        this.renderer.setStyle(
                        this.elementRef.nativeElement,
                        'transform',
                        `translate(${this.posX - res.clientX}px,${this.posY - res.clientY}px) scale(${this.scale})`,
                        // `scale(${this._zoomLevel}) translate3d(${this.left}px, ${this.top}px, 0px)`,
                      )*!/
              // this.gridlayoutComponentXy = ({ componentX: res.clientX + this.posX, componentY: res.clientY + this.posY })
            }
          }),*!/
    ).subscribe()
  */


  @Output() elementOffsets: EventEmitter<ElementOffsets> = new EventEmitter<ElementOffsets>()
  // @Output() zoomedIn: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() outputScale: EventEmitter<number> = new EventEmitter<number>()
  // @Output() zoomingOut: EventEmitter<boolean> = new EventEmitter<boolean>()


  /*
    @Input() set gridlayoutComponentXy(gridLayoutXY: GridLayoutXY | undefined | null) {
      if (!gridLayoutXY || !gridLayoutXY.componentX || !gridLayoutXY.componentY) return
      console.log(gridLayoutXY)
      this._componentX = gridLayoutXY.componentX
      this._componentY = gridLayoutXY.componentY
      console.log(gridLayoutXY)
      /!*    this.renderer.setStyle(
            this.elementRef.nativeElement,
            'transform',
            `scale(${this._zoomLevel}) translate(${gridLayoutXY.componentX}px, ${gridLayoutXY.componentY}px)`,
            // `scale(${this._zoomLevel}) translate3d(${this.left}px, ${this.top}px, 0px)`,
          )*!/
      const sizeH = this.elementRef.nativeElement.offsetHeight
      const sizeW = this.elementRef.nativeElement.offsetWidth
      if (this.posX > 0) this.posX = 0
      if (this.posX + sizeW * this.scale < sizeW) this.posX = -sizeW * (this.scale - 1)
      if (this.posY > 0) this.posY = 0
      if (this.posY + sizeH * this.scale < sizeH) this.posY = -sizeH * (this.scale - 1)
      /!*    let compX = gridLayoutXY.componentX
          let compY = gridLayoutXY.componentY
          if (compX > 0) compX = 0
          if (compX + sizeW * this.scale < sizeW) this.posX = -sizeW * (this.scale - 1)
          if (compY > 0) compY = 0
          if (compY + sizeH * this.scale < sizeH) this.posY = -sizeH * (this.scale - 1)*!/
      // const renderX = (gridLayoutXY.componentX < 0) ? gridLayoutXY.componentX + this.posX : gridLayoutXY.componentX - this.posX
      // const renderY = (gridLayoutXY.componentY < 0) ? gridLayoutXY.componentY + this.posY : gridLayoutXY.componentY - this.posY
      // const renderX = gridLayoutXY.componentX + this.posX
      // const renderY = gridLayoutXY.componentY + this.posY
      const renderX = gridLayoutXY.componentX
      const renderY = gridLayoutXY.componentY
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        'transform',
        `translate(${renderX}px,${renderY}px) scale(${this.scale})`,
        // `scale(${this._zoomLevel}) translate3d(${this.left}px, ${this.top}px, 0px)`,
      )
      // console.log('gridLayoutXY.componentX + this.posX', gridLayoutXY.componentX + this.posX)
      // console.log('gridLayoutXY.componentY + this.posY', gridLayoutXY.componentY + this.posY)
    }

  */

  @HostListener('window:keyup', ['$event'])
  async keyEvent(event: KeyboardEvent) {
    console.log(event)
    if (event.key === 'b') {
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        'transform',
        `translate(${this.posX + 10}px,${this.posY}px) scale(${this.scale})`,
        // `scale(${this._zoomLevel}) translate3d(${this.left}px, ${this.top}px, 0px)`,
      )
    }

  }


  ngAfterViewInit() {
    const offsets: ElementOffsets = {
      offsetHeight: this.elementRef.nativeElement.offsetHeight,
      offsetWidth: this.elementRef.nativeElement.offsetWidth,
      offsetLeft: this.elementRef.nativeElement.offsetLeft,
      offsetTop: this.elementRef.nativeElement.offsetTop,
    }
    this.elementOffsets.emit(offsets)
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    console.log(event)
    const offsets: ElementOffsets = {
      offsetHeight: this.elementRef.nativeElement.offsetHeight,
      offsetWidth: this.elementRef.nativeElement.offsetWidth,
      offsetLeft: this.elementRef.nativeElement.offsetLeft,
      offsetTop: this.elementRef.nativeElement.offsetTop,
    }
    this.elementOffsets.emit(offsets)
  }

  @HostListener('wheel', ['$event'])
  public onScroll(event: WheelEvent) {
    console.log(event)
    event.preventDefault()
    // this.elementRef.nativeElement.style.zoom = 2
    this._zoomLevel += event.deltaY * 0.001
    this._zoomLevel = Math.max(0.5, Math.min(this._zoomLevel, 2))
    this.mouseX = event.clientX
    this.mouseY = event.clientY
    this.componentX = this.mouseX - this.elementRef.nativeElement.offsetWidth / 2 * this._zoomLevel
    this.componentY = this.mouseY - this.elementRef.nativeElement.offsetHeight / 2 * this._zoomLevel
    // this.updateZoom()
    /*    this.renderer.setStyle(
          this.elementRef.nativeElement,
          'transform',
          `scale(${this._zoomLevel}) translate(${this.componentX}px, ${this.componentY}px)`,
          // `scale(${this._zoomLevel}) translate3d(${this.left}px, ${this.top}px, 0px)`,
        )*/
    // this.element.nativeElement.scrollLeft += event.deltaY;


    const sizeH = this.elementRef.nativeElement.offsetHeight
    const sizeW = this.elementRef.nativeElement.offsetWidth

    const pointerX = event.pageX - this.elementRef.nativeElement.offsetLeft
    const pointerY = event.pageY - this.elementRef.nativeElement.offsetTop
    const targetX = (pointerX - this.posX) / this.scale
    const targetY = (pointerY - this.posY) / this.scale

    this.scale += -1 * Math.max(-1, Math.min(1, event.deltaY)) * this.speed * this.scale


    this.scale = Math.max(this.min_scale, Math.min(this.max_scale, this.scale))

    this.posX = -targetX * this.scale + pointerX
    this.posY = -targetY * this.scale + pointerY

    if (this.posX > 0) this.posX = 0
    if (this.posX + sizeW * this.scale < sizeW) this.posX = -sizeW * (this.scale - 1)
    if (this.posY > 0) this.posY = 0
    if (this.posY + sizeH * this.scale < sizeH) this.posY = -sizeH * (this.scale - 1)

    /*    const xs = (event.clientX - this.posX) / this.scale
        const ys = (event.clientY - this.posY) / this.scale
        const delta = ((event as any).wheelDelta ? (event as any).wheelDelta : -event.deltaY);
        (delta > 0) ? (this.scale *= 1.1) : (this.scale /= 1.1)
        this.posX = event.clientX - xs * this.scale
        this.posY = event.clientY - ys * this.scale*/
    this.uiRepository.setPosXY({
      posX: this.posX,
      posY: this.posY,
    })

    if (this.scale < 3) {
      this.elementRef.nativeElement.style.top = '0px'
      this.elementRef.nativeElement.style.left = '0px'
    }

    if (this.scale > 2) {
      this.isZoomed = true
      // this.zoomedIn.emit(true)
    }

    if (this.scale < 2) {
      this.isZoomed = false
      // this.zoomedIn.emit(false)
    }

    if (event.deltaY < 0) {
      //zooming in
    }

    if (event.deltaY > 0) {
      // zooming out
    }


    this.outputScale.emit(this.scale)

    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'transform',
      `translate(${this.posX}px,${this.posY}px) scale(${this.scale})`,
      // `scale(${this._zoomLevel}) translate3d(${this.left}px, ${this.top}px, 0px)`,
    )
    console.log(this.scale)
    console.log('this.posX', this.posX)
    console.log('this.posY', this.posY)
    // image.style.transform = `translate(${pos.x}px,${pos.y}px) scale(${scale},${scale})`

  }


  /*
    @HostListener('document:mousedown', ['$event'])
    mouseDown(event: MouseEvent) {
      this.getScreenWidth = window.innerWidth
      this.getScreenHeight = window.innerHeight
      console.log(`${this.getScreenWidth}x${this.getScreenHeight}`)
      console.log(event)
      console.log('MOUSEDOWN', event)
      if (event.button === 1 || event.ctrlKey) { // Check if the mouse wheel button was pressed
        this.isMoving = true
        this.mouseClick = {
          x: event.clientX,
          y: event.clientY,
          left: this.left,
          top: this.top,
        }
        this.left = this.mouseClick.left +
          (this.mouseX - this.mouseClick.x)
        this.top = this.mouseClick.top +
          (this.mouseY - this.mouseClick.y)
        /!*


              this.startX = clientXY.clientX - rect.left
              this.startY = clientXY.clientY - rect.top*!/
        // const rect = this.elementRef.nativeElement.getBoundingClientRect()
        /!*      this.mouseX = event.clientX
              this.mouseY = event.clientY*!/
        const rect = this.elementRef.nativeElement.getBoundingClientRect()
        console.log(rect)
        /!*      rel: {
                x: e.pageX - pos.left,
                  y: e.pageY - pos.top
              }*!/

        // this.mouseX = event.pageX - rect.left
        // this.mouseY = event.pageY - rect.top
        // this.mouseX = event.pageX - this.elementRef.nativeElement.parentNode.offsetLeft
        // this.mouseY = event.pageY - this.elementRef.nativeElement.parentNode.offsetTop
        // this.mouseX = event.clientX - rect.left
        // this.mouseY = event.clientY - rect.top
        this.isMoving = true
        this.mouseX = event.clientX
        this.mouseY = event.clientY
        // this.componentX = event.target.offsetLeft;
        // this.componentY = event.target.offsetTop;
        // this.mouseX = event.clientX
        // this.mouseY = event.clientY
        const element = event.target as HTMLElement
        console.log(element)
        this.componentX = element.offsetLeft
        this.componentY = element.offsetTop
        console.log(this.mouseX, this.mouseY)
        // this.componentX = (event.target as any).offsetLeft
        // this.componentY = (event.target as any).offsetTop
        console.log((event.target as any).offsetLeft, (event.target as any).offsetTop)
        console.log(event)
        /!*      this.componentX = event.target?.offsetLeft
              this.componentY = event.target?.offsetTop*!/
      }
      /!*    console.log(event.clientX, event.clientY)
          this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
          this.startX = undefined
          this.startY = undefined*!/
      // return
      event.preventDefault()
      event.stopPropagation()
    }
  */

  /*
    @HostListener('document:mouseup', ['$event'])
    mouseUp(event: MouseEvent) {
      event.preventDefault()
      event.stopPropagation()
      this.isMoving = false
      return
    }
  */

  /*<div [ngStyle]="{'transform': 'scale(' + zoomLevel + ') translate(' + componentX + 'px, ' + componentY + 'px)'}">
      <!-- Your component content goes here -->
  </div>*/
  /*  @HostListener('document:mousemove', ['$event'])
    onDragging(event: MouseEvent) {

      // console.log(event)
      if (event.ctrlKey && this.isMoving) {
        const { left, top } = this.elementRef.nativeElement.getBoundingClientRect()
        // const mouseX = event.pageX - this.elementRef.nativeElement.parentNode.offsetLeft
        // const mouseY = event.pageY - this.elementRef.nativeElement.parentNode.offsetTop

        const dx = event.clientX - this.mouseX
        const dy = event.clientY - this.mouseY
        // console.log(event)
        // Calculate the new position of the component
        /!*            const dx = event.clientX - this.mouseX
                    const dy = event.clientY - this.mouseY
                    this.componentX += dx
                    this.componentY += dy*!/
        // const dx = event.clientX - this.mouseX
        // const dy = event.clientY - this.mouseY
        const scaledDx = dx * this.speed
        const scaledDy = dy * this.speed
        /!*      let componentX = [...gridLayoutXY.componentX];
              let componentY = [...y];*!/
        // const updatedComponentX = gridLayoutXY.componentX + scaledDx
        // const updatedComponentY = gridLayoutXY.componentY + scaledDy
        this.componentX += scaledDx
        this.componentY += scaledDy
        // const mouseX = event.pageX - this.elementRef.nativeElement.parentNode.offsetLeft
        // const mouseY = event.pageY - this.elementRef.nativeElement.parentNode.offsetTop
        /!*      const dx = event.clientX - mouseX
              const dy = event.clientY - mouseY
              this.componentX += dx
              this.componentY += dy*!/

        // {'left': componentX + 'px', 'top': componentY + 'px'}
        // this.elementRef.nativeElement.style.offsetLeft = this.componentX
        // this.elementRef.nativeElement.style.offsetTop = this.componentY
        console.log(this.elementRef.nativeElement.style.offsetLeft, this.elementRef.nativeElement.style.offsetTop)
        /!*      this.renderer.setStyle(
                this.elementRef.nativeElement,
                'transform',
                `scale(${this._zoomLevel}) translate(${this.componentX}px, ${this.componentY}px)`,
              )*!/
        // this.left = this.mouseClick.left + (this.mouse.x - this.mouseClick.x)
        /!*      this.left = this.mouseClick.left +
                (this.mouseX - this.mouseClick.x)
              this.top = this.mouseClick.top +
                (this.mouseY - this.mouseClick.y)*!/
        this.left = this.mouseClick.left +
          (event.clientX - this.mouseClick.x)
        this.top = this.mouseClick.top +
          (event.clientY - this.mouseClick.y)
        // this.top = this.mouseClick.top + (this.mouse.y - this.mouseClick.y)
        this.renderer.setStyle(
          this.elementRef.nativeElement,
          'transform',
          `scale(${this._zoomLevel}) translate(${this.left}px, ${this.top}px)`,
          // `scale(${this._zoomLevel}) translate3d(${this.left}px, ${this.top}px, 0px)`,
        )

        this.mouseX = event.clientX
        this.mouseY = event.clientY

        event.preventDefault()
        event.stopPropagation()
      }
    }*/

}
