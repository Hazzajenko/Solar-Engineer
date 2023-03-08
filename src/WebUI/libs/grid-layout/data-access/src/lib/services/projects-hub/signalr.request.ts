import { getGuid } from '@shared/utils'
import {
  ProjectItemType,
  ProjectsSignalrRequest,
  ProjectsSignalrType,
} from '@shared/data-access/models'

export class SignalrRequest<TRequest extends ProjectsSignalrRequest> {
  requestId: string
  model: ProjectItemType
  event: ProjectsSignalrType
  time: Date
  request: TRequest

  constructor(model: ProjectItemType, event: ProjectsSignalrType, request: TRequest) {
    this.requestId = getGuid()
    this.model = model
    this.event = event
    this.request = request
    this.time = new Date()
  }
}
