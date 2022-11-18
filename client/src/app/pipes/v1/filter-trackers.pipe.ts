import { Pipe, PipeTransform } from '@angular/core'
import { TrackerModel } from '../../projects/models/tracker.model'

@Pipe({
  name: 'filterTrackers',
})
export class FilterTrackersPipe implements PipeTransform {
  transform(trackers: TrackerModel[], inverterId: number): TrackerModel[] {
    if (!trackers || !inverterId) {
      return trackers
    }

    return trackers.filter((tracker) => tracker.inverter_id === inverterId)
  }
}
