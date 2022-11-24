import { Injectable } from '@angular/core'
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data'
import { PanelJoinModel } from '../../../models/panel-join.model'

@Injectable()
export class PanelJoinsEntityService extends EntityCollectionServiceBase<PanelJoinModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('PanelJoin', serviceElementsFactory)
  }
}
