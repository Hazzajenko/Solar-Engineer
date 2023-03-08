import { inject, Injectable } from '@angular/core'
import { SignalrRequest } from './signalr.request'
import { PanelsSignalrService } from '@grid-layout/data-access'
import { ProjectsHubRepository } from './projects-hub.repository'
import {
  ProjectItemType,
  ProjectSignalrEvent,
  ProjectsSignalrRequest,
  ProjectsSignalrType,
} from '@shared/data-access/models'
import { NewProjectEvents } from '@projects/data-access'
import { HubConnection } from '@microsoft/signalr'
import { LoggerService } from '@shared/logger'

@Injectable({
  providedIn: 'root',
})
export class ProjectsHubService {
  private projectsHubRepository = inject(ProjectsHubRepository)
  private panelsSignalrService = inject(PanelsSignalrService)
  private hubConnection?: HubConnection
  private logger = inject(LoggerService)

  initHubConnection(projectsHubConnection: HubConnection) {
    this.hubConnection = projectsHubConnection
    this.hubConnection.on(NewProjectEvents, (signalrEvents: ProjectSignalrEvent[]) => {
      this.logger.debug({
        source: 'Projects-Signalr-Service',
        objects: [NewProjectEvents, signalrEvents],
      })
      /*      const events = signalrEvents.map((signalrEvent) => {
              const serverTime = new Date(signalrEvent.time)
              return {
                ...signalrEvent,
                serverTime,
              }
            })*/
      this.projectsHubRepository.receiveManyProjectSignalrEvents(signalrEvents)

      // this.projectsStore.dispatch.addManyProjects(projects)
    })
  }

  createSignalrRequest<TRequest extends ProjectsSignalrRequest>(
    request: TRequest,
    model: ProjectItemType,
    event: ProjectsSignalrType,
  ) {
    const tRequest = new SignalrRequest(model, event, request)
    const newRequest = {
      ...request,
      requestId: tRequest.requestId,
      time: new Date(),
      model,
      event,
    }
    // this.projectsHubRepository.addSignalrRequest<TRequest>(tRequest)
    // this.projectsHubRepository.addSignalrRequestV2(newRequest)
    request.requestId = tRequest.requestId
    return request
    /*    if (model === 'Panel') {
          this.panelsSignalrService[event](tRequest as never)
        }*/
  }

  /*  createSignalrRequestV2<TRequest extends ProjectsSignalrRequest>(
      request: TRequest,
      model: ProjectItemType,
      action: ProjectsSignalrType,
    ) {
      // const tRequest = new SignalrRequest(model, event, request)
      const newRequest = {
        ...request,
        time: new Date(),
        model,
        action,
        receivedSuccess: false,
      } as ProjectsSignalrRequestV2
      // this.projectsHubRepository.addSignalrRequest<TRequest>(tRequest)
      return this.projectsHubRepository.addSignalrRequestV2(newRequest)
      // request.requestId = newRequest.requestId
      // return request
      /!*    if (model === 'Panel') {
            this.panelsSignalrService[event](tRequest as never)
          }*!/
    }*/

  sendSignalrRequest<TRequest extends ProjectsSignalrRequest>(
    request: TRequest,
    model: ProjectItemType,
    action: ProjectsSignalrType,
  ) {
    const projectSignalrEvent: ProjectSignalrEvent = {
      action,
      isSuccess: false,
      model,
      projectId: request.projectId,
      requestId: request.requestId,
      time: new Date(),
    }
    return this.projectsHubRepository.sendSignalrRequest(projectSignalrEvent)
  }

  sendJsonSignalrRequest<TRequest extends ProjectsSignalrRequest>(
    request: TRequest,
    model: ProjectItemType,
    action: ProjectsSignalrType,
  ) {
    const projectSignalrEvent: ProjectSignalrEvent = {
      action,
      isSuccess: false,
      model,
      projectId: request.projectId,
      requestId: request.requestId,
      time: new Date(),
    }
    return this.projectsHubRepository.sendSignalrRequest(projectSignalrEvent)
  }
}

// addPanelSignalr
// updatePanelSignalr
