import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, NgZone, Renderer2 } from '@angular/core'
import { NgForOf } from '@angular/common'
import { CanvasClientStateService, CanvasRenderService } from '../../../../services'
import { EVENT_TYPE } from '@shared/data-access/models'

@Component({
  selector:        'app-canvas-app-settings',
  standalone:      true,
  imports:         [
    NgForOf,
  ],
  templateUrl:     './canvas-app-settings.component.html',
  styles:          [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasAppSettingsComponent

  implements AfterViewInit {

  private _state = inject(CanvasClientStateService)
  private _render = inject(CanvasRenderService)
  private _renderer = inject(Renderer2)
  private _ngZone = inject(NgZone)
  private _elementRef = inject(ElementRef)
  canvasMenuArr = [
    {
      label:   'Create Preview',
      action:  this.toggleCreatePreview.bind(this),
      checked: this._state.menu.createPreview,
    },
    {
      label:   'Nearby Axis Lines',
      action:  this.toggleNearbyAxisLines.bind(this),
      checked: this._state.menu.nearbyAxisLines,
    },
  ]

  public ngAfterViewInit() {
    this._ngZone.runOutsideAngular(() => {
      this._renderer.listen(this._elementRef.nativeElement, EVENT_TYPE.POINTER_ENTER, (event: PointerEvent) => {
        console.log(EVENT_TYPE.POINTER_ENTER, event)
        this._render.drawCanvas()
      })
    })
  }

  toggleCreatePreview() {
    this._state.updateState({
      menu: {
        createPreview: !this._state.menu.createPreview,
      },
    })
    this._render.drawCanvas()
  }

  toggleNearbyAxisLines() {
    this._state.updateState({
      menu: {
        nearbyAxisLines: !this._state.menu.nearbyAxisLines,
      },
    })
    this._render.drawCanvas()
  }

}
