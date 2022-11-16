import { UnitModel } from './unit.model'

export interface BlockModel {
  id: number
  project_id: number
  location: string
  model: UnitModel
}
