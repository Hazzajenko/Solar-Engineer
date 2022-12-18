import { Injectable } from '@angular/core'
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data'
import { DisconnectionPointModel } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class DisconnectionPointsEntityService extends EntityCollectionServiceBase<DisconnectionPointModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('DisconnectionPoint', serviceElementsFactory)
  }
}
