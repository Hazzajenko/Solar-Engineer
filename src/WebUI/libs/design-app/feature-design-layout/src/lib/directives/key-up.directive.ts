import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core'
import { KEYS, UndefinedString } from '@shared/data-access/models'
import { ObjectPositioningService, ViewPositioningService } from 'design-app/utils'
import { SelectedStoreService } from '@design-app/feature-selected'
import { EntityType } from '@design-app/shared'
import { StringsFactoryService } from '@design-app/feature-string'
import { MatSnackBar } from '@angular/material/snack-bar'
import { PanelsStoreService } from '@design-app/feature-panel'

@Directive({
  selector:   '[appKeyUpDirective]',
  standalone: true,
})
export class KeyUpDirective
  implements OnInit {
  private _element = inject(ElementRef<HTMLDivElement>).nativeElement
  private _renderer = inject(Renderer2)
  private _viewPositioningService = inject(ViewPositioningService)
  private _selectedStore = inject(SelectedStoreService)
  private _objectPositioningService = inject(ObjectPositioningService)
  private readonly _stringsFactory = inject(StringsFactoryService)
  private readonly _snackBar = inject(MatSnackBar)
  private readonly _panelsStore = inject(PanelsStoreService)

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
        return this._selectedStore.dispatch.clearSelectedState()
      case KEYS.G: {
        /*      const nearbyPanels = await this._selectedFacade.select.nearbyPanelsOnAxis
         if (nearbyPanels.length > 1) {
         const nearbyPanelIds = nearbyPanels.map(p => p.id)
         return this._objectPositioningService.moveGroupOfPanelsToSameAxisPositionV2(nearbyPanelIds, LineDirection.Right)
         }*/
        const biggestNearByEntityArray = await this._objectPositioningService.selectBiggestNearByEntityArray(EntityType.Panel)
        if (biggestNearByEntityArray.ids.length > 1) {
          return this._objectPositioningService.moveGroupOfPanelsToSameAxisPositionV2(biggestNearByEntityArray.ids, biggestNearByEntityArray.direction)
        }
        return
        // const selectedIds = await this._selectedFacade.nearbyPanelsOnAxis.map(s => s.id)

        // return this._objectPositioningService.moveGroupOfPanelsToSameAxisPositionV2(selectedIds, LineDirection.Right)

      }
      case KEYS.X: {
        const result = await this._stringsFactory.addSelectedToNew(UndefinedString)
        if (!result) break
        this._snackBar.open(`Created String ${result.name}`, 'OK', {
          duration:           5000,
          horizontalPosition: 'start',
          verticalPosition:   'bottom',
        })
        break
      }

      case KEYS.DELETE: {
        const singleAndMultiIds = await this._selectedStore.select.singleAndMultiSelected
        if (singleAndMultiIds.multiSelected && singleAndMultiIds.multiSelected.length > 0) {
          const panels = singleAndMultiIds.multiSelected.filter(s => s.type === EntityType.Panel)
          const panelIds = panels.map(p => p.id)
          this._panelsStore.dispatch.deleteManyPanels(panelIds)
          break
        }
        if (singleAndMultiIds.singleSelected) {
          switch (singleAndMultiIds.singleSelected.type) {
            case EntityType.Panel:
              await this._panelsStore.dispatch.deletePanel(singleAndMultiIds.singleSelected.id)
          }
          // await this.panelsStore.dispatch.deletePanel(singleAndMultiIds.singleId)
          break
        }
        break
      }
      case KEYS.L: {
        console.log('IMPLEMENT LINK MODE')
        break
        /*
         const gridMode = await this.gridStore.select.gridMode
         if (gridMode === GridMode.LINK) {
         this.gridStore.dispatch.selectGridMode(GridMode.SELECT)
         this.linksStore.dispatch.clearLinkState()
         this.snackBar.open('Link Mode Off', 'OK', {
         duration:           5000,
         horizontalPosition: 'start',
         verticalPosition:   'bottom',
         })
         break
         }
         const isStringSelected = await this.selectedStore.select.selectedStringId
         if (!isStringSelected) break
         this.gridStore.dispatch.selectGridMode(GridMode.LINK)
         this.selectedStore.dispatch.clearSingleSelected()
         this.snackBar.open('Link Mode On', 'OK', {
         duration:           5000,
         horizontalPosition: 'start',
         verticalPosition:   'bottom',
         })
         */

      }

      /*      case KEYS.ArrowUp: {
       this._screenMoveService.moveScreenUp()
       }*/
    }
  }

}
