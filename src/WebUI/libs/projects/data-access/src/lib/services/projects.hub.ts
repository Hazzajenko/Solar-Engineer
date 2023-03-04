/*
import { Injectable } from '@angular/core'
import { ProjectsSignalrService } from '../api'
import { HubConnection } from '@microsoft/signalr'
import { GetProjectData } from '../api/projects.methods'

@Injectable({ providedIn: 'root' })
export class ProjectsHub extends ProjectsSignalrService {
  constructor() {
    super()
    // console.log(this.hi)
    // this.projectsHubConnection = this.createProjectsHubConnection('token')
  }

  invokeGetProjectData(projectId: string) {
    if (!this.projectsHubConnection) return
    this.projectsHubConnection
      .invoke(GetProjectData, projectId)
      .then((r) => console.log(r))
      .catch((e) => console.error(e))
  }

  // protected override createProjectsHubConnection(token: string): HubConnection {
  //   return super.createProjectsHubConnection(token)
  // }
}
*/
