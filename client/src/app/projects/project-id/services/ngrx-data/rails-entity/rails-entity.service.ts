import { Injectable } from '@angular/core'
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data'
import { RailModel } from '../../../../models/deprecated-for-now/rail.model'

@Injectable()
export class RailsEntityService extends EntityCollectionServiceBase<RailModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Rail', serviceElementsFactory)
  }
}
