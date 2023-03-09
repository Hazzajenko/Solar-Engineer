import { getGuid } from '@shared/utils'
import {
  ProjectEventAction,
  ProjectItemType,
  ProjectsSignalrRequest,
} from '@shared/data-access/models'

export class SignalrRequest<TRequest extends ProjectsSignalrRequest> {
  requestId: string
  model: ProjectItemType
  event: ProjectEventAction
  time: Date
  request: TRequest

  constructor(model: ProjectItemType, event: ProjectEventAction, request: TRequest) {
    this.requestId = getGuid()
    this.model = model
    this.event = event
    this.request = request
    this.time = new Date()
  }
}
