import { ProjectSignalrEventV2, ProjectSignalrJsonRequest } from '@shared/data-access/models'
import { ProjectsSignalrService } from './projects-signalr.service'
import { inject, Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ProjectsSignalrHelperService {
  private projectsSignalrService = inject(ProjectsSignalrService)

  sendSignalrRequest(request: ProjectSignalrJsonRequest) {
    const projectSignalrEvent: ProjectSignalrEventV2 = {
      ...request,
      isSuccess: false,
      time: new Date(),
    }
    // this.projectsHubRepository.sendSignalrRequestV2(projectSignalrEvent)
    if (!this.hubConnection) {
      this.logger.error({
        source: 'Projects-Signalr-Service',
        objects: ['HubConnection is undefined', request],
      })
      return
    }
    /*    this.hubConnection.invoke(SendProjectEvent, request).catch((error) => {
          this.logger.error({
            source: 'Projects-Signalr-Service',
            objects: ['Error sending signalr request', request, error],
          })
        })*/
  }
}
