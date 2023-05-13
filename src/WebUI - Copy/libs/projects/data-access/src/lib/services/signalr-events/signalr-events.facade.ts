import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import {
  selectAllSignalrEvents,
  selectSignalrEventByRequestId,
} from '../../store/signalr-events/signalr-events.selectors'
import { map } from 'rxjs/operators'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class SignalrEventsFacade {
  private store = inject(Store)

  selectSignalrEventByRequestId$(requestId: string) {
    return this.store.select(selectSignalrEventByRequestId({ requestId }))
  }

  selectManySignalrEventsByRequestIds$(requestIds: string[]) {
    return this.store
      .select(selectAllSignalrEvents)
      .pipe(
        map((signalrEvents) =>
          signalrEvents.filter((signalrEvent) => requestIds.includes(signalrEvent.requestId)),
        ),
      )
  }

  async selectManySignalrEventsByRequestIds(requestIds: string[]) {
    return await firstValueFrom(this.selectManySignalrEventsByRequestIds$(requestIds))
  }

  async selectSignalrEventByRequestId(requestId: string) {
    return await firstValueFrom(this.store.select(selectSignalrEventByRequestId({ requestId })))
  }
}
