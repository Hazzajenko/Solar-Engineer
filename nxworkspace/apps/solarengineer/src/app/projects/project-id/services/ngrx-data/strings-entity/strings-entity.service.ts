import { Injectable } from '@angular/core'
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data'
import { StringModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/string.model'

@Injectable()
export class StringsEntityService extends EntityCollectionServiceBase<StringModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('String', serviceElementsFactory)
  }
}
