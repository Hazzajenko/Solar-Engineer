import { getGuid } from '@shared/utils'
import { ProjectItemType, ProjectsSignalrType } from '@shared/data-access/models'

export class SignalrRequest<T> {
  signalrRequestId: string
  model: ProjectItemType
  event: ProjectsSignalrType
  // event: string
  time: Date
  request: T

  constructor(model: ProjectItemType, event: ProjectsSignalrType, request: T) {
    this.signalrRequestId = getGuid()
    this.model = model
    this.event = event
    this.request = request
    this.time = new Date()
  }
}
