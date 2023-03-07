import { PanelModel } from '@shared/data-access/models'
import { UpdateStr } from '@ngrx/entity/src/models'
import { getGuid } from '@shared/utils'

export interface UpdatePanelRequest {
  signalrRequestId: string
  projectId: string
  update: UpdateStr<PanelModel>
}

export class CreateTRequest<T> {
  id: string
  model: string
  event: string
  time: Date
  request: T

  constructor(model: string, event: string, request: T) {
    this.id = getGuid()
    this.model = model
    this.event = event
    this.request = request
    this.time = new Date()
  }
}
