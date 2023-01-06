import { Directive, ElementRef, HostListener, inject, Input, NgZone, OnInit } from '@angular/core'
import { ClientXY, ElementOffsets } from '@grid-layout/shared/models'
import { GridMode, VibrantColor } from '@shared/data-access/models'

@Directive({
  selector: '[appCanvas]',
  standalone: true,
})
export class CanvasDirective implements OnInit {
  private canvas = inject(ElementRef<HTMLCanvasElement>)
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

}
