import { inject, Injectable } from '@angular/core'
import { ProjectSignalrEvent, ProjectSignalrJsonRequest } from '@shared/data-access/models'
import { NewProjectEvents, ProjectsSignalrService } from '@projects/data-access'
import { SignalrEventsRepository } from './signalr-events.repository'
import { HubConnection } from '@microsoft/signalr'
import { SignalrEventsFacade } from './signalr-events.facade'
import { Update } from '@ngrx/entity'
import { BaseService } from '@shared/logger'

@Injectable({
  providedIn: 'root',
})
export class SignalrEventsService extends BaseService {
  // logger = inject(LoggerService)
  private signalrEventsRepository = inject(SignalrEventsRepository)
  private projectsSignalrService = inject(ProjectsSignalrService)
  private signalrEventsFacade = inject(SignalrEventsFacade)
  private hubConnection?: HubConnection

  /*  constructor(logger: LoggerService) {
      super(logger)
      // this.initHubConnection(this.projectsSignalrService.projectsHubConnection)
    }*/

  initHubConnection(projectsHubConnection: HubConnection) {
    this.hubConnection = projectsHubConnection
    this.hubConnection.on(NewProjectEvents, (signalrEvents: ProjectSignalrEvent[]) => {
      this.logDebug(NewProjectEvents, signalrEvents)
      this.receiveManyProjectSignalrEvents(signalrEvents).catch((error) => {
        this.logError(NewProjectEvents, signalrEvents, error)
      })
    })
  }

  sendProjectSignalrEvent(request: ProjectSignalrJsonRequest) {
    const projectSignalrEvent: ProjectSignalrEvent = {
      ...request,
      isSuccess: false,
      time: new Date(),
    }
    this.signalrEventsRepository.sendSignalrEvent(projectSignalrEvent)
    this.projectsSignalrService.sendProjectEvent(request)
  }

  async receiveManyProjectSignalrEvents(signalrEvents: ProjectSignalrEvent[]) {
    const requestIds = signalrEvents.map((signalrEvent) => signalrEvent.requestId)
    const existingEventsInStore =
      await this.signalrEventsFacade.selectManySignalrEventsByRequestIds(requestIds)

    const existingEventsReceived = signalrEvents.filter((signalrEvent) =>
      existingEventsInStore.some(
        (existingEvent) => existingEvent.requestId === signalrEvent.requestId,
      ),
    )
    for (const event of existingEventsReceived) {
      if (!event.isSuccess || event.error) {
        this.logError('onReceiveManySignalREvents', 'event is not success', event)
        continue
      }
      if (!event.serverTime) {
        this.logError('onReceiveManySignalREvents', 'event.serverTime is null', event)
        continue
      }
      const eventTimeInStore = existingEventsInStore.find(
        (existingEvent) => existingEvent.requestId === event.requestId,
      )?.time
      if (!eventTimeInStore) {
        this.logError('onReceiveManySignalREvents', 'event.time is null', event)
        continue
      }
      const timeDiff = new Date(event.serverTime).getTime() - new Date(eventTimeInStore).getTime()
      const update: Update<ProjectSignalrEvent> = {
        id: event.requestId,
        changes: {
          ...event,
          timeDiff,
        },
      }
      this.signalrEventsRepository.updateSignalrEvent(update)
    }

    const newEventsReceived = signalrEvents.filter(
      (signalrEvent) =>
        !existingEventsInStore.some(
          (existingEvent) => existingEvent.requestId === signalrEvent.requestId,
        ),
    )
    this.signalrEventsRepository.addManySignalrEvents(newEventsReceived)
  }
}
