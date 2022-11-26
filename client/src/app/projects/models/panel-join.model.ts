import { UnitModel } from './unit.model'

export class PanelJoinModel {
  id: string = ''
  project_id?: number
  string_id?: string
  positive_id?: string
  positive_model?: UnitModel
  negative_id?: string
  negative_model?: UnitModel
}
