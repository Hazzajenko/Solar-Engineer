import { Directive, ElementRef, HostListener, inject, Input } from '@angular/core'
import { ClientXY } from '../data-access/models/client-x-y.model'

@Directive({
  selector: '[appCanvas]',
  standalone: true,
})
export class CanvasDirective {
  private canvas = inject(ElementRef<HTMLCanvasElement>)
  private ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d')

  @Input() set canvasRef(ref: HTMLCanvasElement) {
    this.canvas.nativeElement.style.width = '100%'
    this.canvas.nativeElement.style.height = '100%'
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth
    this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight
    console.log(ref)
    /*     this.offsetX = this.canvas.nativeElement.offsetLeft
    this.offsetY = this.canvas.nativeElement.offsetTop
    this.scrollX = this.canvas.nativeElement.scrollLeft
    this.scrollY = this.canvas.nativeElement.scrollTop */
    // ref.

    // this.ctx = this.canvas.nativeElement.getContext('2d')!
  }

  @Input() startDragging(clientXY: ClientXY) {}

  @HostListener('document:mousemove', ['$event'])
  onDragging(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    /*     if (this.startX && this.startY && event.altKey && this.isDraggingBool) {
      const mouseX = event.clientX - this.offsetX
      const mouseY = event.clientY - this.offsetY

      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)

      const width = mouseX - this.startX
      const height = mouseY - this.startY

      this.ctx.globalAlpha = 0.4

      this.ctx.fillStyle = '#7585d8'
      this.ctx.fillRect(this.startX, this.startY, width, height)

      this.ctx.globalAlpha = 1.0
    } else {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
    } */
  }
}
