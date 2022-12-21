import { Injectable } from '@angular/core'
import { TypeModel } from '../../models/type.model'
import { PanelsEntityService } from './ngrx-data/panels-entity/panels-entity.service'
import { CablesEntityService } from './ngrx-data/cables-entity/cables-entity.service'
import { InvertersEntityService } from './ngrx-data/inverters-entity/inverters-entity.service'

import { PanelLinksEntityService } from './ngrx-data/panel-links-entity/panel-links-entity.service'
import { DisconnectionPointsEntityService } from './ngrx-data/disconnection-points-entity/disconnection-points-entity.service'
import { firstValueFrom } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { selectBlocksByProjectIdRouteParams } from './store/blocks/blocks.selectors'

@Injectable({
  providedIn: 'root',
})
export class DeleteService {
  constructor(
    private store: Store<AppState>,
    private panelJoins: PanelLinksEntityService,
    private panels: PanelsEntityService,
    private inverters: InvertersEntityService,
    private cables: CablesEntityService,
    private disconnectionPoints: DisconnectionPointsEntityService,
  ) {}

  deleteSwitch(location: string): void {
    firstValueFrom(this.store.select(selectBlocksByProjectIdRouteParams)).then((blocks) => {
      if (!blocks) return console.warn('nothing to delete')
      const toDelete = blocks.find((block) => block.location === location)
      if (!toDelete) return console.warn('nothing to delete')

      switch (toDelete.type) {
        case TypeModel.PANEL:
          this.panelJoins.delete(toDelete.id!)
          break
        case TypeModel.CABLE:
          this.cables.delete(toDelete.id!)
          break
        case TypeModel.INVERTER:
          this.inverters.delete(toDelete.id!)
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
