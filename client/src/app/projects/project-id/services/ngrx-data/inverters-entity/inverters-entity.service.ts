import { Injectable } from '@angular/core'
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data'
import { InverterModel } from '../../../../models/inverter.model'

@Injectable()
export class InvertersEntityService extends EntityCollectionServiceBase<InverterModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Inverter', serviceElementsFactory)
  }
}
