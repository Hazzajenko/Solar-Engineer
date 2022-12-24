import { TypeModel } from 'libs/shared/data-access/models/src/lib/projects/type.model'

export class PanelLinkModel {
  id = ''
  projectId?: number
  stringId?: string
  positiveToId?: string
  positiveModel?: TypeModel
  negativeToId?: string
  negativeModel?: TypeModel
  isDisconnectionPoint: boolean
  disconnectionPointPanelId?: string

  constructor() {
    this.isDisconnectionPoint = false
  }
}
