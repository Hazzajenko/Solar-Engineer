import { Injectable } from '@angular/core'
import { firstValueFrom, Observable } from 'rxjs'
import { TypeModel } from '../../../../../../../libs/shared/data-access/models/src/lib/type.model'
import { PanelsEntityService } from './ngrx-data/panels-entity/panels-entity.service'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { RailsEntityService } from './ngrx-data/rails-entity/rails-entity.service'
import { PanelModel } from '../../../../../../../libs/shared/data-access/models/src/lib/panel.model'
import { selectCurrentProjectId } from './store/projects/projects.selectors'
import { selectSelectedStringId } from './store/selected/selected.selectors'
import { RailModel } from '../../models/deprecated-for-now/rail.model'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  constructor(
    private panelsEntity: PanelsEntityService,
    private railsEntity: RailsEntityService,
    private store: Store<AppState>,
  ) {}

  modelSwitch(model: TypeModel): Observable<any[]> {
    switch (model) {
      case TypeModel.PANEL:
        return this.panelsEntity.entities$
      case TypeModel.RAIL:
        return this.railsEntity.entities$
      default:
        return this.panelsEntity.entities$
    }
  }

  getItemByLocation(model: TypeModel, location: string) {
    return firstValueFrom(
      this.modelSwitch(model).pipe(
        map((items) => items.find((item) => item.location === location)),
      ),
    )
  }

  async addManyItems(model: TypeModel, locations: string[]) {
    const projectId = await firstValueFrom(this.store.select(selectCurrentProjectId))
    switch (model) {
      case TypeModel.PANEL:
        const selectedStringId = await firstValueFrom(this.store.select(selectSelectedStringId))
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

      case TypeModel.RAIL:
        const rails = locations.map((location) => {
          return new RailModel(projectId, location, false)
        })
        this.railsEntity.addManyToCache(rails)
        break
      default:
        break
    }
  }
}
