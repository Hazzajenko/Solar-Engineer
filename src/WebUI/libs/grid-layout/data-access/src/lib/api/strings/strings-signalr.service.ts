import { inject, Injectable } from '@angular/core'
import { CreateString, ProjectsSignalrService } from '@projects/data-access'
import { CreateStringRequest } from '../../contracts'

@Injectable({
  providedIn: 'root',
})
export class StringsSignalrService {
  private hub = inject(ProjectsSignalrService)

  // private logger = inject(LoggerService)

  addStringSignalr(request: CreateStringRequest) {
    if (!this.hub.projectsHubConnection) return
    this.hub.projectsHubConnection.invoke(CreateString, request).catch(
      (e) => e,
      // this.logger.error({ source: 'StringsSignalrService', objects: ['addStringSignalr', e] }),
    )
  }
}
