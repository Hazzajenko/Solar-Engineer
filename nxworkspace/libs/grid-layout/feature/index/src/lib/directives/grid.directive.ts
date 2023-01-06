import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Output,
  Renderer2,
} from '@angular/core'
import { ElementOffsets } from '@grid-layout/shared/models'


@Directive({
  selector: '[appGrid]',
  standalone: true,
})
export class GridDirective implements AfterViewInit {
  private elementRef = inject(ElementRef<HTMLDivElement>)
  private renderer = inject(Renderer2)

  posX = 0
  posY = 0
  scale = 1
  speed = 0.1
  maxScale = 2
  minScale = 1


  @Output() elementOffsets: EventEmitter<ElementOffsets> = new EventEmitter<ElementOffsets>()
  @Output() outputScale: EventEmitter<number> = new EventEmitter<number>()

  ngAfterViewInit() {
    const offsets: ElementOffsets = {
      offsetHeight: this.elementRef.nativeElement.offsetHeight,
      offsetWidth: this.elementRef.nativeElement.offsetWidth,
      offsetLeft: this.elementRef.nativeElement.offsetLeft,
      offsetTop: this.elementRef.nativeElement.offsetTop,
    }
    this.elementOffsets.emit(offsets)
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    console.log(event)
    const offsets: ElementOffsets = {
      offsetHeight: this.elementRef.nativeElement.offsetHeight,
      offsetWidth: this.elementRef.nativeElement.offsetWidth,
      offsetLeft: this.elementRef.nativeElement.offsetLeft,
      offsetTop: this.elementRef.nativeElement.offsetTop,
    }
    this.elementOffsets.emit(offsets)
  }

  @HostListener('wheel', ['$event'])
  public onScroll(event: WheelEvent) {
    console.log(event)
    event.preventDefault()

    const sizeH = this.elementRef.nativeElement.offsetHeight
    const sizeW = this.elementRef.nativeElement.offsetWidth

    const pointerX = event.pageX - this.elementRef.nativeElement.offsetLeft
    const pointerY = event.pageY - this.elementRef.nativeElement.offsetTop
    const targetX = (pointerX - this.posX) / this.scale
    const targetY = (pointerY - this.posY) / this.scale

    this.scale += -1 * Math.max(-1, Math.min(1, event.deltaY)) * this.speed * this.scale

    this.scale = Math.max(this.minScale, Math.min(this.maxScale, this.scale))

    this.posX = -targetX * this.scale + pointerX
    this.posY = -targetY * this.scale + pointerY

    if (this.posX > 0) this.posX = 0
    if (this.posX + sizeW * this.scale < sizeW) this.posX = -sizeW * (this.scale - 1)
    if (this.posY > 0) this.posY = 0
    if (this.posY + sizeH * this.scale < sizeH) this.posY = -sizeH * (this.scale - 1)

    /*    this.uiRepository.setPosXY({
          posX: this.posX,
          posY: this.posY,
        })*/


    this.outputScale.emit(this.scale)

    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'transform',
      `translate(${this.posX}px,${this.posY}px) scale(${this.scale})`,
    )
  }
}
