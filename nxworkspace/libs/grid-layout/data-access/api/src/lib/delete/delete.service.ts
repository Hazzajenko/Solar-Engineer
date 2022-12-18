import { inject, Injectable } from '@angular/core'
import { BlockModel, TypeModel } from '@shared/data-access/models'

import { firstValueFrom } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '@shared/data-access/store'
import {
  DisconnectionPointsEntityService,
  PanelLinksEntityService,
  selectBlocksByProjectIdRouteParams,
} from '@grid-layout/data-access/store'

@Injectable({
  providedIn: 'root',
})
export class DeleteService {
  private store = inject(Store<AppState>)
  private panelLinks = inject(PanelLinksEntityService)
  private disconnectionPoints = inject(DisconnectionPointsEntityService)

  deleteSwitch(location: string): void {
    firstValueFrom(this.store.select(selectBlocksByProjectIdRouteParams)).then((blocks) => {
      if (!blocks) return console.warn('nothing to delete')
      const toDelete: BlockModel | undefined = blocks.find((block: BlockModel) => block.location === location)
      if (!toDelete) return console.warn('nothing to delete')

      switch (toDelete.type) {
        case TypeModel.PANEL:
          this.panelLinks.delete(toDelete.id!)
          break
        case TypeModel.DISCONNECTIONPOINT:
          this.disconnectionPoints.delete(toDelete.id!)
          break
        default:
          break
      }
    })
  }
}
