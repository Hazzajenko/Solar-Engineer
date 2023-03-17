import { inject, Injectable } from '@angular/core'
import { HubConnection } from '@microsoft/signalr'
import {
  ProjectModel,
  ProjectSignalrEvent,
  ProjectSignalrJsonRequest,
} from '@shared/data-access/models'
import { ProjectsStoreService, SignalrEventsRepository } from '../services'
import { GetManyProjects, GetProject, SendProjectEvent } from './projects.methods'
import { GetProjectDataResponse } from '../models/get-project-data.response'
import { BaseService } from '@shared/logger'
import {
  LinksStoreService,
  PanelsStoreService,
  StringsStoreService,
} from '@grid-layout/data-access'
import { SignalrService } from '@app/data-access/signalr'
import {
  CreateProject,
  DeleteProject,
  GetProjectById,
  GetUserProjects,
} from './projects-signalr.invoke-methods'
import {
  ProjectCreated,
  ProjectDeleted,
  ReceiveProjectEvent,
  ReceiveProjectEvents,
} from './projects-signalr.handlers'
import { ProjectDeletedResponse } from '../contracts'

@Injectable({
  providedIn: 'root',
})
export class ProjectsSignalrService extends BaseService {
  public projectsHubConnection?: HubConnection
  private projectsStore = inject(ProjectsStoreService)
  private panelsStore = inject(PanelsStoreService)
  private signalrService = inject(SignalrService)
  private stringsStore = inject(StringsStoreService)
  private panelLinksStore = inject(LinksStoreService)
  // private signalrEventsService = inject(SignalrEventsService)

  private signalrEventsRepository = inject(SignalrEventsRepository)

  /*  constructor(logger: LoggerService) {
      super(logger)
    }*/

  createProjectsHubConnection(token: string) {
    if (this.projectsHubConnection) return this.projectsHubConnection
    this.projectsHubConnection = this.signalrService.createHubConnection(
      token,
      'Projects',
      '/hubs/projects',
      GetUserProjects,
    )

    this.projectsHubConnection.on(ProjectCreated, (project: ProjectModel) => {
      this.logDebug(ProjectCreated, project)
      this.projectsStore.dispatch.addProject(project)
    })

    this.projectsHubConnection.on(ProjectDeleted, (response: ProjectDeletedResponse) => {
      this.logDebug(ProjectDeleted, response)
      this.projectsStore.dispatch.deleteProject(response.id)
    })

    this.projectsHubConnection.on(GetManyProjects, (projects: ProjectModel[]) => {
      this.logDebug(GetManyProjects, projects)
      this.projectsStore.dispatch.addManyProjects(projects)
    })

    this.projectsHubConnection.on(GetProject, (projectData: GetProjectDataResponse) => {
      this.logDebug(GetProject, projectData)
      if (projectData.panels) {
        this.panelsStore.dispatch.loadPanelsSuccess(projectData.panels)
      }
      if (projectData.strings) {
        this.stringsStore.dispatch.loadStringsSuccess(projectData.strings)
      }
      if (projectData.panelLinks) {
        this.panelLinksStore.dispatch.loadPanelLinksSuccess(projectData.panelLinks)
      }
    })

    this.projectsHubConnection.on(ReceiveProjectEvents, (signalrEvents: ProjectSignalrEvent[]) => {
      this.logDebug(ReceiveProjectEvents, signalrEvents)
      this.signalrEventsRepository.receiveManyProjectSignalrEvents(signalrEvents)
    })

    this.projectsHubConnection.on(ReceiveProjectEvent, (signalrEvent: ProjectSignalrEvent) => {
      this.logDebug(ReceiveProjectEvent, signalrEvent)
      this.signalrEventsRepository.receiveProjectSignalrEvent(signalrEvent)
      // this.signalrEventsService.receiveManyProjectSignalrEvents(signalrEvent)
    })

    return this.projectsHubConnection
  }

  createProject(projectName: string) {
    if (!this.projectsHubConnection) return
    const request = {
      name: projectName,
    }
    this.projectsHubConnection
      .invoke(CreateProject, request)
      .catch((err) => this.logError(CreateProject, err))
  }

  deleteProject(projectId: string) {
    if (!this.projectsHubConnection) return
    const request = {
      id: projectId,
    }
    this.projectsHubConnection
      .invoke(DeleteProject, request)
      .catch((err) => this.logError(DeleteProject, err))
  }

  getUserProjects() {
    if (!this.projectsHubConnection) return
    this.projectsHubConnection
      .invoke(GetUserProjects)
      .catch((err) => this.logError(GetUserProjects, err))
  }

  sendProjectEvent(projectEvent: ProjectSignalrJsonRequest) {
    if (!this.projectsHubConnection) return
    this.projectsHubConnection
      .invoke(SendProjectEvent, projectEvent)
      .catch((err) => this.logError(SendProjectEvent, err))
  }

  getProjectById(projectId: string) {
    if (!this.projectsHubConnection) return
    this.projectsHubConnection
      .invoke(GetProjectById, projectId)
      .catch((err) => this.logError(GetProjectById, err))
  }

  stopHubConnection() {
    if (!this.projectsHubConnection) return
    this.projectsHubConnection.stop().catch((err) => this.logError('StopHubConnection', err))
  }
}
