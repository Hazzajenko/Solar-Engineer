import { AfterViewInit, Directive, ElementRef, EventEmitter, inject, Input, OnInit, Output, Renderer2 } from '@angular/core'
import { ElementOffsets } from '@grid-layout/data-access'
import { ScrollWheelEvent, XyLocation } from '@shared/data-access/models'
import { ScreenMoveService } from '@no-grid-layout/utils'

@Directive({
  selector:   '[appScrollDirective]',
  standalone: true,
})
export class ScrollDirective
  implements OnInit,
             AfterViewInit {
  private _element = inject(ElementRef<HTMLDivElement>).nativeElement
  private _renderer = inject(Renderer2)
  private _screenPosition: XyLocation = { x: 0, y: 0 }
  private _screenMoveService = inject(ScreenMoveService)

  posX = 0
  posY = 0
  scale = 1
  speed = 0.1
  maxScale = 2
  minScale = 1

  @Output() elementOffsets: EventEmitter<ElementOffsets> = new EventEmitter<ElementOffsets>()
  @Output() outputScale: EventEmitter<number> = new EventEmitter<number>()
  @Output() resetKeyUp: EventEmitter<string> = new EventEmitter<string>()

  protected set screenProperties(options: {
    scale: number;
    screenPosition: XyLocation
  }) {
    this.scale = options.scale
    this._screenPosition = options.screenPosition
  }

  protected get screenPosition(): XyLocation {
    return this._screenPosition
  }

  @Input() set keyUp(keyUp: string | null) {
    if (!keyUp) return
    switch (keyUp) {
      case 'r': {
        this.posX = 0
        this.posY = 0
        this.scale = 1

        this.outputScale.emit(this.scale)

        this._renderer.setStyle(
          this._element,
          'transform',
          `translate(${this.posX}px,${this.posY}px) scale(${this.scale})`,
        )
        break
      }
    }
    this.resetKeyUp.emit('')
  }

  ngOnInit(): void {
    this._renderer.listen(this._element, ScrollWheelEvent, (event: WheelEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this._screenMoveService.onScrollHandler(event)
    })
  }

  ngAfterViewInit() {
    const offsets: ElementOffsets = {
      offsetHeight: this._element.offsetHeight,
      offsetWidth:  this._element.offsetWidth,
      offsetLeft:   this._element.offsetLeft,
      offsetTop:    this._element.offsetTop,
    }
    this.elementOffsets.emit(offsets)
  }

  private onKeyUpHandler(event: KeyboardEvent) {
    console.log('onKeyUpHandler', event.key)
    switch (event.key) {
      case 'r': {
        console.log('onKeyUpHandler', event.key)
        this._screenMoveService.resetScreenPosition()
      }
    }
  }

  /*  @HostListener('window:resize', ['$event'])
   onResize(event: Event) {
   console.log(event)
   const offsets: ElementOffsets = {
   offsetHeight: this._element.offsetHeight,
   offsetWidth:  this._element.offsetWidth,
   offsetLeft:   this._element.offsetLeft,
   offsetTop:    this._element.offsetTop,
   }
   this.elementOffsets.emit(offsets)
   }*/
}
