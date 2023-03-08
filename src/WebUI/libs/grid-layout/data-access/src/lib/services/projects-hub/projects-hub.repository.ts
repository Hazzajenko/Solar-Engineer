import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { ProjectsHubActions } from '../../store'
import { ProjectSignalrEvent } from '@shared/data-access/models'
import { Update } from '@ngrx/entity'

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
    this.store.dispatch(ProjectsHubActions.sendSignalrRequest({ projectSignalrEvent }))
  }

  addSignalrRequest(projectSignalrEvent: ProjectSignalrEvent) {
    this.store.dispatch(ProjectsHubActions.addSignalrRequest({ projectSignalrEvent }))
  }

  updateSignalrRequest(update: Update<ProjectSignalrEvent>) {
    this.store.dispatch(ProjectsHubActions.updateSignalrRequest({ update }))
  }

  receiveManyProjectSignalrEvents(projectSignalrEvents: ProjectSignalrEvent[]) {
    this.store.dispatch(ProjectsHubActions.receiveManySignalrEvents({ projectSignalrEvents }))
  }
}
