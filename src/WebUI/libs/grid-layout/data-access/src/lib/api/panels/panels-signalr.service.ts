import { inject, Injectable } from '@angular/core'
import { CreatePanel, ProjectsSignalrService } from '@projects/data-access'
import { CreatePanelRequest } from '../../contracts'

@Injectable({
  providedIn: 'root',
})
export class PanelsSignalrService {
  private hub = inject(ProjectsSignalrService)

  addPanelSignalr(request: CreatePanelRequest) {
    if (!this.hub.projectsHubConnection) return
    this.hub.projectsHubConnection
      .invoke(CreatePanel, request)
      .then((r) => console.log(r))
      .catch((e) => console.error(e))
  }
}
