import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core'

@Component({
  selector: 'app-image-canvas',
  templateUrl: 'image-canvas.component.html',
  styleUrls: ['image-canvas.component.scss'],
  standalone: true,
})
export class ImageCanvasComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef
  @Input() maxZoom!: number
  @Input() minZoom!: number
  private canvas: any
  private context: any
  private imageValue!: HTMLImageElement
  private topValue!: number
  private bottomValue!: number
  private leftValue!: number
  private rightValue!: number
  private zoomLevelValue!: number
  private centerXValue!: number
  private centerYValue!: number
  // Saving 2^zoomLevel to avoid a ton of recalculation
  private zoomRatio!: number

  private dragPos!: Point

  @Input()
  get image(): HTMLImageElement {
    return this.imageValue
  }

  set image(val: HTMLImageElement) {
    this.imageValue = val

    if (val) {
      val.onload = () => {
        this.loadImage(val)
      }
    }
  }

  get top(): number {
    return this.topValue
  }

  set top(val: number) {
    this.topValue = val
    // this.topChange.emit(val)
  }

  get bottom(): number {
    return this.bottomValue
  }

  set bottom(val: number) {
    this.bottomValue = val
    // this.bottomChange.emit(val)
  }

  get left(): number {
    return this.leftValue
  }

  set left(val: number) {
    this.leftValue = val
    // this.leftChange.emit(val)
  }

  get right(): number {
    return this.rightValue
  }

  set right(val: number) {
    this.rightValue = val
    // this.rightChange.emit(val)
  }

  @Input()
  get zoomLevel(): number {
    return this.zoomLevelValue
  }

  set zoomLevel(val: number) {
    val = this.clampZoomLevel(val)
    let newZoomRatio = Math.pow(2, val)
    let previousZoomRatio = this.zoomRatio

    if (this.context)
      setTimeout(() =>
        this.rescale(previousZoomRatio == undefined ? 1 : previousZoomRatio, newZoomRatio),
      )

    this.zoomLevelValue = val
    this.zoomRatio = newZoomRatio
    // this.zoomLevelChange.emit(val)
  }

  @Input()
  get centerX(): number {
    return this.centerXValue
  }

  set centerX(val: number) {
    this.setCenterX(val, true)
  }

  @Input()
  get centerY(): number {
    return this.centerYValue
  }

  set centerY(val: number) {
    this.setCenterY(val, true)
  }

  ngAfterViewInit() {
    // Timeout is to avoid a "changed after it was checked" error
    setTimeout(() => this.initialize())
  }

  public mousedown(event: MouseEvent) {
    this.dragPos = { x: event.offsetX, y: event.offsetY }
  }

  public mousemove(event: MouseEvent) {
    if (event.buttons > 0) {
      if (this.dragPos == null) this.dragPos = { x: event.offsetX, y: event.offsetY }

      let dx = (event.offsetX - this.dragPos.x) / this.zoomRatio
      let dy = (event.offsetY - this.dragPos.y) / this.zoomRatio

      let centerXVal = this.centerXValue - dx
      this.setCenterX(centerXVal, false)
      this.setCenterY(this.centerYValue - dy, false)

      this.dragPos = { x: event.offsetX, y: event.offsetY }

      this.draw({ x: this.centerXValue, y: this.centerYValue }, this.zoomRatio)
    }
  }

  public mousewheel(event: any) {
    event.preventDefault()
    console.log(event)

    let previousZoomLevel = this.zoomLevelValue
    let previousZoomRatio = this.zoomRatio
    let newZoomLevel = this.clampZoomLevel(previousZoomLevel - event.deltaY * 0.0025)
    let newZoomRatio = Math.pow(2, newZoomLevel)

    this.rescale(previousZoomRatio, newZoomRatio, { x: event.offsetX, y: event.offsetY })

    this.zoomLevelValue = newZoomLevel
    this.zoomRatio = newZoomRatio
    // this.zoomLevelChange.emit(newZoomLevel)
  }

  public onresize() {
    // this.canvasWidthChange.emit(this.canvas.scrollWidth)
    // this.canvasHeightChange.emit(this.canvas.scrollHeight)
  }

  private upOrDown() {}

  private initialize() {
    this.canvas = this.canvasRef.nativeElement

    if (this.canvas.getContext) {
      this.context = this.canvas.getContext('2d')

      this.loadImage(this.image)
    }
  }

  private loadImage(image: HTMLImageElement) {
    if (!this.canvas || !image) return

    this.canvas.width = image.width
    this.canvas.height = image.height

    this.onresize()

    if (this.zoomLevel == undefined) this.zoomLevel = 0
    if (this.minZoom == undefined) this.minZoom = 0

    // If the center is at (0,0) or undefined, move it to the center
    if (!this.centerX && !this.centerY) {
      this.setCenterX(this.image.width / 2, false)
      this.setCenterY(this.image.height / 2, false)
    } else {
      if (!this.centerX && this.centerX != 0) this.setCenterX(this.image.width / 2, false)
      if (!this.centerY && this.centerY != 0) this.setCenterY(this.image.height / 2, false)
    }

    this.draw({ x: this.centerX, y: this.centerY }, 1)

    this.rescale(1, this.zoomRatio)
  }

  private draw(center: Point, zoomRatio: number) {
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.context.drawImage(
        this.image,
        0,
        0,
        this.image.width,
        this.image.height,
        this.image.width / 2 - center.x * zoomRatio,
        this.image.height / 2 - center.y * zoomRatio,
        this.image.width * zoomRatio,
        this.image.height * zoomRatio,
      )
    }
  }

  private clampZoomLevel(zoomLevel: number): number {
    let clamped = zoomLevel

    if (this.minZoom != undefined) clamped = Math.max(this.minZoom, clamped)
    if (this.maxZoom != undefined) clamped = Math.min(this.maxZoom, clamped)

    return clamped
  }

  private setCenterX(val: number, redraw: boolean) {
    if (val == this.centerXValue) return
    if (this.image) val = this.clampCenter(val, this.image.width)

    this.left = val - this.image.width / (2 * this.zoomRatio)
    this.right = val + this.image.width / (2 * this.zoomRatio)

    if (redraw) {
      this.draw({ x: val, y: this.centerYValue }, this.zoomRatio)
    }

    this.centerXValue = val
    // this.centerXChange.emit(val)
  }

  private setCenterY(val: number, redraw: boolean) {
    if (val == this.centerYValue) return

    if (this.image) val = this.clampCenter(val, this.image.height)

    this.centerYValue = val
    // this.centerYChange.emit(val)

    this.topValue = val - this.image.height / (2 * this.zoomRatio)
    this.bottom = val + this.image.height / (2 * this.zoomRatio)

    if (redraw) this.draw({ x: this.centerXValue, y: val }, this.zoomRatio)
  }

  private clampCenter(val: number, length: number): number {
    return Math.min(length, Math.max(0, val))
  }

  private rescale(previousZoomRatio: number, newZoomRatio: number, center?: Point) {
    if (
      previousZoomRatio == newZoomRatio ||
      previousZoomRatio == undefined ||
      newZoomRatio == undefined
    )
      return
    if (this.canvas == null) return

    // If scrolling using the mouse wheel, keep the spot under the mouse fixed in the canvas
    if (center == null) center = { x: this.canvas.scrollWidth / 2, y: this.canvas.scrollHeight / 2 }
    let yRatio = center.y / this.canvas.scrollHeight
    let xRatio = center.x / this.canvas.scrollWidth

    let prevWidth = this.right - this.left
    let prevHeight = this.bottom - this.top

    let scale = previousZoomRatio / newZoomRatio
    let newWidth = scale * prevWidth
    let newHeight = scale * prevHeight

    this.left = this.leftValue + (prevWidth - newWidth) * xRatio
    this.right -= (prevWidth - newWidth) * (1 - xRatio)

    this.topValue = this.topValue + (prevHeight - newHeight) * yRatio
    this.bottom -= (prevHeight - newHeight) * (1 - yRatio)

    this.centerXValue = (this.left + this.right) / 2
    this.centerYValue = (this.top + this.bottom) / 2

    // this.centerXChange.emit(this.centerXValue)
    // this.centerYChange.emit(this.centerYValue)

    this.draw({ x: this.centerX, y: this.centerY }, newZoomRatio)
  }
}

interface Point {
  x: number
  y: number
}
