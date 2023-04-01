import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core'

@Directive({
  selector: '[appGridMove]',
  standalone: true,
})
export class GridMoveDirective implements OnInit {
  private renderer = inject(Renderer2)
  private elementRef = inject(ElementRef<HTMLDivElement>)
  scale = 1
  posX = 0
  posY = 0
  maxScale = 2
  minScale = 1
  speed = 0.1

  ngOnInit(): void {
    this.setupMouseEventListeners()
  }

  private setupMouseEventListeners() {
    /*    this.renderer.listen(this.elementRef.nativeElement, 'wheel', (event: WheelEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this.onScrollHandler(event)
     })*/
  }

  private onScrollHandler(event: WheelEvent) {

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

    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'transform',
      `translate(${this.posX}px,${this.posY}px) scale(${this.scale})`,
    )
  }

}

