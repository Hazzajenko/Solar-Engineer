import { Injectable } from '@angular/core'
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data'
import { PanelLinkModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/panel-link.model'

@Injectable()
export class PanelLinksEntityService extends EntityCollectionServiceBase<PanelLinkModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('PanelLink', serviceElementsFactory)
  }
}
