import { UnitModel } from './unit.model'
import { TypeModel } from './type.model'

export interface BlockModel {
  id: string
  project_id: number
  // location: string
  model: UnitModel
  type?: TypeModel
}
