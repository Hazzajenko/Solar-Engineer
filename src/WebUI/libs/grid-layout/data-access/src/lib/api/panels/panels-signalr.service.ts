import { inject, Injectable } from '@angular/core'
import { CreatePanel, ProjectsSignalrService, UpdatePanel } from '@projects/data-access'
import { CreatePanelRequest, UpdatePanelRequest } from '../../contracts'
import { LoggerService } from '@shared/logger'

@Injectable({
  providedIn: 'root',
})
export class PanelsSignalrService {
  private hub = inject(ProjectsSignalrService)
  private logger = inject(LoggerService)

  addPanelSignalr(request: CreatePanelRequest) {
    if (!this.hub.projectsHubConnection) return
    this.hub.projectsHubConnection
      .invoke(CreatePanel, request)
      .catch((e) =>
        this.logger.error({ source: 'PanelsSignalrService', objects: ['addPanelSignalr', e] }),
      )
  }

  updatePanelSignalr(request: UpdatePanelRequest) {
    if (!this.hub.projectsHubConnection) return
    this.hub.projectsHubConnection
      .invoke(UpdatePanel, request)
      .catch((e) =>
        this.logger.error({ source: 'PanelsSignalrService', objects: ['updatePanelSignalr', e] }),
      )
  }

  updateManyPanelsSignalr(request: UpdatePanelRequest) {
    if (!this.hub.projectsHubConnection) return
    this.hub.projectsHubConnection
      .invoke(UpdatePanel, request)
      .catch((e) =>
        this.logger.error({ source: 'PanelsSignalrService', objects: ['updatePanelSignalr', e] }),
      )
  }
}
