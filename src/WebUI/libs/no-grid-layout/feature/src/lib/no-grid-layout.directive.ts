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
import { FreePanelComponent, FreePanelModel } from '@no-grid-layout/feature'
import { NoGridLayoutService } from './no-grid-layout.service'
import { getGuid } from '@shared/utils'
import { BlockRectModel } from '@grid-layout/data-access'
import { LineDrawerService } from './line-drawer.service'

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
  // private ngZone = inject(NgZone)
  // private lineDrawerService = new LineDrawerService(can)
  private lineDrawerService!: LineDrawerService
  @ViewChildren(FreePanelComponent) myDivs!: QueryList<FreePanelComponent>
  @ViewChildren('panelMarker') panelMarkers!: QueryList<any>
  @ContentChildren(FreePanelComponent) freePanelComponents!: QueryList<FreePanelComponent>
  selectedPanelId?: string
  pageX = 0
  pageY = 0
  runEventsOutsideAngular = false
  isDragging = false
  animationId?: number
  pathMapAnimating = false
  fpsInterval = 1000 / 60
  startTime = Date.now()
  cachedPanels: BlockRectModel[] = []

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
    this.lineDrawerService = new LineDrawerService(this.canvas)
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

    const panelId = (event.composedPath()[0] as HTMLDivElement).getAttribute('panelId')
    if (panelId) {
      console.log('panelId', panelId)
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
    }

    console.log('clickEvent', event)
    this.noGridLayoutService.addFreePanel(freePanel)
    return
  }

  private onMouseMoveHandler(event: MouseEvent) {
    if (this.isDragging) {
      const panelId = (event.composedPath()[0] as HTMLDivElement).getAttribute('panelId')
      if (panelId) {
        this.selectedPanelId = panelId
        this.pageX = event.pageX
        this.pageY = event.pageY
        this.ngZone.runOutsideAngular(() => {
          this.animate()
        })
      }
    }
    return
  }

  animate() {
    // const startTime = performance.now()
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
    const panelDimensions = this.getBlockRect(this.selectedPanelId)
    if (!panelDimensions) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      console.error('no panelDimensions')
      return
    }
    this.animateLinesFromBlock(panelDimensions)
    this.animationId = requestAnimationFrame(() => this.animate())

  }

  animateLinesFromBlock(blockRectModel: BlockRectModel) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = 'red'
    this.ctx.fillStyle = 'red'
    this.ctx.font = '15px Arial'

    this.drawLineForAboveBlockV2(blockRectModel)
    this.drawLineForBelowBlockV2(blockRectModel)
    this.drawLineForLeftBlockV2(blockRectModel)
    this.drawLineForRightBlockV2(blockRectModel)
  }

  private drawLineForBelowBlockV2(blockRectModel: BlockRectModel) {
    const printDefault = () => {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x, blockRectModel.y + blockRectModel.height / 2)
      this.ctx.lineTo(blockRectModel.x, this.canvas.height)
      this.ctx.stroke()

      const distanceToBottomOfPage = this.canvas.height - (blockRectModel.y + blockRectModel.height / 2)
      const absoluteDistance = Math.abs(distanceToBottomOfPage)
      this.ctx.fillText(`${absoluteDistance}px`, blockRectModel.x - 50, this.canvas.height - 50)
    }
    if (!this.cachedPanels) {
      return printDefault()
    }
    const panelRectsToCheck = this.cachedPanels.filter(rect => blockRectModel.x >= rect.x - rect.width / 2 && blockRectModel.x <= rect.x + rect.width / 2 && blockRectModel.y < rect.y)
    if (!panelRectsToCheck.length) {
      return printDefault()
    }

    const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
      const distance = Math.abs(rect.y - blockRectModel.y)

      return { ...rect, distance }
    })
    const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
    const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
    if (!closestPanelRect) return printDefault()
    this.ctx.beginPath()
    this.ctx.moveTo(blockRectModel.x, blockRectModel.y + blockRectModel.height / 2)
    this.ctx.lineTo(blockRectModel.x, closestPanelRect.y - closestPanelRect.height / 2)
    this.ctx.stroke()

    const distanceToClosestPanel = closestPanelRect.y - closestPanelRect.height / 2 - (blockRectModel.y + blockRectModel.height / 2)
    const absoluteDistance = Math.abs(distanceToClosestPanel)
    this.ctx.fillText(`${absoluteDistance}px`, blockRectModel.x - 50, blockRectModel.y + blockRectModel.height / 2 + 50)
    return
  }

  private drawLineForAboveBlockV2(blockRectModel: BlockRectModel) {
    const printDefault = () => {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x, blockRectModel.y - blockRectModel.height / 2)
      this.ctx.lineTo(blockRectModel.x, 0)
      this.ctx.stroke()

      const distanceToTopOfPage = blockRectModel.y - blockRectModel.height / 2
      const absoluteDistance = Math.abs(distanceToTopOfPage)
      this.ctx.fillText(`${absoluteDistance}px`, blockRectModel.x - 50, 50)
      return
    }
    if (!this.cachedPanels) {
      return printDefault()
    }
    const panelRectsToCheck = this.cachedPanels.filter(rect => blockRectModel.x >= rect.x - rect.width / 2 && blockRectModel.x <= rect.x + rect.width / 2 && blockRectModel.y > rect.y)
    if (!panelRectsToCheck.length) {
      return printDefault()
    }
    const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
      const distance = Math.abs(rect.y - blockRectModel.y)
      return { ...rect, distance }
    })
    const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
    const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
    if (!closestPanelRect) return printDefault()

    this.ctx.beginPath()
    this.ctx.moveTo(blockRectModel.x, blockRectModel.y - blockRectModel.height / 2)
    this.ctx.lineTo(blockRectModel.x, closestPanelRect.y + closestPanelRect.height / 2)
    this.ctx.stroke()

    const distanceToClosestPanel = closestPanelRect.y + closestPanelRect.height / 2 - (blockRectModel.y - blockRectModel.height / 2)
    const absoluteDistance = Math.abs(distanceToClosestPanel)
    this.ctx.fillText(`${absoluteDistance}px`, blockRectModel.x - 50, blockRectModel.y - blockRectModel.height / 2 - 50)
  }

  private drawLineForLeftBlockV2(blockRectModel: BlockRectModel) {
    const printDefault = () => {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x - blockRectModel.width / 2, blockRectModel.y)
      this.ctx.lineTo(0, blockRectModel.y)
      this.ctx.stroke()

      const distanceToLeftOfPage = blockRectModel.x - blockRectModel.width / 2
      const absoluteDistance = Math.abs(distanceToLeftOfPage)
      this.ctx.fillText(`${absoluteDistance}px`, 50, blockRectModel.y - 50)
      return
    }
    if (!this.cachedPanels) {
      return printDefault()
    }
    const panelRectsToCheck = this.cachedPanels.filter(rect => blockRectModel.y >= rect.y - rect.height / 2 && blockRectModel.y <= rect.y + rect.height / 2 && blockRectModel.x > rect.x)
    if (!panelRectsToCheck.length) {
      return printDefault()
    }

    const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
      const distance = Math.abs(rect.x - blockRectModel.x)
      return { ...rect, distance }
    })
    const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
    const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
    if (!closestPanelRect) return printDefault()
    this.ctx.beginPath()
    this.ctx.moveTo(blockRectModel.x - blockRectModel.width / 2, blockRectModel.y)
    this.ctx.lineTo(closestPanelRect.x + closestPanelRect.width / 2, blockRectModel.y)
    this.ctx.stroke()

    const distanceToClosestPanel = closestPanelRect.x + closestPanelRect.width / 2 - (blockRectModel.x - blockRectModel.width / 2)
    const absoluteDistance = Math.abs(distanceToClosestPanel)
    this.ctx.fillText(`${absoluteDistance}px`, blockRectModel.x - blockRectModel.width / 2 - 50, blockRectModel.y - 50)

  }

  private drawLineForRightBlockV2(blockRectModel: BlockRectModel) {
    const printDefault = () => {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x + blockRectModel.width / 2, blockRectModel.y)
      this.ctx.lineTo(this.canvas.width, blockRectModel.y)
      this.ctx.stroke()

      const distanceToRightOfPage = this.canvas.width - (blockRectModel.x + blockRectModel.width / 2)
      const absoluteDistance = Math.abs(distanceToRightOfPage)
      this.ctx.fillText(`${absoluteDistance}px`, this.canvas.width - 50, blockRectModel.y - 50)
      return
    }
    if (!this.cachedPanels) {
      return printDefault()
    }
    const panelRectsToCheck = this.cachedPanels.filter(rect => blockRectModel.y >= rect.y - rect.height / 2 && blockRectModel.y <= rect.y + rect.height / 2 && blockRectModel.x < rect.x)
    if (!panelRectsToCheck.length) {
      return printDefault()
    }

    const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
      const distance = Math.abs(rect.x - blockRectModel.x)
      return { ...rect, distance }
    })
    const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
    const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
    if (!closestPanelRect) return printDefault()
    this.ctx.beginPath()
    this.ctx.moveTo(blockRectModel.x + blockRectModel.width / 2, blockRectModel.y)
    this.ctx.lineTo(closestPanelRect.x - closestPanelRect.width / 2, blockRectModel.y)
    this.ctx.stroke()

    const distanceToClosestPanel = closestPanelRect.x - closestPanelRect.width / 2 - (blockRectModel.x + blockRectModel.width / 2)
    const absoluteDistance = Math.abs(distanceToClosestPanel)
    this.ctx.fillText(`${absoluteDistance}px`, blockRectModel.x + blockRectModel.width / 2 + 50, blockRectModel.y - 50)

  }

  private getBlockRect(panelId: string): BlockRectModel | undefined {
    const panels = document.querySelectorAll('[panelId]')

    if (!panels) {
      return undefined
    }

    this.cachedPanels = Array.from(panels).map(panel => this.getBlockRectFromElement(panel))

    const panelDiv = Array.from(panels).find(p => p.getAttribute('panelId') === panelId)

    if (!panelDiv) {
      return undefined
    }
    const panelRect = panelDiv.getBoundingClientRect()
    const canvasRect = this.canvas.getBoundingClientRect()
    const x = panelRect.left - canvasRect.left + panelRect.width / 2
    const y = panelRect.top - canvasRect.top + panelRect.height / 2
    return { x, y, height: panelRect.height, width: panelRect.width }
  }

  private getBlockRectFromElement(element: Element): BlockRectModel {
    const panelRect = element.getBoundingClientRect()
    const canvasRect = this.canvas.getBoundingClientRect()
    const x = panelRect.left - canvasRect.left + panelRect.width / 2
    const y = panelRect.top - canvasRect.top + panelRect.height / 2

    return { x, y, height: panelRect.height, width: panelRect.width }
  }
}
