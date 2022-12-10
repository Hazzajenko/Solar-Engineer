import { UnitModel } from './unit.model'

export class PanelLinkModel {
  id: string = ''
  projectId?: number
  stringId?: string
  positiveToId?: string
  positiveModel?: UnitModel
  negativeToId?: string
  negativeModel?: UnitModel
}
