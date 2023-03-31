import {
  ContentChildren,
  Directive,
  ElementRef,
  inject,
  NgZone,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core'
import { NoGridLayoutService } from './no-grid-layout.service'
import { getGuid } from '@shared/utils'
import { FreeBlockRectModel } from './free-block-rect.model'
import { FreePanelDirective } from './components/free-panel-component/free-panel.directive'
import { PanelStylerService } from './panel-styler.service'
import { CanvasService } from './canvas.service'
import { FreePanelComponent, FreePanelModel } from '@no-grid-layout/feature'
import { FreePanelBgStates } from './color-config'

// import Record from '$GLOBAL$'

@Directive({
  selector: '[appNoGridLayoutDirective]',
  standalone: true,
  // providers
})
export class NoGridLayoutDirective implements OnInit {
  private elementRef = inject(ElementRef<HTMLDivElement>)
  private renderer = inject(Renderer2)
  private noGridLayoutService = inject(NoGridLayoutService)
  private clickTimeout: NodeJS.Timeout | undefined
  private canvas!: HTMLCanvasElement
  private ctx!: CanvasRenderingContext2D
  private panelStylerService = inject(PanelStylerService)
  private canvasService = inject(CanvasService)
  // private ngZone = inject(NgZone)
  // private lineDrawerService = new LineDrawerService(can)
  // private lineDrawerService!: LineDrawerService
  // private freePanelsFacade = inject(FreePanelsFacade)
  @ViewChildren(FreePanelComponent) myDivs!: QueryList<FreePanelComponent>
  @ViewChildren('panelMarker') panelMarkers!: QueryList<any>
  @ContentChildren(FreePanelComponent) freePanelComponents!: QueryList<FreePanelComponent>
  @ContentChildren(FreePanelDirective) freePanelDirectives!: QueryList<FreePanelDirective>
  selectedPanelId?: string
  pageX = 0
  pageY = 0
  runEventsOutsideAngular = false
  isDragging = false
  animationId?: number
  pathMapAnimating = false
  fpsInterval = 1000 / 60
  startTime = Date.now()
  cachedPanels: FreeBlockRectModel[] = []
  scale = 1
  posX = 0
  posY = 0
  /*  interface hello{
   hello: string
   }*/
  /*enum hello{
   hello = 'hello'
   }*/
  panelsInLineToRight: string[] = []
  panelsInLineToLeft: string[] = []
  panelsInLineToTop: string[] = []
  panelsInLineToBottom: string[] = []
  startX?: number
  startY?: number
  height!: number
  negativeHeight!: number

  width!: number
  negativeWidth!: number
  maxScale = 2
  minScale = 1
  speed = 0.1

  // lightUpPanels: Record<string, LineDirectionEnum> = {}

  // lightUpPanels: Set<string> = new Set()

  constructor(private readonly ngZone: NgZone) {

    // super( )

    // this.ngZone = ngZone
    // lineDrawerService.setCanvas(this.canvas)
  }

  ngOnInit() {
    if (this.runEventsOutsideAngular) {
      this.ngZone.runOutsideAngular(() => {
        this.setupMouseEventListeners()
      })
    } else {
      this.setupMouseEventListeners()
    }
    this.setupCanvas()
  }

  private setupElements() {
    this.height = Number(this.elementRef.nativeElement.style.height.split('p')[0])
    this.negativeHeight = Number(this.elementRef.nativeElement.style.height.split('p')[0]) * -1
    this.width = Number(this.elementRef.nativeElement.style.width.split('p')[0])
    this.negativeWidth = Number(this.elementRef.nativeElement.style.width.split('p')[0]) * -1
  }

  private setupCanvas() {
    this.canvas = this.renderer.createElement('canvas')
    this.renderer.appendChild(this.elementRef.nativeElement, this.canvas)
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
    this.canvas.width = this.elementRef.nativeElement.offsetWidth
    this.canvas.height = this.elementRef.nativeElement.offsetHeight
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.canvasService.setCanvas(this.canvas, this.ctx)
  }

  private setupMouseEventListeners() {
    this.renderer.listen(this.elementRef.nativeElement, 'mouseup', (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseUpHandler(event)
    })
    this.renderer.listen(this.elementRef.nativeElement, 'mousedown', (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseDownHandler(event)
    })
    this.renderer.listen(this.elementRef.nativeElement, 'mousemove', (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseMoveHandler(event)
    })
    this.renderer.listen(this.elementRef.nativeElement, 'wheel', (event: WheelEvent) => {
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
    event.stopPropagation()
    event.preventDefault()
    console.log('mouseup', event)
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    this.selectedPanelId = undefined
    this.isDragging = false
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout)
      console.log('Button clicked')
      this.handleClickEvent(event)
    } else {
      console.log('Button dragged')
    }
    return
  }

  private onMouseDownHandler(event: MouseEvent) {
    event.stopPropagation()
    event.preventDefault()
    console.log('mousedown', event)
    this.isDragging = true
    if (event.ctrlKey || event.button === 1) {
      const rect = this.elementRef.nativeElement.getBoundingClientRect()
      this.startX = event.clientX - rect.left
      this.startY = event.clientY - rect.top
      this.isDragging = true
      /*     if (event.button === 1) {
       this.middleClickDown = true
       }*/
      return
    }

    const panelId = (event.composedPath()[0] as HTMLDivElement).getAttribute('panelId')
    if (panelId) {
      // console.log('panelId', panelId)
      this.selectedPanelId = panelId

    }
    this.clickTimeout = setTimeout(() => {
      this.clickTimeout = undefined
    }, 300)
    return
  }

  private handleClickEvent(event: MouseEvent) {
    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    console.log('location', location)
    if (location) return
    /*    // check if it is a middle click
     if (event.button === 1) return
     // check if it is a right click
     if (event.button === 2) return
     // check if it is a ctrl click
     if (event.ctrlKey) return
     // check if it is a alt click
     if (event.altKey) return*/

    console.log('click')
    if (event.ctrlKey) return
    const rect = this.elementRef.nativeElement.getBoundingClientRect()
    const mouseX = event.pageX - rect.left
    const mouseY = event.pageY - rect.top

    const freePanel: FreePanelModel = {
      id: getGuid(),
      location: {
        x: mouseX,
        y: mouseY,
      },
      backgroundColor: FreePanelBgStates.Default,
      // backgroundColor: BgColorBuilder('pink').toString(),
    }

    console.log('clickEvent', event)
    this.noGridLayoutService.addFreePanel(freePanel)
    return
  }

  private onMouseMoveHandler(event: MouseEvent) {
    if (this.isDragging) {
      if (event.ctrlKey) {
        return this.handleCtrlMouseMove(event)
      }
      const panelId = (event.composedPath()[0] as HTMLDivElement).getAttribute('panelId')
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

  private handleCtrlMouseMove(event: MouseEvent) {
    if (!this.startX || !this.startY) return
    // const height = this.elementRef.nativeElement.offsetHeight
    // const width = this.elementRef.nativeElement.offsetWidth
    const parentRect = this.elementRef.nativeElement.parentNode.getBoundingClientRect()
    const mouseX =
      event.pageX -
      (parentRect.width - this.width) / 2 -
      this.elementRef.nativeElement.parentNode.offsetLeft

    const mouseY =
      event.pageY -
      (parentRect.height - this.height) / 2 -
      this.elementRef.nativeElement.parentNode.offsetTop

    const newStartY = this.startY
    const newStartX = this.startX

    const top = mouseY - newStartY
    const left = mouseX - newStartX

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

    this.elementRef.nativeElement.style.top = top + 'px'
    this.elementRef.nativeElement.style.left = left + 'px'
    this.elementRef.nativeElement.style.cursor = 'grab'
    return
  }

  private onScrollHandler(event: WheelEvent) {

    console.log(event)
    // event.preventDefault()

    const sizeH = this.elementRef.nativeElement.offsetHeight
    const sizeW = this.elementRef.nativeElement.offsetWidth

    const pointerX = event.pageX - this.elementRef.nativeElement.offsetLeft
    const pointerY = event.pageY - this.elementRef.nativeElement.offsetTop
    const targetX = (pointerX - this.posX) / this.scale
    const targetY = (pointerY - this.posY) / this.scale

    this.scale += -1 * Math.max(-1, Math.min(1, event.deltaY)) * this.speed * this.scale

    this.scale = Math.max(this.minScale, Math.min(this.maxScale, this.scale))

    this.posX = -targetX * this.scale + pointerX
    this.posY = -targetY * this.scale + pointerY

    if (this.posX > 0) this.posX = 0
    if (this.posX + sizeW * this.scale < sizeW) this.posX = -sizeW * (this.scale - 1)
    if (this.posY > 0) this.posY = 0
    if (this.posY + sizeH * this.scale < sizeH) this.posY = -sizeH * (this.scale - 1)

    /*    this.uiRepository.setPosXY({
     posX: this.posX,
     posY: this.posY,
     })*/

    // this.outputScale.emit(this.scale)
    // this.uiStore.dispatch.setScale(this.scale)

    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'transform',
      `translate(${this.posX}px,${this.posY}px) scale(${this.scale})`,
    )
  }

  animateLinesFromBlockMoving() {
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
    const panelDimensions = this.canvasService.getBlockRect(this.selectedPanelId)
    if (!panelDimensions) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      console.error('no panelDimensions')
      return
    }
    this.drawLinesAllDirectionsForBlock(panelDimensions)
    this.animationId = requestAnimationFrame(() => this.animateLinesFromBlockMoving())
  }

  drawLinesAllDirectionsForBlock(blockRectModel: FreeBlockRectModel) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = 'red'
    this.ctx.fillStyle = 'red'
    this.ctx.font = '15px Arial'

    this.canvasService.drawLineForAboveBlock(blockRectModel)
    this.canvasService.drawLineForBelowBlock(blockRectModel)
    this.canvasService.drawLineForLeftBlock(blockRectModel)
    this.canvasService.drawLineForRightBlock(blockRectModel)
  }
}
