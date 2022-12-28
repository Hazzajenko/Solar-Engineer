import { Directive, ElementRef, HostListener, inject, Input, OnInit } from '@angular/core'
import { fromEvent } from 'rxjs'
import { ClientXY } from '../data-access/models/client-x-y.model'
import { ElementOffsets } from '../data-access/models/element-offsets.model'

@Directive({
  selector: '[appCanvas]',
  standalone: true,
})
export class CanvasDirective {
  private canvas = inject(ElementRef<HTMLCanvasElement>)
  private ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d')
  startX?: number
  startY?: number
  offsetX?: number
  offsetY?: number
  mouseUp$ = fromEvent(document, 'mouseup').subscribe((event) => console.log(event))

  @Input() set canvasOffsets(offsets: ElementOffsets) {
    if (!offsets.offsetHeight || !offsets.offsetWidth) return
    this.canvas.nativeElement.width = offsets.offsetWidth
    this.canvas.nativeElement.height = offsets.offsetHeight
    this.offsetX = offsets.offsetLeft
    this.offsetY = offsets.offsetTop
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
    event.preventDefault()
    event.stopPropagation()
    if (!this.startX || !this.startY || !this.offsetX || !this.offsetY || !event.altKey) {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
      return
    }

    const mouseX = event.pageX - this.canvas.nativeElement.parentNode.offsetLeft
    const mouseY = event.pageY - this.canvas.nativeElement.parentNode.offsetTop

    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)

    const width = mouseX - this.startX
    const height = mouseY - this.startY

    this.ctx.globalAlpha = 0.4

    this.ctx.fillStyle = '#7585d8'
    this.ctx.fillRect(this.startX, this.startY, width, height)

    this.ctx.globalAlpha = 1.0
  }
}
