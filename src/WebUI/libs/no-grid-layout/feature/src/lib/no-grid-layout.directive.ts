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
import tippy from 'tippy.js'
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
          // this.animateLines()
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
      // console.error('no panel selected')
      return
    }
    // const rect = (event.composedPath()[0] as HTMLDivElement).getBoundingClientRect()
    // const dimensions = this.getDivDimensions(rect)
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

    // this.lineDrawerService.drawLineForAboveBlockV2(blockRectModel)
    this.drawLineForAboveBlockV2(blockRectModel)
    // this.drawLineForAboveBlock(blockRectModel)
    this.drawLineForBelowBlockV2(blockRectModel)
    // this.drawLineForBelowBlock(blockRectModel)
    this.drawLineForLeftBlockV2(blockRectModel)
    // this.drawLineForLeftBlock(blockRectModel)
    this.drawLineForRightBlockV2(blockRectModel)
    // this.drawLineForRightBlock(blockRectModel)
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

  private drawLineForAboveBlock(blockRectModel: BlockRectModel) {
    if (this.cachedPanels) {
      const panelRectsToCheck = this.cachedPanels.filter(rect => blockRectModel.x >= rect.x - rect.width / 2 && blockRectModel.x <= rect.x + rect.width / 2 && blockRectModel.y > rect.y)
      if (panelRectsToCheck.length) {
        const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
          // const distance = Math.sqrt(Math.pow(rect.x - blockRectModel.x, 2) + Math.pow(rect.y - blockRectModel.y, 2))
          const distance = Math.abs(rect.y - blockRectModel.y)

          return { ...rect, distance }
        })
        const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
        const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
        if (closestPanelRect) {
          this.ctx.beginPath()
          // this.ctx.moveTo(blockRectModel.x, blockRectModel.y + blockRectModel.height / 2)
          // this.ctx.lineTo(blockRectModel.x, closestPanelRect.y - closestPanelRect.height / 2)
          this.ctx.moveTo(blockRectModel.x, blockRectModel.y - blockRectModel.height / 2)
          this.ctx.lineTo(blockRectModel.x, closestPanelRect.y + closestPanelRect.height / 2)
          this.ctx.stroke()

          const distanceToClosestPanel = closestPanelRect.y + closestPanelRect.height / 2 - (blockRectModel.y - blockRectModel.height / 2)
          this.ctx.fillStyle = 'red'
          this.ctx.font = '15px Arial'
          this.ctx.fillText(`${distanceToClosestPanel}px`, blockRectModel.x - 50, blockRectModel.y - blockRectModel.height / 2 - 50)
        }
      } else {
        this.ctx.beginPath()
        this.ctx.moveTo(blockRectModel.x, blockRectModel.y - blockRectModel.height / 2)
        this.ctx.lineTo(blockRectModel.x, 0)
        this.ctx.stroke()

        const distanceToTopOfPage = blockRectModel.y - blockRectModel.height / 2
        this.ctx.fillStyle = 'red'
        this.ctx.font = '15px Arial'
        this.ctx.fillText(`${distanceToTopOfPage}px`, blockRectModel.x - 50, 50)
      }
    } else {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x, blockRectModel.y - blockRectModel.height / 2)
      this.ctx.lineTo(blockRectModel.x, 0)
      this.ctx.stroke()

      const distanceToTopOfPage = blockRectModel.y - blockRectModel.height / 2
      this.ctx.fillStyle = 'red'
      this.ctx.font = '15px Arial'
      this.ctx.fillText(`${distanceToTopOfPage}px`, blockRectModel.x - 50, 50)
    }
  }

  private drawLineForAboveBlockV2(blockRectModel: BlockRectModel) {
    const printDefault = () => {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x, blockRectModel.y - blockRectModel.height / 2)
      this.ctx.lineTo(blockRectModel.x, 0)
      this.ctx.stroke()

      const distanceToTopOfPage = blockRectModel.y - blockRectModel.height / 2
      const absoluteDistance = Math.abs(distanceToTopOfPage)
      this.ctx.fillStyle = 'red'
      this.ctx.font = '15px Arial'
      this.ctx.fillText(`${absoluteDistance}px`, blockRectModel.x - 50, 50)
      return
      /*      return this.drawLinesAndTextBetweenTwoLocationsV2(
       {
       x: blockRectModel.x,
       y: blockRectModel.y - blockRectModel.height / 2,
       },
       {
       x: blockRectModel.x,
       y: 0,
       },
       )*/
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
    this.ctx.fillStyle = 'red'
    this.ctx.font = '15px Arial'
    const absoluteDistance = Math.abs(distanceToClosestPanel)
    this.ctx.fillText(`${absoluteDistance}px`, blockRectModel.x - 50, blockRectModel.y - blockRectModel.height / 2 - 50)
    /*      const distanceToClosestPanel = closestPanelRect.y - closestPanelRect.height / 2 - (blockRectModel.y + blockRectModel.height / 2)
     this.ctx.fillStyle = 'red'
     this.ctx.font = '15px Arial'
     this.ctx.fillText(`${distanceToClosestPanel}px`, blockRectModel.x - 50, blockRectModel.y + blockRectModel.height / 2 + 50)*/
    /*      return this.drawLinesAndTextBetweenTwoLocationsV2(
     {
     x: blockRectModel.x,
     y: closestPanelRect.y + closestPanelRect.height / 2,

     },
     {
     x: blockRectModel.x,
     y: blockRectModel.y - blockRectModel.height / 2,
     },
     )*/

  }

  private getClosedPanelRect(panelRectsToCheck: BlockRectModel[], distanceCalc: number) {
    const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
      const distance = Math.abs(distanceCalc)
      return { ...rect, distance }
    })
    const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
    return panelRectsToCheckWithDistanceSorted[0]
  }

  private drawLinesAndTextBetweenTwoLocations(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()

    // const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    const distance = Math.abs(y2 - y1)
    this.ctx.fillStyle = 'red'
    this.ctx.font = '15px Arial'
    this.ctx.fillText(`${distance}px`, x1, y1)
  }

  private drawLinesAndTextBetweenTwoLocationsV2(moveTo: { x: number, y: number }, lineTo: { x: number, y: number }) {
    this.ctx.beginPath()
    this.ctx.moveTo(moveTo.x, moveTo.y)
    this.ctx.lineTo(lineTo.x, lineTo.y)
    // this.ctx.lineTo(lineTo, y2)
    this.ctx.stroke()

    let distance = null
    if (moveTo.x === lineTo.x) {
      distance = Math.abs(lineTo.y - moveTo.y)
    }
    if (moveTo.y === lineTo.y) {
      distance = Math.abs(lineTo.x - moveTo.x)
    }
    if (!distance) {
      return
    }
    this.ctx.fillStyle = 'red'
    this.ctx.font = '15px Arial'
    const textX = moveTo.x < lineTo.x ? moveTo.x - 25 : lineTo.x + 25
    const textY = moveTo.y < lineTo.y ? lineTo.y - 25 : moveTo.y + 25
    this.ctx.fillText(`${distance}px`, textX, textY)

    /*    if (moveTo.x === lineTo.x) {
     const distance = Math.abs(lineTo.y - moveTo.y)
     this.ctx.fillStyle = 'red'
     this.ctx.font = '15px Arial'
     this.ctx.fillText(`${distance}px`, moveTo.x, moveTo.y)
     } else if (moveTo.y === lineTo.y) {
     const distance = Math.abs(lineTo.x - moveTo.x)
     this.ctx.fillStyle = 'red'
     this.ctx.font = '15px Arial'
     this.ctx.fillText(`${distance}px`, moveTo.x, moveTo.y)
     }*/

    // const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    /*    const distance = Math.abs(y2 - y1)
     this.ctx.fillStyle = 'red'
     this.ctx.font = '15px Arial'
     this.ctx.fillText(`${distance}px`, x1, y1)*/
  }

  /*  private getClosedPanelRect(directionValue: number, otherDirectionValue: number, xAxis: boolean, axisIncrease: boolean) {
   const rectDimensionForCalc = xAxis ? 'width' : 'height'
   const rectAxisForCalc = xAxis ? 'x' : 'y'
   const endRectAxisForCalc = xAxis ? 'y' : 'x'
   const axisCalc = (a: number, b: number) => axisIncrease ? a > b : a < b
   // const axisCalc = axisIncrease ?
   const panelRectsToCheck = this.cachedPanels.filter(rect => directionValue >= rect[rectAxisForCalc] - rect[rectDimensionForCalc] / 2 && directionValue <= rect[rectAxisForCalc] + rect[rectDimensionForCalc] / 2 && otherDirectionValue > rect[endRectAxisForCalc])
   // const panelRectsToCheck = this.cachedPanels.filter(rect => blockRectModel.y >= rect.y - rect.height / 2 && blockRectModel.y <= rect.y + rect.height / 2 && blockRectModel.x > rect.x)
   if (panelRectsToCheck.length) {
   const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
   const distance = Math.sqrt(Math.pow(rect.x - blockRectModel.x, 2) + Math.pow(rect.y - blockRectModel.y, 2))

   return { ...rect, distance }
   })
   const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
   const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
   return closestPanelRect
   }
   return null
   }*/

  private drawLineForLeftBlock(blockRectModel: BlockRectModel) {
    if (this.cachedPanels) {
      const panelRectsToCheck = this.cachedPanels.filter(rect => blockRectModel.y >= rect.y - rect.height / 2 && blockRectModel.y <= rect.y + rect.height / 2 && blockRectModel.x > rect.x)
      if (panelRectsToCheck.length) {
        const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
          const distance = Math.sqrt(Math.pow(rect.x - blockRectModel.x, 2) + Math.pow(rect.y - blockRectModel.y, 2))

          return { ...rect, distance }
        })
        const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
        const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
        if (closestPanelRect) {
          this.ctx.beginPath()
          this.ctx.moveTo(blockRectModel.x - blockRectModel.width / 2, blockRectModel.y)
          this.ctx.lineTo(closestPanelRect.x + closestPanelRect.width / 2, blockRectModel.y)
          this.ctx.stroke()

          const distanceToClosestPanel = closestPanelRect.x + closestPanelRect.width / 2 - (blockRectModel.x - blockRectModel.width / 2)
          this.ctx.fillStyle = 'red'
          this.ctx.font = '15px Arial'
          this.ctx.fillText(`${distanceToClosestPanel}px`, blockRectModel.x - blockRectModel.width / 2 - 50, blockRectModel.y - 50)
        }
      } else {
        this.ctx.beginPath()
        this.ctx.moveTo(blockRectModel.x - blockRectModel.width / 2, blockRectModel.y)
        this.ctx.lineTo(0, blockRectModel.y)
        this.ctx.stroke()

        const distanceToLeftOfPage = blockRectModel.x - blockRectModel.width / 2
        this.ctx.fillStyle = 'red'
        this.ctx.font = '15px Arial'
        this.ctx.fillText(`${distanceToLeftOfPage}px`, 50, blockRectModel.y - 50)
      }
    } else {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x - blockRectModel.width / 2, blockRectModel.y)
      this.ctx.lineTo(0, blockRectModel.y)
      this.ctx.stroke()

      const distanceToLeftOfPage = blockRectModel.x - blockRectModel.width / 2
      this.ctx.fillStyle = 'red'
      this.ctx.font = '15px Arial'
      this.ctx.fillText(`${distanceToLeftOfPage}px`, 50, blockRectModel.y - 50)
    }
  }

  private drawLineForLeftBlockV2(blockRectModel: BlockRectModel) {
    const printDefault = () => {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x - blockRectModel.width / 2, blockRectModel.y)
      this.ctx.lineTo(0, blockRectModel.y)
      this.ctx.stroke()

      const distanceToLeftOfPage = blockRectModel.x - blockRectModel.width / 2
      const absoluteDistance = Math.abs(distanceToLeftOfPage)
      this.ctx.fillStyle = 'red'
      this.ctx.font = '15px Arial'
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
      // const distance = Math.sqrt(Math.pow(rect.x - blockRectModel.x, 2) + Math.pow(rect.y - blockRectModel.y, 2))
      const distance = Math.abs(rect.x - blockRectModel.x)

      return { ...rect, distance }
    })
    const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
    const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
    if (closestPanelRect) {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x - blockRectModel.width / 2, blockRectModel.y)
      this.ctx.lineTo(closestPanelRect.x + closestPanelRect.width / 2, blockRectModel.y)
      this.ctx.stroke()

      const distanceToClosestPanel = closestPanelRect.x + closestPanelRect.width / 2 - (blockRectModel.x - blockRectModel.width / 2)
      const absoluteDistance = Math.abs(distanceToClosestPanel)
      this.ctx.fillStyle = 'red'
      this.ctx.font = '15px Arial'
      this.ctx.fillText(`${absoluteDistance}px`, blockRectModel.x - blockRectModel.width / 2 - 50, blockRectModel.y - 50)
    }

  }

  private drawLineForRightBlock(blockRectModel: BlockRectModel) {
    if (this.cachedPanels) {
      const panelRectsToCheck = this.cachedPanels.filter(rect => blockRectModel.y >= rect.y - rect.height / 2 && blockRectModel.y <= rect.y + rect.height / 2 && blockRectModel.x < rect.x)
      if (panelRectsToCheck.length) {
        const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
          const distance = Math.sqrt(Math.pow(rect.x - blockRectModel.x, 2) + Math.pow(rect.y - blockRectModel.y, 2))

          return { ...rect, distance }
        })
        const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
        const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
        if (closestPanelRect) {
          this.ctx.beginPath()
          this.ctx.moveTo(blockRectModel.x + blockRectModel.width / 2, blockRectModel.y)
          this.ctx.lineTo(closestPanelRect.x - closestPanelRect.width / 2, blockRectModel.y)
          this.ctx.stroke()

          const distanceToClosestPanel = closestPanelRect.x - closestPanelRect.width / 2 - (blockRectModel.x + blockRectModel.width / 2)
          this.ctx.fillStyle = 'red'
          this.ctx.font = '15px Arial'
          this.ctx.fillText(`${distanceToClosestPanel}px`, blockRectModel.x + blockRectModel.width / 2 + 50, blockRectModel.y - 50)
        }
      } else {
        this.ctx.beginPath()
        this.ctx.moveTo(blockRectModel.x + blockRectModel.width / 2, blockRectModel.y)
        this.ctx.lineTo(this.canvas.width, blockRectModel.y)
        this.ctx.stroke()

        const distanceToRightOfPage = this.canvas.width - (blockRectModel.x + blockRectModel.width / 2)
        this.ctx.fillStyle = 'red'
        this.ctx.font = '15px Arial'
        this.ctx.fillText(`${distanceToRightOfPage}px`, this.canvas.width - 50, blockRectModel.y - 50)
      }
    } else {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x + blockRectModel.width / 2, blockRectModel.y)
      this.ctx.lineTo(this.canvas.width, blockRectModel.y)
      this.ctx.stroke()

    }
  }

  private drawLineForRightBlockV2(blockRectModel: BlockRectModel) {
    const printDefault = () => {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x + blockRectModel.width / 2, blockRectModel.y)
      this.ctx.lineTo(this.canvas.width, blockRectModel.y)
      this.ctx.stroke()

      const distanceToRightOfPage = this.canvas.width - (blockRectModel.x + blockRectModel.width / 2)
      const absoluteDistance = Math.abs(distanceToRightOfPage)
      this.ctx.fillStyle = 'red'
      this.ctx.font = '15px Arial'
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
      const distance = Math.sqrt(Math.pow(rect.x - blockRectModel.x, 2) + Math.pow(rect.y - blockRectModel.y, 2))

      return { ...rect, distance }
    })
    const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
    const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
    if (closestPanelRect) {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x + blockRectModel.width / 2, blockRectModel.y)
      this.ctx.lineTo(closestPanelRect.x - closestPanelRect.width / 2, blockRectModel.y)
      this.ctx.stroke()

      const distanceToClosestPanel = closestPanelRect.x - closestPanelRect.width / 2 - (blockRectModel.x + blockRectModel.width / 2)
      const absoluteDistance = Math.abs(distanceToClosestPanel)
      // this.ctx.fillStyle = 'red'
      // this.ctx.font = '15px Arial'
      this.ctx.fillText(`${absoluteDistance}px`, blockRectModel.x + blockRectModel.width / 2 + 50, blockRectModel.y - 50)
    }
  }

  private drawLinesForBlockV2(blockRectModel: BlockRectModel) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = 'red'

    const belowPanelRect = this.cachedPanels?.find(rect => blockRectModel.x >= rect.x - rect.width / 2 && blockRectModel.x <= rect.x + rect.width / 2 && blockRectModel.y < rect.y)
    if (belowPanelRect) {
      this.drawLineToPanel(belowPanelRect, blockRectModel)
    } else {
      this.drawLineToY(this.canvas.height, blockRectModel)
      const distanceToBottomOfPage = this.canvas.height - (blockRectModel.y + blockRectModel.height / 2)
      this.ctx.fillStyle = 'red'
      this.ctx.font = '15px Arial'
      this.ctx.fillText(`${distanceToBottomOfPage}px`, blockRectModel.x - 50, this.canvas.height - 50)
    }

    const abovePanelRect = this.cachedPanels?.find(rect => blockRectModel.x >= rect.x - rect.width / 2 && blockRectModel.x <= rect.x + rect.width / 2 && blockRectModel.y > rect.y)
    if (abovePanelRect) {
      this.drawLineToPanel(abovePanelRect, blockRectModel)
    } else {
      this.drawLineToY(0, blockRectModel)
      const distanceToTopOfPage = blockRectModel.y - blockRectModel.height / 2
      this.ctx.fillStyle = 'red'
      this.ctx.font = '15px Arial'
      this.ctx.fillText(`${distanceToTopOfPage}px`, blockRectModel.x - 50, 50)
    }

  }

  drawLineToY(y: number, blockRectModel: BlockRectModel) {
    this.ctx.beginPath()
    this.ctx.moveTo(blockRectModel.x, blockRectModel.y)
    this.ctx.lineTo(blockRectModel.x, y)
    this.ctx.stroke()
  }

  drawLineToPanel(panelRect: BlockRectModel, blockRectModel: BlockRectModel) {
    const y = panelRect.y - panelRect.height / 2
    this.drawLineToY(y, blockRectModel)

    const distanceToPanel = y - (blockRectModel.y + blockRectModel.height / 2)
    this.ctx.fillStyle = 'red'
    this.ctx.font = '15px Arial'
    this.ctx.fillText(`${distanceToPanel}px`, blockRectModel.x - 50, y - 50)
  }

  animateLineFromAboutPanelToTopOfPageV2(blockRectModel: BlockRectModel) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const panelRects = this.cachedPanels?.filter(panel => panel.x !== blockRectModel.x) || []

    const panelRectsToCheck = panelRects.filter(rect =>
      blockRectModel.x >= rect.x - rect.width / 2 && blockRectModel.x <= rect.x + rect.width / 2,
    )

    const distanceToTopOfPage = blockRectModel.y - blockRectModel.height / 2
    const distanceToBottomOfPage = this.canvas.height - (blockRectModel.y + blockRectModel.height / 2)
    const distanceToLeftOfPage = blockRectModel.x - blockRectModel.width / 2
    const distanceToRightOfPage = this.canvas.width - (blockRectModel.x + blockRectModel.width / 2)

    /*    this.drawVerticalLine(blockRectModel.x, blockRectModel.y - blockRectModel.height / 2, 0)
     this.drawLabel(`${distanceToTopOfPage}px`, blockRectModel.x - 50, 50)*/

    this.handlePanelRectsToCheck(blockRectModel, panelRectsToCheck)
    /* if (panelRectsToCheck.length) {
     /!*   const closestPanelRect = panelRectsToCheck.reduce((closestRect, rect) => {
     const distance = Math.abs(rect.y - blockRectModel.y)
     return (distance < closestRect.distance) ? { ...rect, distance } : closestRect
     }, { distance: Infinity, width: 0, height: 0 })*!/
     const closestPanelRect = panelRectsToCheck.reduce((closestRect, rect) => {
     const distance = Math.abs(rect.y - blockRectModel.y)
     return (distance < closestRect.distance) ? { ...rect, distance } : closestRect
     }, { distance: Infinity })

     this.drawVerticalLine(blockRectModel.x, blockRectModel.y + blockRectModel.height / 2, closestPanelRect.y - closestPanelRect.height / 2)
     this.drawLabel(`${closestPanelRect.y - closestPanelRect.height / 2 - (blockRectModel.y + blockRectModel.height / 2)}px`, blockRectModel.x - 50, blockRectModel.y + blockRectModel.height / 2 + 50)
     } else {
     this.drawVerticalLine(blockRectModel.x, blockRectModel.y + blockRectModel.height / 2, this.canvas.height)
     this.drawLabel(`${distanceToBottomOfPage}px`, blockRectModel.x - 50, this.canvas.height - 50)
     }*/

    this.drawHorizontalLine(blockRectModel.x - blockRectModel.width / 2, blockRectModel.y, 0)
    this.drawLabel(`${distanceToLeftOfPage}px`, 25, blockRectModel.y + 50)

    this.drawHorizontalLine(blockRectModel.x + blockRectModel.width / 2, blockRectModel.y, this.canvas.width)
    this.drawLabel(`${distanceToRightOfPage}px`, this.canvas.width - 75, blockRectModel.y + 50)
  }

  drawVerticalLine(x: number, startY: number, endY: number) {
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = 'red'
    this.ctx.beginPath()
    this.ctx.moveTo(x, startY)
    this.ctx.lineTo(x, endY)
    this.ctx.stroke()
  }

  drawHorizontalLine(startX: number, y: number, endX: number) {
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = 'red'
    this.ctx.beginPath()
    this.ctx.moveTo(startX, y)
    this.ctx.lineTo(endX, y)
    this.ctx.stroke()
  }

  drawLabel(label: string, x: number, y: number) {
    this.ctx.fillStyle = 'red'
    this.ctx.font = '15px Arial'
    this.ctx.fillText(label, x, y)
  }

  handlePanelRectsToCheck(blockRectModel: BlockRectModel, panelRectsToCheck: BlockRectModel[]) {
    if (panelRectsToCheck.length) {
      const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
        const distance = Math.abs(rect.y - blockRectModel.y)
        return { ...rect, distance }
      })
      const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
      const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
      if (closestPanelRect) {
        this.ctx.beginPath()
        this.ctx.moveTo(blockRectModel.x, blockRectModel.y + blockRectModel.height / 2)
        this.ctx.lineTo(blockRectModel.x, closestPanelRect.y - closestPanelRect.height / 2)
        this.ctx.stroke()

        // distance to closest panel
        const distanceToClosestPanel = closestPanelRect.y - closestPanelRect.height / 2 - (blockRectModel.y + blockRectModel.height / 2)
        this.ctx.fillStyle = 'red'
        this.ctx.font = '15px Arial'
        this.ctx.fillText(`${distanceToClosestPanel}px`, blockRectModel.x - 50, blockRectModel.y + blockRectModel.height / 2 + 50)
      }
    } else {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x, blockRectModel.y + blockRectModel.height / 2)
      this.ctx.lineTo(blockRectModel.x, this.canvas.height)
      this.ctx.stroke()

      const distanceToBottomOfPage = this.canvas.height - (blockRectModel.y + blockRectModel.height / 2)
      this.ctx.fillStyle = 'red'
      this.ctx.font = '15px Arial'
      this.ctx.fillText(`${distanceToBottomOfPage}px`, blockRectModel.x - 50, this.canvas.height - 50)
    }
  }

  private getBlockRect(panelId: string): BlockRectModel | undefined {

    // const panelDiv = document.getElementById(panelId)

    // const panelDiv = this.elementRef.nativeElement.getElementById(panelId)
    /*    const panelDiv3 = this.freePanelComponents.find(x => x.freePanel.id === panelId)
     console.log('panelDiv3', panelDiv3)
     if (!panelDiv3) return undefined

     const ref = (panelDiv3 as any).freePanelRef
     console.log('ref', ref)

     const panelDiv6 = ref.nativeElement
     console.log('panelDiv6', panelDiv6)

     const secondChild = panelDiv6.firstChild.firstChild
     console.log('secondChild', secondChild)

     const boundingRect = secondChild.getBoundingClientRect()

     console.log('boundingRect', boundingRect)*/

    /*    const firstChild = panelDiv6.firstChild
     console.log('firstChild', firstChild)

     const boundingRect = firstChild.getBoundingClientRect()
     console.log('boundingRect', boundingRect)*/

    /*    const fuckPanelDiv6 = panelDiv6.getElementById(`[id=${panelId}]`)
     console.log('fuckPanelDiv6', fuckPanelDiv6)*/

    /*   const rect = panelDiv6.getBoundingClientRect()
     console.log('rect', rect)*/

    const panels = document.querySelectorAll('[panelId]')

    if (!panels) {
      return undefined
    }
    // const cachedPanels = this.blockRectCache.get(panelId)
    /*    const cachedPanels = panels.forEach(p => {

     })*/
    this.cachedPanels = Array.from(panels).map(panel => this.getBlockRectFromElement(panel))
    // console.log('cachedPanels', this.cachedPanels)
    // console.log('panels', panels)
    const panelDiv = Array.from(panels).find(p => p.getAttribute('panelId') === panelId)
    // const panel = Array.from(panels).find(p => p.getAttribute('panelId') === '505f066d-b5c1-45af-8cf1-200ad8f85ebe')
    // console.log('panel', panelDiv)
    // const panelDiv = this.elementRef.nativeElement.querySelector(`[panelId=${panelId}]`)
    // const panelDiv4 = this.freePanelComponents.find(x => x.freePanel.id === panelId)
    // console.log('panel', panel)
    // const panelDiv = document.querySelector(`[id=${panelId}]`)
    // const panelDiv = document.querySelector(`[panelId=${panelId}]`)
    // const panelDiv = document.querySelector(`[blockLocation=${panel.location}]`)
    if (!panelDiv) {
      // this.logError('Canvas-directive', '!panelDiv')
      return undefined
    }

    // panelDiv.

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

  private getDivDimensions(rect: DOMRect): BlockRectModel {
    const canvasRect = this.canvas.getBoundingClientRect()
    const x = rect.left - canvasRect.left + rect.width / 2
    const y = rect.top - canvasRect.top + rect.height / 2

    return { x, y, height: rect.height, width: rect.width }
  }

  private drawTwoPoints() {
    // const res = this.getValuesFromTwoBlocks({ first, second })

    // if (!res) return

    this.ctx.lineWidth = 5
    this.ctx.beginPath()
    // this.ctx.moveTo(res.firstResultX, res.firstResultY)
    // this.ctx.lineTo(res.secondResultX, res.secondResultY)
    // this.ctx.strokeStyle = color
    this.ctx.strokeStyle = 'red'
    this.ctx.stroke()
  }

  private setupTooltip() {
    tippy(this.elementRef.nativeElement, {
      // content: 'Bazinga!',
    })
  }

  /*  private animateLineFromAboutPanelToTopOfPageWithCachedPanels(blockRectModel: BlockRectModel) {
   const distanceToTopOfPage = blockRectModel.y - blockRectModel.height / 2
   const distanceToBottomOfPage = this.canvas.height - (blockRectModel.y + blockRectModel.height / 2)
   const distanceToLeftOfPage = blockRectModel.x - blockRectModel.width / 2
   const distanceToRightOfPage = this.canvas.width - (blockRectModel.x + blockRectModel.width / 2)

   const minDistance = Math.min(distanceToTopOfPage, distanceToBottomOfPage, distanceToLeftOfPage, distanceToRightOfPage)

   if (minDistance === distanceToTopOfPage) {
   this.animateLineFromAboutPanelToTopOfPage(blockRectModel)
   } else if (minDistance === distanceToBottomOfPage) {
   this.animateLineFromAboutPanelToBottomOfPage(blockRectModel)
   } else if (minDistance === distanceToLeftOfPage) {
   this.animateLineFromAboutPanelToLeftOfPage(blockRectModel)
   } else if (minDistance === distanceToRightOfPage) {
   this.animateLineFromAboutPanelToRightOfPage(blockRectModel)
   }

   }*/
  /*  private animateLineFromAboutPanelToTopOfPageWithCachedPanels(blockRectModel: BlockRectModel, panelRectsToCheck: BlockRectModel[]) {
   const distanceToTopOfPage = blockRectModel.y - blockRectModel.height / 2
   const distanceToBottomOfPage = this.canvas.height - (blockRectModel.y + blockRectModel.height / 2)
   const distanceToLeftOfPage = blockRectModel.x - blockRectModel.width / 2
   const distanceToRightOfPage = this.canvas.width - (blockRectModel.x + blockRectModel.width / 2)

   const minDistance = Math.min(distanceToTopOfPage, distanceToBottomOfPage, distanceToLeftOfPage, distanceToRightOfPage)

   if (minDistance === distanceToTopOfPage) {
   this.animateLineFromAboutPanelToTopOfPage(blockRectModel)
   } else if (minDistance === distanceToBottomOfPage) {
   this.animateLineFromAboutPanelToBottomOfPage(blockRectModel)
   } else if (minDistance === distanceToLeftOfPage) {
   this.animateLineFromAboutPanelToLeftOfPage(blockRectModel)
   } else if (minDistance === distanceToRightOfPage) {
   this.animateLineFromAboutPanelToRightOfPage(blockRectModel)
   }

   }*/
}
