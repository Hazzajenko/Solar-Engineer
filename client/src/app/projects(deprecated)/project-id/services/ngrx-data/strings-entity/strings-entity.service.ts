import { Injectable } from '@angular/core'
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data'
import { StringModel } from '../../../../models/string.model'

@Injectable()
export class StringsEntityService extends EntityCollectionServiceBase<StringModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('String', serviceElementsFactory)
  }
}
