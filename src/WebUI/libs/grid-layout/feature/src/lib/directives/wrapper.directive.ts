import {
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core'

import {
  BlockRectModel,
  ClickService,
  DoubleClickService,
  ElementOffsets,
  MouseService,
  MultiStoreService,
  PanelsStoreService,
} from '@grid-layout/data-access'
import { BaseService } from '@shared/logger'
import {
  GridMode,
  SelectedPanelLinkPathModel,
  SelectedPathModel,
  VibrantColor,
} from '@shared/data-access/models'
import {
  downAndLeft,
  downAndRight,
  handleXAxisSame,
  handleYAxisSame,
  upAndLeft,
  upAndRight,
} from './utils/handle-axis'

@Directive({
  selector: '[appWrapper]',
  standalone: true,
})
export class WrapperDirective extends BaseService implements OnInit {
  private multiStore = inject(MultiStoreService)

  private elementRef = inject(ElementRef<HTMLDivElement>)
  private renderer = inject(Renderer2)
  private mouseService = inject(MouseService)
  private clickService = inject(ClickService)
  private doubleClickService = inject(DoubleClickService)
  private panelsStore = inject(PanelsStoreService)
  currentGridMode = GridMode.UNDEFINED
  canvas!: HTMLCanvasElement
  ctx!: CanvasRenderingContext2D

  scale = 1
  pageX?: number
  pageY?: number
  startX?: number
  startY?: number
  offsetX?: number
  offsetY?: number
  isDragging = false
  altKeyDragging = false

  height!: number
  negativeHeight!: number

  width!: number
  negativeWidth!: number
  middleClickDown = false
  fillStyle = '#7585d8'
  pathMapAnimationId?: number
  pathMapAnimating = false
  selectedPaths?: SelectedPanelLinkPathModel
  fpsInterval = 1000 / 60
  startTime = Date.now()

  lines: { x: number; y: number }[] = []
  parentHeight?: number
  parentWidth?: number
  private directiveInitialized = false

  constructor(private ngZone: NgZone) {
    super()
  }

  // @Output() clientXY: EventEmitter<ClientXY> = new EventEmitter<ClientXY>()
  // @Output() pageXY: EventEmitter<XYModel> = new EventEmitter<XYModel>()
  @Output() resetKeyUp: EventEmitter<string> = new EventEmitter<string>()

  /*  @Input() set setScale(scale: number | null) {
      if (!scale) return
      /!*if (scale < this.scale) {
        this.elementRef.nativeElement.style.top = '0px'
        this.elementRef.nativeElement.style.left = '0px'
      }
      this.scale = scale*!/
    }*/

  @Input() set keyUp(keyUp: string | null) {
    if (!keyUp) return
    switch (keyUp) {
      case 'r': {
        this.logDebug('R')
        this.elementRef.nativeElement.style.top = '0px'
        this.elementRef.nativeElement.style.left = '0px'
        break
      }
      case 'Control': {
        this.logDebug('CONTROL')
        // console.log('CONTROL')
        this.isDragging = false
        this.multiStore.dispatch.clearMultiState()
        this.elementRef.nativeElement.style.cursor = ''
        break
      }
      case 'Alt': {
        this.logDebug('ALT')
        // console.log('ALT')
        this.altKeyDragging = false
        this.multiStore.dispatch.clearMultiState()
        this.elementRef.nativeElement.style.cursor = ''
      }
    }
    this.resetKeyUp.emit('')
  }

  @Input() set gridMode(gridMode: GridMode) {
    if (!gridMode) return

    this.currentGridMode = gridMode
    switch (gridMode) {
      case GridMode.CREATE: {
        this.fillStyle = VibrantColor.VibrantGreen
        // this.fillStyle = 'red'
        break
      }
      case GridMode.SELECT: {
        this.fillStyle = VibrantColor.VibrantPurple
        // this.fillStyle = 'purple'
        break
      }
      default:
        this.fillStyle = VibrantColor.VibrantYellow
        // this.fillStyle = '#7585d8'
        break
    }
  }

  @Input() set canvasOffsets(offsets: ElementOffsets) {
    if (!offsets.offsetHeight || !offsets.offsetWidth) return
    this.canvas.width = offsets.offsetWidth
    this.canvas.height = offsets.offsetHeight
    this.offsetX = offsets.offsetLeft
    this.offsetY = offsets.offsetTop
  }

  @Input() set setStringPaths(selectedPaths: SelectedPanelLinkPathModel | undefined | null) {
    if (!this.directiveInitialized) return
    if (!selectedPaths || selectedPaths.panelPaths.length < 1) {
      // console.log('undefined')
      if (this.pathMapAnimationId) {
        cancelAnimationFrame(this.pathMapAnimationId)
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.pathMapAnimating = false
      return
    }

    // console.log(selectedPaths)
    this.selectedPaths = selectedPaths
    this.pathMapAnimating = true

    this.animateSelectedPathMap().then((r) => console.log(r))
  }

  async animateSelectedPathMap() {
    this.pathMapAnimationId = requestAnimationFrame(() => this.animateSelectedPathMap())
    const now = Date.now()
    const elapsed = now - this.startTime
    if (elapsed > this.fpsInterval) {
      this.startTime = now - (elapsed % this.fpsInterval)
      if (this.selectedPaths && this.pathMapAnimating) {
        const pathMap = await this.createLineMap(this.selectedPaths)
        await this.drawSelectedPathMap(pathMap)
      }
    }
  }

  private async drawSelectedPathMap(pathMap: Map<number, BlockRectModel> | undefined) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    if (!this.selectedPaths) {
      this.logError('!this.selectedPaths')
      // console.error('!this.selectedPaths')
      return
    }

    if (!pathMap) {
      this.logError('!pathMap')
      // console.error('!pathMap')
      return
    }

    let job = true

    let pathCounter = 0

    const doesHavePositive = pathMap.get(pathCounter + 1)
    if (doesHavePositive) {
      while (job) {
        const start = pathMap.get(pathCounter)
        if (!start) {
          // console.error('!start')
          return
        }
        const next = pathMap.get(pathCounter + 1)
        if (!next) {
          job = false
          break
        }
        if (start.x === next.x && start.y === next.y) {
          // console.error('shit')
        }

        this.drawTwoPoints(start, next, '#ff0000')
        pathCounter++
      }
    }

    let letNegativeJob = true
    const doesHaveNegative = pathMap.get(pathCounter - 1)
    pathCounter = 0
    if (doesHaveNegative) {
      while (letNegativeJob) {
        const start = pathMap.get(pathCounter)
        if (!start) {
          // console.error('!start')
          return
        }
        const next = pathMap.get(pathCounter - 1)
        if (!next) {
          letNegativeJob = false
          return
        }
        if (start.x === next.x && start.y === next.y) {
          // console.error('shit2')
        }

        this.drawTwoPoints(start, next, 'blue')
        pathCounter--
      }
    }
  }

  private drawTwoPoints(first: BlockRectModel, second: BlockRectModel, color: string) {
    const res = this.getValuesFromTwoBlocks({ first, second })

    if (!res) return

    this.ctx.lineWidth = 5
    this.ctx.beginPath()
    this.ctx.moveTo(res.firstResultX, res.firstResultY)
    this.ctx.lineTo(res.secondResultX, res.secondResultY)
    this.ctx.strokeStyle = color
    this.ctx.stroke()
  }

  private getValuesFromTwoBlocks(twoBlocks: { first: BlockRectModel; second: BlockRectModel }) {
    const first = twoBlocks.first
    const second = twoBlocks.second

    const drawingLeft = first.x > second.x
    const drawingUp = first.y > second.y

    const xAxisSame = first.x === second.x
    const yAxisSame = first.y === second.y
    let xDifference = Math.floor(first.x - second.x)
    xDifference = xDifference > 0 ? xDifference : xDifference * -1
    let yDifference = Math.floor(first.y - second.y)
    yDifference = yDifference > 0 ? yDifference : yDifference * -1

    if (xAxisSame) {
      const yRes = handleXAxisSame(drawingUp, first.y, first.height, second.y, second.height)
      return {
        firstResultX: first.x,
        firstResultY: yRes.firstResultY,
        secondResultX: second.x,
        secondResultY: yRes.secondResultY,
      }
    }
    if (yAxisSame) {
      const xRes = handleYAxisSame(drawingLeft, first.x, first.width, second.x, second.width)
      return {
        firstResultX: xRes.firstResultX,
        firstResultY: first.y,
        secondResultX: xRes.secondResultX,
        secondResultY: second.y,
      }
    }
    if (drawingUp && drawingLeft) {
      return upAndLeft(twoBlocks, xDifference, yDifference)
    }
    if (!drawingUp && !drawingLeft) {
      return downAndRight(twoBlocks, xDifference, yDifference)
    }
    if (drawingUp && !drawingLeft) {
      return upAndRight(twoBlocks, xDifference, yDifference)
    }
    if (!drawingUp && drawingLeft) {
      return downAndLeft(twoBlocks, xDifference, yDifference)
    }
    return undefined
  }

  private async createLineMap(selectedPaths: SelectedPanelLinkPathModel) {
    let job = true

    let panelCounter = 0
    let nextPath: SelectedPathModel | undefined = selectedPaths.panelPaths.find(
      (panel) => panel.count === panelCounter,
    )
    const lineMap = new Map<number, BlockRectModel>()
    while (job) {
      if (nextPath) {
        const blockRect = await this.getBlockRect(nextPath.panelId)

        if (!blockRect) {
          console.error('!xY')
          return undefined
        }

        lineMap.set(panelCounter, blockRect)

        const secondPath = selectedPaths.panelPaths.find(
          (panel) => panel.count === panelCounter + 1,
        )
        if (secondPath) {
          nextPath = secondPath
        } else {
          job = false
        }

        panelCounter++
      } else {
        job = false
      }
    }
    let negJob = true
    panelCounter = -1
    nextPath = selectedPaths.panelPaths.find((panel) => panel.count === panelCounter)
    while (negJob) {
      if (nextPath) {
        const blockRect = await this.getBlockRect(nextPath.panelId)
        if (!blockRect) {
          console.error('!xY')
          return undefined
        }

        lineMap.set(panelCounter, blockRect)

        const secondPath = selectedPaths.panelPaths.find(
          (panel) => panel.count === panelCounter - 1,
        )
        if (secondPath) {
          nextPath = secondPath
        } else {
          negJob = false
        }

        panelCounter--
      } else {
        negJob = false
      }
    }
    return lineMap
  }

  private async getBlockRect(panelId: string) {
    if (!this.parentWidth || !this.parentHeight) {
      this.logError('Canvas-directive', '(!this.parentHeight || !this.parentHeight)')
      return undefined
    }
    const panel = await this.panelsStore.select.panelById(panelId)
    if (!panel) {
      this.logError('Canvas-directive', '!panel')
      return undefined
    }
    const panelDiv = document.querySelector(`[blockLocation=${panel.location}]`)
    if (!panelDiv) {
      this.logError('Canvas-directive', '!panelDiv')
      return undefined
    }

    const panelRect = panelDiv.getBoundingClientRect()

    const canvasRect = this.canvas.getBoundingClientRect()
    const x = panelRect.left - canvasRect.left + panelRect.width / 2
    const y = panelRect.top - canvasRect.top + panelRect.height / 2

    return { x, y, height: panelRect.height, width: panelRect.width }
  }

  private onMouseUpHandler(event: MouseEvent) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.startX = undefined
    this.startY = undefined
    if (this.isDragging || event.ctrlKey) {
      this.isDragging = false
      this.elementRef.nativeElement.style.cursor = ''
      return
    }

    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    if (!location) return
    return this.mouseService.mouse({ event, location })
  }

  private onMouseDownHandler(event: MouseEvent) {
    if (event.ctrlKey || event.button === 1) {
      const rect = this.elementRef.nativeElement.getBoundingClientRect()
      this.startX = event.clientX - rect.left
      this.startY = event.clientY - rect.top
      this.isDragging = true
      if (event.button === 1) {
        this.middleClickDown = true
      }
      return
    }
    if (event.altKey) {
      this.altKeyDragging = true
      if (!event.pageX || !event.pageY) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.startX = undefined
        this.startY = undefined
        return
      }

      const rect = this.canvas.getBoundingClientRect()

      this.startX = event.pageX - rect.left
      this.startY = event.pageY - rect.top
    }

    this.isDragging = false
    this.middleClickDown = false
    // const clientX = event.clientX
    // const clientY = event.clientY

    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    if (!location) return

    return this.mouseService.mouse({ event, location })
  }

  private setupMouseEventListeners() {
    this.ngZone.runOutsideAngular(() => {
      this.renderer.listen(this.elementRef.nativeElement, 'mousedown', (event: MouseEvent) => {
        event.stopPropagation()
        event.preventDefault()
        this.onMouseDownHandler(event)
      })
      this.renderer.listen(this.elementRef.nativeElement, 'mouseup', (event: MouseEvent) => {
        event.stopPropagation()
        event.preventDefault()
        this.onMouseUpHandler(event)
      })
      this.renderer.listen(this.elementRef.nativeElement, 'mousemove', (event: MouseEvent) => {
        event.stopPropagation()
        event.preventDefault()
        this.onMouseMoveHandler(event)
      })
      this.renderer.listen(this.elementRef.nativeElement, 'click', (event: MouseEvent) => {
        event.stopPropagation()
        event.preventDefault()
        this.handleClickEvent(event)
      })
      this.renderer.listen(this.elementRef.nativeElement, 'dblclick', (event: MouseEvent) => {
        event.stopPropagation()
        event.preventDefault()
        this.handleDoubleClickEvent(event)
      })
    })
  }

  private handleClickEvent(event: MouseEvent) {
    if (event.ctrlKey) return

    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    if (location) {
      return this.clickService.click({ event: event as MouseEvent, location })
    }
    if (!location) {
      const secondDiv = (event.composedPath()[1] as HTMLDivElement).getAttribute('location')
      if (!secondDiv) return
      return this.clickService.click({ event: event as MouseEvent, location: secondDiv })
    }
    return
  }

  private handleDoubleClickEvent(event: MouseEvent) {
    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    if (location) {
      return this.doubleClickService.doubleCLick({ event: event as MouseEvent, location })
    }
    if (!location) {
      const secondDiv = (event.composedPath()[1] as HTMLDivElement).getAttribute('location')
      if (!secondDiv) return
      return this.doubleClickService.doubleCLick({
        event: event as MouseEvent,
        location: secondDiv,
      })
    }
    return
  }

  private onMouseMoveHandler(event: MouseEvent) {
    if (!this.startX || !this.startY || (!this.isDragging && !this.altKeyDragging)) {
      this.isDragging = false
      this.middleClickDown = false
      return
    }

    if (event.altKey) {
      if (!this.startX || !this.startY || !event.altKey) {
        return
      } else {
        this.pageX = event.pageX
        this.pageY = event.pageY
      }
      this.ngZone.runOutsideAngular(() => {
        this.animate()
      })
    }

    if (!event.ctrlKey) {
      return
    }

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

  animate() {
    if (!this.startX || !this.startY || !this.pageX || !this.pageY) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      return
    }
    const rect = this.canvas.getBoundingClientRect()

    const mouseX = this.pageX - rect.left
    const mouseY = this.pageY - rect.top

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const width = mouseX - this.startX
    const height = mouseY - this.startY

    this.ctx.globalAlpha = 0.4

    this.ctx.fillStyle = this.fillStyle

    this.ctx.fillRect(this.startX, this.startY, width, height)

    this.ctx.globalAlpha = 1.0

    requestAnimationFrame(() => this.animate())
  }

  ngOnInit(): void {
    this.height = Number(this.elementRef.nativeElement.style.height.split('p')[0])
    this.negativeHeight = Number(this.elementRef.nativeElement.style.height.split('p')[0]) * -1
    this.width = Number(this.elementRef.nativeElement.style.width.split('p')[0])
    this.negativeWidth = Number(this.elementRef.nativeElement.style.width.split('p')[0]) * -1
    this.setupMouseEventListeners()
    const parentElement = this.elementRef.nativeElement.parentElement
    this.canvas = parentElement.querySelector('canvas')
    const parentRect = this.elementRef.nativeElement.parentNode.getBoundingClientRect()
    this.parentHeight = parentRect.height
    this.parentWidth = parentRect.width

    let ctx = this.canvas.getContext('2d')
    ctx = this.throwIfNull(ctx)

    this.ctx = ctx
    // this.ctx.globalAlpha = 0.4
    this.directiveInitialized = true
  }
}
