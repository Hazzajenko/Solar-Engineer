import { Injectable } from '@angular/core'
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data'
import { JoinModel } from '../../../../models/deprecated-for-now/join.model'

@Injectable()
export class JoinsEntityService extends EntityCollectionServiceBase<JoinModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Join', serviceElementsFactory)
  }
}
