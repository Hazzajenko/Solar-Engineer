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

  // private ngZone: inject(NgZone)

  constructor(private ngZone: NgZone) {
    // this.draw()
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
  pathMapPromise?: Promise<void | Map<number, { x: number; y: number; }>>
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
    // this.draw()
  }

  @Input() set startDraggingWithPage(xy: XYModel) {
    if (!xy.x || !xy.y) {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
      this.startX = undefined
      this.startY = undefined
      return
    }
    console.log(xy)
    const rect = this.canvas.nativeElement.getBoundingClientRect()
    /*    const appWrapper = document.getElementById('appWrapper')
        if (!appWrapper) return
        const appWrapperRect = appWrapper.getBoundingClientRect()
        console.log(appWrapper)*/
    // this.startX = clientXY.clientX
    // this.startY = clientXY.clientY
    /*    this.startX = xy.x - this.canvas.nativeElement.offsetLeft
        this.startY = xy.y - this.canvas.nativeElement.offsetTop*/
    // this.startX = xy.x - rect.left - this.canvas.nativeElement.offsetLeft
    // this.startY = xy.y - rect.top - this.canvas.nativeElement.offsetTop
    this.startX = xy.x - rect.left
    this.startY = xy.y - rect.top
    console.log(this.startX, this.startY)
    console.log(rect.top, rect.left)
    // console.log(this.canvas.nativeElement.offsetLeft, this.canvas.nativeElement.offsetTop)


    // this.startX = xy.x - rect.left - this.canvas.nativeElement.offsetLeft
    // this.startY = xy.y - rect.top - this.canvas.nativeElement.offsetTop

    /*    this.startX = clientXY.clientX - rect.left - ((rect.width - appWrapperRect.width) / 2)
        this.startY = clientXY.clientY - rect.top - ((rect.height - appWrapperRect.height) / 2)*/
    // console.log(this.startX)
    // this.startX = clientXY.clientX - rect.left - appWrapperRect.width / 2
    // this.startY = clientXY.clientY - rect.top - appWrapperRect.height / 2
    // this.draw()
  }

  @Input() set startDragging(clientXY: ClientXY) {
    /*
        if (!clientXY.clientX || !clientXY.clientY) {
          this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
          this.startX = undefined
          this.startY = undefined
          return
        }
        console.log(clientXY)
        const rect = this.canvas.nativeElement.getBoundingClientRect()
        /!*    const appWrapper = document.getElementById('appWrapper')
            if (!appWrapper) return
            const appWrapperRect = appWrapper.getBoundingClientRect()
            console.log(appWrapper)*!/
        // this.startX = clientXY.clientX
        // this.startY = clientXY.clientY
        this.startX = clientXY.clientX - rect.left
        this.startY = clientXY.clientY - rect.top
        /!*    this.startX = clientXY.clientX - rect.left - ((rect.width - appWrapperRect.width) / 2)
            this.startY = clientXY.clientY - rect.top - ((rect.height - appWrapperRect.height) / 2)*!/
        // console.log(this.startX)
        // this.startX = clientXY.clientX - rect.left - appWrapperRect.width / 2
        // this.startY = clientXY.clientY - rect.top - appWrapperRect.height / 2
        // this.draw()*/
  }

  selectedPaths?: SelectedPanelLinkPathModel

  @Input() set setStringPaths(selectedPaths: SelectedPanelLinkPathModel | undefined | null) {
    if (!selectedPaths || selectedPaths.panelPaths.length < 1) {
      console.log('undefined')
      if (this.pathMapAnimationId) {
        cancelAnimationFrame(this.pathMapAnimationId)
      }
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
      /*      window.addEventListener('blur', function() {
              console.log('blur')
            })
            addEventListener('focus', (event) => {
              console.log(event)
            })*/
      this.pathMapAnimating = false
      return
    }

    console.log(selectedPaths)
    this.selectedPaths = selectedPaths
    this.pathMapAnimating = true
    /*    this.pathMapPromise = this.createLineMap(this.selectedPaths)
        if (!this.pathMapPromise) {
          return
        }*/
    this.animateSelectedPathMap().then(r => console.log(r))
    /*    this.createLineMap(selectedPaths).then(async (map) => {
          if (!map) return
          this.pathMap = map
          this.animateSelectedPathMap()
        })*/
    // this.setStringLines(selectedPaths).then(r => console.log(r))

    // stringPaths.
    // this.reDraw()
    // this.startAnimating(60)
    // this.startAnimatingV2(60)
  }

  @Input() set setScale(scale: number | null) {
    if (!scale) return
    // this.reDraw()
    /*    if (this.pathMap) {
          this.animateSelectedPathMap()
        }*/
    // this.startAnimating(60)
    // this.startAnimatingV2(60)
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

  async setStringLines(selectedPaths: SelectedPanelLinkPathModel) {
    const first = selectedPaths.panelPaths.find(path => path.count === 0)
    if (!first) return

    const firstPanelId = first.panelId
    const firstPanelLocation = await this.panelsStore.select.panelById(firstPanelId)
    if (!firstPanelLocation) {
      return console.error('firstPanelLocation')
    }
    const firstPanelDiv = document.querySelector(`[blockLocation=${firstPanelLocation.location}]`)
    if (!firstPanelDiv) {
      return console.error('!firstPanelDiv')
    }
    const firstPanelRect = firstPanelDiv.getBoundingClientRect()
    const parentRect = this.canvas.nativeElement.parentNode.getBoundingClientRect()
    const startX = firstPanelRect.left - (parentRect.width - this.width) / 2 - this.canvas.nativeElement.parentNode.offsetLeft
    const startY = firstPanelRect.top - (parentRect.height - this.height) / 2 - this.canvas.nativeElement.parentNode.offsetTop

    this.lines[0] = { x: startX, y: startY }
    // this.lines.push({ x: startX, y: startY })

    const second = selectedPaths.panelPaths.find(path => path.count === 1)
    if (!second) return

    const secondPanelId = second.panelId
    const secondPanelLocation = await this.panelsStore.select.panelById(secondPanelId)
    if (!secondPanelLocation) {
      return console.error('secondPanelLocation')
    }
    const secondPanelDiv = document.querySelector(`[blockLocation=${secondPanelLocation.location}]`)
    if (!secondPanelDiv) {
      return console.error('!secondPanelDiv')
    }
    const secondPanelRect = secondPanelDiv.getBoundingClientRect()
    const secondX = secondPanelRect.left - (parentRect.width - this.width) / 2 - this.canvas.nativeElement.parentNode.offsetLeft
    const secondY = secondPanelRect.top - (parentRect.height - this.height) / 2 - this.canvas.nativeElement.parentNode.offsetTop

    this.lines[1] = { x: secondX, y: secondY }
    // this.lines.push({ x: secondX, y: secondY })

    this.reDrawSelected()
    // this.startAnimatingSelected()
  }

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
    // console.log('onDRAGGING')
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

    const parentRect = this.canvas.nativeElement.parentNode.getBoundingClientRect()
    const rect = this.canvas.nativeElement.getBoundingClientRect()

    /*    console.log(parentRect)
        console.log(this.canvas.nativeElement.parentNode)
        console.log(this.canvas.nativeElement.parentNode.offsetLeft)
        console.log(this.canvas.nativeElement.parentNode.offsetTop)*/

    const mouseX = this.pageX - rect.left

    const mouseY = this.pageY - rect.top


    /*    const mouseX = this.pageX - (parentRect.width - this.width) / 2 - this.canvas.nativeElement.parentNode.offsetLeft

        const mouseY = this.pageY - (parentRect.height - this.height) / 2 - this.canvas.nativeElement.parentNode.offsetTop*/
    /*    const rect = this.canvas.nativeElement.getBoundingClientRect()
        const appWrapper = document.getElementById('appWrapper')
        if (!appWrapper) return
        const appWrapperRect = appWrapper.getBoundingClientRect()
        console.log(appWrapper)/!**!/

        const mouseX = this.pageX - this.canvas.nativeElement.parentNode.offsetLeft - appWrapper.offsetLeft

        const mouseY = this.pageY - this.canvas.nativeElement.parentNode.offsetTop - appWrapper.offsetTop*/

    // const mouseX = this.pageX - this.canvas.nativeElement.parentNode.offsetLeft
    // const mouseY = this.pageY - this.canvas.nativeElement.parentNode.offsetTop

    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)

    const width = mouseX - this.startX
    const height = mouseY - this.startY

    this.ctx.globalAlpha = 0.4

    this.ctx.fillStyle = this.fillStyle
    // this.ctx.fillStyle = '#7585d8'
    this.ctx.fillRect(this.startX, this.startY, width, height)

    this.ctx.globalAlpha = 1.0

    // window.requestAnimationFrame(this.animate)
    // requestAnimationFrame(this.animate.bind(this))
    window.requestAnimationFrame(() => this.animate())
  }

  startAnimating(fps: number) {
    this.fpsInterval = 1000 / fps
    this.startTime = Date.now()
    this.animateWithFps()
  }

  // deprecated
  startAnimatingV2(fps: number) {
    this.fpsInterval = 1000 / fps
    this.startTime = Date.now()
    this.animateWithFpsV2()
  }

  // deprecated
  animateWithFpsV2() {
    // perform some animation task here
    this.reDraw()

    setTimeout(() => {
      requestAnimationFrame(() => this.animateWithFpsV2())
    }, 1000 / this.fpsInterval)
  }

  startAnimatingSelected() {
    this.fpsInterval = 1000 / 60
    this.startTime = Date.now()
    this.animateSelectedPaths()
  }

  animateSelectedPaths() {

    // request another frame

    requestAnimationFrame(() => this.animateSelectedPaths())

    // calc elapsed time since last loop

    const now = Date.now()
    const elapsed = now - this.startTime

    // if enough time has elapsed, draw the next frame

    if (elapsed > this.fpsInterval) {

      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      this.startTime = now - (elapsed % this.fpsInterval)

      // Put your drawing code here
      this.reDrawSelected()
    }
  }

  animateWithFps() {

    // request another frame

    requestAnimationFrame(() => this.animateWithFps())

    // calc elapsed time since last loop

    const now = Date.now()
    const elapsed = now - this.startTime

    // if enough time has elapsed, draw the next frame

    if (elapsed > this.fpsInterval) {

      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      this.startTime = now - (elapsed % this.fpsInterval)

      // Put your drawing code here
      this.reDraw()
    }
  }

  private reDrawSelected() {
    if (!this.lines) {
      return
    }
    /*    // await new Promise(resolve => setTimeout(resolve, 100))
        this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)

        const firstObject = document.querySelector(`[blockLocation=${this.firstObjectLocation}]`)
        if (!firstObject) return
        const firstRect = firstObject.getBoundingClientRect()
        const parentRect = this.canvas.nativeElement.parentNode.getBoundingClientRect()
        this.firstObjectX = firstRect.left - (parentRect.width - this.width) / 2 - this.canvas.nativeElement.parentNode.offsetLeft
        this.firstObjectY = firstRect.top - (parentRect.height - this.height) / 2 - this.canvas.nativeElement.parentNode.offsetTop

        const secondObject = document.querySelector(`[blockLocation=${this.secondObjectLocation}]`)
        if (!secondObject) return
        const secondRect = secondObject.getBoundingClientRect()
        this.secondObjectX = secondRect.left - (parentRect.width - this.width) / 2 - this.canvas.nativeElement.parentNode.offsetLeft
        this.secondObjectY = secondRect.top - (parentRect.height - this.height) / 2 - this.canvas.nativeElement.parentNode.offsetTop
        this.secondObjectX += (secondRect.width / 2)
        this.secondObjectY += (secondRect.height / 2)*/


    this.ctx.lineWidth = 15
    this.ctx.fillStyle = this.fillStyle
    this.ctx.globalAlpha = 0.4
    this.ctx.beginPath()
    this.ctx.moveTo(this.lines[0].x, this.lines[0].y)
    this.ctx.lineTo(this.lines[1].x, this.lines[1].y)
    this.ctx.stroke()
  }

  private reDraw() {
    if (!this.firstObjectX || !this.firstObjectY || !this.secondObjectX || !this.secondObjectY) {
      return
    }
    // await new Promise(resolve => setTimeout(resolve, 100))
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)

    const firstObject = document.querySelector(`[blockLocation=${this.firstObjectLocation}]`)
    if (!firstObject) return
    const firstRect = firstObject.getBoundingClientRect()
    const parentRect = this.canvas.nativeElement.parentNode.getBoundingClientRect()
    this.firstObjectX = firstRect.left - (parentRect.width - this.width) / 2 - this.canvas.nativeElement.parentNode.offsetLeft
    this.firstObjectY = firstRect.top - (parentRect.height - this.height) / 2 - this.canvas.nativeElement.parentNode.offsetTop

    const secondObject = document.querySelector(`[blockLocation=${this.secondObjectLocation}]`)
    if (!secondObject) return
    const secondRect = secondObject.getBoundingClientRect()
    this.secondObjectX = secondRect.left - (parentRect.width - this.width) / 2 - this.canvas.nativeElement.parentNode.offsetLeft
    this.secondObjectY = secondRect.top - (parentRect.height - this.height) / 2 - this.canvas.nativeElement.parentNode.offsetTop
    this.secondObjectX += (secondRect.width / 2)
    this.secondObjectY += (secondRect.height / 2)


    this.ctx.lineWidth = 15
    this.ctx.fillStyle = this.fillStyle
    this.ctx.globalAlpha = 0.4
    this.ctx.beginPath()
    this.ctx.moveTo(this.firstObjectX, this.firstObjectY)
    this.ctx.lineTo(this.secondObjectX, this.secondObjectY)
    this.ctx.stroke()
  }

  draw() {
    /*
    var c = document.getElementById("myCanvas"),
      ctx = c.getContext("2d"),
      lineWidth = 2,
      xNumber = 6,
      yNumber = 9,
*/


    // const lineWidth = 2
    const xNumber = 6
    const yNumber = 9
    const xCenter = this.canvas.nativeElement.width / 2
    const yCenter = 44.5 * yNumber + 44.5

    this.ctx.lineCap = 'round'
// draw a scale with the numbers on it
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = '#FF9900'
    this.ctx.fillStyle = 'blue'

    this.ctx.beginPath()
    this.ctx.moveTo(xCenter, yCenter)

    for (let i = 0; i <= xNumber; ++i) {
      //put a stroke mark
      this.ctx.lineTo((xCenter + (100 * i)), yCenter)
      this.ctx.lineTo((xCenter + (100 * i)), (yCenter + 5)) //markers
      this.ctx.lineTo((xCenter + (100 * i)), yCenter)

      // write the number 10px below
      this.ctx.strokeStyle = '#000000'
      // default size is 10px
      this.ctx.strokeText(i.toString(), (xCenter + (100 * i)), (yCenter + 15))
    }

    this.ctx.strokeStyle = '#FF9900'
    this.ctx.stroke()

// draw a vertical scale with lines on it
    this.ctx.beginPath()
    this.ctx.moveTo(xCenter, yCenter)

    for (let b = 0; b <= yNumber; ++b) {
      //put a stroke mark
      if (b === 0) continue

      this.ctx.lineTo(xCenter, (yCenter - (44.5 * b)))
      this.ctx.lineTo((xCenter - 5), (yCenter - (44.5 * b)))
      this.ctx.lineTo(xCenter, (yCenter - (44.5 * b)))
      this.ctx.strokeStyle = '#000000'
      this.ctx.strokeText(b.toString(), (xCenter - 15), (yCenter - (44.5 * b)))
    }

    this.ctx.strokeStyle = '#FF9900'
    this.ctx.stroke()
  }

  private async createLineMap(selectedPaths: SelectedPanelLinkPathModel) {
    let job = true
    /*    let nextPanel: PanelModel | undefined = selectedPaths.panelPaths.find(
          (panel) => panel.count === 0
        )*/
    let panelCounter = 0
    let nextPath: SelectedPathModel | undefined = selectedPaths.panelPaths.find(
      (panel) => panel.count === panelCounter,
    )
    const lineMap = new Map<number, BlockRectModel>()
    while (job) {
      if (nextPath) {
        const blockRect = await this.getBlockRect(nextPath.panelId)
        // const xY = await this.getCentre(nextPath.panelId)
        if (!blockRect) {
          return console.error('!xY')
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
          return console.error('!xY')
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
        // this.pathMap = await this.createLineMap(this.selectedPaths)
        const pathMap = await this.createLineMap(this.selectedPaths)
        await this.drawSelectedPathMap(pathMap)
      }
      /*      if (!this.pathMapPromise) {
              return
            }
            if (this.pathMapAnimating) {
              await this.drawSelectedPathMap()
            }*/
    }
  }

  private async drawSelectedPathMap(pathMap: void | Map<number, BlockRectModel>) {
    console.log('draw')
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
    // const res = this.getValues(first, second)
    if (!res) return

    this.ctx.lineWidth = 5
    this.ctx.beginPath()
    this.ctx.moveTo(res.firstResultX, res.firstResultY)
    this.ctx.lineTo(res.secondResultX, res.secondResultY)
    this.ctx.strokeStyle = color
    this.ctx.stroke()
  }

  // private getValues(twoBlocks: { first: BlockRectModel, second: BlockRectModel }) {

  private getValuesFromTwoBlocks(twoBlocks: { first: BlockRectModel, second: BlockRectModel }) {
    const first = twoBlocks.first
    const second = twoBlocks.second
    /*    const { x: firstX, y: firstY, width: firstWidth, height: firstHeight } = twoBlocks.first
        const { x: secondX, y: secondY, width: secondWidth, height: secondHeight } = twoBlocks.second*/
    const drawingLeft = first.x > second.x
    const drawingUp = first.y > second.y
    // firstResultY = drawingUp ? first.y - first.height / 2 : first.y + first.height / 2;
    // secondResultY = drawingUp ? second.y + second.height / 2 : second.y - second.height / 2;
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


  private handleXAxisSame(drawingUp: boolean, firstY: number, firstHeight: number, secondY: number, secondHeight: number) {
    const firstResultY = drawingUp ? firstY - firstHeight / 2 : firstY + firstHeight / 2
    const secondResultY = drawingUp ? secondY + secondHeight / 2 : secondY - secondHeight / 2
    return { firstResultY, secondResultY }
  }

  private handleYAxisSame(drawingLeft: boolean, firstX: number, firstWidth: number, secondX: number, secondWidth: number) {
    const firstResultX = drawingLeft ? firstX - firstWidth / 2 : firstX + firstWidth / 2
    const secondResultX = drawingLeft ? secondX + secondWidth / 2 : secondX - secondWidth / 2
    return { firstResultX, secondResultX }
  }


  private differenceBetweenYAndXIsEqual(twoBlocks: { first: BlockRectModel, second: BlockRectModel }) {
    const xDifference = Math.floor(twoBlocks.first.x - twoBlocks.second.x)
    const yDifference = Math.floor(twoBlocks.first.y - twoBlocks.second.y)
    return xDifference === yDifference
  }

  private getValues(first: BlockRectModel, second: BlockRectModel) {
    const drawingLeft = first.x > second.x
    const drawingUp = first.y > second.y
    const xAxisSame = first.x === second.x
    const yAxisSame = first.y === second.y

    let firstResultX: number | undefined
    let firstResultY: number | undefined

    let secondResultX: number | undefined
    let secondResultY: number | undefined
    if (xAxisSame) {
      // console.log('xAxisSame')
      if (drawingUp) {
        console.log('xAxisSame drawingUp')
        firstResultY = first.y - first.height / 2
        secondResultY = second.y + second.height / 2
        return { firstResultX: first.x, firstResultY, secondResultX: second.x, secondResultY }
      } else {
        console.log('xAxisSame !drawingUp')
        firstResultY = first.y + first.height / 2
        secondResultY = second.y - second.height / 2
        return { firstResultX: first.x, firstResultY, secondResultX: second.x, secondResultY }
      }
      /*      if (drawingUp) {
              firstResultY = first.y + first.height / 2
              secondResultY = second.y - second.height / 2
              return { firstResultX: first.x, firstResultY, secondResultX: second.x, secondResultY }
            } else if (!drawingUp) {
              firstResultY = first.y - first.height / 2
              secondResultY = second.y + second.height / 2
              return { firstResultX: first.x, firstResultY, secondResultX: second.x, secondResultY }
            }*/
    }
    if (yAxisSame) {
      console.log('yAxisSame')
      if (drawingLeft) {
        firstResultX = first.x - first.width / 2
        secondResultX = second.x + second.width / 2
        return { firstResultX, firstResultY: first.y, secondResultX, secondResultY: second.y }
      } else {
        firstResultX = first.x + first.width / 2
        secondResultX = second.x - second.width / 2
        return { firstResultX, firstResultY: first.y, secondResultX, secondResultY: second.y }
      }
      /*      if (drawingLeft) {
              firstResultX = first.x + first.width / 2
              secondResultX = second.x - second.width / 2
              return { firstResultX, firstResultY: first.y, secondResultX, secondResultY: second.y }
            } else if (!drawingLeft) {
              firstResultX = first.x - first.width / 2
              secondResultX = second.x + second.width / 2
              return { firstResultX, firstResultY: first.y, secondResultX, secondResultY: second.y }
            }*/
    }
    if (drawingUp && drawingLeft) {
      console.log('drawingUp && drawingLeft')
      firstResultY = first.y - first.height / 2
      secondResultY = second.y + second.height / 2
      firstResultX = first.x - first.width / 2
      secondResultX = second.x + second.width / 2
      return { firstResultX, firstResultY, secondResultX, secondResultY }
    }
    if (!drawingUp && !drawingLeft) {
      console.log('!drawingUp && !drawingLeft')
      firstResultY = first.y + first.height / 2
      secondResultY = second.y - second.height / 2
      firstResultX = first.x + first.width / 2
      secondResultX = second.x - second.width / 2
      return { firstResultX, firstResultY, secondResultX, secondResultY }
    }
    return undefined
  }

  private async getCentre(panelId: string) {
    if (!this.parentWidth || !this.parentHeight) {
      return console.error('(!this.parentHeight || !this.parentHeight)')
    }
    const panel = await this.panelsStore.select.panelById(panelId)
    if (!panel) {
      return console.error('panel')
    }
    const panelDiv = document.querySelector(`[blockLocation=${panel.location}]`)
    if (!panelDiv) {
      return console.error('!firstPanelDiv')
    }
    const panelRect = panelDiv.getBoundingClientRect()
    const parentRect = this.canvas.nativeElement.parentNode.getBoundingClientRect()
    const x = panelRect.left - (parentRect.width - this.width) / 2 - this.canvas.nativeElement.parentNode.offsetLeft + (panelRect.width / 2)
    const y = panelRect.top - (parentRect.height - this.height) / 2 - this.canvas.nativeElement.parentNode.offsetTop + (panelRect.height / 2)

    return { x, y }
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

    // const mouseX = this.pageX - rect.left
    //
    // const mouseY = this.pageY - rect.top
    const panelRect = panelDiv.getBoundingClientRect()
    const parentRect = this.canvas.nativeElement.parentNode.getBoundingClientRect()
    const canvasRect = this.canvas.nativeElement.getBoundingClientRect()
    const x = panelRect.left - canvasRect.left + (panelRect.width / 2)
    const y = panelRect.top - canvasRect.top + (panelRect.height / 2)
    /*    const x = panelRect.left - (parentRect.width - this.width) / 2 - this.canvas.nativeElement.parentNode.offsetLeft + (panelRect.width / 2)
        const y = panelRect.top - (parentRect.height - this.height) / 2 - this.canvas.nativeElement.parentNode.offsetTop + (panelRect.height / 2)*/

    return { x, y, height: panelRect.height, width: panelRect.width }
  }

}
