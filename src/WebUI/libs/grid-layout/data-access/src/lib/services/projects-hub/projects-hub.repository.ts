import { ProjectsHubActions } from '../../store'
import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { ProjectSignalrEvent, ProjectSignalrEventV2 } from '@shared/data-access/models'


@Injectable({
	providedIn: 'root',
})
export class ProjectsHubRepository {
	private store = inject(Store)

	/*  addSignalrRequest<T extends ProjectsSignalrRequest>(request: SignalrRequest<T>) {
	 // this.store.dispatch(ProjectsHubActions.sendSignalrRequest({ projectSignalrEvent: request }))
	 }

	 addSignalrRequestV2<T extends ProjectsSignalrRequestV2>(request: T) {
	 // this.store.dispatch(ProjectsHubActions.sendSignalrRequest({ projectSignalrEvent: request }))
	 }*/

	sendSignalrRequest(projectSignalrEvent: ProjectSignalrEvent) {
		this.store.dispatch(ProjectsHubActions.sendSignalRRequest({ projectSignalrEvent }))
	}

	sendSignalrRequestV2(projectSignalrEvent: ProjectSignalrEventV2) {
		this.store.dispatch(ProjectsHubActions.sendSignalRRequest({ projectSignalrEvent }))
	}

	addSignalrRequest(projectSignalrEvent: ProjectSignalrEvent) {
		this.store.dispatch(ProjectsHubActions.addSignalRRequest({ projectSignalrEvent }))
	}

	updateSignalrRequest(update: Update<ProjectSignalrEvent>) {
		this.store.dispatch(ProjectsHubActions.updateSignalRRequest({ update }))
	}

	receiveManyProjectSignalrEvents(projectSignalrEvents: ProjectSignalrEvent[]) {
		this.store.dispatch(ProjectsHubActions.receiveManySignalREvents({ projectSignalrEvents }))
	}
}