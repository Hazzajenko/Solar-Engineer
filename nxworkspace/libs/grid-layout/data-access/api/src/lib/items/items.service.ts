import { inject, Injectable } from '@angular/core'
import { firstValueFrom, Observable } from 'rxjs'

import { Store } from '@ngrx/store'
import { AppState } from '@shared/data-access/store'

import { map } from 'rxjs/operators'
import { PanelModel, TypeModel } from '@shared/data-access/models'
import {
  PanelsEntityService,
  selectCurrentProjectId,
  selectSelectedStringId,
} from '@grid-layout/data-access/store'


@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private store = inject(Store<AppState>)
  private panelsEntity = inject(PanelsEntityService)



  modelSwitch(model: TypeModel): Observable<any[]> {
    switch (model) {
      case TypeModel.PANEL:
        return this.panelsEntity.entities$
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

      default:
        break
    }
  }
}
