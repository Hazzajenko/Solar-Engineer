import { Injectable } from '@angular/core'
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data'
import { PanelLinkModel } from '../../../../models/panelLinkModel'

@Injectable()
export class PanelLinksEntityService extends EntityCollectionServiceBase<PanelLinkModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('PanelLink', serviceElementsFactory)
  }
}
