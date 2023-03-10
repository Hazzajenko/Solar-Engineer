import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { ProjectSignalrEvent } from '@shared/data-access/models'
import { Update } from '@ngrx/entity'
import { SignalrEventsActions } from '../../store'

@Injectable({
  providedIn: 'root',
})
export class SignalrEventsRepository {
  private store = inject(Store)

  addSignalrEvent(projectSignalrEvent: ProjectSignalrEvent) {
    this.store.dispatch(SignalrEventsActions.addSignalrEvent({ projectSignalrEvent }))
  }

  addManySignalrEvents(projectSignalrEvents: ProjectSignalrEvent[]) {
    this.store.dispatch(SignalrEventsActions.addManySignalrEvents({ projectSignalrEvents }))
  }

  sendSignalrEvent(projectSignalrEvent: ProjectSignalrEvent) {
    this.store.dispatch(SignalrEventsActions.sendSignalrEvent({ projectSignalrEvent }))
  }

  updateSignalrEvent(update: Update<ProjectSignalrEvent>) {
    this.store.dispatch(SignalrEventsActions.updateSignalrEvent({ update }))
  }

  receiveProjectSignalrEvent(projectSignalrEvent: ProjectSignalrEvent) {
    this.store.dispatch(SignalrEventsActions.receiveSignalrEvent({ projectSignalrEvent }))
  }

  receiveManyProjectSignalrEvents(projectSignalrEvents: ProjectSignalrEvent[]) {
    this.store.dispatch(SignalrEventsActions.receiveManySignalrEvents({ projectSignalrEvents }))
  }
}
