import { Directive, ElementRef, HostListener, inject, Input, NgZone, OnInit } from '@angular/core'
import { BlockRectModel, ClientXY, ElementOffsets, PosXY, XYModel } from '@grid-layout/shared/models'
import { PanelsStoreService } from '@project-id/data-access/facades'
import {
  GridMode, PanelIdPath,
  PanelModel,
  SelectedPanelLinkPathModel, SelectedPathModel,
  StringLinkPathModel,
  VibrantColor,
} from '@shared/data-access/models'
import { reducers } from '@shared/data-access/store'
import {
  downAndLeft,
  downAndRight,
  handleXAxisSame,
  handleYAxisSame,
  startDiagonal,
  upAndLeft,
  upAndRight,
} from './utils/handle-axis'

@Directive({
  selector: '[appCanvas]',
  standalone: true,
})
export class CanvasDirective implements OnInit {
  private canvas = inject(ElementRef<HTMLCanvasElement>)
  private panelsStore = inject(PanelsStoreService)
  private ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d')


  constructor(private ngZone: NgZone) {

  }


  height!: number
  negativeHeight!: number

  width!: number
  negativeWidth!: number
  pageX?: number
  pageY?: number
  startX?: number
  startY?: number
  offsetX?: number
  offsetY?: number
  currentGridMode = GridMode.UNDEFINED
  fillStyle = '#7585d8'
  pathMap?: void | Map<number, { x: number; y: number; }>
  pathMapAnimationId?: number
  pathMapAnimating = false


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
    this.canvas.nativeElement.width = offsets.offsetWidth
    this.canvas.nativeElement.height = offsets.offsetHeight
    this.offsetX = offsets.offsetLeft
    this.offsetY = offsets.offsetTop
  }

  @Input() set startDraggingWithPage(xy: XYModel) {
    if (!xy.x || !xy.y) {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
      this.startX = undefined
      this.startY = undefined
      return
    }

    const rect = this.canvas.nativeElement.getBoundingClientRect()

    this.startX = xy.x - rect.left
    this.startY = xy.y - rect.top
  }

  @Input() set startDragging(clientXY: ClientXY) {

  }

  selectedPaths?: SelectedPanelLinkPathModel

  @Input() set setStringPaths(selectedPaths: SelectedPanelLinkPathModel | undefined | null) {
    if (!selectedPaths || selectedPaths.panelPaths.length < 1) {
      console.log('undefined')
      if (this.pathMapAnimationId) {
        cancelAnimationFrame(this.pathMapAnimationId)
      }
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
      this.pathMapAnimating = false
      return
    }

    console.log(selectedPaths)
    this.selectedPaths = selectedPaths
    this.pathMapAnimating = true

    this.animateSelectedPathMap().then(r => console.log(r))

  }

  @Input() set setScale(scale: number | null) {
    if (!scale) return
  }

  firstObjectX?: number
  firstObjectY?: number
  firstObjectLocation?: string

  secondObjectX?: number
  secondObjectY?: number
  secondObjectLocation?: string

  fpsInterval = 1000 / 60
  startTime = Date.now()

  lines: { x: number, y: number }[] = []
  parentHeight?: number
  parentWidth?: number


  @HostListener('document:mouseup', ['$event'])
  mouseUp(event: MouseEvent) {
    console.log(event.clientX, event.clientY)
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
    this.startX = undefined
    this.startY = undefined
    return
  }

  @HostListener('document:mousemove', ['$event'])
  onDragging(event: MouseEvent) {
    if (!this.startX || !this.startY || !event.altKey) {
      return
    } else {
      this.pageX = event.pageX
      this.pageY = event.pageY
    }
    this.ngZone.runOutsideAngular(() => {
      this.animate()
    })
    event.preventDefault()
    event.stopPropagation()
  }

  ngOnInit(): void {
    this.height = Number(this.canvas.nativeElement.style.height.split('p')[0])
    this.negativeHeight = Number(this.canvas.nativeElement.style.height.split('p')[0]) * -1.
    this.width = Number(this.canvas.nativeElement.style.width.split('p')[0])
    this.negativeWidth = Number(this.canvas.nativeElement.style.width.split('p')[0]) * -1.
    const parentRect = this.canvas.nativeElement.parentNode.getBoundingClientRect()
    this.parentHeight = parentRect.height
    this.parentWidth = parentRect.width
  }


  animate() {
    if (!this.startX || !this.startY || !this.pageX || !this.pageY) {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
      return
    }
    const rect = this.canvas.nativeElement.getBoundingClientRect()


    const mouseX = this.pageX - rect.left
    const mouseY = this.pageY - rect.top


    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)

    const width = mouseX - this.startX
    const height = mouseY - this.startY

    this.ctx.globalAlpha = 0.4

    this.ctx.fillStyle = this.fillStyle
    // this.ctx.fillStyle = '#7585d8'
    this.ctx.fillRect(this.startX, this.startY, width, height)

    this.ctx.globalAlpha = 1.0

    requestAnimationFrame(() => this.animate())
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
    nextPath = selectedPaths.panelPaths.find(
      (panel) => panel.count === panelCounter,
    )
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
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
    if (!this.selectedPaths) {
      console.error('!this.selectedPaths')
      return
    }

    if (!pathMap) {
      console.error('!pathMap')
      return
    }

    let job = true

    let pathCounter = 0

    const doesHavePositive = pathMap.get(pathCounter + 1)
    if (doesHavePositive) {
      while (job) {
        const start = pathMap.get(pathCounter)
        if (!start) {
          console.error('!start')
          return
        }
        const next = pathMap.get(pathCounter + 1)
        if (!next) {
          job = false
          break
        }
        if (start.x === next.x && start.y === next.y) {
          console.error('shit')
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
          console.error('!start')
          return
        }
        const next = pathMap.get(pathCounter - 1)
        if (!next) {
          letNegativeJob = false
          return
        }
        if (start.x === next.x && start.y === next.y) {
          console.error('shit2')
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


  private getValuesFromTwoBlocks(twoBlocks: { first: BlockRectModel, second: BlockRectModel }) {
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

  private async getBlockRect(panelId: string) {
    if (!this.parentWidth || !this.parentHeight) {
      console.error('(!this.parentHeight || !this.parentHeight)')
      return undefined
    }
    const panel = await this.panelsStore.select.panelById(panelId)
    if (!panel) {
      console.error('panel')
      return undefined
    }
    const panelDiv = document.querySelector(`[blockLocation=${panel.location}]`)
    if (!panelDiv) {
      console.error('!firstPanelDiv')
      return undefined
    }


    const panelRect = panelDiv.getBoundingClientRect()

    const canvasRect = this.canvas.nativeElement.getBoundingClientRect()
    const x = panelRect.left - canvasRect.left + (panelRect.width / 2)
    const y = panelRect.top - canvasRect.top + (panelRect.height / 2)

    return { x, y, height: panelRect.height, width: panelRect.width }
  }

}
