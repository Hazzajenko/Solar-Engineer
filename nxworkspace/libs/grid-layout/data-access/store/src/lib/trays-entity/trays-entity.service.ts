import { Injectable } from '@angular/core'
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data'
import { TrayModel } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class TraysEntityService extends EntityCollectionServiceBase<TrayModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Tray', serviceElementsFactory)
  }
}
