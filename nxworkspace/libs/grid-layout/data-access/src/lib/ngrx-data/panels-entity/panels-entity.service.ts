import { Injectable } from '@angular/core'
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data'
import { PanelModel } from '@shared/data-access/models'

@Injectable()
export class PanelsEntityService extends EntityCollectionServiceBase<PanelModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Panel', serviceElementsFactory)
  }
}
