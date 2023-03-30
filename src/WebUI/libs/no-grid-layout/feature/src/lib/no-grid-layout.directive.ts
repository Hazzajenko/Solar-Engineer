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
import { FreeBlockRectModel } from './free-block-rect.model'
import { LineDirectionEnum } from './line-direction.enum'
import { FreePanelDirective } from './components/free-panel-component/free-panel.directive'

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
  // private ngZone = inject(NgZone)
  // private lineDrawerService = new LineDrawerService(can)
  private lineDrawerService!: LineDrawerService
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
      border: 'black',
      borderColorAndWidth: 'border border-black',
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
          this.animateLinesFromBlockMoving()
        })
      }
    }
    return
  }

  animateLinesFromBlockMoving() {
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
    this.drawLinesAllDirectionsForBlock(panelDimensions)
    this.animationId = requestAnimationFrame(() => this.animateLinesFromBlockMoving())

  }

  drawLinesAllDirectionsForBlock(blockRectModel: BlockRectModel) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = 'red'
    this.ctx.fillStyle = 'red'
    this.ctx.font = '15px Arial'

    this.drawLineForAboveBlock(blockRectModel)
    this.drawLineForBelowBlock(blockRectModel)
    this.drawLineForLeftBlock(blockRectModel)
    this.drawLineForRightBlock(blockRectModel)
  }

  private drawLineForBelowBlock(blockRectModel: BlockRectModel) {
    const printDefault = () => {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x, blockRectModel.y + blockRectModel.height / 2)
      this.ctx.lineTo(blockRectModel.x, this.canvas.height)
      this.ctx.stroke()

      const distanceToBottomOfPage = this.canvas.height - (blockRectModel.y + blockRectModel.height / 2)
      const absoluteDistance = Math.abs(distanceToBottomOfPage)
      this.ctx.fillText(`${absoluteDistance}px`, blockRectModel.x - 50, this.canvas.height - 50)
      this.removePanelClassForLightUpPanels(LineDirectionEnum.Bottom)
      return
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
    this.lightUpClosestPanel(closestPanelRect, LineDirectionEnum.Bottom)
    // return
  }

  private drawLineForAboveBlock(blockRectModel: BlockRectModel) {
    const printDefault = () => {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x, blockRectModel.y - blockRectModel.height / 2)
      this.ctx.lineTo(blockRectModel.x, 0)
      this.ctx.stroke()

      const distanceToTopOfPage = blockRectModel.y - blockRectModel.height / 2
      const absoluteDistance = Math.abs(distanceToTopOfPage)
      this.ctx.fillText(`${absoluteDistance}px`, blockRectModel.x - 50, 50)
      this.removePanelClassForLightUpPanels(LineDirectionEnum.Top)
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

    this.lightUpClosestPanel(closestPanelRect, LineDirectionEnum.Top)
  }

  private drawLineForLeftBlock(blockRectModel: BlockRectModel) {
    const printDefault = () => {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x - blockRectModel.width / 2, blockRectModel.y)
      this.ctx.lineTo(0, blockRectModel.y)
      this.ctx.stroke()

      const distanceToLeftOfPage = blockRectModel.x - blockRectModel.width / 2
      const absoluteDistance = Math.abs(distanceToLeftOfPage)
      this.ctx.fillText(`${absoluteDistance}px`, 50, blockRectModel.y - 50)
      this.removePanelClassForLightUpPanels(LineDirectionEnum.Left)
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

    this.lightUpClosestPanel(closestPanelRect, LineDirectionEnum.Left)

  }

  private drawLineForRightBlock(blockRectModel: BlockRectModel) {
    // this.lightUpPanels map to array
    // this.lightUpPanels.map(rect => rect.x)
    // this.lightUpPanels to array from Record
    // Object.values(this.lightUpPanels)
    // this.lightUpPanels = []

    const printDefault = () => {
      this.ctx.beginPath()
      this.ctx.moveTo(blockRectModel.x + blockRectModel.width / 2, blockRectModel.y)
      this.ctx.lineTo(this.canvas.width, blockRectModel.y)
      this.ctx.stroke()

      const distanceToRightOfPage = this.canvas.width - (blockRectModel.x + blockRectModel.width / 2)
      const absoluteDistance = Math.abs(distanceToRightOfPage)
      this.ctx.fillText(`${absoluteDistance}px`, this.canvas.width - 50, blockRectModel.y - 50)
      this.removePanelClassForLightUpPanels(LineDirectionEnum.Right)
      return
    }
    if (!this.cachedPanels) return printDefault()
    const panelRectsToCheck = this.cachedPanels.filter(rect => blockRectModel.y >= rect.y - rect.height / 2 && blockRectModel.y <= rect.y + rect.height / 2 && blockRectModel.x < rect.x)
    if (!panelRectsToCheck.length) return printDefault()

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

    this.lightUpClosestPanel(closestPanelRect, LineDirectionEnum.Right)

  }

  private lightUpClosestPanel(blockRectModel: FreeBlockRectModel, direction: LineDirectionEnum) {
    const panels = document.querySelectorAll('[panelId]')
    if (!panels) {
      return
    }
    const panelDiv = Array.from(panels).find(p => p.getAttribute('panelId') === blockRectModel.id)
    if (!panelDiv) {
      return
    }
    // panelDiv.classList.add('panel-light-up')
    const handleArray = (arr: string[], id: string) => {
      if (arr.includes(id)) {
        return
      }
      arr.push(id)
      /*      const index = arr.indexOf(id)
       if (index > -1) {
       arr.splice(index, 1)
       }*/
    }
    const handleCanvas = (arr: string[], blockRectModel: FreeBlockRectModel) => {
      if (!arr.includes(blockRectModel.id)) {
        arr.push(blockRectModel.id)
      }

      // this.ctx.globalAlpha = 0.6

      // this.ctx.fillStyle = this.fillStyle
      /*      const startX = blockRectModel.x - blockRectModel.width / 2
       const startY = blockRectModel.y - blockRectModel.height / 2*/
      const width = blockRectModel.width + 2
      const height = blockRectModel.height + 2
      const startX = blockRectModel.x - (width) / 2
      const startY = blockRectModel.y - (height) / 2
      // this.ctx.fillStyle = '#7585d8'
      /*   this.ctx.strokeStyle = '#cf46ff'
       this.ctx.lineWidth = 2
       this.ctx.strokeRect(startX, startY, width, height)
       this.ctx.strokeStyle = 'red'*/

      const panel = this.noGridLayoutService.getPanelById2(blockRectModel.id)
      if (!panel) {
        return
      }
      if (panel.borderColorAndWidth === 'border border-blue-500 border-2') return

      panel.borderColorAndWidth = 'border border-blue-500 border-2'
      // panel.borderColorAndWidth = 'border border-indigo-500 border-2'
      /*      if (panel.border === 'indigo') {
       return
       }*/
      // panel.border = 'white'
      // panel.border = 'indigo'
      // panel.border = '2px solid #cf46ff'
      this.noGridLayoutService.updateFreePanel(panel)
      // this.ctx.globalAlpha = 1
      // this.ctx.fillRect(startX, startY, blockRectModel.width, blockRectModel.height)
    }
    switch (direction) {
      case LineDirectionEnum.Top:
        // console.log('top', panelDiv)
        // handleArray(this.panelsInLineToTop, blockRectModel.id)
        handleCanvas(this.panelsInLineToTop, blockRectModel)
        /*        if (this.panelsInLineToTop.includes(blockRectModel.id)) {
         return
         }
         this.panelsInLineToTop.push(blockRectModel.id)*/
        break
      case LineDirectionEnum.Bottom:
        handleArray(this.panelsInLineToBottom, blockRectModel.id)
        /*        if (this.panelsInLineToBottom.includes(blockRectModel.id)) {
         return
         }
         this.panelsInLineToBottom.push(blockRectModel.id)*/
        break
      case LineDirectionEnum.Left:
        handleArray(this.panelsInLineToLeft, blockRectModel.id)
        /*        if (this.panelsInLineToLeft.includes(blockRectModel.id)) {
         return
         }
         this.panelsInLineToLeft.push(blockRectModel.id)*/
        break
      case LineDirectionEnum.Right:
        handleArray(this.panelsInLineToRight, blockRectModel.id)
        /*        if (this.panelsInLineToRight.includes(blockRectModel.id)) {
         return
         }
         this.panelsInLineToRight.push(blockRectModel.id)*/
        break
      default:
        break
    }
    // this.noGridLayoutService.setClassForPanel(blockRectModel.id, 'bg-blue-200')
    // panelDiv.
    // /*    panelDiv.classList.add('bg-blue-200')
    // check if it already had a class
    /*    const doesItHaveBgBlue = panelDiv.classList.contains('bg-blue-200') /!*&& panelDiv.classList.remove('border-4')*!/
     if (doesItHaveBgBlue) {
     console.log('already has bg-blue-200', panelDiv)
     return
     }
     // panelDiv.classList.add('bg-blue-200')
     // panelDiv.style.backgroundColor = 'blue'
     const doesItHaveBgBlue2 = panelDiv.classList.contains('bg-blue-200')
     console.log('doesItHaveBgBlue2', doesItHaveBgBlue2)*/

    /*    const comp = this.freePanelComponents.find(p => p.freePanel.id === blockRectModel.id)
     if (!comp) {
     return
     }
     comp.classes = 'bg-blue-200'*/

    /*    const directives = this.freePanelDirectives.find(p => p.panelId === blockRectModel.id)
     if (!directives) {
     return
     }
     directives.elRef.nativeElement.classList.add('bg-blue-200')*/
    // directives.setStyle()

    /*
     panelDiv.classList.add('border-4')
     panelDiv.classList.add('border-sky-500')
     panelDiv.classList.add('border-dashed')
     panelDiv.classList.add('border-opacity-50')*/
    // panelDiv.classList.add('border-2')*/
    /*    if (direction === LineDirectionEnum.Top) {
     // panelDiv.classList.add('border-t-0')
     // console.log('top', panelDiv)
     }*/

    /* if (this.panelsInLineToRight.includes(blockRectModel.id)) {
     return
     }

     this.panelsInLineToRight.push(blockRectModel.id)*/
    // this.lightUpPanels[blockRectModel.id] = direction

    // this.lightUpPanels.add(blockRectModel.id)
    // panelDiv.classList.add('bg-blue-200')

  }

  private getElementById(id: string): Element | undefined {
    const panels = document.querySelectorAll('[panelId]')
    if (!panels) {
      return undefined
    }
    return Array.from(panels).find(p => p.getAttribute('panelId') === id)
  }

  private removePanelClassForLightUpPanels(directionEnum: LineDirectionEnum) {
    /*    const panels = document.querySelectorAll('[panelId]')
     if (!panels) {
     return
     }*/
    const handleArray = (arr: string[]) => {
      arr.forEach(id => {
        const panel = this.getElementById(id)
        if (panel) {
          // panel.closest('.panel')?.classList.remove('border-4')
          // panel.innerHTML = '<button (click)="console.log(1)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Button</button>'
          // panel.innerHTML = '<script>console.log("hello")</script>'
          // panel.innerHTML = '<div class="panel">HELLO</div>'
          /*          panel.innerHTML = `
           <a href="javascript:alert(\\'Crash Landing on You stinks!\\')">Click to win a free prize!</a>
           <img ngSrc='1' onerror="alert('Doh!')" alt=''/>*/
          // `
          // panel.innerHTML = '<iframe src="javascript:alert(\'Boo!\')" />'
          /*          const doesPanelHaveClass = panel.classList.contains('bg-blue-200')
           if (doesPanelHaveClass) {
           panel.classList.remove('bg-blue-200')

           }*/

          /*  const comp = this.freePanelComponents.find(p => p.freePanel.id === panel.id)
           if (!comp) {
           return
           }
           comp.classes = ''*/

          const directive = this.freePanelDirectives.find(p => p.panelId === panel.id)
          if (!directive) {
            return
          }
          directive.elRef.nativeElement.classList.remove('bg-blue-200')
          // directive.setStyle()
          // directive.ngOnInit() = ''
          // panel.classList.remove('border-4')
          // panel.classList.remove('border-sky-500')

        }
        // this.noGridLayoutService.setClassForPanel(id, '')
        // this.noGridLayoutService.clearClassesForPanel()
      })
      arr = []
    }
    const handleCanvas = (arr: string[]) => {
      arr.forEach(id => {
          const panel = this.noGridLayoutService.getPanelById2(id)
          if (!panel) return
          // if (panel.border === 'black') return
          // panel.border = 'black'
          // if (panel.borderColorAndWidth === 'border border-indigo-500 border-2') return
          // panel.borderColorAndWidth = 'border border-indigo-500 border-2'
          if (panel.borderColorAndWidth === 'border border-black') return
          panel.borderColorAndWidth = 'border border-black'
          this.noGridLayoutService.updateFreePanel(panel)
        },
      )
    }
    switch (directionEnum) {
      case LineDirectionEnum.Top:
        handleCanvas(this.panelsInLineToTop)
        // handleArray(this.panelsInLineToTop)
        /*        this.panelsInLineToTop.forEach(id => {
         const panel = this.getElementById(id)
         if (panel) {
         panel.classList.remove('bg-blue-200')
         }
         }
         )
         this.panelsInLineToTop = []*/
        break
      case LineDirectionEnum.Bottom:
        handleArray(this.panelsInLineToBottom)
        break
      case LineDirectionEnum.Left:
        handleArray(this.panelsInLineToLeft)
        break
      case LineDirectionEnum.Right:
        handleArray(this.panelsInLineToRight)
        break
      default:
        break
    }
    /*    Array.from(panels).forEach(panel => panel.classList.remove('bg-blue-200'))
     this.panelsInLineToRight = []*/
  }

  private getBlockRect(panelId: string): FreeBlockRectModel | undefined {
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
    return { id: panelId, x, y, height: panelRect.height, width: panelRect.width }
  }

  private getBlockRectFromElement(element: Element): FreeBlockRectModel {
    const panelId = element.getAttribute('panelId')
    if (!panelId) {
      throw new Error('panelId not found')
    }
    const panelRect = element.getBoundingClientRect()
    const canvasRect = this.canvas.getBoundingClientRect()
    const x = panelRect.left - canvasRect.left + panelRect.width / 2
    const y = panelRect.top - canvasRect.top + panelRect.height / 2

    return { id: panelId, x, y, height: panelRect.height, width: panelRect.width }
  }
}
