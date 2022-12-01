import { Injectable } from '@angular/core'
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data'
import { TrayModel } from '../../../../models/tray.model'

@Injectable()
export class TraysEntityService extends EntityCollectionServiceBase<TrayModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Tray', serviceElementsFactory)
  }
}
