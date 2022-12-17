import { Injectable } from '@angular/core'
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data'
import { PanelLinkModel } from '@shared/data-access/models'
@Injectable()
export class PanelLinksEntityService extends EntityCollectionServiceBase<PanelLinkModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('PanelLink', serviceElementsFactory)
  }
}
