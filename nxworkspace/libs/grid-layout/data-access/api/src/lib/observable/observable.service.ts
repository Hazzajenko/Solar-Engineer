import { inject, Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { firstValueFrom, Observable } from 'rxjs'

import { Store } from '@ngrx/store'
import { AppState } from '@shared/data-access/store'
import { BlocksService, PanelsEntityService } from '@grid-layout/data-access/store'
import { TypeModel } from '@shared/data-access/models'


@Injectable({
  providedIn: 'root',
})
export class ObservableService {
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

  getItemFromIncludedIdArray(model: TypeModel, array: string[]) {
    return this.modelSwitch(model).pipe(
      map((items: any[]) => items.filter((item: any) => array.includes(item.id!))),
    )
  }
}
