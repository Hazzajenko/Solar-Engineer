import { Injectable } from '@angular/core'
import { combineLatestWith, firstValueFrom } from 'rxjs'
import { UnitModel } from '../../models/unit.model'
import { PanelsEntityService } from './ngrx-data/panels-entity/panels-entity.service'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { RailsEntityService } from './ngrx-data/rails-entity/rails-entity.service'
import { PanelModel } from '../../models/panel.model'
import { selectCurrentProjectId } from './store/projects/projects.selectors'
import { selectSelectedStringId } from './store/selected/selected.selectors'
import { RailModel } from '../../models/rail.model'

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  constructor(
    private panelsEntity: PanelsEntityService,
    private railsEntity: RailsEntityService,
    private store: Store<AppState>,
  ) {}

  addManyItems(model: UnitModel, locations: string[]) {
    firstValueFrom(
      this.store
        .select(selectCurrentProjectId)
        .pipe(combineLatestWith(this.store.select(selectSelectedStringId))),
    ).then(([projectId, selectedStringId]) => {
      switch (model) {
        case UnitModel.PANEL:
          const panels = locations.map((location) => {
            return new PanelModel(
              projectId,
              location,
              selectedStringId ? selectedStringId : 'undefined',
              0,
            )
          })
          this.panelsEntity.addManyToCache(panels)
          break

        case UnitModel.RAIL:
          const rails = locations.map((location) => {
            return new RailModel(projectId, location, false)
          })
          this.railsEntity.addManyToCache(rails)
          break
        default:
          break
      }
    })
  }
}
