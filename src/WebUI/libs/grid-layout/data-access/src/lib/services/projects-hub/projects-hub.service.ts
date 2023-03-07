import { inject, Injectable } from '@angular/core'
import { SignalrRequest } from './signalr.request'
import { PanelsSignalrService } from '@grid-layout/data-access'
import { ProjectsHubRepository } from './projects-hub.repository'
import {
  ProjectItemType,
  ProjectsSignalrRequest,
  ProjectsSignalrType,
} from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class ProjectsHubService {
  private projectsHubRepository = inject(ProjectsHubRepository)
  private panelsSignalrService = inject(PanelsSignalrService)

  createSignalrRequest<TRequest extends ProjectsSignalrRequest>(
    request: TRequest,
    model: ProjectItemType,
    event: ProjectsSignalrType,
  ) {
    const tRequest = new SignalrRequest(model, event, request)
    this.projectsHubRepository.addSignalrRequest<TRequest>(tRequest)
    request.signalrRequestId = tRequest.signalrRequestId
    return request
    /*    if (model === 'Panel') {
          this.panelsSignalrService[event](tRequest as never)
        }*/
  }
}

// addPanelSignalr
// updatePanelSignalr
