import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { SignalrRequest } from './signalr.request'
import { ProjectsHubActions } from '../../store'

@Injectable({
  providedIn: 'root',
})
export class ProjectsHubRepository {
  private store = inject(Store)

  addSignalrRequest<T>(request: SignalrRequest<T>) {
    this.store.dispatch(ProjectsHubActions.sendSignalrRequest({ signalrRequest: request }))
  }
}
