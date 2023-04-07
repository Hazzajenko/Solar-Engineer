import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core'
import { ObjectPositioningService, ScreenMoveService } from '@no-grid-layout/utils'
import { KEYS } from '@shared/data-access/models'
import { SelectedService } from '@no-grid-layout/data-access'
import { LineDirection } from '@no-grid-layout/shared'

@Directive({
  selector:   '[appKeyUpDirective]',
  standalone: true,
})
export class KeyUpDirective
  implements OnInit {
  private _element = inject(ElementRef<HTMLDivElement>).nativeElement
  private _renderer = inject(Renderer2)
  private _screenMoveService = inject(ScreenMoveService)
  private _selectedService = inject(SelectedService)
  private _objectPositioningService = inject(ObjectPositioningService)

  // private _

  ngOnInit(): void {
    this._renderer.listen(window, 'keyup', (event: KeyboardEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onKeyUpHandler(event)
    })
    // EventName.Ke
  }

  private onKeyUpHandler(event: KeyboardEvent) {
    console.log('onKeyUpHandler', event.key)
    switch (event.key) {
      case KEYS.R:
        return this._screenMoveService.resetScreenPosition()
      case KEYS.ESCAPE:
        return this._selectedService.clearSelected()
      case KEYS.G: {
        const selectedIds = this._selectedService.directionNearbySelection.map(s => s.id)

        return this._objectPositioningService.moveGroupOfPanelsToSameAxisPositionV2(selectedIds, LineDirection.Right)

      }

      /*      case KEYS.ArrowUp: {
       this._screenMoveService.moveScreenUp()
       }*/
    }
  }

}
