import { Injectable } from '@angular/core'
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data'
import { StringModel } from '@shared/data-access/models'

@Injectable()
export class StringsEntityService extends EntityCollectionServiceBase<StringModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('String', serviceElementsFactory)
  }
}
