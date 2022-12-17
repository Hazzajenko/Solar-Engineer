import { Injectable } from '@angular/core'
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data'
import { DisconnectionPointModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/disconnection-point.model'

@Injectable()
export class DisconnectionPointsEntityService extends EntityCollectionServiceBase<DisconnectionPointModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('DisconnectionPoint', serviceElementsFactory)
  }
}
