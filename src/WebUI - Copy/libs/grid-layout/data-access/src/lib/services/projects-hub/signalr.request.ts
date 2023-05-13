import {
  ProjectEventAction,
  ProjectItemType,
  ProjectsSignalrRequest,
} from '@shared/data-access/models'
import { newGuid } from '@shared/utils'

export class SignalrRequest<TRequest extends ProjectsSignalrRequest> {
  requestId: string
  model: ProjectItemType
  event: ProjectEventAction
  time: Date
  request: TRequest

  constructor(model: ProjectItemType, event: ProjectEventAction, request: TRequest) {
    this.requestId = newGuid()
    this.model = model
    this.event = event
    this.request = request
    this.time = new Date()
  }
}