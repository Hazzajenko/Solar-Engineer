import { AfterViewInit, Directive, ElementRef, EventEmitter, inject, NgZone, OnInit, Output, Renderer2 } from '@angular/core'
import { ElementOffsets } from '@grid-layout/data-access'
import { Point } from '@shared/data-access/models'
import { ComponentElementsService, ViewPositioningService } from 'design-app/utils'

@Directive({
  selector:   '[appScrollView]',
  standalone: true,
})
export class ScrollViewDirective
  implements OnInit,
             AfterViewInit {
  private _scrollElement = inject(ElementRef<HTMLDivElement>).nativeElement
  private _renderer = inject(Renderer2)
  private _ngZone = inject(NgZone)
  private _screenPosition: Point = { x: 0, y: 0 }
  private _viewPositioningService = inject(ViewPositioningService)
  private _componentElementsService = inject(ComponentElementsService)

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
    screenPosition: Point
  }) {
    this.scale = options.scale
    this._screenPosition = options.screenPosition
  }

  protected get screenPosition(): Point {
    return this._screenPosition
  }

  ngOnInit(): void {
    this._componentElementsService.scrollElement = this._scrollElement
    // this._renderer.setStyle(this._scrollElement, 'width', `${layoutWidth}px`)
    // this._renderer.setStyle(this._scrollElement, 'height', `${layoutHeight}px`)
    /*    this._renderer.listen(this._scrollElement, 'wheel', (event: WheelEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this._viewPositioningService.onScrollHandler(event)
     })*/
    /*    this._ngZone.runOutsideAngular(() => {
     /     this._renderer.listen(this._element, 'wheel', (event: WheelEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this._viewPositioningService.onScrollHandler(event)
     })*!/
     })*/
    /*    this._renderer.listen(this._element, ScrollWheelEvent, (event: WheelEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this._viewPositioningService.onScrollHandler(event)
     })*/
  }

  ngAfterViewInit() {
    const offsets: ElementOffsets = {
      offsetHeight: this._scrollElement.offsetHeight,
      offsetWidth:  this._scrollElement.offsetWidth,
      offsetLeft:   this._scrollElement.offsetLeft,
      offsetTop:    this._scrollElement.offsetTop,
    }
    this.elementOffsets.emit(offsets)
  }

  private onKeyUpHandler(event: KeyboardEvent) {
    console.log('onKeyUpHandler', event.key)
    switch (event.key) {
      case 'r': {
        console.log('onKeyUpHandler', event.key)
        this._viewPositioningService.resetScreenPosition()
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
