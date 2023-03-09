import { inject, Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
// import { UserIsOnline } from '../../../../../app/data-access/connections/src/lib/api/connections.methods'
import { ProjectModel, ProjectSignalrEvent } from '@shared/data-access/models'
import { ProjectsStoreService } from '../services'
import {
  GetManyProjects,
  GetProject,
  ReceiveProjectEvent,
  SendProjectEvent,
} from './projects.methods'
import { GetProjectDataResponse } from '../models/get-project-data.response'
import { LoggerService } from '@shared/logger'
import { PanelsStoreService } from '@grid-layout/data-access'

@Injectable({
  providedIn: 'root',
})
export class ProjectsSignalrService {
  public projectsHubConnection?: HubConnection
  private projectsStore = inject(ProjectsStoreService)
  private panelsStore = inject(PanelsStoreService)
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
        this.logger.debug({
          source: 'Projects-Signalr-Service',
          objects: ['Projects Hub Connection started'],
        })
        this.getUserProjects()
      })
      .catch((err) => {
        this.logger.error({
          source: 'Projects-Signalr-Service',
          objects: ['Error while starting Projects Hub connection: ' + err],
        })
        throw new Error('Error while starting Projects Hub connection: ' + err)
      })

    this.projectsHubConnection.on(GetManyProjects, (projects: ProjectModel[]) => {
      this.logger.debug({
        source: 'Projects-Signalr-Service',
        objects: [GetManyProjects, projects],
      })
      this.projectsStore.dispatch.addManyProjects(projects)
    })

    this.projectsHubConnection.on(GetProject, (projectData: GetProjectDataResponse) => {
      this.logger.debug({
        source: 'Projects-Signalr-Service',
        objects: [GetProject, projectData],
      })
      if (projectData.panels) {
        this.panelsStore.dispatch.loadPanelsSuccess(projectData.panels)
      }
    })

    this.projectsHubConnection.on(ReceiveProjectEvent, (signalrEvents: ProjectSignalrEvent[]) => {
      this.logger.debug({
        source: 'Projects-Signalr-Service',
        objects: [ReceiveProjectEvent, signalrEvents],
      })

      // this.projectsHubRepository.receiveManyProjectSignalrEvents(signalrEvents)

      // this.projectsStore.dispatch.addManyProjects(projects)
    })

    /*    this.projectsHubConnection.on(NewProjectEvents, (events: any[]) => {
          this.logger.debug({
            source: 'Projects-Signalr-Service',
            objects: [NewProjectEvents, events],
          })
          // this.projectsStore.dispatch.addManyProjects(projects)
        })*/

    return this.projectsHubConnection
  }

  getUserProjects() {
    if (!this.projectsHubConnection) return
    this.projectsHubConnection
      .invoke(GetManyProjects)
      .catch((err) =>
        this.logger.error({ source: 'Projects-Signalr-Service', objects: ['GetProjects', err] }),
      )
  }

  sendProjectEvent() {
    if (!this.projectsHubConnection) return
    this.projectsHubConnection
      .invoke(SendProjectEvent)
      .catch((err) =>
        this.logger.error({ source: 'Projects-Signalr-Service', objects: [SendProjectEvent, err] }),
      )
  }

  getProject(projectId: string) {
    if (!this.projectsHubConnection) return
    this.projectsHubConnection
      .invoke(GetProject, projectId)
      .catch((e) =>
        this.logger.debug({ source: 'Projects-Signalr-Service', objects: ['getProject', e] }),
      )
  }

  stopHubConnection() {
    if (!this.projectsHubConnection) return
    this.projectsHubConnection.stop().catch((error) =>
      this.logger.error({
        source: 'Projects-Signalr-Service',
        objects: ['StopHubConnection', error],
      }),
    )
  }
}
