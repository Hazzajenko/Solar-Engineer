import { Injectable } from '@angular/core'
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data'
import { PanelModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/panel.model'

@Injectable()
export class PanelsEntityService extends EntityCollectionServiceBase<PanelModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Panel', serviceElementsFactory)
  }
}
