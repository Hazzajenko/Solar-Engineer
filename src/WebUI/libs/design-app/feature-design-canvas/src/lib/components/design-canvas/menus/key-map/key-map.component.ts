import { AfterViewInit, Component, ElementRef, inject, NgZone, Renderer2 } from '@angular/core'
import { NgForOf } from '@angular/common'
import { KeyMapKeys } from './key-map.keys'
import { CanvasRenderService } from '@design-app/feature-design-canvas'
import { EVENT_TYPE } from '@shared/data-access/models'

@Component({
  selector:    'app-key-map-component',
  templateUrl: './key-map.component.html',
  standalone:  true,
  imports:     [
    NgForOf,
  ],
})
export class KeyMapComponent
  implements AfterViewInit {
  private _render = inject(CanvasRenderService)
  private _renderer = inject(Renderer2)
  private _ngZone = inject(NgZone)
  private _elementRef = inject(ElementRef)

  keys = KeyMapKeys

  public ngAfterViewInit() {
    this._ngZone.runOutsideAngular(() => {
      this._renderer.listen(this._elementRef.nativeElement, EVENT_TYPE.POINTER_ENTER, (event: PointerEvent) => {
        console.log(EVENT_TYPE.POINTER_ENTER, event)
        this._render.drawCanvas()
      })
    })
  }
}