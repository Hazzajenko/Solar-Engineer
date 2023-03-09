import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import {
  selectAllSignalrEvents,
  selectSignalrEventByRequestId,
} from '../store/signalr-events.selectors'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class SignalrEventsFacade {
  private store = inject(Store)

  selectManySignalrEventsByRequestIds(requestIds: string[]) {
    return this.store
      .select(selectAllSignalrEvents)
      .pipe(
        map((signalrEvents) =>
          signalrEvents.filter((signalrEvent) => requestIds.includes(signalrEvent.requestId)),
        ),
      )
  }

  selectSignalrEventByRequestId(requestId: string) {
    return this.store.select(selectSignalrEventByRequestId({ requestId }))
  }
}
