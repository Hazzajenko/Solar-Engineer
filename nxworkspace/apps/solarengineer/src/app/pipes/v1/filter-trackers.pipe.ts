import { Pipe, PipeTransform } from '@angular/core'
import { TrackerModel } from '../../projects/models/deprecated-for-now/tracker.model'

@Pipe({
  name: 'filterTrackers',
  standalone: true,
})
export class FilterTrackersPipe implements PipeTransform {
  transform(trackers: TrackerModel[], inverterId: string): TrackerModel[] {
    if (!trackers || !inverterId) {
      return trackers
    }

    return trackers.filter((tracker) => tracker.inverterId === inverterId)
  }
}
