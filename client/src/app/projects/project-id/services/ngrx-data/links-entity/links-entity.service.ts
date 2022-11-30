import { Injectable } from '@angular/core'
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data'
import { LinkModel } from '../../../../models/link.model'

@Injectable()
export class LinksEntityService extends EntityCollectionServiceBase<LinkModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Link', serviceElementsFactory)
  }
}
