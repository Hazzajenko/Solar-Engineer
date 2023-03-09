import { inject, Injectable } from '@angular/core'
import { LoggerService } from '@shared/logger'
import { ProjectSignalrEvent, ProjectSignalrJsonRequest } from '@shared/data-access/models'
import { ProjectsSignalrService } from '@projects/data-access'
import { SignalrEventsRepository } from './signalr-events.repository'

@Injectable({
  providedIn: 'root',
})
export class SignalrEventsService {
  private logger = inject(LoggerService)
  private signalrEventsRepository = inject(SignalrEventsRepository)
  private projectsSignalrService = inject(ProjectsSignalrService)

  sendProjectSignalrEvent(request: ProjectSignalrJsonRequest) {
    const projectSignalrEvent: ProjectSignalrEvent = {
      ...request,
      isSuccess: false,
      time: new Date(),
    }
    this.signalrEventsRepository.sendSignalrEvent(projectSignalrEvent)
    this.projectsSignalrService.sendProjectEvent(request)
  }
}
