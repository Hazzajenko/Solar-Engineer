import { Injectable } from '@angular/core'
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data'
import { BlockModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/block.model'

@Injectable()
export class BlocksEntityService extends EntityCollectionServiceBase<BlockModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Block', serviceElementsFactory)
  }
}
