import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core'
import { KEYS } from '@shared/data-access/models'
import { ObjectPositioningService, ViewPositioningService } from 'design-app/utils'
import { SelectedStoreService } from '@design-app/feature-selected'
import { DesignEntityType } from '@design-app/shared'

@Directive({
  selector:   '[appKeyUpDirective]',
  standalone: true,
})
export class KeyUpDirective
  implements OnInit {
  private _element = inject(ElementRef<HTMLDivElement>).nativeElement
  private _renderer = inject(Renderer2)
  private _viewPositioningService = inject(ViewPositioningService)
  private _selectedFacade = inject(SelectedStoreService)
  private _objectPositioningService = inject(ObjectPositioningService)

  // private _

  ngOnInit(): void {
    this._renderer.listen(window, 'keyup', (event: KeyboardEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onKeyUpHandler(event)
        .catch(console.error)
    })
    // EventName.Ke
  }

  private async onKeyUpHandler(event: KeyboardEvent) {
    console.log('onKeyUpHandler', event.key)
    switch (event.key) {
      case KEYS.R:
        return this._viewPositioningService.resetScreenPosition()
      case KEYS.ESCAPE:
        return this._selectedFacade.dispatch.clearSelectedState()
      case KEYS.G: {
        /*      const nearbyPanels = await this._selectedFacade.select.nearbyPanelsOnAxis
         if (nearbyPanels.length > 1) {
         const nearbyPanelIds = nearbyPanels.map(p => p.id)
         return this._objectPositioningService.moveGroupOfPanelsToSameAxisPositionV2(nearbyPanelIds, LineDirection.Right)
         }*/
        const biggestNearByEntityArray = await this._objectPositioningService.selectBiggestNearByEntityArray(DesignEntityType.Panel)
        if (biggestNearByEntityArray.ids.length > 1) {
          return this._objectPositioningService.moveGroupOfPanelsToSameAxisPositionV2(biggestNearByEntityArray.ids, biggestNearByEntityArray.direction)
        }
        return
        // const selectedIds = await this._selectedFacade.nearbyPanelsOnAxis.map(s => s.id)

        // return this._objectPositioningService.moveGroupOfPanelsToSameAxisPositionV2(selectedIds, LineDirection.Right)

      }

      /*      case KEYS.ArrowUp: {
       this._screenMoveService.moveScreenUp()
       }*/
    }
  }

}
