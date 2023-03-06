import { inject, Injectable } from '@angular/core'
import { CreatePanel, ProjectsSignalrService } from '@projects/data-access'
import { CreateStringRequest } from '../../contracts'

@Injectable({
  providedIn: 'root',
})
export class PanelsSignalrService {
  private hub = inject(ProjectsSignalrService)

  addStringSignalr(request: CreateStringRequest) {
    if (!this.hub.projectsHubConnection) return
    this.hub.projectsHubConnection
      .invoke(CreatePanel, request)
      .then((r) => console.log(r))
      .catch((e) => console.error(e))
  }
}
