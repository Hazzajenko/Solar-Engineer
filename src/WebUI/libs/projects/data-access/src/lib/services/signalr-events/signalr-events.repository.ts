import { SignalrEventsActions } from '../../store'
import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { ProjectSignalrEvent } from '@shared/data-access/models'


@Injectable({
	providedIn: 'root',
})
export class SignalrEventsRepository {
	private store = inject(Store)

	addSignalrEvent(projectSignalrEvent: ProjectSignalrEvent) {
		this.store.dispatch(SignalrEventsActions.addSignalREvent({ projectSignalrEvent }))
	}

	addManySignalrEvents(projectSignalrEvents: ProjectSignalrEvent[]) {
		this.store.dispatch(SignalrEventsActions.addManySignalREvents({ projectSignalrEvents }))
	}

	sendSignalrEvent(projectSignalrEvent: ProjectSignalrEvent) {
		this.store.dispatch(SignalrEventsActions.sendSignalREvent({ projectSignalrEvent }))
	}

	updateSignalrEvent(update: Update<ProjectSignalrEvent>) {
		this.store.dispatch(SignalrEventsActions.updateSignalREvent({ update }))
	}

	receiveProjectSignalrEvent(projectSignalrEvent: ProjectSignalrEvent) {
		this.store.dispatch(SignalrEventsActions.receiveSignalREvent({ projectSignalrEvent }))
	}

	receiveManyProjectSignalrEvents(projectSignalrEvents: ProjectSignalrEvent[]) {
		this.store.dispatch(SignalrEventsActions.receiveManySignalREvents({ projectSignalrEvents }))
	}
}