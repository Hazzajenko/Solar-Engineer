import { TypeModel } from './type.model'

export class PanelLinkModel {
  id: string = ''
  projectId?: number
  stringId?: string
  positiveToId?: string
  positiveModel?: TypeModel
  negativeToId?: string
  negativeModel?: TypeModel
}
