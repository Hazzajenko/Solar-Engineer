import { Directive, ElementRef, HostListener, inject, Input, NgZone, OnInit } from '@angular/core'
import { ClientXY, ElementOffsets } from '@grid-layout/shared/models'
import { PanelsStoreService } from '@project-id/data-access/facades'
import {
  GridMode, PanelIdPath,
  PanelModel,
  SelectedPanelLinkPathModel, SelectedPathModel,
  StringLinkPathModel,
  VibrantColor,
} from '@shared/data-access/models'

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

  @Input() set startDragging(clientXY: ClientXY) {
    if (!clientXY.clientX || !clientXY.clientY) {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
      this.startX = undefined
      this.startY = undefined
      return
    }
    console.log(clientXY)
    const rect = this.canvas.nativeElement.getBoundingClientRect()
    this.startX = clientXY.clientX - rect.left
    this.startY = clientXY.clientY - rect.top
    // this.draw()
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
    this.pathMapPromise = this.createLineMap(this.selectedPaths)
    if (!this.pathMapPromise) {
      return
    }
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
    /*    const pan = (event.composedPath()[0] as HTMLDivElement)
        console.log(pan)
        const rect = (event.composedPath()[0] as HTMLDivElement).getBoundingClientRect()
        const id = (event.composedPath()[0] as HTMLDivElement).getAttribute('id')
        const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
        console.log(id)
        if (id) {
          // const doc = document.querySelector(`#${id}`) // Match the second div
          // const doc = document.querySelector(`[id=${id}]`) // Match the second div
          const doc2 = document.querySelector(`[blockLocation=${location}]`) // Match the second div
          // const doc3 = document.querySelector(`[blockId=${id}]`) // Match the second div
          const yes = document.querySelector('div.panel')
          // console.log(doc)
          console.log(doc2)
          // console.log(doc3)
          console.log(yes)

        }
        console.log(rect)
        const parentRect = this.canvas.nativeElement.parentNode.getBoundingClientRect()
        const mouseX = rect.left - (parentRect.width - this.width) / 2 - this.canvas.nativeElement.parentNode.offsetLeft

        const mouseY = rect.top - (parentRect.height - this.height) / 2 - this.canvas.nativeElement.parentNode.offsetTop
        if (this.firstObjectX && this.firstObjectY) {
          if (location) {
            this.secondObjectLocation = location

          }
          this.secondObjectX = mouseX
          this.secondObjectY = mouseY
          this.secondObjectX += (rect.width / 2)
          this.secondObjectY += (rect.height / 2)

          this.ctx.lineWidth = 15
          this.ctx.fillStyle = this.fillStyle
          this.ctx.globalAlpha = 0.4
          this.ctx.beginPath()
          this.ctx.moveTo(this.firstObjectX, this.firstObjectY)
          this.ctx.lineTo(mouseX, mouseY)
          this.ctx.stroke()
        }
        if (!this.firstObjectX || !this.firstObjectY) {
          if (location) {
            this.firstObjectLocation = location

          }
          this.firstObjectX = mouseX
          this.firstObjectY = mouseY
          this.firstObjectX += (rect.width / 2)
          this.firstObjectY += (rect.height / 2)
        }*/
    /*    this.ctx.globalAlpha = 0.4

        this.ctx.fillStyle = this.fillStyle
        // this.ctx.fillStyle = '#7585d8'
        this.ctx.fillRect(mouseX, mouseY, rect.width, rect.height)

        this.ctx.globalAlpha = 1.0*/
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

    const mouseX = this.pageX - (parentRect.width - this.width) / 2 - this.canvas.nativeElement.parentNode.offsetLeft

    const mouseY = this.pageY - (parentRect.height - this.height) / 2 - this.canvas.nativeElement.parentNode.offsetTop

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
    let nextPath: SelectedPathModel | undefined = selectedPaths.panelPaths.find(
      (panel) => panel.count === 0,
    )
    let panelCounter = 0
    const lineMap = new Map<number, { x: number, y: number }>()
    while (job) {
      if (nextPath) {
        const xY = await this.getCentre(nextPath.panelId)
        if (!xY) {
          return console.error('!xY')
        }

        lineMap.set(panelCounter, xY)

        const secondPath = selectedPaths.panelPaths.find(
          (panel) => panel.count === panelCounter,
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
    return lineMap
  }

  async animateSelectedPathMap() {
    this.pathMapAnimationId = requestAnimationFrame(() => this.animateSelectedPathMap())
    const now = Date.now()
    const elapsed = now - this.startTime
    if (elapsed > this.fpsInterval) {
      this.startTime = now - (elapsed % this.fpsInterval)
      if (this.selectedPaths && this.pathMapAnimating) {
        this.pathMap = await this.createLineMap(this.selectedPaths)
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

  private async drawSelectedPathMap(pathMap: void | Map<number, { x: number; y: number }>) {
    // console.log('drawSelectedPathMap')
    // console.log(selectedPaths)
    /*    if (!this.pathMap) {
          return
        }
        const pathMap = this.pathMap*/
    console.log('draw')
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
    if (!this.selectedPaths) {
      return console.error('!this.selectedPaths')
    }

    // const pathMap = await this.pathMapPromise
    if (!pathMap) {
      return console.error('!pathMap')
    }
    /*    const pathMap = await this.createLineMap(this.selectedPaths)
        if (!pathMap) {
          return console.error('!pathMap')
        }*/


    let job = true


    let pathCounter = 0
    while (job) {
      const start = pathMap.get(pathCounter)
      if (!start) {
        return console.error('!start')
      }
      const next = pathMap.get(pathCounter + 1)
      if (!next) {
        job = false
        break
        // return console.error('!next')
      }
      // const next = pathMap.get(pathCounter)
      // job = !!next
      /*      if (!next) {
              job = false
              break
            }*/

      this.drawTwoPoints(start, next)
      pathCounter++

      /*      if (!next) {
              job = false
            }*/


    }


    /*    this.ctx.lineWidth = 15
        this.ctx.fillStyle = this.fillStyle
        this.ctx.globalAlpha = 0.4
        this.ctx.beginPath()
        this.ctx.moveTo(this.lines[0].x, this.lines[0].y)
        this.ctx.lineTo(this.lines[1].x, this.lines[1].y)
        this.ctx.stroke()*/
  }

  private drawTwoPoints(first: { x: number, y: number }, second: { x: number, y: number }) {
    this.ctx.lineWidth = 5


    // this.ctx.globalAlpha = 0.4
    this.ctx.beginPath()
    this.ctx.moveTo(first.x, first.y)
    this.ctx.lineTo(second.x, second.y)
    this.ctx.strokeStyle = '#ff0000'
    // this.ctx.fillStyle = '#10ff12'
    this.ctx.stroke()
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
    /*    let x = panelRect.left - (this.parentWidth - this.width) / 2
        let y = panelRect.top - (this.parentHeight - this.height) / 2
        x -= this.canvas.nativeElement.parentNode.offsetLeft
        y -= this.canvas.nativeElement.parentNode.offsetTop
        x += (panelRect.width / 2)
        y += (panelRect.height / 2)*/
    return { x, y }
    /*    const secondObject = document.querySelector(`[blockLocation=${this.secondObjectLocation}]`)
        if (!secondObject) return
        const secondRect = secondObject.getBoundingClientRect()
        this.secondObjectX = secondRect.left - (parentRect.width - this.width) / 2 - this.canvas.nativeElement.parentNode.offsetLeft
        this.secondObjectY = secondRect.top - (parentRect.height - this.height) / 2 - this.canvas.nativeElement.parentNode.offsetTop
        this.secondObjectX += (secondRect.width / 2)
        this.secondObjectY += (secondRect.height / 2)*/
  }

}
