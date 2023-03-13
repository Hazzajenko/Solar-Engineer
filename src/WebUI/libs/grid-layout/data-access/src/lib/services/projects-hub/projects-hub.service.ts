import { inject, Injectable } from '@angular/core'
import { SignalrRequest } from './signalr.request'
import { PanelsSignalrService } from '@grid-layout/data-access'
import { ProjectsHubRepository } from './projects-hub.repository'
import {
  ProjectEventAction,
  ProjectItemType,
  ProjectSignalrEvent,
  ProjectSignalrEventV2,
  ProjectSignalrJsonRequest,
  ProjectsSignalrRequest,
} from '@shared/data-access/models'
import { NewProjectEvents, SendProjectEvent } from '@projects/data-access'
import { HubConnection } from '@microsoft/signalr'
import { BaseService } from '@shared/logger'

@Injectable({
  providedIn: 'root',
})
export class ProjectsHubService extends BaseService {
  private projectsHubRepository = inject(ProjectsHubRepository)
  private panelsSignalrService = inject(PanelsSignalrService)
  private hubConnection?: HubConnection

  // private logger = inject(LoggerService)

  /*  constructor(logger: LoggerService) {
      super(logger)
      // this.initHubConnection(this.projectsSignalrService.projectsHubConnection)
    }*/

  initHubConnection(projectsHubConnection: HubConnection) {
    this.hubConnection = projectsHubConnection
    this.hubConnection.on(NewProjectEvents, (signalrEvents: ProjectSignalrEvent[]) => {
      this.logDebug(NewProjectEvents, signalrEvents)
      /*     this.logger.debug({
             source: 'Projects-Signalr-Service',
             objects: [NewProjectEvents, signalrEvents],
           })*/
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

  sendEvent(event: ProjectSignalrEvent) {
    this.hubConnection?.send(NewProjectEvents, event)
  }

  createSignalrRequest<TRequest extends ProjectsSignalrRequest>(
    request: TRequest,
    model: ProjectItemType,
    event: ProjectEventAction,
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
    action: ProjectEventAction,
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

  sendJsonSignalrRequest<TRequest extends ProjectSignalrJsonRequest>(request: TRequest) {
    const projectSignalrEvent: ProjectSignalrEventV2 = {
      ...request,
      isSuccess: false,
      time: new Date(),
    }
    this.projectsHubRepository.sendSignalrRequestV2(projectSignalrEvent)
    if (!this.hubConnection) {
      this.logError('HubConnection is undefined', request)
      /*      this.logger.error({
              source: 'Projects-Signalr-Service',
              objects: ['HubConnection is undefined', request],
            })*/
      return
    }
    this.hubConnection.invoke(SendProjectEvent, request).catch((error) => {
      this.logError('Error sending signalr request', request, error)
      /*      this.logger.error({
              source: 'Projects-Signalr-Service',
              objects: ['Error sending signalr request', request, error],
            })*/
    })
  }
}

// addPanelSignalr
// updatePanelSignalr
