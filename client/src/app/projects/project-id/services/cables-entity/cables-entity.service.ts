import { Injectable } from '@angular/core'
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data'
import { CableModel } from '../../../models/cable.model'

@Injectable()
export class CablesEntityService extends EntityCollectionServiceBase<CableModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Cable', serviceElementsFactory)
  }
}
