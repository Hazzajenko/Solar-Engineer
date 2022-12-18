import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'

import { firstValueFrom } from 'rxjs'
import {
  DisconnectionPointsEntityService,
  GridStateActions,
  LinksStateActions,
  MultiActions,
  PanelLinksEntityService,
  PanelsEntityService,
  selectBlockByLocation,
  SelectedStateActions,
  selectLinksState,
  selectSelectedStringModel,
} from '@grid-layout/data-access/store'
import { GridMode, TypeModel } from '@shared/data-access/models'
import { LinksPanelsService } from './links-panels.service'
import { AppState } from '@shared/data-access/store'
import { ItemsService } from '../items'

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  private store = inject(Store<AppState>)
  private panelsEntity = inject(PanelsEntityService)
  private panelLinksEntity = inject(PanelLinksEntityService)
  private disconnectionPointsEntity = inject(DisconnectionPointsEntityService)
  private linksPanelsService = inject(LinksPanelsService)
  private itemsService = inject(ItemsService)

  async linkSwitch(location: string, shiftKey: boolean) {
    const selectedState = await firstValueFrom(this.store.select(selectSelectedStringModel))
    if (selectedState.type !== TypeModel.STRING) {
      return console.error('no string selected')
    }
    if (!selectedState.selectedStringId) {
      return console.error('no string selected')
    }
    const block = await firstValueFrom(this.store.select(selectBlockByLocation({ location })))
    const linksState = await firstValueFrom(this.store.select(selectLinksState))
    if (!block) {
      this.store.dispatch(LinksStateActions.clearLinkState())
      this.store.dispatch(SelectedStateActions.clearSelectedState())
      this.store.dispatch(MultiActions.clearMultiState())
      this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.SELECT }))
      return console.error('linkswitch, block doesnt exist')
    }
    switch (block.type) {
      case TypeModel.PANEL:
        this.itemsService.getItemByLocation(TypeModel.PANEL, location).then((panel) => {
          this.linksPanelsService.addPanelToLink(
            panel,
            linksState,
            selectedState.selectedStringId,
            shiftKey,
          )
        })
        break
      /*      case TypeModel.DISCONNECTIONPOINT:
        this.itemsService
          .getItemByLocation(TypeModel.DISCONNECTIONPOINT, location)
          .then((disconnectionPoint) => {
            this.addDpToLink(disconnectionPoint, linksState)
          })
        break*/
      default:
        console.warn('cannot link on this object')
        break
    }
  }
}
