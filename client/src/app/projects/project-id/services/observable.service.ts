import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { firstValueFrom, Observable } from 'rxjs'
import { UnitModel } from '../../models/unit.model'
import { PanelsEntityService } from './ngrx-data/panels-entity/panels-entity.service'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { RailsEntityService } from './ngrx-data/rails-entity/rails-entity.service'

@Injectable({
  providedIn: 'root',
})
export class ObservableService {
  constructor(
    private panelsEntity: PanelsEntityService,
    private railsEntity: RailsEntityService,
    private store: Store<AppState>,
  ) {}

  modelSwitch(model: UnitModel): Observable<any[]> {
    switch (model) {
      case UnitModel.PANEL:
        return this.panelsEntity.entities$
      case UnitModel.RAIL:
        return this.railsEntity.entities$
      default:
        return this.panelsEntity.entities$
    }
  }



  getItemByLocation(model: UnitModel, location: string) {
    return firstValueFrom(
      this.modelSwitch(model).pipe(
        map((items) =>
          items.find((item) => item.location === location),
        ),
      ),
    )
  }

  getItemFromIncludedIdArray(model: UnitModel, array: string[]) {
    return this.modelSwitch(model).pipe(
      map((items: any[]) => items.filter((item: any) => array.includes(item.id!))),
    )
  }
}
