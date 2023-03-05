import { inject, Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
// import { UserIsOnline } from '../../../../../app/data-access/connections/src/lib/api/connections.methods'
import { ProjectModel } from '@shared/data-access/models'
import { ProjectsStoreService } from '../services'
import { GetProjectData, GetProjects } from './projects.methods'
import { GetProjectDataResponse } from '../models/get-project-data.response'
import { LoggerService } from '@shared/logger'

@Injectable({
  providedIn: 'root',
})
export class ProjectsSignalrService {
  public projectsHubConnection?: HubConnection
  private projectsStore = inject(ProjectsStoreService)
  private hubConnectionIsInitialized = false
  private logger = inject(LoggerService)
  // protected hi = "ss"

  /*  createProjectsHubConnection(token: string) {
      if (this.hubConnectionIsInitialized) return
      this.initHubConnection(token)
      this.hubConnectionIsInitialized = true
    }*/

  createProjectsHubConnection(token: string) {
    if (this.projectsHubConnection) return this.projectsHubConnection
    this.projectsHubConnection = new HubConnectionBuilder()
      .withUrl('/hubs/projects', {
        // .withUrl('/projects-api/hubs/projects', {
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
        this.logger.debug({ source: 'Projects-Signalr-Service', objects: ['Projects Hub Connection started'] })
        // this.logger.debug('Projects-Signalr-Service', 'GetProjects')
        this.getProjects()
      })
      .catch((err) => {
        this.logger.error({
          source: 'Projects-Signalr-Service',
          objects: ['Error while starting Projects Hub connection: ' + err],
        })
        throw new Error('Error while starting Projects Hub connection: ' + err)
      })

    this.projectsHubConnection.on(GetProjects, (projects: ProjectModel[]) => {
      // console.log(projects)
      this.logger.debug({ source: 'Projects-Signalr-Service', objects: ['GetProjects', projects] })
      this.projectsStore.dispatch.addManyProjects(projects)
    })

    this.projectsHubConnection.on(GetProjectData, (projectData: GetProjectDataResponse) => {
      // console.log(projectData)
      this.logger.debug({ source: 'Projects-Signalr-Service', objects: ['GetProjectData', projectData] })
      // this.projectsStore.dispatch.addManyProjects(projects)
    })

    // this.projectsHubConnection.invoke(GetProjects, (projects: ProjectModel[]) => {
    //   console.log(projects)
    //   this.projectsStore.dispatch.addManyProjects(projects)
    // }).then(r => console.log(r)).catch(e => console.log(e))

    return this.projectsHubConnection
  }

  getProjects() {
    if (!this.projectsHubConnection) return
    this.projectsHubConnection
      .invoke(GetProjects)
      // .then((r) => this.logger.debug('Projects-Signalr-Service', 'GetProjects', r))
      .then((r) => this.logger.debug({ source: 'Projects-Signalr-Service', objects: ['GetProjects', r] }))
      .catch((e) => this.logger.debug({ source: 'Projects-Signalr-Service', objects: ['GetProjects', e] }))
    // .catch((e) => this.logger.error('Projects-Signalr-Service', 'GetProjects', e))
  }

  invokeGetProjectData(projectId: string) {
    if (!this.projectsHubConnection) return
    this.projectsHubConnection
      .invoke(GetProjectData, projectId)
      .then((r) => this.logger.debug({ source: 'Projects-Signalr-Service', objects: ['GetProjectData', r] }))
      .catch((e) => this.logger.debug({ source: 'Projects-Signalr-Service', objects: ['GetProjectData', e] }))
  }

  stopHubConnection() {
    if (!this.projectsHubConnection) return
    // this.projectsHubConnection.stop().catch((error) => this.logger.error('Projects-Signalr-Service', 'StopHubConnection', error))
    this.projectsHubConnection.stop().catch((error) => this.logger.error({
      source: 'Projects-Signalr-Service',
      objects: ['StopHubConnection', error],
    }))
  }
}
