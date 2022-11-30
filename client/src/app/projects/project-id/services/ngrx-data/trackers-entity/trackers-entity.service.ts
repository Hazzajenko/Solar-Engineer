import { Injectable } from '@angular/core'
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data'
import { TrackerModel } from '../../../../models/tracker.model'

@Injectable()
export class TrackersEntityService extends EntityCollectionServiceBase<TrackerModel> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Tracker', serviceElementsFactory)
  }
}
