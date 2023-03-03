import { inject, Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
// import { UserIsOnline } from '../../../../../app/data-access/connections/src/lib/api/connections.methods'
import { ProjectModel } from '@shared/data-access/models'
import { ProjectsStoreService } from '../services'
import { GetProjectData, GetProjects } from './projects.methods'
import { GetProjectDataResponse } from '../models/get-project-data.response'

@Injectable({
  providedIn: 'root',
})
export class ProjectsSignalrService {
  private projectsHubConnection?: HubConnection
  private projectsStore = inject(ProjectsStoreService)

  createProjectsHubConnection(token: string) {
    this.projectsHubConnection = new HubConnectionBuilder()
      .withUrl('/projects-api/hubs/projects', {
        // .withUrl('/projects-hub', {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build()

    this.projectsHubConnection
      .start()
      .then(() => {
        console.log('Projects Hub Connection started')
        this.invokeTest()
      })
      .catch((err) => {
        console.error('Error while starting Projects Hub connection: ' + err)
        throw new Error('Error while starting Projects Hub connection: ' + err)
      })

    this.projectsHubConnection.on(GetProjects, (projects: ProjectModel[]) => {
      console.log(projects)
      this.projectsStore.dispatch.addManyProjects(projects)
    })

    this.projectsHubConnection.on(GetProjectData, (projectData: GetProjectDataResponse) => {
      console.log(projectData)
      // this.projectsStore.dispatch.addManyProjects(projects)
    })

    // this.projectsHubConnection.invoke(GetProjects, (projects: ProjectModel[]) => {
    //   console.log(projects)
    //   this.projectsStore.dispatch.addManyProjects(projects)
    // }).then(r => console.log(r)).catch(e => console.log(e))

    return this.projectsHubConnection
  }

  invokeTest() {
    if (!this.projectsHubConnection) return
    this.projectsHubConnection
      .invoke(GetProjects)
      .then((r) => console.log(r))
      .catch((e) => console.log(e))
  }

  stopHubConnection() {
    if (!this.projectsHubConnection) return
    this.projectsHubConnection.stop().catch((error) => console.log(error))
  }
}
