import { Directive, ElementRef, HostListener, inject, Input } from '@angular/core'

@Directive({
  selector: '[canvasDirective]',
  standalone: true,
})
export class CanvasDirective {
  cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  cameraZoom = 1
  MAX_ZOOM = 5
  MIN_ZOOM = 0.1
  SCROLL_SENSITIVITY = 0.0005
  clientX: number = 0
  clientY: number = 0
  isDragging = false
  dragStartX: number = 0
  dragStartY: number = 0
  private canvas = inject(ElementRef<HTMLCanvasElement>)
  private ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d')!

  @Input() set canvasRef(ref: HTMLCanvasElement) {
    // this.canvas.nativeElement = initCanvas(this.canvas.nativeElement)
    this.ctx = this.canvas.nativeElement.getContext('2d')!
    // this.#drawRectangle(this.ctx)
    // let ctx = ref.getContext('2d')!
    this.ctx.translate(window.innerWidth / 2, window.innerHeight / 2)
    this.ctx.scale(this.cameraZoom, this.cameraZoom)
    this.ctx.translate(
      -window.innerWidth / 2 + this.cameraOffset.x,
      -window.innerHeight / 2 + this.cameraOffset.y,
    )
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    /*    this.canvas.nativeElement.addEventListener('mousedown',function(event: Event){
          document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
          lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
          lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
          dragStart = ctx.transformedPoint(lastX,lastY);
          dragged = false;
        },false);*/

    this.canvas.nativeElement.canvas.addEventListener(
      'mousemove',
      (event: MouseEvent) => {
        let lastX = event.offsetX || event.pageX - ref.offsetLeft
        let lastY = event.offsetY || event.pageY - ref.offsetTop
        const dragStart = true
        if (dragStart) {
          this.ctx.translate(lastX, lastY)
          this.ctx.setTransform()
          // ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
          // redraw()
        }
      },
      false,
    )
  }

  @HostListener('mouseenter') onMouseEnter() {
    console.log('mouseenter')
  }

  @HostListener('click', ['$event.target'])
  onClick(event: MouseEvent) {
    console.log('button')
    this.clientX = event.clientX
    this.clientY = event.clientY
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    event.preventDefault()
    this.isDragging = true
    this.dragStartX = this.getEventLocation(event).x / this.cameraZoom - this.cameraOffset.x
    this.dragStartY = this.getEventLocation(event).y / this.cameraZoom - this.cameraOffset.y
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    event.preventDefault()
    this.isDragging = false
    // this.lastZoom = this.cameraZoom
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.cameraOffset.x = this.getEventLocation(event).x / this.cameraZoom - this.dragStartX
      this.cameraOffset.y = this.getEventLocation(event).y / this.cameraZoom - this.dragStartY
    }
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (!this.isDragging) {
      if (event.deltaY) {
        this.cameraZoom += event.deltaY
      } else if (this.SCROLL_SENSITIVITY) {
        console.log(this.SCROLL_SENSITIVITY)
        this.cameraZoom = this.SCROLL_SENSITIVITY /**lastZoom*/
      }

      this.cameraZoom = Math.min(this.cameraZoom, this.MAX_ZOOM)
      this.cameraZoom = Math.max(this.cameraZoom, this.MIN_ZOOM)

      console.log(event.deltaY)
      this.ctx.translate(window.innerWidth / 2, window.innerHeight / 2)
      this.ctx.scale(this.cameraZoom, this.cameraZoom)
      this.ctx.translate(
        -window.innerWidth / 2 + this.cameraOffset.x,
        -window.innerHeight / 2 + this.cameraOffset.y,
      )
    }
  }

  #drawRectangle(context: CanvasRenderingContext2D) {
    context.fillRect(20, 20, 100, 100)
    context.clearRect(40, 40, 30, 30)
    context.strokeRect(50, 50, 10, 10)
  }

  private getEventLocation(event: MouseEvent) {
    return {
      x: event.clientX,
      y: event.clientY,
    }
  }
}
